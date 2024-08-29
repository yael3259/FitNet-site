import express from "express";
import { getAllProducts, getProductById, AddProduct, deleteProduct, UpdateProduct } from "../controllers/product.js";
import { authAdmin } from "../middlewares/auth.js";




const router = express.Router();

// router.get("/", getAllProducts);
// router.get("/:id", getProductById);
// router.delete("/:id", authAdmin, deleteProduct);
// router.post("/", authAdmin, AddProduct);
// router.put("/:id", authAdmin, UpdateProduct);

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.delete("/:id", deleteProduct);
router.post("/", AddProduct);
router.put("/:id", UpdateProduct);


export default router;