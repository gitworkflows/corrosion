import React, { useState, useCallback } from 'react';
import type { AddLogFn } from '../types';
import { InfoCard } from './InfoCard';
import CodeEditor from './CodeEditor';
import { CogIcon } from './icons/CogIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface AppConfigCardProps {
    appConfig: string;
    setAppConfig: (config: string) => void;
    isProcessing: Record<string, boolean>;
    performAiAction: (key: string, systemInstruction: string, userPrompt: string) => Promise<string>;
    addLog: AddLogFn;
}

export const AppConfigCard: React.FC<AppConfigCardProps> = ({ appConfig, setAppConfig, isProcessing, performAiAction, addLog }) => {
    const [configPrompt, setConfigPrompt] = useState('');

    const handleConfigAi = useCallback(async () => {
        if (!configPrompt.trim()) {
            addLog('WARN', 'Configuration prompt is empty.');
            return;
        }
        const result = await performAiAction('config', 'You are a configuration expert. The user provides a JSON config and a request. Modify the JSON to satisfy the request. ONLY output the raw, updated JSON object.', `CONFIG:\n${appConfig}\n\nREQUEST:\n${configPrompt}`);
        try {
          JSON.parse(result); // Validate JSON
          setAppConfig(result);
        } catch {
          addLog('ERROR', 'AI returned invalid JSON for configuration.');
        }
    }, [performAiAction, appConfig, configPrompt, addLog, setAppConfig]);
    
    return (
        <InfoCard title="Application Configuration" icon={<CogIcon />}>
            <CodeEditor language="json" code={appConfig} setCode={setAppConfig} height="h-40"/>
            <div className="flex gap-2 mt-2">
                <input type="text" placeholder="e.g., 'Change title to My Tauri App'" value={configPrompt} onChange={e => setConfigPrompt(e.target.value)} className="flex-grow p-2 bg-primary-dark border border-border-dark rounded-md focus:ring-2 focus:ring-accent-blue focus:outline-none font-mono text-xs" />
                <button onClick={handleConfigAi} disabled={isProcessing['config']} className="bg-wasm-purple hover:bg-purple-700 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-colors text-xs flex items-center justify-center space-x-2">
                    {isProcessing['config'] && <SpinnerIcon className="w-4 h-4" />}
                    <span>{isProcessing['config'] ? '...' : 'Apply'}</span>
                </button>
            </div>
        </InfoCard>
    );
};