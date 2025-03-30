import Joi from 'joi';
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';



// סכמת משתמש
export const userSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    userName: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: "USER" },
    enterDate: { type: Date, default: Date.now() },
    url: String
});



// בדיקות תקינות
export const userValidator = (_user) => {
    const userValidationSchema = Joi.object().keys({
        userName: Joi.string().min(3).max(20).required(),
        url: Joi.string().optional()
    });
    return userValidationSchema.validate(_user);
}


// פונקציה ליצירת הסיסמה (token)
export const generateToken = (_id, role, userName) => {
    let token = jwt.sign(
        { _id, role, userName },
        process.env.SECRET_JWT,
        { expiresIn: "1h" });
    return token;
}

// ללא הגבלת זמן הגלישה באתר
// export const generateToken = (_id, role, userName) => {
//     let token = jwt.sign(
//         { _id, role, userName },
//         process.env.SECRET_JWT
//     );
//     return token;
// };


export const userModel = mongoose.model("users", userSchema);