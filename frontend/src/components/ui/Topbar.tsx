import { useEffect, useRef, useState } from "react"
import { ChevronDown, LayoutDashboardIcon, LogOut, UserPen } from "lucide-react"
import { Link } from "react-router-dom"
import SignInOAuthButtons from "./SignInOAuthButtons"
import { useAuthStore } from "@/stores/useAuthStore";
import { buttonVariants } from "./button";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";


const Topbar = () => {
    const { isAdmin, isAuthenticated, currentUser, sessionUser, reset } = useAuthStore()
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleSignOut = async () => {
        setMenuOpen(false);
        await authClient.signOut();
        reset();
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!menuRef.current?.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };

        if (menuOpen) {
            window.addEventListener("mousedown", handleClickOutside);
        }

        return () => window.removeEventListener("mousedown", handleClickOutside);
    }, [menuOpen]);

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

                {!isAuthenticated ? (
                    <SignInOAuthButtons />
                ) : (
                    <div className="relative" ref={menuRef}>
                        <button
                            type="button"
                            onClick={() => setMenuOpen((open) => !open)}
                            className="flex items-center gap-2 rounded-full p-1 pr-2 hover:bg-zinc-800 transition-colors"
                        >
                            <Avatar className="size-9">
                                <AvatarImage src={currentUser?.imageUrl || sessionUser?.image || ""} />
                                <AvatarFallback>{currentUser?.fullName?.[0] || sessionUser?.name?.[0] || "Y"}</AvatarFallback>
                            </Avatar>
                            <ChevronDown className={cn("size-4 text-zinc-400 transition-transform", menuOpen && "rotate-180")} />
                        </button>

                        {menuOpen && (
                            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-zinc-800 bg-zinc-900/95 p-2 shadow-2xl backdrop-blur-md">
                                <div className="px-3 py-2 border-b border-zinc-800 mb-2">
                                    <p className="text-sm font-medium text-white">{sessionUser?.name}</p>
                                    <p className="text-xs text-zinc-400 truncate">{sessionUser?.email}</p>
                                </div>

                                <Link
                                    to="/profile"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-800"
                                >
                                    <UserPen className="size-4" />
                                    Edit Profile
                                </Link>

                                <button
                                    type="button"
                                    onClick={handleSignOut}
                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-800"
                                >
                                    <LogOut className="size-4" />
                                    Log Out
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
            
    )
}

export default Topbar
