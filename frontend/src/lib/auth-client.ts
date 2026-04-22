import { createAuthClient } from "better-auth/react";

const apiURL =
	import.meta.env.VITE_API_URL ||
	(import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api");

const authBaseURL = import.meta.env.VITE_AUTH_URL || apiURL.replace(/\/api\/?$/, "");

export const authClient = createAuthClient({
	baseURL: authBaseURL,
	fetchOptions: {
		credentials: "include",
	},
});
