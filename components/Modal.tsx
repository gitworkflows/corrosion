import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity" onClick={onClose}>
            <div className="bg-secondary-dark border border-border-dark rounded-lg shadow-xl p-6 w-full max-w-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-100">{title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl font-light">&times;</button>
                </div>
                <div className="bg-primary-dark p-4 rounded-md max-h-[60vh] overflow-y-auto border border-border-dark">
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans">{children}</pre>
                </div>
                <div className="mt-6 flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 bg-accent-blue hover:bg-blue-600 text-white font-bold rounded-md transition-colors">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
