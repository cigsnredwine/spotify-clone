import { useEffect } from "react";
import Topbar from "../../components/ui/Topbar"
import NewUploadsSection from "./components/NewUploadsSection";
import LatestAlbumsSection from "./components/LatestAlbumsSection";
import { useMusicStore } from "@/stores/useMusicStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import SongsSection from "./components/SongsSection";
import { usePlayerStore } from "@/stores/usePlayerStore";

const HomePage = () => {

    const {
        fetchFeaturedSongs,
        fetchMadeForYouSongs,
        fetchTrendingSongs,
        fetchAlbums,
        isLoading,
        madeForYouSongs,
        trendingSongs,
        featuredSongs,
        albums,
    } = useMusicStore();

    const { initializeQueue } = usePlayerStore();

    useEffect(() => {
        fetchFeaturedSongs();
        fetchMadeForYouSongs();
        fetchTrendingSongs();
        fetchAlbums();
    }, [fetchAlbums, fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs]);

    useEffect(() => {
        if(madeForYouSongs.length > 0 && featuredSongs.length > 0 && trendingSongs.length > 0) {
            const allSongs = [...madeForYouSongs, ...featuredSongs, ...trendingSongs];
            initializeQueue(allSongs);
        }
    }, [initializeQueue,madeForYouSongs, trendingSongs, featuredSongs]);


    return (
        <main className='h-full overflow-hidden rounded-xl border border-white/8 bg-black/30 backdrop-blur-[6px] shadow-[0_14px_36px_rgba(0,0,0,0.12)]'>
            <Topbar />
            <ScrollArea className="h-[calc(100vh-180px)]">
                <div className="p-4 sm:p-6">
                    <section className="mb-10 rounded-2xl border border-white/8 bg-black/26 px-6 py-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] sm:px-8 sm:py-10">
                        <div className="max-w-3xl">
                            <p className="text-5xl font-bold tracking-[-0.002em] text-white sm:text-5xl">
                                Lyre
                            </p>
                            <h1 className="mt-4 max-w-2xl text-2xl font-medium tracking-tight text-zinc-400 sm:text-4xl">
                                Listen to songs before they&apos;re released
                            </h1>
                        </div>
                    </section>

                    <NewUploadsSection title="New Uploads" />
                    <div className="space-y-8">
                        <SongsSection title="Recently Updated" songs={trendingSongs} isLoading={isLoading} showAllHref="/browse/recently-updated" />
                        <LatestAlbumsSection title="Latest Albums & EPs" albums={albums} isLoading={isLoading} showAllHref="/browse/latest-albums" />
                    </div>
                </div>
            </ScrollArea>
        </main>
    )
}

export default HomePage
