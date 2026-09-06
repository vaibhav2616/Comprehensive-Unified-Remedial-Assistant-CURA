import { NextResponse } from 'next/server';
import { appointments as defaultAppointments } from '@/data/mockData';

let appointments = [...defaultAppointments];

export async function GET() {
    return NextResponse.json({ success: true, data: appointments });
}

export async function POST(request) {
    const body = await request.json();
    const newAppointment = {
        id: `apt-${Date.now()}`,
        ...body,
        status: 'pending',
    };
    appointments.push(newAppointment);
    return NextResponse.json({ success: true, data: newAppointment }, { status: 201 });
}
