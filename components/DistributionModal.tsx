import React, { useState, useEffect } from 'react';
import type { BuildTarget, DistributionFormat } from '../types';

interface DistributionModalProps {
  target: BuildTarget | null;
  onClose: () => void;
  onPackage: (format: DistributionFormat) => void;
}

const DistributionModal: React.FC<DistributionModalProps> = ({ target, onClose, onPackage }) => {
  const [selectedFormat, setSelectedFormat] = useState<DistributionFormat | null>(null);

  useEffect(() => {
    if (target) {
      setSelectedFormat(target.distributionFormats[0]);
    }
  }, [target]);

  if (!target) {
    return null;
  }

  const handlePackageClick = () => {
    if (selectedFormat) {
      onPackage(selectedFormat);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity" onClick={onClose}>
      <div className="bg-secondary-dark border border-border-dark rounded-lg shadow-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-100">Distribute for {target.platform}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
        </div>

        <p className="text-sm text-gray-400 mb-4">Select a distribution format to begin the packaging process.</p>

        <div className="space-y-2">
            {target.distributionFormats.map((format) => (
                <button
                    key={format.id}
                    onClick={() => setSelectedFormat(format)}
                    className={`w-full flex items-center p-3 rounded-md border-2 transition-colors ${selectedFormat?.id === format.id ? 'bg-accent-blue/20 border-accent-blue' : 'bg-primary-dark border-border-dark hover:border-gray-600'}`}
                >
                    <div className="mr-3 text-gray-300">{format.icon}</div>
                    <span className="font-semibold text-gray-200">{format.name}</span>
                </button>
            ))}
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded-md transition-colors">
            Cancel
          </button>
          <button
            onClick={handlePackageClick}
            disabled={!selectedFormat}
            className="px-4 py-2 bg-accent-blue hover:bg-blue-600 disabled:bg-gray-700 text-white font-bold rounded-md transition-colors"
          >
            Package
          </button>
        </div>
      </div>
    </div>
  );
};

export default DistributionModal;