import mongoose from "mongoose";

const connectDB = async (): Promise <void> => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);       

        console.log("MongoDB connected ...");

    } catch (error: unknown) {
        console.error("MongoDB failed connection", (error as Error).message);
        process.exit(1);
    }
}

export default connectDB;