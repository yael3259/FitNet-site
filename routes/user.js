import express from "express";
import { addUser, login, getAllUsers, deleteUser } from "../controllers/user.js";
import { authAdmin } from "../middlewares/auth.js";




const router = express.Router();


router.post("/", addUser);
router.post("/login", login);
router.get("/", getAllUsers);
router.delete("/:id", deleteUser);

// router.post("/", addUser);
// router.post("/login", login);
// router.delete("/:id", authAdmin, deleteUser);
// router.get("/", authAdmin, getAllUsers);


export default router;