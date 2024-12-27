import express from "express";
import { addUser, login, getAllUsers, deleteUser } from "../controllers/user.js";
import { authAdmin } from "../middlewares/auth.js";




const router = express.Router();


router.post("/", addUser);
router.post("/login", login);
router.get("/", getAllUsers);
router.delete("/:userId", deleteUser);

// router.post("/", addUser);
// router.post("/login", login);
// router.get("/", authAdmin, getAllUsers);
// router.delete('/delete/:userId',authAdmin, deleteUser);


export default router;