import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    artists: {
        type: [String],
        required: true,
        default: [],
    },
    artist:{
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    audioUrl: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    uploadedByUserId: {
        type: String,
        required: false,
        index: true,
        default: null,
    },
    albumId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Album",
        required: false
    }
}, { timestamps: true});

export const Song = mongoose.model("Song", songSchema);
