import React from 'react';

export const GooglePlayIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2.5 2.5v19l19-9.5L2.5 2.5Z" />
        <path d="m13 12.5-5.5 3V8.5l5.5 3Z" />
        <path d="M2.5 2.5 13 12.5l-10.5 9.5" />
    </svg>
);