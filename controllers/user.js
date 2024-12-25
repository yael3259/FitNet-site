import { generateToken, userModel } from "../models/user.js";
import bcrypt from "bcryptjs";




// רישום משתמש
// export const addUser = async (req, res) => {
//     let { email, password, userName } = req.body;

//     if (!email || !password || !userName)
//         return res.status(404).json({ type: "missing parameters", message: "enter email, password and userName" })

//     try {
//         const sameUser = await userModel.findOne({ email: email })

//         if (sameUser)
//             return res.status(409).json({ type: "same user", message: "user with such email already exist" })

//         // פונקציה לעדכון התפקיד
//         const ChangingUserStatus = (userName) => {
//             if (userName.startsWith(process.env.ROLE_CODE)) {
//                 userName = userName.replace(process.env.ROLE_CODE, '').trim();
//                 return "ADMIN";
//             }
//             return "USER";
//         };

//         let role = ChangingUserStatus(userName);

//         let hashedPassword = await bcrypt.hash(password, 15);
//         let newUser = new userModel({ email, password: hashedPassword, userName, role });

//         await newUser.save();

//         let token = generateToken(newUser._id, newUser.role, newUser.userName);

//         return res.json({ userId: newUser._id, userName: newUser.userName, role: newUser.role, token, email: newUser.email });
//     }
//     catch (err) {
//         return res.status(400).json({ type: "invalide operations", message: "cannot add user" })
//     }
// }
export const addUser = async (req, res) => {
    let { email, password, userName } = req.body;

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
        let newUser = new userModel({ email, password: hashedPassword, userName: updatedUserName, role });

        await newUser.save();

        let token = generateToken(newUser._id, newUser.role, newUser.userName);

        return res.json({ userId: newUser._id, userName: newUser.userName, role: newUser.role, token, email: newUser.email });
    }
    catch (err) {
        return res.status(400).json({ type: "invalid operations", message: "cannot add user" });
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


// מחיקת משתמש
export const deleteUser = async (req, res) => {
    let { id } = req.params;
    console.log("ID received by server:", id);
    try {
        if (!mongoose.isValidObjectId(id))
            return res.status(400).json({ type: "not valid id", message: "id is not in the right format" });

        let user = await userModel.findById(id);
        console.log("User found:", user);
        if (!user) {
            return res.status(404).json({ type: "undefined user for delete", message: "this user is undefined for delete" });
        }

        console.log("Attempting to delete user with ID:", id);

        user = await userModel.findByIdAndDelete(id);
        console.log("User deleted:", user);
        return res.json(user);
    } catch (err) {
        console.log(err);
        res.status(400).json({ type: "invalid operation", message: "sorry cannot delete user" });
    }
};


// export const deleteUser = async (req, res) => {
//     const { id } = req.params;

//     // לוג עבור ה-ID המתקבל
//     console.log("ID received by server:", id);

//     try {
//         // בדיקת תקינות ה-ID
//         if (!mongoose.isValidObjectId(id)) {
//             console.log("Invalid ID format");
//             return res.status(400).json({
//                 type: "not valid id",
//                 message: "ID is not in the correct format"
//             });
//         }

//         // מחיקת המשתמש ישירות
//         const user = await userModel.findByIdAndDelete(id);

//         // בדיקה אם המשתמש נמצא ונמחק
//         if (!user) {
//             console.log("User not found for deletion:", id);
//             return res.status(404).json({
//                 type: "undefined user for delete",
//                 message: "This user is undefined for deletion"
//             });
//         }

//         // החזרת המשתמש שנמחק
//         console.log("User deleted successfully:", user);
//         return res.json(user);

//     } catch (err) {
//         // טיפול בשגיאות
//         if (err.name === 'MongoError') {
//             console.error("MongoDB error during deletion:", err);
//             return res.status(500).json({
//                 type: "db error",
//                 message: "Database operation failed"
//             });
//         }

//         console.error("General error during deletion:", err);
//         return res.status(400).json({
//             type: "invalid operation",
//             message: "Sorry, cannot delete user"
//         });
//     }
// };