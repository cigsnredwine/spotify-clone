import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth.js";
import { User } from "../models/user.model.js";

export const syncAppUser = async (sessionUser) => {
    const fullName = sessionUser.name?.trim() || sessionUser.email;
    const imageUrl = sessionUser.image || "";

    return User.findOneAndUpdate(
        { authUserId: sessionUser.id },
        {
            authUserId: sessionUser.id,
            email: sessionUser.email,
            fullName,
            imageUrl,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );
};

export const protectRoute = async (req, res, next) => {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });

        if (!session?.user) {
            return res.status(401).json({message: "Unauthorized - you must be logged in"});
        }

        const appUser = await syncAppUser(session.user);

        req.session = session.session;
        req.authUser = session.user;
        req.userId = session.user.id;
        req.appUser = appUser;

        next();
    } catch (error) {
        next(error);
    }
}

export const requireAdmin = async(req,res,next) => {
    try {
        if (!req.authUser?.email) {
            return res.status(401).json({message: "Unauthorized - you must be logged in"});
        }

        const isAdmin = process.env.ADMIN_EMAIL === req.authUser.email;

        if(!isAdmin) {
            return res.status(403).json({message: "Unauthorized - you must be an admin"});
        }

        next();
    } catch (error) {
        next(error)
    }
}
