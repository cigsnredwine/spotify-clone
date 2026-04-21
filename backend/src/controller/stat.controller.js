import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import { User } from "../models/user.model.js";


export const getStats = async (req, res, next) => {
    try {
        const [totalSongs, totalAlbums, totalUsers, uniqueArtists] = await Promise.all([
            Song.countDocuments(),
            Album.countDocuments(),
            User.countDocuments(),


            Song.aggregate([
                {
                    $project: {
                        normalizedArtists: {
                            $cond: [
                                { $gt: [{ $size: { $ifNull: ["$artists", []] } }, 0] },
                                "$artists",
                                {
                                    $map: {
                                        input: { $split: [{ $ifNull: ["$artist", ""] }, ","] },
                                        as: "artist",
                                        in: { $trim: { input: "$$artist" } }
                                    }
                                }
                            ]
                        }
                    }
                },
                {
                    $unionWith:{
                        coll:"albums",
                        pipeline:[
                            {
                                $project: {
                                    normalizedArtists: {
                                        $map: {
                                            input: { $split: [{ $ifNull: ["$artist", ""] }, ","] },
                                            as: "artist",
                                            in: { $trim: { input: "$$artist" } }
                                        }
                                    }
                                }
                            }
                        ]
                    }
                },
                {
                    $unwind: "$normalizedArtists"
                },
                {
                    $match: {
                        normalizedArtists: { $ne: "" }
                    }
                },
                {
                    $group: {
                        _id: "$normalizedArtists",
                    }
                },
                {
                    $count: "count",
                },
            ]),
        ]);
        res.status(200).json({
            totalSongs,
            totalAlbums,
            totalUsers,
            totalArtists: uniqueArtists[0]?.count || 0
        });
    } catch (error) {
        next(error);
    }
}
