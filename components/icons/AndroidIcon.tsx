
import React from 'react';

export const AndroidIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 18a1 1 0 0 1-1-1v-2.35a5 5 0 0 0-10 0V17a1 1 0 0 1-1 1" />
        <path d="M6 15h12" />
        <path d="M12 4v2" />
        <path d="M12 10a2 2 0 1 0-2 2" />
        <path d="M12 10a2 2 0 1 0 2 2" />
        <path d="M6 9H4.5a1.5 1.5 0 0 0 0 3H6" />
        <path d="M18 9h1.5a1.5 1.5 0 0 1 0 3H18" />
    </svg>
);
