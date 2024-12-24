import { generateToken, userModel } from "../models/user.js";
import bcrypt from "bcryptjs";




// רישום משתמש
export const addUser = async (req, res) => {
    let { email, password, userName } = req.body;

    if (!email || !password || !userName)
        return res.status(404).json({ type: "missing parameters", message: "enter email, password and userName" })

    try {
        const sameUser = await userModel.findOne({ email: email })

        if (sameUser)
            return res.status(409).json({ type: "same user", message: "user with such email already exist" })

        // פונקציה לעדכון התפקיד
        const ChangingUserStatus = (userName) => {
            if (userName.startsWith(process.env.ROLE_CODE)) {
                return "ADMIN";
            }
            return "USER";
        };

        // עדכון התפקיד לפני שמירת המשתמש
        let role = ChangingUserStatus(userName);

        let hashedPassword = await bcrypt.hash(password, 15);
        let newUser = new userModel({ email, password: hashedPassword, userName, role });

        await newUser.save();

        let token = generateToken(newUser._id, newUser.role, newUser.userName);

        return res.json({ userId: newUser._id, userName: newUser.userName, role: newUser.role, token, email: newUser.email });
    }
    catch (err) {
        return res.status(400).json({ type: "invalide operations", message: "cannot add user" })
    }
}

// let token = generateToken(newUser.userId, newUser.role, newUser.userName);
// return res.json({ userId: newUser.userId, userName: newUser.userName, token, email: newUser.email });


// כניסת משתמש רשום (התחברות)
export const login = async (req, res) => {
    let { email, password } = req.body;

    if (!email || !password)
        return res.status(404).json({ type: "missing parameters", message: "enter email, password and userName" })

    try {
        const user = await userModel.findOne({ email: email })
        if (!user)
            return res.status(404).json({ type: "user is undifind", message: "one or more ditails are invalide" })
        if (!await bcrypt.compare(password, user.password))
            return res.status(404).json({ type: "user is undifind", message: "user passwors is invalide" })

        let token = generateToken(user._id, user.role, user.userName);
        // user.password = "****";
        // return res.json(user);
        return res.json({ _id: user._id, userName: user.userName, token, email: user.email });

    }
    catch (err) {
        return res.status(400).json({ type: "invalide operations", message: "cannot sign in user" })
    }
}


// הצגת כל המשתמשים
export const getAllUsers = async (req, res) => {
    try {
        // מציג את כל הנתונים של המשתמשים חוץ מהסיסמה
        let allUsers = await userModel.find({}, '-password');

        res.json(allUsers);
    }
    catch (err) {
        return res.status(400).json({ type: "invalide operations", message: "cannot sign in user" })
    }
}