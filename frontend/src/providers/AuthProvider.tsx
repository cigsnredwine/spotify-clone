import { useEffect, useState, type ReactNode } from "react";
import { useAuth } from "@clerk/react";
import { axiosInstance } from "@/lib/axios";
import { Loader } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";

const updateApiToken = (token: string | null) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [loading, setLoading] = useState(true);
  const { checkAdminStatus, reset } = useAuthStore()

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    const initAuth = async () => {
      try {
        const token = isSignedIn ? await getToken() : null;
        updateApiToken(token);

        if (token) {
          await checkAdminStatus();
        } else {
          reset();
        }
      } catch (error) {
        updateApiToken(null);
        reset();
        console.log("Error in initAuth", error);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, [checkAdminStatus, getToken, isLoaded, isSignedIn, reset]);

  if (loading) {
    return (
    <div className="h-screen w-full flex items-center justify-center">
        <Loader className="size-8 text-blue-500 animate-spin" />
    </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;
