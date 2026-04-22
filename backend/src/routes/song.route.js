import { Router } from 'express'
import {
    getAllSongs,
    getNewUploadSongs,
    getTrendingSongs,
    getLatestSongs,
    getRecentlyUpdatedSongs,
    searchSongs,
} from '../controller/song.controller.js'
import { protectRoute, requireAdmin } from '../middleware/auth.middleware.js'

const router = Router()

router.get("/", protectRoute, requireAdmin,getAllSongs);
router.get("/latest", getLatestSongs);
router.get("/recently-updated", getRecentlyUpdatedSongs);
router.get("/search", searchSongs);
router.get("/new-uploads", getNewUploadSongs);
router.get("/trending", getTrendingSongs);

export default router
