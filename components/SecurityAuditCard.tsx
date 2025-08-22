import React, { useState, useCallback } from 'react';
import { InfoCard } from './InfoCard';
import { Modal } from './Modal';
import { ShieldIcon } from './icons/ShieldIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface SecurityAuditCardProps {
    isProcessing: Record<string, boolean>;
    performAiAction: (key: string, systemInstruction: string, userPrompt: string) => Promise<string>;
    rustApiCode: string;
}

export const SecurityAuditCard: React.FC<SecurityAuditCardProps> = ({ isProcessing, performAiAction, rustApiCode }) => {
    const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
    const [securityAuditResult, setSecurityAuditResult] = useState('');

    const handleSecurityAudit = useCallback(async () => {
        const result = await performAiAction('security', 'You are a security expert specializing in Rust and web applications. Analyze the following Rust Tauri commands for potential security vulnerabilities like command injection, path traversal, or excessive permissions. Provide a concise summary of findings and recommendations. If no issues are found, state that. Use markdown for formatting.', rustApiCode);
        setSecurityAuditResult(result);
        setIsSecurityModalOpen(true);
    }, [performAiAction, rustApiCode]);

    return (
        <>
            <InfoCard title="API Security Audit" icon={<ShieldIcon />}>
                <p className="text-xs text-gray-400 mb-4">The AI will analyze the Rust commands from the API bridge panel for potential security vulnerabilities like path traversal or command injection.</p>
                <button onClick={handleSecurityAudit} disabled={isProcessing['security']} className="w-full bg-rust-orange hover:bg-orange-700 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-colors flex items-center justify-center space-x-2">
                    {isProcessing['security'] && <SpinnerIcon />}
                    <span>{isProcessing['security'] ? 'Analyzing...' : 'Run AI Security Audit'}</span>
                </button>
            </InfoCard>
            <Modal isOpen={isSecurityModalOpen} onClose={() => setIsSecurityModalOpen(false)} title="AI Security Audit Results">
                {securityAuditResult}
            </Modal>
        </>
    );
};