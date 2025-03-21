import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import discRoute from "./routes/api/discRoute";
import manufacturerRoute from "./routes/api/manufacturerRoute";
import cors from "cors";

dotenv.config();

const app = express();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;


// Anslut till MongoDB
connectDB();

// CORS

const allowedOrigins = [
    "http://localhost:4200",
    "https://u05-wbsp.onrender.com"
];

app.use(cors({ 
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)){
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

// Middlewares
app.use(express.json());

// Routes
app.use("/api/discs", discRoute);
app.use("/api/manufacturer", manufacturerRoute);

app.get("/", (req,res) => {
    res.send("API is running");
});

app.listen(PORT, (): void => {
console.log(`Server running on port ${PORT}`)
});