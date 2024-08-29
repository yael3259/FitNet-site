import Joi from "joi";
import mongoose from "mongoose";





// let image="https://www.misgeret.co.il/wht_Images/catalog/subject/image_content_597.jpg.webp";

// סכמת מוצר
export const productSchema = mongoose.Schema({

    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
    name: { type: String, unique: true },
    price: Number,
    description: { type: String },
    color: String,
    quantity: Number,
    startDate: { type: Date, default: Date.now() },
    urlImage: { type: String, default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7WAcHGVONSN7em4LGqtqKD72ouqgGV-ph_w&s"},
    // urlImage: { type: String, default: image },
    localhost: String
})



export const productValidator = (_product) => {
    const productValidationSchema = Joi.object({
        name: Joi.string().min(10).max(15).required(),
        price: Joi.number().min(6).max(500).required(),
        description: Joi.string().optional(),
        startDate: Joi.date().max(new Date().toISOString()),
        urlImage: Joi.string()
    })

    return productValidationSchema.validate(_product);
}



export const productModel = mongoose.model("products", productSchema);