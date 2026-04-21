import express from "express";
import dotenv from "dotenv";
import { clerkMiddleware } from '@clerk/express';
import fileUpload from "express-fileupload";
import path from "path";
import cors from "cors";
import cron from "node-cron";
import fs from "fs";

import { connectDB } from "./lib/db.js";
import userRoutes from "./routes/user.route.js";
import adminRoutes from "./routes/admin.route.js";
import authRoutes from "./routes/auth.route.js";
import songRoutes from "./routes/song.route.js";
import albumRoutes from "./routes/album.route.js";
import statsRoutes from "./routes/stats.route.js";
import { createServer } from "http";
import { initializeSocket } from "./lib/socket.js";


dotenv.config();

const __dirname = path.resolve();
const app = express();
const PORT = process.env.PORT;
const CLIENT_URLS = (process.env.CLIENT_URL || "http://localhost:3000")
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean);

const isAllowedOrigin = (origin) => {
    if (!origin) return true;
    return CLIENT_URLS.includes(origin);
};

const httpServer = createServer(app);
initializeSocket(httpServer);

app.use(cors({
    origin(origin, callback) {
        if (isAllowedOrigin(origin)) {
            return callback(null, true);
        }

        callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true
}))
app.use(express.json()); // to parse req.body
app.use(
    clerkMiddleware({
        authorizedParties: CLIENT_URLS,
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

// cron jobs
// delete temp files after 1 hour
const tempDir = path.join(process.cwd(), "tmp");

cron.schedule("0 * * * *", () => {
    if (fs.existsSync(tempDir)) {
        fs.readdir(tempDir, (err, files) => {
            if (err) {
                console.error("Error reading temp directory:", err);
                return;
            }
            for (const file of files) {
                fs.unlink(path.join(tempDir,file), err => {});
            }
        });
    }
})


app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/album", albumRoutes);
app.use("/api/stats", statsRoutes);

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("/{*splat}", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
    })
}

// error handler
app.use((err, req, res, next) => {
    res.status(500).json({message: process.env.NODE_ENV === "production" ? "Internal server error" : err.message});
})
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});
