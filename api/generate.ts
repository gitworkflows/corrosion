import { GoogleGenAI } from "@google/genai";

// This function is deployed as a Vercel Edge Function

export const config = {
  runtime: 'edge',
};

const DEFAULT_SYSTEM_INSTRUCTION = `You are an expert Rust programmer. Your task is to generate clean, high-quality Rust code based on the user's request.
- ONLY output the raw code or text response.
- Do NOT include markdown fences like \`\`\`rust or \`\`\`.
- Do NOT include any explanations, comments, or introductory text unless specifically asked to.
- The code should be complete and ready to compile if it's a code generation task.`;

export default async function handler(req: Request) {
    if (!process.env.API_KEY) {
        return new Response(JSON.stringify({ error: 'API_KEY environment variable not set on server' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const { prompt, systemInstruction } = await req.json();

        if (!prompt) {
            return new Response(JSON.stringify({ error: 'Prompt is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
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

        return new Response(JSON.stringify({ code }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error("Error in Vercel function:", error);
        return new Response(JSON.stringify({ error: (error as Error).message || 'Failed to generate code' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}