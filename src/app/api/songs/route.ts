// app/api/songs/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(request: NextRequest) {
  console.log(process.env.DEV_DATABASE_URL);
  const { searchParams } = new URL(request.url);
  
  const limit = parseInt(searchParams.get('limit') || '50');
  const page = parseInt(searchParams.get('page') || '1');
  const skip = (page - 1) * limit;
  
  const songs = await prisma.song.findMany({
    skip,
    take: limit,
    orderBy: { title: 'asc' }
  });
  
  const total = await prisma.song.count();
  
  return Response.json({
    songs,
    total,
    page,
    limit,
    hasMore: skip + limit < total
  });
}