
import React from 'react';

export const WindowsIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 11 8-1.5V3.9a.2.2 0 0 1 .3-.2l9.5 2.3a.2.2 0 0 1 .1.3V11Z" />
        <path d="m3 13 8 1.5v6.6a.2.2 0 0 1-.3.2l-9.5-2.3a.2.2 0 0 1-.1-.3V13Z" />
    </svg>
);
