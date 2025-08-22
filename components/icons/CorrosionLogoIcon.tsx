import React from 'react';

// A stylized 'C' for the brand "Corrosion".
// It evokes a clamp or a piece of machinery, fitting the toolkit theme.
// The color is inherited via the `currentColor` SVG attribute.
export const CorrosionLogoIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.2418 2.00195C8.58195 2.00195 3.99121 6.59269 3.99121 12.2525C3.99121 17.9124 8.58195 22.5031 14.2418 22.5031C16.8837 22.5031 19.2965 21.4939 21.1118 19.8519L19.6976 18.4377C18.2673 19.5393 16.3601 20.2531 14.2418 20.2531C9.82932 20.2531 6.24121 16.665 6.24121 12.2525C6.24121 7.84003 9.82932 4.25195 14.2418 4.25195C16.3601 4.25195 18.2673 4.96577 19.6976 6.06731L21.1118 4.65309C19.2965 3.01111 16.8837 2.00195 14.2418 2.00195Z" />
        <path d="M22 6H19V9H22V6Z" />
        <path d="M22 18H19V15H22V18Z" />
    </svg>
);
