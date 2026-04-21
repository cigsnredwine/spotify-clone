import Header from "@/pages/admin/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SongsTabContent from "@/pages/admin/components/SongsTabContent";
import AlbumsTabContent from "@/pages/admin/components/AlbumsTabContent";
import { Album, Music } from "lucide-react";
import { useEffect } from "react";
import { useMusicStore } from "@/stores/useMusicStore";

const UploadMusicPage = () => {
	const { fetchAlbums, fetchSongs } = useMusicStore();

	useEffect(() => {
		fetchAlbums();
		fetchSongs();
	}, [fetchAlbums, fetchSongs]);

	return (
		<div className="min-h-screen bg-linear-to-b from-zinc-900 via-zinc-900 to-black p-8 text-zinc-100">
			<Header title="Upload Music" description="Upload songs and albums to the shared library" />

			<Tabs defaultValue="songs" className="space-y-6">
				<TabsList className="bg-zinc-800/50 p-1">
					<TabsTrigger value="songs" className="data-[state=active]:bg-zinc-800">
						<Music className="mr-2 size-4" />
						Songs
					</TabsTrigger>

					<TabsTrigger value="albums" className="data-[state=active]:bg-zinc-800">
						<Album className="mr-2 size-4" />
						Albums
					</TabsTrigger>
				</TabsList>

				<TabsContent value="songs">
					<SongsTabContent canDelete={false} uploadEndpoint="/upload/songs" />
				</TabsContent>

				<TabsContent value="albums">
					<AlbumsTabContent canDelete={false} uploadEndpoint="/upload/albums" />
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default UploadMusicPage;
