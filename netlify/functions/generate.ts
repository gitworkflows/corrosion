import { GoogleGenAI } from "@google/genai";
import type { Handler } from "@netlify/functions";

// This function is deployed as a Netlify Function

const DEFAULT_SYSTEM_INSTRUCTION = `You are an expert Rust programmer. Your task is to generate clean, high-quality Rust code based on the user's request.
- ONLY output the raw code or text response.
- Do NOT include markdown fences like \`\`\`rust or \`\`\`.
- Do NOT include any explanations, comments, or introductory text unless specifically asked to.
- The code should be complete and ready to compile if it's a code generation task.`;

const handler: Handler = async (event) => {
    if (!process.env.API_KEY) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'API_KEY environment variable not set on server' }),
        };
    }
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }

    try {
        const { prompt, systemInstruction } = JSON.parse(event.body || '{}');

        if (!prompt) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Prompt is required' }),
            };
        }
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: systemInstruction || DEFAULT_SYSTEM_INSTRUCTION,
                temperature: 0.2,
            }
        });

        const code = response.text;

        return {
            statusCode: 200,
            body: JSON.stringify({ code }),
            headers: { 'Content-Type': 'application/json' },
        };

    } catch (error) {
        console.error("Error in Netlify function:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: (error as Error).message || 'Failed to generate code' }),
        };
    }
};

export { handler };