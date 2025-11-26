import express from "express";
import dotenv, { config } from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoute from "./routes/userRoutes.js";
import eventRoute from "./routes/eventRoutes.js";
import swapRoute from "./routes/swapRoutes.js";


dotenv.config();

// MongoDB configuration
connectDB();

const app = express();

// Middlewares
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(express.json());

// Defining Routes
app.use("/api/user", userRoute);
app.use("/api/events", eventRoute);
app.use("/api/swaps", swapRoute);

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
    console.log(`Server is running on port ${PORT}`)
);