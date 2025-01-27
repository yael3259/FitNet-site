// import express from "express";
// import productRouter from "./routes/product.js";
// import userRouter from "./routes/user.js";
// import orderRouter from "./routes/order.js";
// import { connectToDb } from "./db/connectToDb.js";
// import { config } from "dotenv";
// import cors from "cors";
// import { errorHandling } from "./middlewares/errorHandling.js";




// const printDate = (req, res, next) => {
//     console.log("A new request in: ", Date.now());
//     next();
// }


// const app = express();

// // app.use("/api/course", printDate);
// //הפונקציה הזו תופעל רק כשתהיה קריאת get
// // app.get("/api/course", printDate);

// // ניתוב להצגת תמונות מתוך תיקית files
// app.use("/api/pic", express.static("files"));

// //הגדרת הרשאות גישה לכתובת מסוימת או לכל כתובת (האפשרות השניה)
// // app.use(cors({ methods: "POST GET PUT DELETE", origin: "http://localhost:3000" }))
// // app.use(cors({ methods: "POST GET PUT DELETE", origin: "*" }))
// app.use(cors());

// app.use(express.json());

// connectToDb();
// config();


// app.use("/domain/api/product", productRouter);
// app.use("/domain/api/user", userRouter);
// app.use("/domain/api/order", orderRouter);


// // ללכידת שגיאות middle-ware
// //(אם קרתה שגיאה כלשהי, תופיע הודעה והשרת לא יקרוס)
// app.use(errorHandling);



// let port = process.env.PORT || 3500;
// app.listen(port, () => {
//     console.log(`app is listening on port ${port}`);
// })



import express from "express";
import productRouter from "./routes/product.js";
import userRouter from "./routes/user.js";
import orderRouter from "./routes/order.js";
import nodemailer from "nodemailer";
import cors from "cors";
import { config } from "dotenv";
import { connectToDb } from "./db/connectToDb.js";
import { userModel } from "./models/user.js";
import { errorHandling } from "./middlewares/errorHandling.js";
import dotenv from 'dotenv';


const app = express();
app.use(express.json());
app.use(cors());

const printDate = (req, res, next) => {
    console.log("A new request in: ", Date.now());
    next();
}

// הגדרת הרשאות גישה לכתובת מסוימת או לכל כתובת (האפשרות השניה)
app.use(cors({ methods: "POST GET PUT DELETE", origin: "http://localhost:3000" }));
app.use(cors({ methods: "POST GET PUT DELETE", origin: "*" }));

app.use("/domain/api/product", productRouter);
app.use("/domain/api/user", userRouter);
app.use("/domain/api/order", orderRouter);


// פונקציה לשליחת מייל עם קישור לאיפוס סיסמה
const sendResetPasswordEmail = async (userEmail, resetLink) => {
    if (!userEmail || !resetLink) {
        throw new Error("User email and reset link must be provided.");
    }

    // בדיקת אם קישור האיפוס לא ריק
    if (!resetLink || resetLink.trim() === '') {
        throw new Error("Reset link cannot be empty.");
    }

    // בדיקה אם יש הגדרות סביבה תקינות עבור המייל
    if (!process.env.EMAIL || !process.env.EMAIL_PASSWORD) {
        throw new Error("Email credentials are missing in environment variables.");
    }
    

    // יצירת חיבור לשרת הדואר
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,  // כתובת המייל שלך
            pass: process.env.EMAIL_PASSWORD,  // סיסמת המייל שלך או סיסמת אפליקציה
        },
    });

    // בדיקת אם החיבור תקין
    if (!transporter) {
        throw new Error("Failed to create transporter.");
    }

    // הגדרות המייל
    const mailOptions = {
        from: process.env.EMAIL,
        to: userEmail,
        subject: "Password Reset Request",
        text: `To reset your password, click the following link: ${resetLink}`,
    };

    try {
        // ניסיון לשלוח את המייל
        await transporter.sendMail(mailOptions);
        console.log("Password reset email sent to:", userEmail);
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Email sending failed");
    }
};


// מסלול לשליחת מייל עם קישור לאיפוס סיסמה
app.post("/domain/api/user/reset-password", async (req, res) => {
    const { email } = req.body;
    console.log("Received email:", email);

    try {
        // חיפוש המשתמש במסד הנתונים
        const user = await userModel.findOne({ email });
        console.log("User found in DB:", user);

        if (!user) {
            console.log("User not found");
            return res.status(404).json({
                type: "user not found",
                message: "No user found with that email",
            });
        }

        // יצירת קישור לאיפוס סיסמה
        const resetToken = "some-unique-token";
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        console.log("Reset Link:", resetLink); // הצג את הקישור שנשלח במייל

        // שליחת המייל למשתמש
        await sendResetPasswordEmail(user.email, resetLink);
        console.log("Email sent successfully");

        return res.status(200).json({
            message: "Password reset email sent successfully",
        });
    } catch (err) {
        console.error("Error processing request:", err);
        return res.status(500).json({
            type: "internal server error",
            message: "Failed to process the request",
            error: err.message,
        });
    }
});

app.use(errorHandling);

config();
connectToDb();

let port = process.env.PORT || 3500;
app.listen(port, () => {
    console.log(`app is listening on port ${port}`);
});