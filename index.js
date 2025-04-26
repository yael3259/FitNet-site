import express from "express";
import productRouter from "./routes/product.js";
import userRouter from "./routes/user.js";
import orderRouter from "./routes/order.js";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";
import { config } from "dotenv";
import { connectToDb } from "./db/connectToDb.js";
import { errorHandling } from "./middlewares/errorHandling.js";


dotenv.config();

const app = express();
// app.use(express.json());
// app.use(cors({
//     methods: "POST, GET, PUT, DELETE",
//     origin: "*"
// }));
app.use(cors({
    origin: ["https://fitnet-site.vercel.app"],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    preflightContinue: true,
    optionsSuccessStatus: 204
}));


const printDate = (req, res, next) => {
    console.log("A new request in: ", new Date().toISOString());
    next();
};
app.use(printDate);

// ניתובים עיקריים
app.use("/domain/api/product", productRouter);
app.use("/domain/api/user", userRouter);
app.use("/domain/api/order", orderRouter);


// מסלול לשליחת הודעה מטופס יצירת קשר
app.post("/domain/api/contact", async (req, res) => {
    const { fullname, email, message } = req.body;
    console.log("Received contact form:", { fullname, email, message });

    if (!fullname || !email || !message) {
        console.error("Error: All fields are required");
        return res.status(400).json({ error: "All fields are required" });
    }
    try {
        console.log("Attempting to send contact form email...");
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false, // עקיפת בדיקות אישור האבטחה
            },
        });

        const mailOptions = {
            from: email,
            to: process.env.RECIPIENT_EMAIL,
            subject: `New Contact Form Submission from ${fullname}`,
            text: `Name: ${fullname}\nEmail: ${email}\n\nMessage:\n${message}`,
        };

        await transporter.sendMail(mailOptions);
        console.log("Contact form email sent successfully!");
        res.json({ message: "Message sent successfully!" });
    } catch (error) {
        console.error("Error sending contact form email:", error);
        res.status(500).json({ error: "Failed to send message" });
    }
});

// חיבור למסד נתונים
config();
connectToDb();

// לניהול שגיאות middleware שימוש ב
app.use(errorHandling);

// הפעלת השרת
const PORT = process.env.PORT || 3500;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
