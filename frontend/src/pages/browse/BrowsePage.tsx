import { useEffect, useMemo, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Topbar from "@/components/ui/Topbar";
import { useParams } from "react-router-dom";
import { axiosInstance } from "@/lib/axios";
import type { Album, Song } from "@/types";
import SongsSection from "@/pages/home/components/SongsSection";
import LatestAlbumsSection from "@/pages/home/components/LatestAlbumsSection";

const sectionConfig = {
	"new-uploads": {
		title: "New Uploads",
		type: "songs" as const,
		endpoint: "/songs/latest",
	},
	"recently-updated": {
		title: "Recently Updated",
		type: "songs" as const,
		endpoint: "/songs/recently-updated",
	},
	"latest-albums": {
		title: "Latest Albums & EPs",
		type: "albums" as const,
		endpoint: "/albums",
	},
};

const BrowsePage = () => {
	const { sectionId } = useParams();
	const config = useMemo(
		() => (sectionId ? sectionConfig[sectionId as keyof typeof sectionConfig] : undefined),
		[sectionId]
	);
	const [songs, setSongs] = useState<Song[]>([]);
	const [albums, setAlbums] = useState<Album[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchSection = async () => {
			if (!config) return;

			setIsLoading(true);
			setError("");

			try {
				const response = await axiosInstance.get(config.endpoint);
				if (config.type === "songs") {
					setSongs(response.data);
					setAlbums([]);
				} else {
					setAlbums(response.data);
					setSongs([]);
				}
			} catch (err: any) {
				setError(err.response?.data?.message ?? "Failed to load this section");
			} finally {
				setIsLoading(false);
			}
		};

		fetchSection();
	}, [config]);

	if (!config) {
		return null;
	}

	return (
		<main className='h-full overflow-hidden rounded-xl border border-white/8 bg-black/30 backdrop-blur-[6px] shadow-[0_14px_36px_rgba(0,0,0,0.12)]'>
			<Topbar />
			<ScrollArea className='h-[calc(100vh-180px)]'>
				<div className='p-4 sm:p-6'>
					<div className='mb-8'>
						<h1 className='text-3xl font-bold text-white sm:text-4xl'>{config.title}</h1>
						<p className='mt-2 text-sm text-zinc-400'>
							Explore the full collection for this section.
						</p>
					</div>

					{error ? <p className='text-red-500'>{error}</p> : null}

					{config.type === "songs" ? (
						<SongsSection
							title={config.title}
							songs={songs}
							isLoading={isLoading}
							hideShowAll
							hideTitle
						/>
					) : (
						<LatestAlbumsSection
							title={config.title}
							albums={albums}
							isLoading={isLoading}
							hideShowAll
							hideTitle
						/>
					)}
				</div>
			</ScrollArea>
		</main>
	);
};

export default BrowsePage;
