import { useParams } from "react-router-dom"
import { useEffect } from "react"
import { useMusicStore } from "@/stores/useMusicStore"
import { ScrollArea } from "@/components/ui/scroll-area";

const AlbumPage = () => {

   const { albumId } = useParams();
   const { fetchAlbumById, currentAlbum, isLoading } = useMusicStore();

   useEffect(() => {
      if(albumId) fetchAlbumById(albumId);
   }, [fetchAlbumById, albumId])

   if(isLoading || !currentAlbum) return null
   
  return (
    <div className='h-full'>
        <ScrollArea className='h-full'>
            {/* Main content */}
            <div className='relative min-h-full'>
                {/* bg gradient */}
                <div className='absolute inset-0 bg-linear-to-b from-[#3793a6]/80 via-zinc-900/80
                to-zinc-900 pointer-events-home'
                aria-hidden='true'
                />

                {/* Content */}
                <div className='relative z-10'>
                    <div className='flex p-6 gap-6 pb-8'>
                        <img src={currentAlbum.imageUrl} alt={currentAlbum.title}
                        className='w-60 h-60 shadow-xl rounded object-cover'
                        />
                        <div className="flex flex-col justify-end">
                            <p className='text-sm font-medium'>
                                Album
                            </p>
                            <h1 className='text-7xl font-bold my-4'>
                                {currentAlbum.title}
                            </h1>
                            <div className="flex items-center gap-2 text-sm text-zinc-100">   
                                <span className="font-medium text-white">{currentAlbum.artist}</span>
                                <span>• {currentAlbum.songs.length} songs</span>
                                <span>• {currentAlbum.releaseYear}</span>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </ScrollArea>
    </div>
  );
}

export default AlbumPage
