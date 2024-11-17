import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function summarizePDF(fileUri, mimeType) {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `
    Please summarize the following document in a concise and clear format:
    - Focus on the most important points.
    - Provide the summary as a bulleted list.
    - Avoid unnecessary details.
    `;

    const result = await model.generateContent([
        {
            fileData: {
                mimeType,
                fileUri,
            },
        },
        { text: prompt },
    ]);

    return result.response.text();
}
