import { useState, useCallback } from 'react';
import { callGemini } from '../services/geminiService';
import type { AddLogFn } from '../types';

export const useAiApi = (addLog: AddLogFn) => {
    const [isProcessing, setIsProcessing] = useState<Record<string, boolean>>({});

    const setProcessingState = (key: string, value: boolean) => {
        setIsProcessing(prev => ({ ...prev, [key]: value }));
    };

    const performAiAction = useCallback(async (
        key: string,
        systemInstruction: string,
        userPrompt: string
    ): Promise<string> => {
        setProcessingState(key, true);
        addLog('INFO', `Requesting AI for: ${key}...`);
        try {
            const result = await callGemini({ prompt: userPrompt, systemInstruction });
            addLog('SUCCESS', `AI task '${key}' completed successfully.`);
            return result;
        } catch (error) {
            const errorMessage = `AI task '${key}' failed: ${(error as Error).message}`;
            addLog('ERROR', errorMessage);
            return `// Error: ${errorMessage}`;
        } finally {
            setProcessingState(key, false);
        }
    }, [addLog]);

    return { isProcessing, performAiAction, setProcessingState };
};