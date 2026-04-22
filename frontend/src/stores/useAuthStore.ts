import { axiosInstance } from "@/lib/axios";
import {create} from "zustand"
import type { User } from "@/types";

interface AuthStore{
    currentUser: User | null;
    sessionUser: {
        id: string;
        email: string;
        name: string;
        image?: string | null;
    } | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isLoading: boolean;
    hasCheckedAdmin: boolean;
    error: string | null;

    checkAdminStatus: () => Promise<void>;
    setAuthState: (payload: {
        user: User;
        sessionUser: {
            id: string;
            email: string;
            name: string;
            image?: string | null;
        };
        isAdmin: boolean;
    }) => void;
    reset: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    currentUser: null,
    sessionUser: null,
    isAuthenticated: false,
    isAdmin: false,
    isLoading: false,
    hasCheckedAdmin: false,
    error: null,

    checkAdminStatus: async () => {
        set({isLoading: true, error: null});
        try {
            const response = await axiosInstance.get("/app-auth/me");
            set({
                currentUser: response.data.user,
                sessionUser: response.data.sessionUser,
                isAuthenticated: true,
                isAdmin:response.data.isAdmin,
                hasCheckedAdmin: true
            });
        } catch (error:any) {
            set({
                currentUser: null,
                sessionUser: null,
                isAuthenticated: false,
                isAdmin:false,
                hasCheckedAdmin: true,
                error: error.response?.data?.message ?? "Unable to verify admin access"
            });
        } finally{
            set({isLoading:false});
        }
    },

    setAuthState: (payload) => {
        set({
            currentUser: payload.user,
            sessionUser: payload.sessionUser,
            isAuthenticated: true,
            isAdmin: payload.isAdmin,
            hasCheckedAdmin: true,
            error: null,
        });
    },

    reset: () => {
        set({
            currentUser: null,
            sessionUser: null,
            isAuthenticated: false,
            isAdmin: false,
            isLoading:false,
            hasCheckedAdmin: false,
            error: null
        });
    }
}))
