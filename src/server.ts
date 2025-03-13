import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import discRoute from "./routes/api/discRoute";
import manufacturerRoute from "./routes/api/manufacturerRoute";
import cors from "cors";

dotenv.config();

const app: Application = express();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;


// Anslut till MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/discs", discRoute);
app.use("/manufacturer", manufacturerRoute);

app.get("/", (req: Request, res: Response) => {
    res.send("API is running");
});

app.listen(PORT, (): void => {
console.log(`Server running on port ${PORT}`)
});