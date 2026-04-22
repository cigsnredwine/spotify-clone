import { useEffect, useRef, useState } from "react"
import { ChevronDown, LayoutDashboardIcon, LogOut, Search, UserPen } from "lucide-react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import SignInOAuthButtons from "./SignInOAuthButtons"
import { useAuthStore } from "@/stores/useAuthStore";
import { buttonVariants } from "./button";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Input } from "./input";
import LyreLogo from "./LyreLogo";


const Topbar = () => {
    const { isAdmin, isAuthenticated, currentUser, sessionUser, reset } = useAuthStore()
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const menuRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const handleSignOut = async () => {
        setMenuOpen(false);
        await authClient.signOut();
        reset();
    };

    useEffect(() => {
        setSearchValue(searchParams.get("q") || "");
    }, [searchParams]);

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

    const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const trimmedValue = searchValue.trim();
        if (!trimmedValue) return;
        navigate(`/search?q=${encodeURIComponent(trimmedValue)}`);
    };

    return (
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/8 bg-black/34 p-4 backdrop-blur-[6px]">
            <div className="flex min-w-0 items-center gap-4">
                <div className="flex gap-2 items-center shrink-0">
                    <LyreLogo showLabel />
                </div>
                <form onSubmit={handleSearchSubmit} className="hidden md:block w-full max-w-md">
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
                        <Input
                            value={searchValue}
                            onChange={(event) => setSearchValue(event.target.value)}
                            placeholder="Search songs and artists"
                            className="border-border bg-muted/60 pl-9 text-sm text-white"
                        />
                    </div>
                </form>
            </div>
            <div className="flex items-center gap-4">
                {isAuthenticated && (
                    <Link to={isAdmin ? "/admin" : "/upload-music"} className={cn(buttonVariants({ variant: "outline" }))}>
                        <LayoutDashboardIcon className="size-4 mr-2"/>
                        {isAdmin ? "Admin Dashboard" : "Upload Music"}
                    </Link>
                )}

                {!isAuthenticated ? (
                    <SignInOAuthButtons />
                ) : (
                    <div className="relative" ref={menuRef}>
                        <button
                            type="button"
                            onClick={() => setMenuOpen((open) => !open)}
                            className="flex items-center gap-2 rounded-full p-1 pr-2 transition-colors hover:bg-accent/80"
                        >
                            <Avatar className="size-9">
                                <AvatarImage src={currentUser?.imageUrl || sessionUser?.image || ""} />
                                <AvatarFallback>{currentUser?.fullName?.[0] || sessionUser?.name?.[0] || "Y"}</AvatarFallback>
                            </Avatar>
                            <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", menuOpen && "rotate-180")} />
                        </button>

                        {menuOpen && (
                            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border bg-popover/95 p-2 shadow-2xl backdrop-blur-md">
                                <div className="mb-2 border-b border-border px-3 py-2">
                                    <p className="text-sm font-medium text-white">{sessionUser?.name}</p>
                                    <p className="text-xs text-zinc-400 truncate">{sessionUser?.email}</p>
                                </div>

                                <Link
                                    to="/profile"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-200 hover:bg-accent"
                                >
                                    <UserPen className="size-4" />
                                    Edit Profile
                                </Link>

                                <button
                                    type="button"
                                    onClick={handleSignOut}
                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-200 hover:bg-accent"
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
