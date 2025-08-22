const MOCK_RESPONSE = `// Mock response: This is a fallback for local development.
// For full functionality, run with a Vercel or Netlify dev server.
fn mock_function() -> &'static str {
    "This is mock data because the AI service is not available."
}
`;

interface GeminiRequest {
    prompt: string;
    systemInstruction?: string;
}

export const callGemini = async (request: GeminiRequest): Promise<string> => {
    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            // If the API proxy is not found (e.g. in basic local dev), use mock data.
            if (response.status === 404) {
                 console.warn("API endpoint '/api/generate' not found, returning mock data. For full functionality, run with 'vercel dev' or 'netlify dev'.");
                 return MOCK_RESPONSE;
            }
            const errorData = await response.json();
            throw new Error(errorData.error || `Request failed with status ${response.status}`);
        }

        const data = await response.json();
        return data.code;
    } catch (error) {
        console.error("Error calling Gemini service:", error);
        if (error instanceof TypeError) { // Catches network errors
             console.warn("Network error, returning mock data. Ensure the development server is running.");
             return MOCK_RESPONSE;
        }
        return `// Error generating code: ${(error as Error).message}\n// Please check the serverless function logs.`;
    }
};