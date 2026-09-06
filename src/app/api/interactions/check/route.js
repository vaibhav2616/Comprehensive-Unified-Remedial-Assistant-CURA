import { NextResponse } from 'next/server';
import { drugInteractions } from '@/data/mockData';

export async function POST(request) {
    const body = await request.json();
    const { medications = [], targetDomain } = body;

    const conflicts = drugInteractions.filter(
        int => int.conflictDomain === targetDomain &&
            medications.some(med => med.name === int.medication || med === int.medication)
    );

    return NextResponse.json({
        success: true,
        hasConflicts: conflicts.length > 0,
        conflicts,
        checkedMedications: medications.length,
        targetDomain,
    });
}
