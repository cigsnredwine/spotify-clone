import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Pause, Play, Repeat, Shuffle, SkipBack, SkipForward, Volume1 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { formatDuration } from "@/pages/album/AlbumPage";

const getSliderValue = (value: number | readonly number[]) =>
	Array.isArray(value) ? value[0] ?? 0 : value;

export const PlaybackControls = () => {
	const {
		currentSong,
		isPlaying,
		togglePlay,
		playNext,
		playPrevious,
		isShuffleEnabled,
		repeatMode,
		toggleShuffle,
		cycleRepeatMode,
	} = usePlayerStore();

	const [volume, setVolume] = useState(75);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const audioRef = useRef<HTMLAudioElement | null>(null);

	useEffect(() => {
		audioRef.current = document.querySelector("audio");

		const audio = audioRef.current;
		if (!audio) return;

		const updateTime = () => setCurrentTime(audio.currentTime);
		const updateDuration = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);

		audio.addEventListener("timeupdate", updateTime);
		audio.addEventListener("loadedmetadata", updateDuration);
		audio.addEventListener("durationchange", updateDuration);

		return () => {
			audio.removeEventListener("timeupdate", updateTime);
			audio.removeEventListener("loadedmetadata", updateDuration);
			audio.removeEventListener("durationchange", updateDuration);
		};
	}, [currentSong]);

	const handleSeek = (value: number | readonly number[]) => {
		const nextTime = getSliderValue(value);
		if (audioRef.current) {
			audioRef.current.currentTime = nextTime;
		}
	};

	return (
		<footer className='h-24 border-t border-white/8 bg-black/34 px-4 backdrop-blur-[6px] rounded-xl'>
			<div className='mx-auto flex h-full max-w-[1800px] items-center justify-between gap-4'>
				{/* currently playing song */}
				<div className='hidden w-[30%] min-w-[180px] items-center gap-4 sm:flex'>
					{currentSong && (
						<>
							<img
								src={currentSong.imageUrl}
								alt={currentSong.title}
								className='w-14 h-14 object-cover rounded-md'
							/>
							<div className='flex-1 min-w-0'>
								<div className='font-medium truncate hover:underline cursor-pointer'>
									{currentSong.title}
								</div>
								<div className='text-sm text-zinc-400 truncate hover:underline cursor-pointer'>
									{currentSong.artist}
								</div>
							</div>
						</>
					)}
				</div>

				{/* player controls*/}
				<div className='flex flex-col items-center gap-2 flex-1 max-w-full sm:max-w-[45%]'>
					<div className='flex items-center gap-4 sm:gap-6'>
						<Button
							size='icon'
							variant='ghost'
							className={`hidden sm:inline-flex hover:text-white ${
								isShuffleEnabled ? "text-white" : "text-zinc-400"
							}`}
							onClick={toggleShuffle}
							disabled={!currentSong}
						>
							<Shuffle className='h-4 w-4' />
						</Button>

						<Button
							size='icon'
							variant='ghost'
							className='hover:text-white text-zinc-400'
							onClick={playPrevious}
							disabled={!currentSong}
						>
							<SkipBack className='h-4 w-4' />
						</Button>

						<Button
							size='icon'
							className='bg-primary transition-all hover:scale-105 hover:bg-primary/90'
							onClick={togglePlay}
							disabled={!currentSong}
						>
							{isPlaying ? <Pause className='size-5 text-black' /> : <Play className='size-5 text-black' />}
						</Button>
						<Button
							size='icon'
							variant='ghost'
							className='hover:text-white text-zinc-400'
							onClick={playNext}
							disabled={!currentSong}
						>
							<SkipForward className='h-4 w-4' />
						</Button>
						<Button
							size='icon'
							variant='ghost'
							className={`hidden sm:inline-flex hover:text-white ${
								repeatMode !== "off" ? "text-white" : "text-zinc-400"
							}`}
							onClick={cycleRepeatMode}
							disabled={!currentSong}
						>
							<Repeat className='h-4 w-4' />
						</Button>
					</div>

					<div className='flex items-center gap-2 w-full px-2 sm:px-0'>
						<div className='w-10 text-right text-xs text-zinc-400'>{formatDuration(currentTime)}</div>
						<Slider
							value={[currentTime]}
							max={duration || 100}
							step={1}
							className='w-full hover:cursor-grab active:cursor-grabbing'
							onValueChange={handleSeek}
							disabled={!currentSong}
						/>
						<div className='w-10 text-xs text-zinc-400'>{formatDuration(duration)}</div>
					</div>
				</div>
				{/* volume controls */}
				<div className='hidden w-[28%] min-w-[220px] items-center justify-end pr-18 sm:flex'>
					<div className='flex w-full max-w-[170px] shrink-0 items-center gap-2'>
						<Button size='icon' variant='ghost' className='hover:text-white text-zinc-400'>
							<Volume1 className='h-4 w-4' />
						</Button>

						<Slider
							value={[volume]}
							max={100}
							step={1}
							className='w-full shrink-0 hover:cursor-grab active:cursor-grabbing [&_[data-slot=slider-track]]:bg-muted [&_[data-slot=slider-range]]:bg-primary'
							onValueChange={(value) => {
								const nextVolume = Array.isArray(value) ? value[0] : value;
								setVolume(nextVolume);
								if (audioRef.current) {
									audioRef.current.volume = nextVolume / 100;
								}
							}}
						/>
					</div>
				</div>
			</div>
		</footer>
	);
};
