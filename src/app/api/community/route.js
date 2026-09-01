import { NextResponse } from 'next/server';
import { communityPosts } from '@/data/mockData';

export async function GET() {
    return NextResponse.json({ success: true, data: communityPosts });
}
