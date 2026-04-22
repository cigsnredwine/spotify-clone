import { Song } from "../models/song.model.js"

export const getAllSongs = async(req, res, next) => {
    try {
        // -1 = descending => newest to oldest
        // 1 = ascending => oldest to newest
        const songs = await Song.find().sort({createdAt: -1});
        res.json(songs)
    } catch (error) {
        next(error);
    }
}

export const getLatestSongs = async (req, res, next) => {
    try {
        const songs = await Song.find().sort({ createdAt: -1 });
        res.json(songs);
    } catch (error) {
        next(error);
    }
}

export const getRecentlyUpdatedSongs = async (req, res, next) => {
    try {
        const songs = await Song.find().sort({ updatedAt: -1 });
        res.json(songs);
    } catch (error) {
        next(error);
    }
}

export const searchSongs = async (req, res, next) => {
    try {
        const query = String(req.query.q || "").trim();

        if (!query) {
            return res.json({ songs: [], artists: [] });
        }

        const regex = new RegExp(query, "i");
        const songs = await Song.find({
            $or: [
                { title: regex },
                { artist: regex },
                { artists: { $elemMatch: { $regex: regex } } },
            ],
        }).sort({ createdAt: -1 });

        const artists = Array.from(
            new Set(
                songs.flatMap((song) => (song.artists?.length ? song.artists : song.artist.split(",")))
                    .map((artist) => artist.trim())
                    .filter((artist) => artist && regex.test(artist))
            )
        );

        res.json({ songs, artists });
    } catch (error) {
        next(error);
    }
}

export const getNewUploadSongs = async (req, res, next) => {
    try {
        // fetch 6 random songs using mongodb's aggregation pipeline
        const songs = await Song.aggregate([
            {
                $sample: {size: 6}
            },
            {
                $project: {
                    _id:1,
                    title: 1,
                    artist: 1,
                    imageUrl: 1,
                    audioUrl: 1,
                }
            }
        ])

        res.json(songs);
    } catch (error) {
        next(error);
    }
}

export const getTrendingSongs = async (req, res, next) => {
    try {
        // fetch 6 random songs using mongodb's aggregation pipeline
        const songs = await Song.aggregate([
            {
                $sample: {size: 4}
            },
            {
                $project: {
                    _id:1,
                    title: 1,
                    artist: 1,
                    imageUrl: 1,
                    audioUrl: 1,
                }
            }
        ])

        res.json(songs);
    } catch (error) {
        next(error);
    }
}
