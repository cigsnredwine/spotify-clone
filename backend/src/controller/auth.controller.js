import { fromNodeHeaders } from "better-auth/node";
import cloudinary from "../lib/cloudinary.js";
import { auth } from "../lib/auth.js";
import { User } from "../models/user.model.js";
import { syncAppUser } from "../middleware/auth.middleware.js";

const uploadToCloudinary = async (file, options = {}) => {
    try {
        return await cloudinary.uploader.upload(file.tempFilePath, {
            resource_type: "image",
            ...options,
        });
    } catch (error) {
        console.log("Error uploading profile image", error);
        throw new Error("Error uploading profile image");
    }
};

export const getCurrentUser = async (req, res, next) => {
    try {
        res.status(200).json({
            user: req.appUser,
            sessionUser: req.authUser,
            isAdmin: process.env.ADMIN_EMAIL === req.authUser?.email,
        });
    } catch (error) {
        console.log("Error in getCurrentUser", error);
        next(error);
    }
}

export const updateProfile = async (req, res, next) => {
    try {
        const nextName = req.body?.name?.trim();
        let nextImage = req.appUser?.imageUrl || req.authUser?.image || "";

        if (req.files?.imageFile) {
            const imageUpload = await uploadToCloudinary(req.files.imageFile);
            nextImage = imageUpload.secure_url;
        }

        if (!nextName && !req.files?.imageFile) {
            return res.status(400).json({ message: "No profile changes submitted" });
        }

        await auth.api.updateUser({
            headers: fromNodeHeaders(req.headers),
            body: {
                ...(nextName ? { name: nextName } : {}),
                image: nextImage || null,
            },
        });

        const syncedUser = await User.findOneAndUpdate(
            { authUserId: req.userId },
            {
                ...(nextName ? { fullName: nextName } : {}),
                imageUrl: nextImage,
            },
            { new: true }
        );

        const refreshedSession = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });

        if (refreshedSession?.user) {
            await syncAppUser(refreshedSession.user);
        }

        res.status(200).json({
            user: syncedUser,
            sessionUser: refreshedSession?.user ?? req.authUser,
            isAdmin: process.env.ADMIN_EMAIL === (refreshedSession?.user?.email ?? req.authUser?.email),
        });
    } catch (error) {
        console.log("Error in updateProfile", error);
        next(error);
    }
}
