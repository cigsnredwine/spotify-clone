import { Router } from "express";
import {
    createSong,
    createAlbum,
    getUploadedSongs,
    getUploadedAlbums,
} from "../controller/admin.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protectRoute);

router.get("/songs", getUploadedSongs);
router.get("/albums", getUploadedAlbums);
router.post("/songs", createSong);
router.post("/albums", createAlbum);

export default router;
