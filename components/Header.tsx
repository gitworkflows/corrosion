import React from 'react';
import { CorrosionLogoIcon } from './icons/CorrosionLogoIcon';

const Header: React.FC = () => {
  return (
    <header className="bg-secondary-dark border-b border-border-dark p-4 flex items-center justify-center space-x-4 sticky top-0 z-10">
      <CorrosionLogoIcon className="h-10 w-10 text-rust-orange" />
      <div className="flex flex-col items-start">
        <h1 className="text-2xl font-bold text-gray-100 tracking-tight">
          Corrosion
        </h1>
        <p className="text-sm text-gray-400 -mt-1">The Composable Toolkit</p>
      </div>
    </header>
  );
};

export default Header;