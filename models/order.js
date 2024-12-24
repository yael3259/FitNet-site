import mongoose from "mongoose";
import { productSchema } from "./product.js";




// פונקציה ליצירת תאריך לעוד שבוע מהיום
const defaultDate = () => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return nextWeek;
}


// סכמת מוצר (שדות חובה)
const minimalProduct = mongoose.Schema({
    // product_Id: { type: mongoose.Schema.Types.ObjectId, ref: 'products' }, // קשר למודל המוצר
    name: { type: String, required: true },
    quantity: Number
});


// סכמת הזמנה
const orderSchema = mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'orders' },
    orderDate: { type: Date, default: Date.now() },
    targetDate: { type: Date, default: defaultDate },
    address: String,
    userId: String,
    products: [minimalProduct],
    isSent: { type: Boolean, default: false }
});


// פונקציה שבודקת אם קיימים שדות חסרים בהזמנה
export const orderValidator = (orderData) => {
    const { targetDate, address, products } = orderData;
    const errors = [];

    // if (!targetDate) {
    //     errors.push("Target date is required");
    // }

    if (!address) {
        errors.push("Address is required");
    }

    if (!products || !Array.isArray(products) || products.length === 0) {
        errors.push("At least one product is required");
    }

    return {
        isValid: errors.length === 0,
        errors: errors
    };
};



export const orderModel = mongoose.model("orders", orderSchema);
