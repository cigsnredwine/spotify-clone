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
    <div className="mb-6 sm:mb-8">
        {!hideTitle || (!hideShowAll && showAllHref) ? (
            <div className="mb-3 flex items-center justify-between sm:mb-4">
                {!hideTitle ? <h2 className="text-lg font-bold sm:text-2xl">{title}</h2> : <div />}
                {!hideShowAll && showAllHref ? (
                    <Link to={showAllHref}>
                        <Button variant="link" className='h-auto p-0 text-xs text-zinc-400 hover:text-white sm:text-sm'>
                            Show all
                        </Button>
                    </Link>
                ) : null}
            </div>
        ) : null}

        <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4'>
            {songs.map((song) => (
                <div
                    key={song._id}
                    className='group cursor-pointer rounded-xl bg-zinc-900/38 p-2.5 transition-colors hover:bg-zinc-800/70 sm:p-3'
                >
                    <div className='relative mb-2.5 sm:mb-3'>
                        <div className='aspect-square overflow-hidden rounded-md shadow-lg'>
                            <img src={song.imageUrl} alt={song.title}
                            className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105' />
                        </div>
                        <PlayButton song={song} />
                    </div>
                    <h3 className='mb-1 truncate text-base font-medium sm:mb-2'>
                        {song.title}
                    </h3>
                        <p className='truncate text-xs text-zinc-400 sm:text-sm'>{song.artist}</p>
                    
                </div>
            ))}
        </div>
    </div>
  )
}

export default SongsSection
