import NewUploadsSectionSkeleton from '@/components/ui/skeletons/NewUploadsSectionSkeleton';
import { useMusicStore } from '@/stores/useMusicStore'
import PlayButton from './PlayButton';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

type NewUploadsSectionProps = {
    title?: string;
    showAllHref?: string;
}

const NewUploadsSection = ({ title = "New Uploads", showAllHref = "/browse/new-uploads" }: NewUploadsSectionProps) => {
    const {isLoading, featuredSongs, error} = useMusicStore();

    if(isLoading) return <NewUploadsSectionSkeleton />

    if(error) return <p className="text-red-500 mb-4 text-lg">{error}</p>


  return (
    <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold sm:text-2xl">{title}</h2>
            <Link to={showAllHref}>
                <Button variant="link" className='h-auto p-0 text-sm text-zinc-400 hover:text-white'>
                    Show all
                </Button>
            </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
    </div>
  )
}

export default NewUploadsSection
