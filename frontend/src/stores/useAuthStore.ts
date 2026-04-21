import { axiosInstance } from "@/lib/axios";
import {create} from "zustand"

interface AuthStore{
    isAdmin: boolean;
    isLoading: boolean;
    hasCheckedAdmin: boolean;
    error: string | null;

    checkAdminStatus: () => Promise<void>;
    reset: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    isAdmin: false,
    isLoading: false,
    hasCheckedAdmin: false,
    error: null,

    checkAdminStatus: async () => {
        set({isLoading: true, error: null});
        try {
            const response = await axiosInstance.get("/admin/check");
            set({isAdmin:response.data.admin, hasCheckedAdmin: true});
        } catch (error:any) {
            set({isAdmin:false, hasCheckedAdmin: true, error: error.response?.data?.message ?? "Unable to verify admin access"});
        } finally{
            set({isLoading:false});
        }
    },

    reset: () => {
        set({isAdmin: false, isLoading:false, hasCheckedAdmin: false, error: null});
    }
}))
