import { request } from "express";
import { orderModel, orderValidator } from "../models/order.js";
import { userModel } from "../models/user.js";
import mongoose from "mongoose";



// הצגת כל ההזמנות
export const getAllorders = async (req, res, next) => {
    let txt = req.query.txt || undefined;
    let page = req.query.page || 1;
    let perPage = req.query.perPage || 30;

    try {
        let allorders = await orderModel.find({})
            .skip((page - 1) * perPage).limit(perPage);

        return res.json(allorders);
    }
    catch (err) {
        return res.status(400).json({ type: "invalid operation", massage: "cannot get orders" });
    }
}


// הצגת כל ההזמנות של משתמש לפי קוד
export const getOrderById = async (req, res, next) => {
    const idUser = req.params.idUser;

    let txt = req.query.txt || undefined;
    let page = req.query.page || 1;
    let perPage = req.query.perPage || 30;

    try {
        let allorders = await orderModel.find({ idUser: idUser })
            .skip((page - 1) * perPage)
            .limit(perPage);

        return res.json(allorders);
    }
    catch (err) {
        return res.status(400).json({ type: "invalid operation", message: "cannot get orders" });
    }
}


// מחיקת הזמנה
export const deleteOrder = async (req, res) => {
    let { id } = req.params;

    try {
        if (!mongoose.isValidObjectId(id))
            return res.status(400).json({ type: "not valid id", message: "id is in not the right format" })

        let order = await orderModel.findByIdAndDelete(id);

        if (!order)
            return res.status(404).json({ type: "undifind order for delete", message: "this order is undifind for delete" })

        return res.json(order)
    }
    catch (err) {
        console.log(err)
        res.status(400).json({ type: "invalid operation", message: "sorry cannot delete order" })
    }
}


// הוספת הזמנה חדשה
export const AddOrder = async (req, res) => {
    let { targetDate, address, products } = req.body;

    // if (!targetDate || !address || !products) {
    //     return res.status(400).json({ type: "missing params", message: "Missing required fields in body" });
    // }

    const errors = orderValidator(req.body).errors;

    if (errors.length>0)
        return res.status(404).json(errors.details[0].message);

    try {
        let newOrder = new orderModel({
            targetDate,
            address,
            userId: req.user._id,
            products
        });

        await newOrder.save();

        return res.json(newOrder)
    }
    catch (err) {
        console.log(err)
        return res.status(400).json({ type: "invalid operation", message: "sorry cannot add Order" })
    }
}


// עדכון הזמנה לפי קוד
export const UpdateOrder = async (req, res) => {
    let { id } = req.params;
    if (!mongoose.isValidObjectId(id))
        return res.status(404).json({ type: "not valid id", massage: "id is in not the right format" });

    try {
        let order = await orderModel.findById(id);
        if (!order)
            return res.status(404).json({ type: "order is undifind", massage: "there is no order with such id" });

        let { isSent } = req.body;

        order.isSent = true;

        await order.save();
        return res.json(order);
    }

    catch (err) {
        console.log(err);
        res.status(400).json({ type: "invalid operation", massage: "sorry, cannot get order" });
    }
}