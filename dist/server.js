"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const discRoute_1 = __importDefault(require("./routes/api/discRoute"));
const manufacturerRoute_1 = __importDefault(require("./routes/api/manufacturerRoute"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
// Anslut till MongoDB
(0, db_1.default)();
// CORS
const allowedOrigins = [
    "http://localhost:4200", // future frontend
    "http://127.0.0.1:5500", // dev frontend, local
    "http://localhost:3000", // local backend
    "https://u05-wbsp.onrender.com" // Deployed backend
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));
// Middlewares
app.use(express_1.default.json());
// Routes
app.use("/api/discs", discRoute_1.default);
app.use("/api/manufacturer", manufacturerRoute_1.default);
app.get("/", (req, res) => {
    res.send("API is running");
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
