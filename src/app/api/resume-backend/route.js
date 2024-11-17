import { cn } from '@/utils/googleAI';
import { NextResponse } from 'next/server';

export const POST = async (req) => {
    try {
        const { jobDescription, resume } = await req.json();

        if (!jobDescription || !resume) {
            return NextResponse.json(
                { error: 'Job description and resume are required.' },
                { status: 400 }
            );
        }

        const questions = await generateQuestions(jobDescription, resume);

        return NextResponse.json({ questions, status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { error: 'Failed to generate interview questions.' },
            { status: 500 }
        );
    }
};
