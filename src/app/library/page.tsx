'use client';

import { useEffect, useState } from 'react';
import { Song } from '@prisma/client';
import SongCard from '@/app/components/SongCard';

async function getSongs() {
    const response = await fetch('/api/songs', {
        method: 'GET',
    });
    const data = await response.json();
    return data.songs;
}

export default function LibraryPage() {
    const [songs, setSongs] = useState([]);
    
    useEffect(() => {
        const fetchSongs = async () => {
            const songs = await getSongs();
            setSongs(songs);
        }
        fetchSongs();
    }, []);
      
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Music Library</h1>
      
      {songs && (
        <div className="mt-4 p-4 text-blackbg-gray-100 rounded">
            {songs.map((song: Song) => (
                <SongCard key={song.id} song={song} />
            ))}
        </div>
      )}
    </div>
  );
}