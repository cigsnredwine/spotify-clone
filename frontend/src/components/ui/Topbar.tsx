import { LayoutDashboardIcon } from "lucide-react"
import { Link } from "react-router-dom"
import { Show, UserButton } from "@clerk/react"
import SignInOAuthButtons from "./SignInOAuthButtons"
import { useAuthStore } from "@/stores/useAuthStore";
import { buttonVariants } from "./button";
import { cn } from "@/lib/utils";


const Topbar = () => {
    const isAdmin = useAuthStore()
    console.log({ isAdmin })
    return (
        <div className="flex items-center justify-between p-4 sticky top-0 bg-zinc-900/75
        backdrop-blur-md z-10">
            <div className="flex gap-2 items-center">
                <img src="spotify-512.png" className ="size-8" alt="Spotify logo" />
                Lyre
            </div>
            <div className="flex items-center gap-4">
                {isAdmin && (
                    <Link to={"/admin"} className={cn(buttonVariants({ variant: "outline" }))}>
                        <LayoutDashboardIcon className="size-4 mr-2"/>
                            Admin Dashboard
                    </Link>
                )}

                <Show when="signed-out">     
                    <SignInOAuthButtons />
                </Show>

                <UserButton />
            </div>
        </div>
            
    )
}

export default Topbar
