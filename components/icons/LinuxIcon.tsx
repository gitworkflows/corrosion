
import React from 'react';

export const LinuxIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13.29 7.03a2.43 2.43 0 0 1 2.2-1.4A2.43 2.43 0 0 1 17.7 8.1a2.43 2.43 0 0 1-1.4 2.2" />
        <path d="M12 20v-4" />
        <path d="M12 20H8" />
        <path d="M15.22 17.55A3.48 3.48 0 0 0 12 16a3.48 3.48 0 0 0-3.22 1.55" />
        <path d="M12 16V2" />
        <path d="M15 2H9" />
        <path d="M10.71 7.03a2.43 2.43 0 0 0-2.2-1.4A2.43 2.43 0 0 0 6.3 8.1a2.43 2.43 0 0 0 1.4 2.2" />
    </svg>
);
