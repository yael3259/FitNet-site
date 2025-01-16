import express from "express";
import { addUser, login, getAllUsers, deleteUser, resetPasswordUser } from "../controllers/user.js";
import { auth, authAdmin } from "../middlewares/auth.js";



const router = express.Router();


// router.post("/", addUser);
// router.post("/login", login);
// router.get("/", authAdmin, getAllUsers);
// router.delete("/:userId", authAdmin, deleteUser);
// router.put("/", auth, resetPasswordUser);


// ניתוב של נתיבי API עבור משתמשים
router.post("/", addUser);
router.post("/login", login);
router.get("/", getAllUsers);
router.delete("/:userId", deleteUser);
router.put("/", resetPasswordUser);


export default router;