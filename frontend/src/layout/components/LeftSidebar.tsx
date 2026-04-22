import PlaylistSkeleton from "@/components/ui/skeletons/PlaylistSkeleton";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useMusicStore } from "@/stores/useMusicStore";
import { HomeIcon, Library, MessageCircle } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";

const albumPreviewFallback = "/cover-images/khi nao em tien temp cover.jpg";

const LeftSidebar = () => {
	const { albums, fetchAlbums, isLoading } = useMusicStore();
    const { isAuthenticated } = useAuthStore();

	useEffect(() => {
		fetchAlbums();
	}, [fetchAlbums]);

	return (
		<div className='h-full flex flex-col gap-2'>
			{/* Navigation menu */}

			<div className='rounded-xl border border-white/8 bg-black/34 p-4 backdrop-blur-[6px] shadow-[0_14px_36px_rgba(0,0,0,0.14)]'>
				<div className='space-y-2'>
					<Link
						to={"/"}
						className={cn(
							buttonVariants({
								variant: "ghost",
								className: "w-full justify-start text-white hover:bg-zinc-800",
							})
						)}
					>
						<HomeIcon className='mr-2 size-5' />
						<span className='hidden md:inline'>Home</span>
					</Link>

					{isAuthenticated && (
						<Link
							to={"/chat"}
							className={cn(
								buttonVariants({
									variant: "ghost",
									className: "w-full justify-start text-white hover:bg-zinc-800",
								})
							)}
						>
							<MessageCircle className='mr-2 size-5' />
							<span className='hidden md:inline'>Messages</span>
						</Link>
					)}
				</div>
			</div>

			{/* Library section */}
			<div className='flex-1 rounded-xl border border-white/8 bg-black/34 p-4 backdrop-blur-[6px] shadow-[0_14px_36px_rgba(0,0,0,0.14)]'>
				<div className='flex items-center justify-between mb-4'>
					<div className='flex items-center text-white px-2'>
						<Library className='size-5 mr-2' />
						<span className='hidden md:inline'>Playlists</span>
					</div>
				</div>

				<ScrollArea className='h-[calc(100vh-300px)]'>
					<div className='space-y-2'>
						{isLoading ? (
							<PlaylistSkeleton />
						) : (
							albums.map((album) => (
								<Link
									to={`/albums/${album._id}`}
									key={album._id}
									className='flex cursor-pointer items-center gap-3 rounded-md p-2 transition-colors hover:bg-white/6 group'
								>
									<img
										src={album.imageUrl}
										alt='Playlist img'
										className='size-12 rounded-md shrink-0 object-cover'
										loading='lazy'
										onError={(event) => {
											event.currentTarget.onerror = null;
											event.currentTarget.src = albumPreviewFallback;
										}}
									/>

									<div className='flex-1 min-w-0 hidden md:block'>
										<p className='font-medium truncate'>{album.title}</p>
										<p className='text-sm text-zinc-400 truncate'>Album • {album.artist}</p>
									</div>
								</Link>
							))
						)}
					</div>
				</ScrollArea>
			</div>
		</div>
	);
};
export default LeftSidebar;
