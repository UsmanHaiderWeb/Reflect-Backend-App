import mongoose from "mongoose";
import dotenv from "dotenv";

const connectToDb = async () => {
    try {
        dotenv.config();
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("DB connected");
    } catch (error) {
        console.log("DB connection error: ", error.message);
        process.exit(1);
    }
}

export default connectToDb;