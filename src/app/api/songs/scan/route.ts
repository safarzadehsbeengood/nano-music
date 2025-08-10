import { NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { parseFile, type IPicture, type ICommonTagsResult } from "music-metadata";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const musicDir = path.join(process.cwd(), "public", "music");
    const coversDir = path.join(process.cwd(), "public", "covers");
    
    // Create covers directory if it doesn't exist
    if (!fs.existsSync(coversDir)) {
      fs.mkdirSync(coversDir, { recursive: true });
    }
    
    if (!fs.existsSync(musicDir)) {
      return Response.json(
        { error: "Music directory not found" },
        { status: 404 }
      );
    }

    const songs = await scanMusicDirectory(musicDir, coversDir);
    
    return Response.json({
      message: `Successfully scanned ${songs.length} songs`,
      songs: songs.length
    });
  } catch (error) {
    console.error("Scan error:", error);
    return Response.json(
      { error: "Failed to scan music directory" },
      { status: 500 }
    );
  }
}

async function scanMusicDirectory(dir: string, coversDir: string): Promise<unknown[]> {
  const songs: unknown[] = [];
  const supportedFormats = ['.mp3', '.flac', '.m4a', '.wav', '.ogg'];

  async function scanDir(currentDir: string) {
    const entries = fs.readdirSync(currentDir);

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        await scanDir(fullPath);
      } else if (stat.isFile()) {
        const ext = path.extname(entry).toLowerCase();
        
        if (supportedFormats.includes(ext)) {
          try {
            const relativePath = path.relative(path.join(process.cwd(), "public"), fullPath);
            const existingSong = await prisma.song.findUnique({
              where: { filePath: relativePath }
            });

            if (!existingSong) {
              const song = await processMusicFile(fullPath, relativePath, coversDir);
              if (song) {
                songs.push(song);
              }
            }
          } catch (error) {
            console.error(`Error processing ${entry}:`, error);
          }
        }
      }
    }
  }

  await scanDir(dir);
  return songs;
}

async function processMusicFile(fullPath: string, relativePath: string, coversDir: string) {
  try {
    const metadata = await parseFile(fullPath);
    const stats = fs.statSync(fullPath);
    
    // Extract and save cover art
    let coverArtPath = null;
    if (metadata.common.picture && metadata.common.picture.length > 0) {
      coverArtPath = await saveCoverArt(metadata.common.picture[0], coversDir, metadata.common);
    }
    
    const song = await prisma.song.create({
      data: {
        title: metadata.common.title || path.basename(fullPath, path.extname(fullPath)),
        artist: metadata.common.artist || "Unknown Artist",
        album: metadata.common.album || null,
        genre: metadata.common.genre?.[0] || null,
        year: metadata.common.year || null,
        duration: metadata.format.duration ? Math.round(metadata.format.duration) : null,
        trackNumber: metadata.common.track?.no || null,
        filePath: relativePath,
        fileSize: stats.size,
        format: path.extname(fullPath).substring(1).toLowerCase(),
        bitrate: metadata.format.bitrate || null,
        coverArt: coverArtPath, // Add this field
      }
    });

    console.log(`Added: ${song.artist} - ${song.title}${coverArtPath ? ' (with cover)' : ''}`);
    return song;
  } catch (error) {
    console.error(`Failed to process ${fullPath}:`, error);
    return null;
  }
}

async function saveCoverArt(picture: IPicture, coversDir: string, commonMetadata: ICommonTagsResult): Promise<string | null> {
  try {
    // Create a unique filename based on artist and album
    const artist = commonMetadata.artist || "unknown";
    const album = commonMetadata.album || "unknown";
    const sanitizedArtist = artist.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const sanitizedAlbum = album.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    
    // Create hash for uniqueness
    const hash = crypto.createHash('md5').update(`${artist}-${album}`).digest('hex').substring(0, 8);
    const filename = `${sanitizedArtist}-${sanitizedAlbum}-${hash}.jpg`;
    const fullPath = path.join(coversDir, filename);
    const relativePath = `/covers/${filename}`;
    
    // Check if cover already exists
    if (fs.existsSync(fullPath)) {
      return relativePath;
    }
    
    // Process and save the image
    await sharp(picture.data)
      .resize(300, 300, { 
        fit: 'cover', 
        position: 'center' 
      })
      .jpeg({ 
        quality: 85,
        progressive: true 
      })
      .toFile(fullPath);
    
    console.log(`Saved cover art: ${filename}`);
    return relativePath;
  } catch (error) {
    console.error('Error saving cover art:', error);
    return null;
  }
}