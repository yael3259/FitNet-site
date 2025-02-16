import { request } from "express";
import { orderModel, orderValidator } from "../models/order.js";
import { userModel } from "../models/user.js";
import mongoose from "mongoose";



// הצגת כל ההזמנות
export const getAllorders = async (req, res, next) => {
    let txt = req.query.txt || undefined;
    let page = req.query.page || 1;
    let perPage = req.query.perPage || 15;

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
    const { userId, targetDate, address, products } = req.body;

    const validationErrors = orderValidator(req.body)?.errors || [];
    if (validationErrors.length > 0) {
        return res.status(400).json({
            type: "validation_error",
            message: validationErrors.join(", ")
        });
    }

    try {
        const newOrder = new orderModel({
            targetDate,
            address,
            userId: req.user?._id || null,
            products
        });

        const savedOrder = await newOrder.save();
        return res.status(201).json(savedOrder);
    } catch (err) {
        console.error("Error adding order:", err);
        return res.status(500).json({
            type: "server_error",
            message: "Failed to add order",
            error: err.message
        });
    }
};


// עדכון הזמנה לפי קוד
export const UpdateOrder = async (req, res) => {
    const { id } = req.params;
    const { isSent } = req.body;

    if (!mongoose.isValidObjectId(id))
        return res.status(404).json({ type: "invalid id", message: "ID format is invalid." });

    if (typeof isSent !== "boolean")
        return res.status(400).json({ type: "invalid data", message: "isSent must be a boolean." });

    try {
        let order = await orderModel.findById(id);
        if (!order)
            return res.status(404).json({ type: "order not found", message: "No order found with this ID." });

        order.isSent = isSent;
        await order.save();

        return res.json(order);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ type: "server error", message: "Failed to update order." });
    }
};
