import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

dotenv.config();

const authBaseURL = process.env.BETTER_AUTH_URL || "http://localhost:5001";
const trustedOrigins = (process.env.CLIENT_URL || "http://localhost:3000")
	.split(",")
	.map((origin) => origin.trim())
	.filter(Boolean);

const mongoClient = new MongoClient(process.env.MONGODB_URI);
await mongoClient.connect();

export const auth = betterAuth({
	baseURL: authBaseURL,
	secret: process.env.BETTER_AUTH_SECRET || "better-auth-dev-secret-change-me",
	trustedOrigins,
	database: mongodbAdapter(mongoClient.db()),
	emailAndPassword: {
		enabled: true,
	},
});
