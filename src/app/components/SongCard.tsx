import { Song } from "@prisma/client";
import Image from "next/image";

export default function SongCard({ song }: { song: Song }) {
    return (
        <div className="flex flex-col gap-2">
            {song.coverArt && <Image src={song.coverArt} alt={song.title} width={100} height={100} />}    
            <h2>{song.artist} - {song.title}</h2>
            <p>{song.album}</p>
            <p>{song.year}</p>
            <p>{song.duration} seconds</p>
            <p>Track ID {song.trackNumber}</p>
        </div>
    );
}