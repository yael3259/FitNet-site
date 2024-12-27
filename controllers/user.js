import { generateToken, userModel } from "../models/user.js";
import bcrypt from "bcryptjs";




// רישום משתמש
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
        return res.json({ _id: user._id, userName: user.userName, role: user.role, token, email: user.email });
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
// export const deleteUser = async (req, res) => {
//     let { userId } = req.params;
//     console.log("ID received by server:", userId);
//     try {
//         if (!mongoose.isValidObjectId(userId)) {
//             return res.status(400).json({ type: "not valid id", message: "id is not in the right format" });
//         }

//         let user = await userModel.findById(userId);
//         console.log("User found:", user);
//         if (!user) {
//             return res.status(404).json({ type: "undefined user for delete", message: "this user is undefined for delete" });
//         }

//         console.log("Attempting to delete user with ID:", userId);

//         user = await userModel.findByIdAndDelete(userId);
//         console.log("User deleted:", user);
//         return res.json(user);
//     } catch (err) {
//         console.log(err);
//         res.status(400).json({ type: "invalid operation", message: "sorry cannot delete user" });
//     }
// };
// מחיקת משתמש
export const deleteUser = async (req, res) => {
    let { userId } = req.params;

    try {
        if (!mongoose.isValidObjectId(userId))
            return res.status(400).json({ type: "not valid id", message: "id is not the right format" });

        let user = await userModel.findById(userId);

        if (!user)
            return res.status(404).json({ type: "undefined user for delete", message: "this user is undefined for delete" });

        user = await userModel.findByIdAndDelete(userId);

        return res.json(user);
    } catch (err) {
        console.log(err);
        res.status(400).json({ type: "invalid operation", message: "sorry cannot delete user" });
    }
};

// מחיקת מוצר
export const deleteProduct = async (req, res) => {
    let { id } = req.params;

    try {
        if (!mongoose.isValidObjectId(id))
            return res.status(400).json({ type: "not valid id", message: "id is in not the right format" })

        let product = await productModel.findById(id);

        if (!product)
            return res.status(404).json({ type: "undifind product for delete", message: "this product is undifind for delete" })

        product = await productModel.findByIdAndDelete(id);

        return res.json(product)
    }
    catch (err) {
        console.log(err)
        res.status(400).json({ type: "invalid operation", message: "sorry cannot delete product" })
    }
}

