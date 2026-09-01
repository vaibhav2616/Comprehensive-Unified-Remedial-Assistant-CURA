import { NextResponse } from 'next/server';
import { samplePrescription } from '@/data/mockData';

export async function POST() {
    // Simulate processing delay
    await new Promise(r => setTimeout(r, 500));

    return NextResponse.json({
        success: true,
        data: {
            patientName: samplePrescription.patientName,
            issueDate: samplePrescription.issueDate,
            prescribedBy: samplePrescription.prescribedBy,
            domain: samplePrescription.domain,
            medications: samplePrescription.medications,
        },
        message: 'Prescription analyzed via OCR + NLP pipeline',
    });
}
