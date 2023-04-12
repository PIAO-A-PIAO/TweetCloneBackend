import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auths.js";
import tweetRoutes from "./routes/tweets.js";
import chatRoutes from "./routes/chats.js";

const app = express();
dotenv.config();

const connect = () => {
    mongoose.connect(process.env.MONGO)
    .then(() => {
        console.log("Connected to MongoDB");
    }).catch(err => {throw err});
}

app.get('/', (req, res) => {
    res.send('hi');
})

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use("/api/users", userRoutes);
app.use("/api/auths", authRoutes);
app.use("/api/tweets", tweetRoutes);
app.use("/api/chats", chatRoutes);

app.listen(8000, () => {
    connect();
    console.log("Server is running on port 8000");
});

export default app;