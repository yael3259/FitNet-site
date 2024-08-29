import express from "express";
import { addUser, login, getAllUsers } from "../controllers/user.js";
import { authAdmin } from "../middlewares/auth.js";




const router = express.Router();


// router.get("/", authAdmin, getAllUsers);
// router.post("/", addUser);
// router.post("/login", login);

router.get("/", getAllUsers);
router.post("/", addUser);
router.post("/login", login);

export default router;