import express from "express";
import dotenv from "dotenv";
import { clerkMiddleware } from '@clerk/express';
import fileUpload from "express-fileupload";
import path from "path";
import cors from "cors";

import { connectDB } from "./lib/db.js";
import userRoutes from "./routes/user.route.js";
import adminRoutes from "./routes/admin.route.js";
import authRoutes from "./routes/auth.route.js";
import songRoutes from "./routes/song.route.js";
import albumRoutes from "./routes/album.route.js";
import statsRoutes from "./routes/stats.route.js";


dotenv.config();

const __dirname = path.resolve();
const app = express();
const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

app.use(cors(
    {
        origin: CLIENT_URL,
        credentials: true
    }
))
app.use(express.json()); // to parse req.body
app.use(
    clerkMiddleware({
        authorizedParties: [CLIENT_URL],
    })
); // add auth to req obj ==> req.auth
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp"),
    createParentPath: true,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB max file size
    }
}));


app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/album", albumRoutes);
app.use("/api/stats", statsRoutes);

// error handler
app.use((err, req, res, next) => {
    res.status(500).json({message: process.env.NODE_ENV === "production" ? "Internal server error" : err.message});
})
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});

// todo: socket.io will be implemented
