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
        <div className="sticky top-0 z-10 border-b border-white/8 bg-black/34 px-3 py-3 backdrop-blur-[6px] sm:px-4 sm:py-4">
            <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex shrink-0 items-center gap-2">
                        <LyreLogo showLabel className="gap-1.5 sm:gap-2" labelClassName="hidden text-lg sm:inline" markClassName="size-7 text-[1.5rem] sm:size-8 sm:text-[1.75rem]" />
                    </div>
                    <form onSubmit={handleSearchSubmit} className="hidden w-full max-w-md md:block">
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
                <div className="flex items-center gap-2 sm:gap-4">
                    {isAuthenticated && (
                        <Link
                            to={isAdmin ? "/admin" : "/upload-music"}
                            className={cn(
                                buttonVariants({ variant: "outline" }),
                                "h-9 px-2.5 text-xs sm:h-8 sm:px-3 sm:text-sm"
                            )}
                        >
                            <LayoutDashboardIcon className="size-4 shrink-0 sm:mr-2"/>
                            <span className="hidden sm:inline">{isAdmin ? "Admin Dashboard" : "Upload Music"}</span>
                        </Link>
                    )}

                    {!isAuthenticated ? (
                        <SignInOAuthButtons />
                    ) : (
                        <div className="relative" ref={menuRef}>
                            <button
                                type="button"
                                onClick={() => setMenuOpen((open) => !open)}
                                className="flex items-center gap-1 rounded-full p-1 transition-colors hover:bg-accent/80 sm:gap-2 sm:pr-2"
                            >
                                <Avatar className="size-9 sm:size-9">
                                    <AvatarImage src={currentUser?.imageUrl || sessionUser?.image || ""} />
                                    <AvatarFallback>{currentUser?.fullName?.[0] || sessionUser?.name?.[0] || "Y"}</AvatarFallback>
                                </Avatar>
                                <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", menuOpen && "rotate-180")} />
                            </button>

                            {menuOpen && (
                                <div className="absolute right-0 top-full mt-2 w-52 overflow-hidden rounded-2xl border border-white/10 bg-black/72 p-2 shadow-[0_18px_44px_rgba(0,0,0,0.34)] ring-1 ring-white/6 backdrop-blur-xl sm:w-56">
                                    <div className="mb-2 rounded-xl border border-white/6 bg-white/[0.035] px-3 py-2.5">
                                        <p className="truncate text-sm font-semibold text-white">{sessionUser?.name}</p>
                                        <p className="mt-0.5 truncate text-xs text-zinc-400">{sessionUser?.email}</p>
                                    </div>

                                    <Link
                                        to="/profile"
                                        onClick={() => setMenuOpen(false)}
                                        className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-zinc-200 transition-colors hover:bg-white/7 hover:text-white"
                                    >
                                        <UserPen className="size-4 text-zinc-400" />
                                        Edit Profile
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={handleSignOut}
                                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-zinc-200 transition-colors hover:bg-white/7 hover:text-white"
                                    >
                                        <LogOut className="size-4 text-zinc-400" />
                                        Log Out
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <form onSubmit={handleSearchSubmit} className="mt-3 md:hidden">
                <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
                    <Input
                        value={searchValue}
                        onChange={(event) => setSearchValue(event.target.value)}
                        placeholder="Search songs and artists"
                        className="h-10 border-border bg-muted/60 pl-9 text-sm text-white"
                    />
                </div>
            </form>
        </div>
            
    )
}

export default Topbar
