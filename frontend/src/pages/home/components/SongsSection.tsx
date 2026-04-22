import type { Song } from "@/types";
import SongsSectionSkeleton from "@/components/ui/skeletons/SongsSectionSkeleton";
import { Button } from "@/components/ui/button";
import PlayButton from "./PlayButton";
import { Link } from "react-router-dom";

type SongsSectionProps = {
    title:string,
    songs:Song[],
    isLoading:boolean;
    showAllHref?: string;
    hideShowAll?: boolean;
    hideTitle?: boolean;
}

const SongsSection = ({ title, songs, isLoading, showAllHref, hideShowAll = false, hideTitle = false }: SongsSectionProps) => {
    if (isLoading) return <SongsSectionSkeleton />
  return (
    <div className="mb-8">
        {!hideTitle || (!hideShowAll && showAllHref) ? (
            <div className="mb-4 flex items-center justify-between">
                {!hideTitle ? <h2 className="text-xl font-bold sm:text-2xl">{title}</h2> : <div />}
                {!hideShowAll && showAllHref ? (
                    <Link to={showAllHref}>
                        <Button variant="link" className='h-auto p-0 text-sm text-zinc-400 hover:text-white'>
                            Show all
                        </Button>
                    </Link>
                ) : null}
            </div>
        ) : null}

        <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4'>
            {songs.map((song) => (
                <div
                    key={song._id}
                    className='group cursor-pointer rounded-md bg-zinc-900/40 p-3 transition-colors hover:bg-zinc-800/70'
                >
                    <div className='relative mb-3'>
                        <div className='aspect-square overflow-hidden rounded-md shadow-lg'>
                            <img src={song.imageUrl} alt={song.title}
                            className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105' />
                        </div>
                        <PlayButton song={song} />
                    </div>
                    <h3 className='font-medium mb-2 truncate'>
                        {song.title}
                    </h3>
                        <p className='truncate text-sm text-zinc-400'>{song.artist}</p>
                    
                </div>
            ))}
        </div>
    </div>
  )
}

export default SongsSection
