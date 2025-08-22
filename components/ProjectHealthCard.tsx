import React from 'react';
import { InfoCard } from './InfoCard';
import { GithubIcon } from './icons/GithubIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface ProjectHealthCardProps {
    isProcessing: boolean;
    ciStatus: 'Passing' | 'Failing' | 'Running';
    handleCiCdRun: () => void;
}

export const ProjectHealthCard: React.FC<ProjectHealthCardProps> = ({ isProcessing, ciStatus, handleCiCdRun }) => {
    return (
        <InfoCard title="Project Health & CI/CD" icon={<GithubIcon />}>
            <div className="flex items-center justify-between p-3 bg-primary-dark rounded-md border border-border-dark mb-4">
                <span className="text-sm font-semibold">CI/CD Status</span>
                <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                    ciStatus === 'Passing' ? 'bg-green-500/20 text-accent-green' :
                    ciStatus === 'Failing' ? 'bg-red-500/20 text-red-500' :
                    'bg-blue-500/20 text-accent-blue animate-pulse'
                }`}>
                    {ciStatus}
                </span>
            </div>
            <div className="space-y-2 mb-4 text-sm">
                <a href="./docs/contributing.md" target="_blank" rel="noopener noreferrer" className="block text-accent-blue hover:underline">› Contribution Guide</a>
                <a href="./docs/roadmap.md" target="_blank" rel="noopener noreferrer" className="block text-accent-blue hover:underline">› Project Roadmap</a>
                <a href="./docs/labels.md" target="_blank" rel="noopener noreferrer" className="block text-accent-blue hover:underline">› Issue Labels Guide</a>
            </div>
            <p className="text-xs text-gray-500 text-center mb-4">
              Automated releases are triggered by pushing a version tag.
            </p>
            <button onClick={handleCiCdRun} disabled={isProcessing} className="w-full mt-auto bg-gray-600 hover:bg-gray-500 disabled:bg-gray-800 text-white font-bold py-2 px-4 rounded-md transition-colors flex items-center justify-center space-x-2">
                {isProcessing && <SpinnerIcon />}
                <span>{isProcessing ? 'Pipeline Running...' : 'Run CI/CD Pipeline'}</span>
            </button>
        </InfoCard>
    );
};