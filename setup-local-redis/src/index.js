import express from "express";
import Redis from "ioredis";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const redis = new Redis(
    process.env.REDIS_URL || "redis://localhost:6379"
);

// ioredis ek Redis client library hai jo Node.js application ko Redis server ke saath communicate karne deti hai

const connectDB = async () => {
    await mongoose.connect(
        process.env.MONGO_URL ||
        "mongodb://localhost:27017/mydatabase"
    );

    console.log("MongoDB connected:", mongoose.connection.name);
};

app.get("/redis", async (req, res) => {
    const reply = await redis.ping();
    res.json({ redis: reply });
});

app.get("/mongo", (req, res) => {
    res.json({
        mongo: "connected successfully",
        database: mongoose.connection.name
    });
});

const startServer = async () => {
    try {
        await connectDB();

        await redis.ping();

        app.listen(3000, () => {
            console.log("Server running on port 3000");
        });
    } catch (error) {
        console.error("Server startup failed:", error);
        process.exit(1);
    }
};

startServer();