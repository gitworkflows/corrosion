import React from 'react';

export const PuzzlePieceIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19.439 7.561c-1.305-1.305-3.056-2.024-4.9-2.024-1.844 0-3.595.72-4.9 2.024L5 12.121V19h6.879l4.56-4.56c1.305-1.305 2.024-3.056 2.024-4.9 0-1.844-.72-3.595-2.024-4.9z" />
        <path d="M12.121 5L5 12.121V19h6.879l4.56-4.56c1.305-1.305 2.024-3.056 2.024-4.9 0-1.844-.72-3.595-2.024-4.9z" />
        <path d="M12.121 5l-2.024-2.024c-1.305-1.305-3.056-2.024-4.9-2.024-1.844 0-3.595.72-4.9 2.024L5 12.121V19h6.879" />
        <path d="M14.5 12a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
);