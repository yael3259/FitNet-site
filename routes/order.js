import express from "express";
import { getAllorders, getOrderById, AddOrder, deleteOrder, UpdateOrder } from "../controllers/order.js";
import { auth, authAdmin } from "../middlewares/auth.js";



const router = express.Router();


// router.get("/", authAdmin, getAllorders);
// router.get("/:id", auth, getOrderById);
// router.delete("/:id", auth, deleteOrder);
// router.post("/", auth, AddOrder);
// router.put("/", authAdmin, UpdateOrder);


router.get("/", getAllorders);
router.get("/:id", getOrderById);
router.delete("/:id", deleteOrder);
router.post("/", AddOrder);
router.put("/:id", UpdateOrder);


export default router;