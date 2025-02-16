import { request } from "express";
import { productModel, productValidator } from "../models/product.js";
import mongoose from "mongoose";



// הצגת כל המוצרים
export const getAllProducts = async (req, res, next) => {
    let txt = req.query.txt || undefined;
    let page = parseInt(req.query.page) || 1;
    let perPage = parseInt(req.query.perPage) || 12;

    try {
        let query = {};
        if (txt) {
            query.$or = [
                { name: { $regex: txt, $options: 'i' } },
                { description: { $regex: txt, $options: 'i' } }
            ];
        }

        let allProducts = await productModel.find(query)
            .skip((page - 1) * perPage)
            .limit(perPage);

        return res.json(allProducts);
    } catch (err) {
        return res.status(400).json({ type: "invalid operation", message: "Sorry, cannot get products" });
    }
}


// הצגת מוצר בודד לפי קוד
export const getProductById = async (req, res) => {
    let id = req.params.id;

    try {
        if (!mongoose.isValidObjectId(id))
            return res.status(404).json({ type: "invalid id", message: "ID is not in the correct format" });

        let product = await productModel.findById(id);
        if (!product)
            return res.status(404).json({ type: "not found", message: "Sorry, this product was not found" });

        return res.json(product);
    }

    catch (err) {
        console.log(err);
        res.status(500).json({ type: "internal error", message: "Sorry, cannot get product" }); // עדכון לקוד סטטוס 500 במקרה של שגיאה פנימית
    }
}


// מחיקת מוצר
export const deleteProduct = async (req, res) => {
    let { id } = req.params;

    try {
        if (!mongoose.isValidObjectId(id))
            return res.status(400).json({ type: "not valid id", message: "id is in not the right format" })

        let product = await productModel.findById(id);

        if (!product)
            return res.status(404).json({ type: "undifind product for delete", message: "this product is undifind for delete" })

        // הרשאת מחיקה רק למנהל
        // if (req.user.role != "ADMIN" && product.userId != req.user._id)
        //     return res.status(403).json({ type: "not authorized", message: "You are not allowed to delete this product, only an administrator or the user who added it" })

        product = await productModel.findByIdAndDelete(id);

        return res.json(product)
    }
    catch (err) {
        console.log(err)
        res.status(400).json({ type: "invalid operation", message: "sorry cannot delete product" })
    }
}


// הוספת מוצר חדש
export const AddProduct = async (req, res) => {
    let { name, price, description, color, startDate, urlImage } = req.body;

    if (!name || !price) {
        return res.status(400).json({ type: "missing params", message: "missing details in body (name or price)" });
    }

    // const result = await productValidator(req.body);

    // if (result.error) {
    //     return res.status(400).json(result.error.details[0]);
    // }

    try {
        let sameproduct = await productModel.findOne({ name: name });

        if (sameproduct) {
            return res.status(409).json({ type: "same details", message: "there is already such a product" });
        }

        let newproduct = new productModel({
            name,
            price,
            description: description || "",
            color,
            startDate: startDate || Date.now(),
            urlImage: urlImage || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7WAcHGVONSN7em4LGqtqKD72ouqgGV-ph_w&s"
        });

        await newproduct.save();

        return res.json(newproduct);
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ type: "invalid operation", message: "sorry, cannot add product" });
    }
}


// עדכון מוצר לפי קוד
export const UpdateProduct = async (req, res) => {
    let { id } = req.params;

    if (!mongoose.isValidObjectId(id))
        return res.status(404).json({ type: "not valid id", massage: "id is in not the right format" });

    try {
        let product = await productModel.findById(id);
        if (!product)
            return res.status(404).json({ type: "product is undifind", massage: "there is no product with such id" });

        let { name, price, description, color, quantity, startDate, urlImage } = req.body;

        product.name = name || product.name;
        product.price = price || product.price;
        product.description = description || product.description;
        product.color = color || product.color;
        product.quantity = quantity || product.quantity;
        product.startDate = startDate || product.startDate;
        product.urlImage = urlImage || product.urlImage;

        await product.save();

        return res.json(product);
    }

    catch (err) {
        console.log(err);
        res.status(400).json({ type: "invalid operation", massage: "sorry, cannot get product" });
    }
}