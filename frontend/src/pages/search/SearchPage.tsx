import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Topbar from "@/components/ui/Topbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { axiosInstance } from "@/lib/axios";
import type { Song } from "@/types";
import SongsSection from "@/pages/home/components/SongsSection";

type SearchResponse = {
	songs: Song[];
	artists: string[];
};

const SearchPage = () => {
	const [searchParams] = useSearchParams();
	const query = searchParams.get("q")?.trim() || "";
	const [results, setResults] = useState<SearchResponse>({ songs: [], artists: [] });
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		const runSearch = async () => {
			if (!query) {
				setResults({ songs: [], artists: [] });
				return;
			}

			setIsLoading(true);
			setError("");

			try {
				const response = await axiosInstance.get("/songs/search", {
					params: { q: query },
				});
				setResults(response.data);
			} catch (err: any) {
				setError(err.response?.data?.message ?? "Search failed");
			} finally {
				setIsLoading(false);
			}
		};

		runSearch();
	}, [query]);

	return (
		<main className='h-full overflow-hidden rounded-xl border border-white/8 bg-black/30 backdrop-blur-[6px] shadow-[0_14px_36px_rgba(0,0,0,0.12)]'>
			<Topbar />
			<ScrollArea className='h-[calc(100vh-180px)]'>
				<div className='p-4 sm:p-6'>
					<div className='mb-8'>
						<h1 className='text-3xl font-bold text-white sm:text-4xl'>Search</h1>
						<p className='mt-2 text-sm text-zinc-400'>
							{query ? `Results for "${query}"` : "Search for songs and artists."}
						</p>
					</div>

					{error ? <p className='mb-6 text-red-500'>{error}</p> : null}

					{!!query && results.artists.length > 0 && (
						<div className='mb-10'>
							<h2 className='mb-4 text-xl font-bold sm:text-2xl'>Artists</h2>
							<div className='flex flex-wrap gap-3'>
								{results.artists.map((artist) => (
									<div
										key={artist}
										className='rounded-full border border-zinc-700 bg-zinc-900/60 px-4 py-2 text-sm text-zinc-200'
									>
										{artist}
									</div>
								))}
							</div>
						</div>
					)}

					{query ? (
						<SongsSection title="Songs" songs={results.songs} isLoading={isLoading} hideShowAll />
					) : null}
				</div>
			</ScrollArea>
		</main>
	);
};

export default SearchPage;
