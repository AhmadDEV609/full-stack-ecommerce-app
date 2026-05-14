import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

const dbconnection = async () => {
    try {
        if (mongoose.connection.readyState === 1) {
            return;
        }

        await mongoose.connect(MONGODB_URL);

        console.log("MongoDB Connected");
    } catch (error) {
        console.log(error);
    }
};

export default dbconnection;