import { GoogleAIFileManager } from '@google/generative-ai/server';
import { summarizePDF } from '@/utils/googleAI';
import { NextResponse } from 'next/server';
import path from 'path';
import { writeFile, mkdir, unlink } from 'fs/promises';

export const POST = async (req) => {
    try {
        const formData = await req.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ error: 'No file received.' }, { status: 400 });
        }

        if (!file.type.includes('pdf')) {
            return NextResponse.json({ error: 'Only PDF files are supported.' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = file.name.replace(/\s+/g, '_');
        const dirPath = path.join(process.cwd(), 'public/assets');
        await mkdir(dirPath, { recursive: true });
        const filePath = path.join(dirPath, filename);
        await writeFile(filePath, buffer);

        const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);
        const uploadResponse = await fileManager.uploadFile(filePath, {
            mimeType: file.type,
            displayName: filename,
        });

        const summary = await summarizePDF(uploadResponse.file.uri, file.type);

        await unlink(filePath);

        return NextResponse.json({ summary, status: 201 });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Failed to process PDF.' }, { status: 500 });
    }
};
