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


    return <div className="h-screen bg-black text-white flex flex-col">
        <ResizablePanelGroup orientation="horizontal" className='flex-1 flex overflow-hidden p-2'>
            <AudioPlayer />
            {/* left sidebar */}
            <ResizablePanel defaultSize={isMobile ? "0%" : "24%"} minSize={isMobile ? "0%" : "16%"} maxSize="30%">
                <LeftSidebar />
            </ResizablePanel>

            <ResizableHandle className="w-2 bg-black rounded-lg transition-colors" /> 

            {/* main content */}
            <ResizablePanel defaultSize={isMobile ? "100%" : "52%"} minSize="36%">
                <Outlet />
            </ResizablePanel>

            {!isMobile && (
                <> <ResizableHandle className="w-2 bg-black rounded-lg transition-colors" /> 

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
