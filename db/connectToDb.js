import mongoose from "mongoose";



export const connectToDb = async () => {
    try {
        let connect = await mongoose.connect(process.env.DB_URI||"mongodb://0.0.0.0:27017/coursesDB");
        console.log("mongo db connected!")
    }

    catch (err) {
        console.log(err);
        console.log("cannot connect to mongo db");
        process.exit(1);
    }
}