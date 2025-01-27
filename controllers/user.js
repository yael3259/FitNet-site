import { generateToken, userModel } from "../models/user.js";
import bcrypt from "bcryptjs";
import mongoose from 'mongoose';




// רישום משתמש
export const addUser = async (req, res) => {
    let { email, password, userName, url } = req.body;

    if (!email || !password || !userName)
        return res.status(404).json({ type: "missing parameters", message: "enter email, password and userName" });

    try {
        const sameUser = await userModel.findOne({ email: email });

        if (sameUser)
            return res.status(409).json({ type: "same user", message: "user with such email already exist" });

        // פונקציה לשדרוג התפקיד והסרת המילה לפני שם המשתמש
        const ChangingUserStatus = (userName) => {

            if (userName.startsWith(process.env.ROLE_CODE)) {
                const newUserName = userName.replace(process.env.ROLE_CODE, '').trim();
                console.log("After removing ROLE_CODE:", newUserName);
                return { userName: newUserName, role: "ADMIN" };
            }
            return { userName, role: "USER" };
        };

        const { userName: updatedUserName, role } = ChangingUserStatus(userName);

        let hashedPassword = await bcrypt.hash(password, 15);
        let newUser = new userModel({ email, password: hashedPassword, userName: updatedUserName, role, url });

        await newUser.save();

        let token = generateToken(newUser._id, newUser.role, newUser.userName, newUser.url);

        return res.json({ userId: newUser._id, userName: newUser.userName, role: newUser.role, token, email: newUser.email, url: newUser.url});
    }
    catch (err) {
        return res.status(400).json({ type: "invalid operations", message: "cannot add user" });
    }
}


// כניסת משתמש רשום (התחברות)
export const login = async (req, res) => {
    let { email, password } = req.body;

    if (!email || !password)
        return res.status(404).json({ type: "missing parameters", message: "enter email and password" })

    try {
        const user = await userModel.findOne({ email: email })
        if (!user)
            return res.status(404).json({ type: "user is undifind", message: "one or more ditails are invalide" })
        if (!await bcrypt.compare(password, user.password))
            return res.status(404).json({ type: "user is undifind", message: "user passwors is invalide" })

        let token = generateToken(user._id, user.role, user.userName);
        // user.password = "****";
        // return res.json(user);
        return res.json({ _id: user._id, userName: user.userName, role: user.role, token, email: user.email, url: user.url });
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


// מחיקת משתמש
export const deleteUser = async (req, res) => {
    const { userId } = req.params;
    console.log("deleteUser function called with ID:", userId);

    try {
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).json({ type: "not valid id", message: "ID is not the right format" });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ type: "undefined user for delete", message: "This user is undefined for delete" });
        }

        await userModel.findByIdAndDelete(userId);
        return res.json({ message: "User deleted successfully", user });

    } catch (err) {
        console.error("Error details:", {
            message: err.message,
            stack: err.stack,
            code: err.code,
        });
        return res.status(500).json({ type: "invalid operation", message: err.message });
    }
};


// התנתקות משתמש
// export const log_outUser = async (req, res) => {
//     const { userId } = req.params;

//     try {
//         if (!mongoose.isValidObjectId(userId)) {
//             return res.status(400).json({ type: "not valid id", message: "ID is not the right format" });
//         }

//         const user = await userModel.findById(userId);
//         if (!user) {
//             return res.status(404).json({ type: "undefined user for log out", message: "This user is undefined for log out" });
//         }

//         await userModel.findByIdAndDelete(userId);
//         return res.json({ message: "User loged out successfully", user });

//     } catch (err) {
//         console.error("Error details:", {
//             message: err.message,
//             stack: err.stack,
//             code: err.code,
//         });
//         return res.status(500).json({ type: "invalid operation", message: err.message });
//     }
// }

// התנתקות משתמש
export const log_outUser = async (req, res) => {
    const { userId } = req.params;

    try {
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).json({ type: "not valid id", message: "ID is not the right format" });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ type: "undefined user for log out", message: "This user is undefined for log out" });
        }

        user.status = "guest";
        await user.save();

        return res.json({ message: "User logged out successfully", user });

    } catch (err) {
        console.error("Error details:", {
            message: err.message,
            stack: err.stack,
            code: err.code,
        });
        return res.status(500).json({ type: "invalid operation", message: err.message });
    }
}


// שינוי סיסמת משתמש
export const resetPasswordUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email: email })
        if (!user)
            return res.status(404).json({ type: "user is undifind", message: "one or more ditails are invalide" })
        console.log("user found!");

        user.password = await bcrypt.hash(password, 15);

        await user.save();
        console.log("password changed successfully to ", password);
        res.json({ message: "Password reset successfully" });

    } catch (err) {
        console.error("Error details:", {
            message: err.message,
            stack: err.stack,
            code: err.code,
        });
        return res.status(500).json({ type: "invalid operation", message: err.message });
    }
}