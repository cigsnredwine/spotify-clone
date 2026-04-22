import {Song} from "../models/song.model.js";
import {Album} from "../models/album.model.js";
import cloudinary from "../lib/cloudinary.js";

// helper functions for cloudinary uploads
const uploadToCloudinary = async (file, options = {}) => {
    try {
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            resource_type: "auto",
            ...options,
            }
        ) 
    return result;
    } catch (error) {
        console.log("Error in uploadeToCloudinary", error);
        throw new Error("Error uploading to Cloudinary");
    }
}

const normalizeArtists = (artistsInput, artistInput) => {
    if (artistsInput) {
        try {
            const parsedArtists = JSON.parse(artistsInput);

            if (Array.isArray(parsedArtists)) {
                return parsedArtists
                    .map((artist) => String(artist).trim())
                    .filter(Boolean);
            }
        } catch (error) {
            console.log("Error parsing artists payload", error);
        }
    }

    return String(artistInput || "")
        .split(",")
        .map((artist) => artist.trim())
        .filter(Boolean);
};

export const createSong = async (req, res, next) => {
    try {
        if(!req.files || !req.files.audioFile || !req.files.imageFile){
            return res.status(400).json({message: "Please upload all files"});
        }

        const {
            title,
            artists,
            artist,
            albumId,
            duration,
            newAlbumTitle,
            newAlbumArtist,
            newAlbumReleaseYear,
        } = req.body
        const uploaderId = req.userId;
        const audioFile = req.files.audioFile;
        const imageFile = req.files.imageFile;

        if (audioFile.truncated || imageFile.truncated) {
            return res.status(413).json({
                message: "One or more files exceeded the upload limit. Please use smaller files and try again.",
            });
        }

        const audioUpload = await uploadToCloudinary(audioFile, { resource_type: "video" });
        const imageUpload = await uploadToCloudinary(imageFile, { resource_type: "image" });
        const audioUrl = audioUpload.secure_url;
        const imageUrl = imageUpload.secure_url;
        const resolvedDuration = Number.isFinite(audioUpload.duration)
            ? Math.round(audioUpload.duration)
            : Number(duration);
        const normalizedArtists = normalizeArtists(artists, artist);
        const displayArtist = normalizedArtists.join(", ");

        let resolvedAlbumId = albumId || null;

        if (!resolvedAlbumId && newAlbumTitle?.trim()) {
            const albumTitle = newAlbumTitle.trim();
            const albumArtist = (newAlbumArtist?.trim() || displayArtist || "Unknown Artist");
            const releaseYear = Number(newAlbumReleaseYear) || new Date().getFullYear();

            let album = await Album.findOne({
                title: albumTitle,
                artist: albumArtist,
            });

            if (!album) {
                album = await Album.create({
                    title: albumTitle,
                    artist: albumArtist,
                    imageUrl,
                    releaseYear,
                    songs: [],
                    uploadedByUserId: uploaderId,
                });
            }

            resolvedAlbumId = album._id;
        }

        const song = new Song({
            title,
            artists: normalizedArtists,
            artist: displayArtist,
            audioUrl,
            imageUrl,
            albumId: resolvedAlbumId,
            duration: resolvedDuration,
            uploadedByUserId: uploaderId,
        })

        await song.save();

        // if song belongs to album, update album's songs array
        if(resolvedAlbumId) {
            await Album.findByIdAndUpdate(resolvedAlbumId, {
                $push: {
                    songs: song._id
                }
            })
        }
        res.status(201).json(song);
    } catch (error) {
        console.log("Error creating song", error);
        next(error)
    }
};

export const deleteSong = async (req,res,next) => {
    try {
        const { id } = req.params;

        const song = await Song.findById(id);

        // if song belongs to album, update album's songs array
        if(song.albumId) {
            await Album.findByIdAndUpdate(song.albumId, {
                $pull: {
                    songs: song._id
                }
            })
        }

        await Song.findByIdAndDelete(id);

        res.status(200).json({message: "Song deleted successfully"});

    } catch (error) {
        console.log("Error in deleteSong", error);
        next(error);
    }
}

export const createAlbum = async(req,res,next) => {
    try {
        const uploaderId = req.userId;
        const { title, artist, releaseYear }= req.body
        const { imageFile } = req.files;

        const imageUrl = await uploadToCloudinary(imageFile);

        const album = new Album({
            title,
            artist,
            imageUrl,
            releaseYear,
            uploadedByUserId: uploaderId,
        })

        await album.save();

        res.status(201).json(album);

    } catch (error) {
        console.log("Error creating album", error);
        next(error);
    }
}

export const deleteAlbum = async(req,res,next) => {
    try {
        const { id } = req.params;
        await Song.deleteMany({albumId: id});
        await Album.findByIdAndDelete(id);
        res.status(200).json({message: "Album deleted successfully"});
    } catch (error) {
        console.log("Error in deleteAlbum", error);
        next(error);
    }
}

export const getUploadedSongs = async (req, res, next) => {
    try {
        const songs = await Song.find({ uploadedByUserId: req.userId }).sort({ createdAt: -1 });
        res.status(200).json(songs);
    } catch (error) {
        next(error);
    }
}

export const getUploadedAlbums = async (req, res, next) => {
    try {
        const albums = await Album.find({ uploadedByUserId: req.userId }).sort({ createdAt: -1 });
        res.status(200).json(albums);
    } catch (error) {
        next(error);
    }
}

export const checkAdmin = async (req, res, next) => {
    res.status(200).json({ admin: true});
}
