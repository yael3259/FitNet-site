import express from "express";
import productRouter from "./routes/product.js";
import userRouter from "./routes/user.js";
import orderRouter from "./routes/order.js";
import { connectToDb } from "./db/connectToDb.js";
import { config } from "dotenv";
import cors from "cors";
import { errorHandling } from "./middlewares/errorHandling.js";




const printDate = (req, res, next) => {
    console.log("A new request in: ", Date.now());
    next();
}


const app = express();

// app.use("/api/course", printDate);
//הפונקציה הזו תופעל רק כשתהיה קריאת get
// app.get("/api/course", printDate);

// ניתוב להצגת תמונות מתוך תיקית files
app.use("/api/pic", express.static("files"));

//הגדרת הרשאות גישה לכתובת מסוימת או לכל כתובת (האפשרות השניה)
// app.use(cors({ methods: "POST GET PUT DELETE", origin: "http://localhost:3000" }))
// app.use(cors({ methods: "POST GET PUT DELETE", origin: "*" }))
app.use(cors());

app.use(express.json());

connectToDb();
config();


app.use("/domain/api/product", productRouter);
app.use("/domain/api/user", userRouter);
app.use("/domain/api/order", orderRouter);


// ללכידת שגיאות middle-ware
//(אם קרתה שגיאה כלשהי בפרויקט, תופיע הודעה והתוכנית לא תקרוס)
app.use(errorHandling);



let port = process.env.PORT || 3500;
app.listen(port, () => {
    console.log(`app is listening on port ${port}`);
})



// import express from 'express';
// import productRouter from './routes/product.js';
// import userRouter from './routes/user.js';
// import orderRouter from './routes/order.js';
// import { connectToDb } from './db/connectToDb.js';
// import { config } from 'dotenv';
// import cors from 'cors';
// import { errorHandling } from './middlewares/errorHandling.js';
// import nodemailer from 'nodemailer';  // הוספת Nodemailer

// const printDate = (req, res, next) => {
//   console.log("A new request in: ", Date.now());
//   next();
// };

// const app = express();

// // ניתוב להצגת תמונות מתוך תיקית files
// app.use("/api/pic", express.static("files"));

// app.use(cors());
// app.use(express.json());

// connectToDb();
// config();

// // הגדרת הטרנספוטר של Nodemailer
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,  // המשתמש מהמייל (ב- .env)
//     pass: process.env.EMAIL_PASS,  // הסיסמה שמוגדרת ב- .env
//   },
//   tls: {
//     rejectUnauthorized: false  // מוסיף אבטחה נוספת במקרים מסוימים
//   }
// });

// // נתיב לשליחת אימייל
// app.post('/domain/api/send-email', (req, res) => {
//   const { fullname, email, message } = req.body;

//   const mailOptions = {
//     from: process.env.EMAIL_USER,  // כתובת שולח הדוא"ל
//     to: email,  // כתובת הנמען (הכתובת שהמשתמש הזין)
//     subject: 'Your message was received',  // נושא ההודעה
//     text: `Hello ${fullname},\n\nYour message was received successfully. We will get back to you within 3 business days.\n\nMessage: ${message}\n\nThank you for contacting us!`
//   };

//   console.log('Transporter configuration:', transporter.options);

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.log('Error details:', error);  // הוסף פרטים על השגיאה
//       return res.status(500).json({ message: 'Failed to send email', error });
//     } else {
//       console.log('Email sent: ' + info.response);
//       return res.status(200).json({ message: 'Email sent successfully' });
//     }
//   });
// });

// // נתיבים אחרים
// app.use("/domain/api/product", productRouter);
// app.use("/domain/api/user", userRouter);
// app.use("/domain/api/order", orderRouter);

// // ללכידת שגיאות middle-ware
// app.use(errorHandling);

// let port = process.env.PORT || 3500;
// app.listen(port, () => {
//   console.log(`App is listening on port ${port}`);
// });
