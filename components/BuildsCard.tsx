import React, { useState } from 'react';
import { InfoCard } from './InfoCard';
import TerminalOutput from './TerminalOutput';
import { CpuChipIcon } from './icons/CpuChipIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { Modal } from './Modal';
import type { BuildTarget, BuildStatus } from '../types';

interface BuildsCardProps {
    targets: BuildTarget[];
    logs: any[];
    isBuilding: boolean;
    isPackaging: boolean;
    isAnalyzing: boolean;
    handleBuildAll: () => Promise<void>;
    handleDistributeClick: (target: BuildTarget) => void;
    handleAnalyzeLog: () => Promise<string>;
}

const getStatusColor = (status: BuildStatus) => {
    switch (status) {
        case 'Success': return 'bg-green-500/20 text-accent-green';
        case 'Failed': return 'bg-red-500/20 text-red-500';
        case 'Building': return 'bg-blue-500/20 text-accent-blue animate-pulse';
        case 'Queued': return 'bg-yellow-500/20 text-yellow-400';
        default: return 'bg-gray-700/20 text-gray-400';
    }
};

export const BuildsCard: React.FC<BuildsCardProps> = ({
    targets,
    logs,
    isBuilding,
    isPackaging,
    isAnalyzing,
    handleBuildAll,
    handleDistributeClick,
    handleAnalyzeLog
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [analysisResult, setAnalysisResult] = useState('');

    const onAnalyzeClick = async () => {
        const result = await handleAnalyzeLog();
        setAnalysisResult(result);
        setIsModalOpen(true);
    };

    return (
        <>
            <InfoCard title="Cross-Platform Builds" icon={<CpuChipIcon />}>
                <button onClick={handleBuildAll} disabled={isBuilding} className="w-full bg-rust-orange hover:bg-orange-700 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-colors mb-4 flex items-center justify-center space-x-2">
                    {isBuilding && <SpinnerIcon />}
                    <span>{isBuilding ? 'Building All...' : 'Build All Targets'}</span>
                </button>
                <div className="space-y-2 mb-4">
                    {targets.map((target) => (
                        <div key={target.platform} className="flex items-center justify-between p-2 bg-primary-dark rounded-md border border-border-dark">
                            <div className="flex items-center space-x-3"><div className="text-gray-400">{target.icon}</div><span className="font-mono text-sm text-gray-300">{target.platform}</span></div>
                            <div className="flex items-center space-x-2">
                                <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${getStatusColor(target.status)}`}>{target.status}</span>
                                {target.status === 'Success' && (
                                    <button onClick={() => handleDistributeClick(target)} disabled={isPackaging} className="bg-accent-blue/80 hover:bg-accent-blue text-white font-bold px-3 py-1 rounded-md text-xs transition-colors">
                                        Distribute
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <TerminalOutput logs={logs} />
                {logs.length > 0 && !isBuilding &&
                    <button onClick={onAnalyzeClick} disabled={isAnalyzing} className="mt-2 w-full bg-gray-600 hover:bg-gray-500 disabled:bg-gray-800 text-white font-bold py-2 px-4 rounded-md transition-colors text-xs flex items-center justify-center space-x-2">
                        {isAnalyzing && <SpinnerIcon className="w-4 h-4" />}
                        <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Build Log with AI'}</span>
                    </button>
                }
            </InfoCard>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="AI Build Log Analysis">
                {analysisResult}
            </Modal>
        </>
    );
};
