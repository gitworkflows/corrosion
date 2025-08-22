import React, { useState, useCallback } from 'react';
import { InfoCard } from './InfoCard';
import { BrainCircuitIcon } from './icons/BrainCircuitIcon';
import CodeEditor from './CodeEditor';
import { INITIAL_RUST_CODE } from '../constants';
import { SpinnerIcon } from './icons/SpinnerIcon';

type DevCardTab = 'Generate' | 'Refactor' | 'Test' | 'Explain';

interface AiDevelopmentCardProps {
    isProcessing: Record<string, boolean>;
    performAiAction: (key: string, systemInstruction: string, userPrompt: string) => Promise<string>;
}

export const AiDevelopmentCard: React.FC<AiDevelopmentCardProps> = ({ isProcessing, performAiAction }) => {
    const [devCardTab, setDevCardTab] = useState<DevCardTab>('Generate');
    const [rustCode, setRustCode] = useState(INITIAL_RUST_CODE);
    const [prompt, setPrompt] = useState('Generate a Rust function that calculates the factorial of a number.');

    const handleDevAiAction = useCallback(async () => {
        const tab = devCardTab;
        const instructions: Record<DevCardTab, string> = {
            Generate: 'You are an expert Rust programmer. Your task is to generate clean, high-quality Rust code based on the user\'s request. ONLY output the raw Rust code. Do NOT include markdown fences or explanations.',
            Refactor: 'You are an expert Rust programmer. Refactor the following Rust code for clarity, performance, and idiomatic style. ONLY output the refactored Rust code. Do NOT include markdown fences or explanations.',
            Test: 'You are an expert Rust programmer. Generate a comprehensive suite of unit tests for the following Rust code using the standard `#[cfg(test)]` mod pattern. ONLY output the Rust test code. Do NOT include markdown fences or explanations.',
            Explain: 'You are an expert code reviewer. Explain the following Rust code in a clear, concise, and easy-to-understand way. Use markdown for formatting your explanation.'
        };
        const currentCode = tab === 'Generate' ? prompt : rustCode;
        const result = await performAiAction(tab, instructions[tab], currentCode);
        setRustCode(result);
    }, [devCardTab, prompt, rustCode, performAiAction]);

    return (
        <InfoCard title="AI-Powered Rust Development" icon={<BrainCircuitIcon />}>
            <div className="flex border-b border-border-dark mb-4">
                {(['Generate', 'Refactor', 'Test', 'Explain'] as DevCardTab[]).map(tab => (
                    <button key={tab} onClick={() => setDevCardTab(tab)} className={`px-4 py-2 text-sm font-semibold transition-colors ${devCardTab === tab ? 'text-accent-blue border-b-2 border-accent-blue' : 'text-gray-400 hover:text-white'}`}>{tab}</button>
                ))}
            </div>
            {devCardTab === 'Generate' && <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe the Rust code you want..." className="w-full p-2 mb-4 bg-primary-dark border border-border-dark rounded-md focus:ring-2 focus:ring-accent-blue focus:outline-none font-mono text-sm" rows={2} />}
            <button onClick={handleDevAiAction} disabled={isProcessing[devCardTab]} className="w-full bg-accent-blue hover:bg-blue-600 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-colors mb-4 flex items-center justify-center space-x-2">
                {isProcessing[devCardTab] && <SpinnerIcon />}
                <span>{isProcessing[devCardTab] ? `Running ${devCardTab}...` : `Run ${devCardTab}`}</span>
            </button>
            <CodeEditor language={devCardTab === 'Explain' ? 'markdown' : 'rust'} code={rustCode} setCode={setRustCode} />
        </InfoCard>
    );
};
