import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    authUserId: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        default: ""
    }
}, {timestamps: true   });
// createdAt updatedAt

export const User = mongoose.model("User", userSchema);
