import mongoose from "mongoose";


// התחברות למסד נתונים לוקאלי
export const connectToDb = async () => {
    try {
        let connect = await mongoose.connect(process.env.DB_URI || "mongodb://0.0.0.0:27017/fitnessDB");
        // let connect = await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        console.log("mongo db connected!")
    } catch (err) {
        console.log(err);
        console.log("cannot connect to mongo db");
        process.exit(1);
    }
}

// export const connectToDb = async () => {
//     try {
//         let connect = await mongoose.connect(process.env.MONGO_URI);
//         console.log("MongoDB connected!");
//     } catch (err) {
//         console.error("Cannot connect to MongoDB:", err);
//         process.exit(1);
//     }
// };
