import { Outlet } from "react-router-dom"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import LeftSidebar from "./components/LeftSidebar.tsx"
import FriendsActivity from "./components/FriendsActivity.tsx";
import AudioPlayer from "./components/AudioPlayer.tsx";
import { PlaybackControls } from "./components/PlaybackControls.tsx";
import { useEffect, useState } from "react";

const MainLayout = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    return <div className="relative flex h-screen flex-col overflow-hidden bg-background text-foreground">
        <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
        >
            <div
                className="absolute inset-[-8%] bg-cover bg-center opacity-78 saturate-90"
                style={{ backgroundImage: "url('/lyre-bg-3.jpeg')" }}
            />
            <div className="absolute inset-0 bg-black/80" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_8%,_rgba(0,0,0,0.24)_54%,_rgba(0,0,0,0.62)_100%)]" />
        </div>

        <ResizablePanelGroup orientation="horizontal" className='relative z-10 flex flex-1 overflow-hidden p-2'>
            <AudioPlayer />
            {/* left sidebar */}
            <ResizablePanel defaultSize={isMobile ? "0%" : "24%"} minSize={isMobile ? "0%" : "16%"} maxSize="30%">
                <LeftSidebar />
            </ResizablePanel>

            <ResizableHandle className="w-2 rounded-lg bg-transparent transition-colors" /> 

            {/* main content */}
            <ResizablePanel defaultSize={isMobile ? "100%" : "52%"} minSize="36%">
                <Outlet />
            </ResizablePanel>

            {!isMobile && (
                <> <ResizableHandle className="w-2 rounded-lg bg-transparent transition-colors" /> 

            {/* right sidebar */}
            <ResizablePanel
                defaultSize={isMobile ? "0%" : "24%"}
                minSize={isMobile ? "0%" : "16%"}
                maxSize="28%"
                collapsedSize={0}
                collapsible
            >
                <FriendsActivity />
            </ResizablePanel>
                    </>
            )}

        </ResizablePanelGroup>
        <PlaybackControls />
    </div>
};

export default MainLayout
