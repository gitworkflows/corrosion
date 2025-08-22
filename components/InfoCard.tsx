import React from 'react';

interface InfoCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const InfoCard: React.FC<InfoCardProps> = React.memo(({ title, icon, children, className = '' }) => {
  return (
    <div className={`bg-secondary-dark border border-border-dark rounded-lg shadow-lg p-4 sm:p-6 h-full flex flex-col transition-all duration-200 hover:border-gray-600 hover:shadow-2xl ${className}`}>
      <div className="flex items-center mb-4">
        <div className="text-accent-blue mr-3">{icon}</div>
        <h2 className="text-lg font-semibold text-gray-200">{title}</h2>
      </div>
      <div className="flex-grow flex flex-col">{children}</div>
    </div>
  );
});
