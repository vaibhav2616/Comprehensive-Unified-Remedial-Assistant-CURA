import { NextResponse } from 'next/server';
import { doctors } from '@/data/mockData';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain');

    let result = doctors;
    if (domain) {
        result = result.filter(d => d.domain.toLowerCase() === domain.toLowerCase());
    }

    return NextResponse.json({ success: true, data: result, count: result.length });
}
