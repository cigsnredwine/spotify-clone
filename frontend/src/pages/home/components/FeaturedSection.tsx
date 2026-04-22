import FeaturedGridSkeleton from '@/components/ui/skeletons/FeaturedGridSkeleton';
import { useMusicStore } from '@/stores/useMusicStore'
import PlayButton from './PlayButton';

const FeaturedSection = () => {
    const {isLoading, featuredSongs, error} = useMusicStore();

    if(isLoading) return <FeaturedGridSkeleton />

    if(error) return <p className="text-red-500 mb-4 text-lg">{error}</p>


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        
        {featuredSongs.map((song) => (
            <div
                key={song._id}
                className="group relative flex cursor-pointer items-stretch overflow-hidden rounded-md bg-zinc-800/50 transition-colors hover:bg-zinc-700/50"
            >
                <img
                    src={song.imageUrl}
                    alt={song.title}
                    className="h-16 w-16 shrink-0 object-cover sm:h-20 sm:w-20"
                />
                <div className="flex min-w-0 flex-1 flex-col justify-center px-4 py-3">
                    <p className="font-medium text-sm truncate">{song.title}</p>    
                    <p className="text-zinc-400 text-xs truncate">{song.artist}</p>
                </div>

                <PlayButton song={song} />
            </div>
            
        ))}
    </div>
  )
}

export default FeaturedSection
