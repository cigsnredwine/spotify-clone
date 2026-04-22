import type { Album } from "@/types";
import { Button } from "@/components/ui/button";
import SongsSectionSkeleton from "@/components/ui/skeletons/SongsSectionSkeleton";
import { Link } from "react-router-dom";

type LatestAlbumsSectionProps = {
	title: string;
	albums: Album[];
	isLoading: boolean;
	showAllHref?: string;
	hideShowAll?: boolean;
	hideTitle?: boolean;
};

const LatestAlbumsSection = ({
	title,
	albums,
	isLoading,
	showAllHref,
	hideShowAll = false,
	hideTitle = false,
}: LatestAlbumsSectionProps) => {
	if (isLoading) return <SongsSectionSkeleton />;

	return (
		<div className='mb-6 sm:mb-8'>
			{!hideTitle || (!hideShowAll && showAllHref) ? (
				<div className='mb-3 flex items-center justify-between sm:mb-4'>
					{!hideTitle ? <h2 className='text-lg font-bold sm:text-2xl'>{title}</h2> : <div />}
					{!hideShowAll && showAllHref ? (
						<Link to={showAllHref}>
							<Button variant='link' className='h-auto p-0 text-xs text-zinc-400 hover:text-white sm:text-sm'>
								Show all
							</Button>
						</Link>
					) : null}
				</div>
			) : null}

			<div className='grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4'>
				{albums.map((album) => (
					<Link
						to={`/albums/${album._id}`}
						key={album._id}
						className='group rounded-xl bg-zinc-900/38 p-2.5 transition-colors hover:bg-zinc-800/70 sm:p-3'
					>
						<div className='mb-2.5 aspect-square overflow-hidden rounded-md shadow-lg sm:mb-3'>
							<img
								src={album.imageUrl}
								alt={album.title}
								className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
							/>
						</div>
						<h3 className='mb-1 truncate text-base font-medium sm:mb-2'>{album.title}</h3>
						<p className='truncate text-xs text-zinc-400 sm:text-sm'>{album.artist}</p>
						<p className='mt-1 text-[11px] text-zinc-500 sm:text-xs'>
							{album.releaseYear} • {album.songs.length} songs
						</p>
					</Link>
				))}
			</div>
		</div>
	);
};

export default LatestAlbumsSection;
