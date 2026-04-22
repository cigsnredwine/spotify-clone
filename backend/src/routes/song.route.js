import { Router } from 'express'
import {
    getAllSongs,
    getMadeForYouSongs,
    getFeaturedSongs,
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
router.get("/featured", getFeaturedSongs);
router.get("/made-for-you", getMadeForYouSongs);
router.get("/trending", getTrendingSongs);

export default router
