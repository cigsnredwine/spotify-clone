import { useEffect, useState, type ReactNode } from "react";
import { Loader } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { authClient } from "@/lib/auth-client";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, isPending } = authClient.useSession();
  const [loading, setLoading] = useState(true);
  const { checkAdminStatus, reset } = useAuthStore()

  useEffect(() => {
    if (isPending) {
      return;
    }

    const initAuth = async () => {
      try {
        if (session?.user) {
          await checkAdminStatus();
        } else {
          reset();
        }
      } catch (error) {
        reset();
        console.log("Error in initAuth", error);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, [checkAdminStatus, isPending, reset, session?.user]);

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
