
const audioBaseUrl = "https://www.soundhelix.com/examples/mp3/";

export const featuredSongs = [
  {
    id: 1,
    title: "Midnight Dreams",
    artist: "SoundHelix",
    genre: "Electronic",
    cover:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=600&auto=format&fit=crop",
    audioUrl: `${audioBaseUrl}SoundHelix-Song-1.mp3`,
  },
  {
    id: 2,
    title: "Neon Skies",
    artist: "SoundHelix",
    genre: "Chill",
    cover:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&auto=format&fit=crop",
    audioUrl: `${audioBaseUrl}SoundHelix-Song-2.mp3`,
  },
  {
    id: 3,
    title: "Lost in Space",
    artist: "SoundHelix",
    genre: "Ambient",
    cover:
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&auto=format&fit=crop",
    audioUrl: `${audioBaseUrl}SoundHelix-Song-3.mp3`,
  },
  {
    id: 4,
    title: "Ocean Lights",
    artist: "SoundHelix",
    genre: "Chillwave",
    cover:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=600&auto=format&fit=crop",
    audioUrl: `${audioBaseUrl}SoundHelix-Song-4.mp3`,
  },
];

export const recentlyPlayed = [
  {
    id: 5,
    title: "Dreamscape",
    artist: "SoundHelix",
    cover:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&auto=format&fit=crop",
    audioUrl: `${audioBaseUrl}SoundHelix-Song-5.mp3`,
  },
  {
    id: 6,
    title: "Beyond the Stars",
    artist: "SoundHelix",
    cover:
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&auto=format&fit=crop",
    audioUrl: `${audioBaseUrl}SoundHelix-Song-6.mp3`,
  },
  {
    id: 7,
    title: "Afterglow",
    artist: "SoundHelix",
    cover:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop",
    audioUrl: `${audioBaseUrl}SoundHelix-Song-7.mp3`,
  },
];

export const allSongs = [...featuredSongs, ...recentlyPlayed];