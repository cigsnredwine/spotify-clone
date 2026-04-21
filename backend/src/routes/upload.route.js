import { Router } from "express";
import { createSong, createAlbum } from "../controller/admin.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protectRoute);

router.post("/songs", createSong);
router.post("/albums", createAlbum);

export default router;
