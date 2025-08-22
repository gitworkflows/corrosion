import React, { useState, useCallback } from 'react';
import { InfoCard } from './InfoCard';
import CodeEditor from './CodeEditor';
import { PlugIcon } from './icons/PlugIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { INITIAL_JS_API_CODE } from '../constants';

interface ApiBridgeCardProps {
  isProcessing: Record<string, boolean>;
  performAiAction: (key: string, systemInstruction: string, userPrompt: string) => Promise<string>;
  rustApiCode: string;
  setRustApiCode: (code: string) => void;
}

export const ApiBridgeCard: React.FC<ApiBridgeCardProps> = ({ isProcessing, performAiAction, rustApiCode, setRustApiCode }) => {
    const [jsApiCode, setJsApiCode] = useState(INITIAL_JS_API_CODE);
    const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

    const handleApiBridgeAi = useCallback(async (action: 'docstrings' | 'snippet') => {
        if (action === 'docstrings') {
            const result = await performAiAction('docstrings', 'You are a Rust expert. Generate idiomatic Rust docstrings for the following functions. Only output the full, updated code with the new docstrings.', rustApiCode);
            setRustApiCode(result);
        } else {
            const result = await performAiAction('snippet', 'You are a TypeScript expert. Given the following Rust tauri commands, generate the corresponding TypeScript functions using `@tauri-apps/api/tauri`. Only output the raw TypeScript code.', rustApiCode);
            setJsApiCode(result);
            navigator.clipboard.writeText(result).then(() => {
                setCopyStatus('copied');
                setTimeout(() => setCopyStatus('idle'), 2000);
            });
        }
    }, [performAiAction, rustApiCode, setRustApiCode]);

    return (
        <InfoCard title="JS-Rust API Bridge" icon={<PlugIcon />}>
            <CodeEditor language="rust" code={rustApiCode} setCode={setRustApiCode} height="h-40" />
            <div className="grid grid-cols-2 gap-2 my-2">
                <button onClick={() => handleApiBridgeAi('docstrings')} disabled={isProcessing['docstrings']} className="bg-graphql-pink/80 hover:bg-graphql-pink disabled:bg-gray-600 text-white font-bold py-2 px-2 rounded-md transition-colors text-xs flex items-center justify-center space-x-2">
                    {isProcessing['docstrings'] && <SpinnerIcon className="w-4 h-4" />}
                    <span>{isProcessing['docstrings'] ? '...' : 'Generate Docstrings'}</span>
                </button>
                <button onClick={() => handleApiBridgeAi('snippet')} disabled={isProcessing['snippet']} className="bg-graphql-pink/80 hover:bg-graphql-pink disabled:bg-gray-600 text-white font-bold py-2 px-2 rounded-md transition-colors text-xs flex items-center justify-center space-x-2">
                    {isProcessing['snippet'] && <SpinnerIcon className="w-4 h-4" />}
                    <span className="transition-all">{isProcessing['snippet'] ? '...' : (copyStatus === 'copied' ? 'Copied!' : 'Generate JS Snippet')}</span>
                </button>
            </div>
            <CodeEditor language="javascript" code={jsApiCode} setCode={setJsApiCode} isReadOnly={false} height="h-24" />
        </InfoCard>
    );
};