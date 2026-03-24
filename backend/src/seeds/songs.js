import mongoose from "mongoose";
import { Song } from "../models/song.model.js";
import { config } from "dotenv";

config();

const songs = [
	{
		title: "Tek It",
		artist: "Cafuné",
		imageUrl: "/cover-images/1.jpg",
		audioUrl: "/songs/1.mp3",
		duration: 3*60 + 11, // 3:11
	},
	{
		title: "Heavy",
		artist: "The Marías",
		imageUrl: "/cover-images/2.jpg",
		audioUrl: "/songs/2.mp3",
		duration: 4*60 + 13 , // 4:13
	},
	{
		title: "It's Me & You",
		artist: "Tokyo Tea Room",
		imageUrl: "/cover-images/3.jpg",
		audioUrl: "/songs/3.mp3",
		duration: 3*60 + 38, // 3:38
	},
	{
		title: "Is There Someone Else?",
		artist: "The Weeknd",
		imageUrl: "/cover-images/4.jpg",
		audioUrl: "/songs/4.mp3",
		duration: 3*60 + 19, // 0:24
	},
	{
		title: "Someone Else - Lost Tapes 2015",
		artist: "Tory Lanez",
		imageUrl: "/cover-images/5.jpg",
		audioUrl: "/songs/5.mp3",
		duration: 2*60 + 16, // 0:36
	},
	{
		title: "TBH",
		artist: "PARTYNEXTDOOR",
		imageUrl: "/cover-images/6.jpg",
		audioUrl: "/songs/6.mp3",
		duration: 2*60 + 3, // 0:40
	},
	{
		title: "DIE FOR ME",
		artist: "Chase Atlantic",
		imageUrl: "/cover-images/7.jpg",
		audioUrl: "/songs/7.mp3",
		duration: 3*60 + 26, // 0:39
	},
	{
		title: "Night",
		artist: "Keshi",
		imageUrl: "/cover-images/8.jpg",
		audioUrl: "/songs/8.mp3",
		duration: 3*60, // 0:28
	},
	{
		title: "NIGHTS LIKE THIS",
		artist: "The Kid LAROI",
		imageUrl: "/cover-images/9.jpg",
		audioUrl: "/songs/9.mp3",
		duration: 1*60 + 26, // 0:28
	},
	{
		title: "Agora Hills",
		artist: "Doja Cat",
		imageUrl: "/cover-images/10.jpg",
		audioUrl: "/songs/10.mp3",
		duration: 4*60 + 25, // 0:30
	},
	{
		title: "Pink + White",
		artist: "Frank Ocean",
		imageUrl: "/cover-images/11.jpg",
		audioUrl: "/songs/11.mp3",
		duration: 3*60 + 5, // 0:29
	},
	{
		title: "HONEST",
		artist: "Baby Keem",
		imageUrl: "/cover-images/12.jpg",
		audioUrl: "/songs/12.mp3",
		duration: 2*60 + 53, // 0:17
	},
	{
		title: "You Belong To Somebody Else",
		artist: "DeJ Loaf, Jacquees",
		imageUrl: "/cover-images/13.jpg",
		audioUrl: "/songs/13.mp3",
		duration: 3*60 + 38, // 0:39
	},
	{
		title: "A New Kind Of Love - Demo",
		artist: "Frou Frou, Imogen Heap, Guy Sigsworth",
		imageUrl: "/cover-images/14.jpg",
		audioUrl: "/songs/14.mp3",
		duration: 4*60 + 19, // 0:27
	},
	{
		title: "Stateside + Zara Larrson",
		artist: "PinkPantheress, Zara Larrson",
		imageUrl: "/cover-images/15.jpg",
		audioUrl: "/songs/15.mp3",
		duration: 3 * 60 + 5, // 0:36
	},
	{
		title: "Crystal Rain",
		artist: "Echo Valley",
		imageUrl: "/cover-images/16.jpg",
		audioUrl: "/songs/16.mp3",
		duration: 39, // 0:39
	},
];

const seedSongs = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI);

		// Clear existing songs
		await Song.deleteMany({});

		// Insert new songs
		await Song.insertMany(songs);

		console.log("Songs seeded successfully!");
	} catch (error) {
		console.error("Error seeding songs:", error);
	} finally {
		mongoose.connection.close();
	}
};

seedSongs();
