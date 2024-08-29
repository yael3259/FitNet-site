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