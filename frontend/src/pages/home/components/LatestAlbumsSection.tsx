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
		<div className='mb-8'>
			{!hideTitle || (!hideShowAll && showAllHref) ? (
				<div className='mb-4 flex items-center justify-between'>
					{!hideTitle ? <h2 className='text-xl font-bold sm:text-2xl'>{title}</h2> : <div />}
					{!hideShowAll && showAllHref ? (
						<Link to={showAllHref}>
							<Button variant='link' className='h-auto p-0 text-sm text-zinc-400 hover:text-white'>
								Show all
							</Button>
						</Link>
					) : null}
				</div>
			) : null}

			<div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4'>
				{albums.map((album) => (
					<Link
						to={`/albums/${album._id}`}
						key={album._id}
						className='group rounded-md bg-zinc-900/40 p-3 transition-colors hover:bg-zinc-800/70'
					>
						<div className='mb-3 aspect-square overflow-hidden rounded-md shadow-lg'>
							<img
								src={album.imageUrl}
								alt={album.title}
								className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
							/>
						</div>
						<h3 className='mb-2 truncate font-medium'>{album.title}</h3>
						<p className='truncate text-sm text-zinc-400'>{album.artist}</p>
						<p className='mt-1 text-xs text-zinc-500'>
							{album.releaseYear} • {album.songs.length} songs
						</p>
					</Link>
				))}
			</div>
		</div>
	);
};

export default LatestAlbumsSection;
