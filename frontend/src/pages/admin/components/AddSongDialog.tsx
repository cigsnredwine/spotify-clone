import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { axiosInstance } from "@/lib/axios";
import { useMusicStore } from "@/stores/useMusicStore";
import { Plus, Upload } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

interface NewSong {
	title: string;
	artist: string;
	album: string | null;
	newAlbumTitle: string;
	newAlbumArtist: string;
	newAlbumReleaseYear: string;
	duration: string;
}

const CREATE_NEW_ALBUM = "create-new";

const formatDetectedDuration = (durationInSeconds: number) => {
	const minutes = Math.floor(durationInSeconds / 60);
	const seconds = Math.floor(durationInSeconds % 60);

	return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const AddSongDialog = () => {
	const { albums, fetchAlbums, fetchSongs } = useMusicStore();
	const [songDialogOpen, setSongDialogOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const [newSong, setNewSong] = useState<NewSong>({
		title: "",
		artist: "",
		album: "none",
		newAlbumTitle: "",
		newAlbumArtist: "",
		newAlbumReleaseYear: new Date().getFullYear().toString(),
		duration: "0",
	});

	const [files, setFiles] = useState<{ audio: File | null; image: File | null }>({
		audio: null,
		image: null,
	});

	const audioInputRef = useRef<HTMLInputElement>(null);
	const imageInputRef = useRef<HTMLInputElement>(null);

	const handleAudioSelect = (file: File | null) => {
		if (!file) {
			setFiles((prev) => ({ ...prev, audio: null }));
			setNewSong((prev) => ({ ...prev, duration: "0" }));
			return;
		}

		const audio = document.createElement("audio");
		const objectUrl = URL.createObjectURL(file);

		audio.preload = "metadata";
		audio.src = objectUrl;

		audio.onloadedmetadata = () => {
			const detectedDuration = Number.isFinite(audio.duration)
				? Math.round(audio.duration)
				: 0;

			setFiles((prev) => ({ ...prev, audio: file }));
			setNewSong((prev) => ({
				...prev,
				duration: detectedDuration.toString(),
			}));

			URL.revokeObjectURL(objectUrl);
		};

		audio.onerror = () => {
			setFiles((prev) => ({ ...prev, audio: file }));
			setNewSong((prev) => ({ ...prev, duration: "0" }));
			URL.revokeObjectURL(objectUrl);
			toast.error("Couldn't detect the audio duration automatically");
		};
	};

	const handleSubmit = async () => {
		setIsLoading(true);

		try {
			if (!files.audio || !files.image) {
				return toast.error("Please upload both audio and image files");
			}

			const formData = new FormData();

			formData.append("title", newSong.title);
			formData.append("artist", newSong.artist);
			formData.append("duration", newSong.duration);
			if (newSong.album === CREATE_NEW_ALBUM) {
				formData.append("newAlbumTitle", newSong.newAlbumTitle);
				formData.append("newAlbumArtist", newSong.newAlbumArtist || newSong.artist);
				formData.append("newAlbumReleaseYear", newSong.newAlbumReleaseYear);
			} else if (newSong.album && newSong.album !== "none") {
				formData.append("albumId", newSong.album);
			}

			formData.append("audioFile", files.audio);
			formData.append("imageFile", files.image);

			await axiosInstance.post("/admin/songs", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			setNewSong({
				title: "",
				artist: "",
				album: "none",
				newAlbumTitle: "",
				newAlbumArtist: "",
				newAlbumReleaseYear: new Date().getFullYear().toString(),
				duration: "0",
			});

			setFiles({
				audio: null,
				image: null,
			});
			await Promise.all([fetchSongs(), fetchAlbums()]);
			setSongDialogOpen(false);
			toast.success("Song added successfully");
		} catch (error: any) {
			toast.error("Failed to add song: " + error.message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={songDialogOpen} onOpenChange={setSongDialogOpen}>
			<DialogTrigger
				render={
					<Button className='bg-blue-500 text-black hover:bg-blue-600'>
						<Plus className='mr-2 h-4 w-4' />
						Add Song
					</Button>
				}
			>
				<span className='sr-only'>Add Song</span>
			</DialogTrigger>

			<DialogContent className='bg-zinc-900 border-zinc-700 max-h-[80vh] overflow-auto'>
				<DialogHeader>
					<DialogTitle>Add New Song</DialogTitle>
					<DialogDescription>Add a new song to your music library</DialogDescription>
				</DialogHeader>

				<div className='space-y-4 py-4'>
					<input
						type='file'
						accept='audio/*'
						ref={audioInputRef}
						hidden
						onChange={(e) => handleAudioSelect(e.target.files?.[0] ?? null)}
					/>

					<input
						type='file'
						ref={imageInputRef}
						className='hidden'
						accept='image/*'
						onChange={(e) => setFiles((prev) => ({ ...prev, image: e.target.files![0] }))}
					/>

					{/* image upload area */}
					<div
						className='flex items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer'
						onClick={() => imageInputRef.current?.click()}
					>
						<div className='text-center'>
							{files.image ? (
								<div className='space-y-2'>
									<div className='text-sm text-blue-500'>Image selected:</div>
									<div className='text-xs text-zinc-400'>{files.image.name.slice(0, 20)}</div>
								</div>
							) : (
								<>
									<div className='p-3 bg-zinc-800 rounded-full inline-block mb-2'>
										<Upload className='h-6 w-6 text-zinc-400' />
									</div>
									<div className='text-sm text-zinc-400 mb-2'>Upload artwork</div>
									<Button variant='outline' size='sm' className='text-xs'>
										Choose File
									</Button>
								</>
							)}
						</div>
					</div>

					{/* Audio upload */}
					<div className='space-y-2'>
						<label className='text-sm font-medium'>Audio File</label>
						<div className='flex items-center gap-2'>
							<Button variant='outline' onClick={() => audioInputRef.current?.click()} className='w-full'>
								{files.audio ? files.audio.name.slice(0, 20) : "Choose Audio File"}
							</Button>
						</div>
					</div>

					{/* other fields */}
					<div className='space-y-2'>
						<label className='text-sm font-medium'>Title</label>
						<Input
							value={newSong.title}
							onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
							className='bg-zinc-800 border-zinc-700'
						/>
					</div>

					<div className='space-y-2'>
						<label className='text-sm font-medium'>Artist</label>
						<Input
							value={newSong.artist}
							onChange={(e) =>
								setNewSong((prev) => ({
									...prev,
									artist: e.target.value,
									newAlbumArtist:
										prev.album === CREATE_NEW_ALBUM && !prev.newAlbumArtist
											? e.target.value
											: prev.newAlbumArtist,
								}))
							}
							className='bg-zinc-800 border-zinc-700'
						/>
					</div>

					<div className='space-y-2'>
						<label className='text-sm font-medium'>Detected Duration</label>
						<div className='rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-300'>
							{files.audio && Number(newSong.duration) > 0
								? `${formatDetectedDuration(Number(newSong.duration))} (${newSong.duration}s)`
								: "Select an audio file to detect duration"}
						</div>
					</div>

						<div className='space-y-2'>
							<label className='text-sm font-medium'>Album (Optional)</label>
							<Select
								value={newSong.album}
								onValueChange={(value) =>
									setNewSong((prev) => ({
										...prev,
										album: value,
										newAlbumArtist:
											value === CREATE_NEW_ALBUM
												? prev.newAlbumArtist || prev.artist
												: prev.newAlbumArtist,
									}))
								}
							>
							<SelectTrigger className='bg-zinc-800 border-zinc-700'>
								<SelectValue placeholder='Select album' />
							</SelectTrigger>
							<SelectContent className='bg-zinc-800 border-zinc-700'>
								<SelectItem value='none'>No Album (Single)</SelectItem>
								<SelectItem value={CREATE_NEW_ALBUM}>Create New Album</SelectItem>
								{albums.map((album) => (
									<SelectItem key={album._id} value={album._id}>
										{album.title}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{newSong.album === CREATE_NEW_ALBUM && (
						<div className='rounded-lg border border-zinc-700/80 bg-zinc-800/40 p-4'>
							<div className='mb-3 text-sm font-medium text-zinc-200'>New Album Details</div>
							<div className='space-y-3'>
								<div className='space-y-2'>
									<label className='text-sm font-medium'>Album Title</label>
									<Input
										value={newSong.newAlbumTitle}
										onChange={(e) =>
											setNewSong((prev) => ({ ...prev, newAlbumTitle: e.target.value }))
										}
										className='bg-zinc-800 border-zinc-700'
										placeholder='Enter album title'
									/>
								</div>

								<div className='space-y-2'>
									<label className='text-sm font-medium'>Album Artist</label>
									<Input
										value={newSong.newAlbumArtist}
										onChange={(e) =>
											setNewSong((prev) => ({ ...prev, newAlbumArtist: e.target.value }))
										}
										className='bg-zinc-800 border-zinc-700'
										placeholder='Enter album artist'
									/>
								</div>

								<div className='space-y-2'>
									<label className='text-sm font-medium'>Release Year</label>
									<Input
										type='number'
										min='1900'
										max={new Date().getFullYear()}
										value={newSong.newAlbumReleaseYear}
										onChange={(e) =>
											setNewSong((prev) => ({
												...prev,
												newAlbumReleaseYear: e.target.value || new Date().getFullYear().toString(),
											}))
										}
										className='bg-zinc-800 border-zinc-700'
									/>
								</div>
							</div>
						</div>
					)}
				</div>

				<DialogFooter>
					<Button variant='outline' onClick={() => setSongDialogOpen(false)} disabled={isLoading}>
						Cancel
					</Button>
					<Button
						onClick={handleSubmit}
						disabled={
							isLoading ||
							(newSong.album === CREATE_NEW_ALBUM && !newSong.newAlbumTitle.trim())
						}
					>
						{isLoading ? "Uploading..." : "Add Song"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
export default AddSongDialog;
