import Joi from "joi";
import mongoose from "mongoose";




// סכמת מוצר
export const productSchema = mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
    name: { type: String, unique: true },
    price: Number,
    description: String,
    color:{ type: String, default: "black"},
    quantity: { type: Number, default: 1},
    startDate: { type: Date, default: Date.now() },
    urlImage: { type: String, default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7WAcHGVONSN7em4LGqtqKD72ouqgGV-ph_w&s"},
    localhost: String
})



export const productValidator = (_product) => {
    const productValidationSchema = Joi.object({
        name: Joi.string().min(5).max(20).required(),
        price: Joi.number().min(6).max(500).required(),
        description: Joi.string().optional(),
        startDate: Joi.date().optional().max(new Date().toISOString()),
        urlImage: Joi.string().optional()
    })

    return productValidationSchema.validate(_product);
}


export const productModel = mongoose.model("products", productSchema);