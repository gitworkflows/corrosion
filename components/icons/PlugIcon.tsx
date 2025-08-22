import React from 'react';

export const PlugIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22v-5"/>
        <path d="M9 8V2"/>
        <path d="M15 8V2"/>
        <path d="M18 8h3a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-3"/>
        <path d="M6 8H3a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h3"/>
        <path d="M18 17h-2.5a1.5 1.5 0 0 0-1.5 1.5v2.5a1.5 1.5 0 0 0 1.5 1.5H18a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-3"/>
        <path d="M6 17h2.5a1.5 1.5 0 0 1 1.5 1.5v2.5a1.5 1.5 0 0 1-1.5 1.5H6a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h3"/>
    </svg>
);