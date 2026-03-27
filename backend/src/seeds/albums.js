import mongoose from "mongoose";
import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import { config } from "dotenv";

config();

const seedDatabase = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI);

		// Clear existing data
		await Album.deleteMany({});
		await Song.deleteMany({});

		// First, create all songs
		const createdSongs = await Song.insertMany([
			{
				title: "Intro",
				artist: "hien long",
				imageUrl: "/cover-images/khi nao em tien temp cover.jpg",
				audioUrl: "/songs/INTRO.wav",
				plays: Math.floor(Math.random() * 5000),
				duration: 28, // 0:39
			},
			{
				title: "Rollin'",
				artist: "hien long",
				imageUrl: "/cover-images/khi nao em tien temp cover.jpg",
				audioUrl: "/songs/ROLLING MASTER.wav",
				plays: Math.floor(Math.random() * 5000),
				duration: 2*60 + 7, // 0:36
			},
			{
				title: "Ban Đầu",
				artist: "hien long, Pham",
				imageUrl: "/cover-images/khi nao em tien temp cover.jpg",
				audioUrl: "/songs/bandau master.wav",
				plays: Math.floor(Math.random() * 5000),
				duration: 2*60 + 53, // 0:36
			},
			{
				title: "RƠI",
				artist: "hien long, thanbong",
				imageUrl: "/cover-images/khi nao em tien temp cover.jpg",
				audioUrl: "/songs/ROI MASTER NEW.wav",
				plays: Math.floor(Math.random() * 5000),
				duration: 3 * 60 + 18, // 0:39
			},
			{
				title: "nhớ(quên) interlude",
				artist: "hien long",
				imageUrl: "/cover-images/khi nao em tien temp cover.jpg",
				audioUrl: "/songs/nhoquen.wav",
				plays: Math.floor(Math.random() * 5000),
				duration: 60 + 34, // 0:24
			},
			{
				title: "midsummer",
				artist: "Pham, hien long",
				imageUrl: "/cover-images/khi nao em tien temp cover.jpg",
				audioUrl: "/songs/midsummer mastered.wav",
				plays: Math.floor(Math.random() * 5000),
				duration: 3*60 + 24, // 0:28
			},
			{
				title: "y xì em",
				artist: "Pham, hien long",
				imageUrl: "/cover-images/khi nao em tien temp cover.jpg",
				audioUrl: "/songs/y xi em.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 3*60 + 45, // 0:39
			},
			{
				title: "re:Khi Trời Khuya",
				artist: "hien long",
				imageUrl: "/cover-images/khi nao em tien temp cover.jpg",
				audioUrl: "/songs/ktk.wav",
				plays: Math.floor(Math.random() * 5000),
				duration: 3*60 + 18, // 0:30
			},
			{
				title: "19",
				artist: "hien long",
				imageUrl: "/cover-images/khi nao em tien temp cover.jpg",
				audioUrl: "/songs/19 master.wav",
				plays: Math.floor(Math.random() * 5000),
				duration: 3*60 + 24, // 0:46
			},
			{
				title: "Midnight Drive",
				artist: "The Wanderers",
				imageUrl: "/cover-images/2.jpg",
				audioUrl: "/songs/2.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 41, // 0:41
			},
			{
				title: "Moonlight Dance",
				artist: "Silver Shadows",
				imageUrl: "/cover-images/14.jpg",
				audioUrl: "/songs/14.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 27, // 0:27
			},
			{
				title: "Lost in Tokyo",
				artist: "Electric Dreams",
				imageUrl: "/cover-images/3.jpg",
				audioUrl: "/songs/3.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 24, // 0:24
			},
			{
				title: "Neon Tokyo",
				artist: "Future Pulse",
				imageUrl: "/cover-images/17.jpg",
				audioUrl: "/songs/17.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 39, // 0:39
			},
			{
				title: "Purple Sunset",
				artist: "Dream Valley",
				imageUrl: "/cover-images/12.jpg",
				audioUrl: "/songs/12.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 17, // 0:17
			},
		]);

		// Create albums with references to song IDs
		const albums = [
			{
				title: "khi nào em tiện",
				artist: "hien long",
				imageUrl: "/albums/khi nao em tien temp cover.jpg",
				releaseYear: 2026,
				songs: createdSongs.slice(0, 9).map((song) => song._id),
			},
			{
				title: "Coastal Dreaming",
				artist: "Various Artists",
				imageUrl: "/albums/2.jpg",
				releaseYear: 2024,
				songs: createdSongs.slice(9, 13).map((song) => song._id),
			},
		];

		// Insert all albums
		const createdAlbums = await Album.insertMany(albums);

		// Update songs with their album references
		for (let i = 0; i < createdAlbums.length; i++) {
			const album = createdAlbums[i];
			const albumSongs = albums[i].songs;

			await Song.updateMany({ _id: { $in: albumSongs } }, { albumId: album._id });
		}

		console.log("Database seeded successfully!");
	} catch (error) {
		console.error("Error seeding database:", error);
	} finally {
		mongoose.connection.close();
	}
};

seedDatabase();
