import React, { useEffect, useRef } from 'react';
import type { LogEntry } from '../types';

interface TerminalOutputProps {
  logs: LogEntry[];
}

const getLevelColor = (level: LogEntry['level']) => {
  switch (level) {
    case 'SUCCESS': return 'text-accent-green';
    case 'ERROR': return 'text-red-500';
    case 'WARN': return 'text-yellow-400';
    case 'INFO':
    default: return 'text-gray-400';
  }
};

// --- Start of ANSI parsing logic ---
const ANSI_COLOR_MAP: Record<string, string> = {
    '30': 'text-gray-500',      // Black
    '31': 'text-red-500',         // Red
    '32': 'text-accent-green',    // Green
    '33': 'text-yellow-400',      // Yellow
    '34': 'text-accent-blue',     // Blue
    '35': 'text-graphql-pink',    // Magenta
    '36': 'text-cyan-400',        // Cyan
    '37': 'text-gray-200',        // White
    '90': 'text-gray-400',      // Bright Black (Gray)
    '91': 'text-red-400',         // Bright Red
    '92': 'text-green-400',       // Bright Green
    '93': 'text-yellow-300',      // Bright Yellow
    '94': 'text-blue-400',        // Bright Blue
    '95': 'text-pink-400',        // Bright Magenta
    '96': 'text-cyan-300',        // Bright Cyan
    '97': 'text-white',           // Bright White
};

const ANSI_STYLE_MAP: Record<string, string> = {
    '1': 'font-bold',
    '3': 'italic',
    '4': 'underline',
};

const AnsiFormattedText: React.FC<{ text: string }> = React.memo(({ text }) => {
    const ansiRegex = /(\x1b\[[0-9;]*m)/;
    const parts = text.split(ansiRegex).filter(Boolean);

    let currentClasses: string[] = []; // Start with no classes, default is handled by parent span
    const elements: React.ReactNode[] = [];

    parts.forEach((part, index) => {
        if (part.match(ansiRegex)) {
            const codes = part.replace(/\x1b\[|m/g, '').split(';').filter(Boolean);
            
            if (codes.length === 0 || codes[0] === '0') {
                currentClasses = []; // Reset all styles
                return;
            }

            codes.forEach(code => {
                if (ANSI_COLOR_MAP[code]) {
                    currentClasses = currentClasses.filter(c => !c.startsWith('text-'));
                    currentClasses.push(ANSI_COLOR_MAP[code]);
                } else if (ANSI_STYLE_MAP[code]) {
                    if (!currentClasses.includes(ANSI_STYLE_MAP[code])) {
                        currentClasses.push(ANSI_STYLE_MAP[code]);
                    }
                } else if (code === '39') { // Default foreground color
                    currentClasses = currentClasses.filter(c => !c.startsWith('text-'));
                } else if (code === '22') { // Normal intensity
                    currentClasses = currentClasses.filter(c => c !== 'font-bold');
                } else if (code === '23') { // Not italic
                    currentClasses = currentClasses.filter(c => c !== 'italic');
                } else if (code === '24') { // Not underlined
                    currentClasses = currentClasses.filter(c => c !== 'underline');
                }
            });
        } else {
            elements.push(<span key={index} className={currentClasses.join(' ')}>{part}</span>);
        }
    });

    return <>{elements}</>;
});
// --- End of ANSI parsing logic ---

const TerminalOutput: React.FC<TerminalOutputProps> = React.memo(({ logs }) => {
  const endOfLogsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfLogsRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="bg-primary-dark rounded-md border border-border-dark h-64 flex flex-col">
      <div className="bg-secondary-dark px-4 py-2 border-b border-border-dark rounded-t-md">
        <span className="text-xs font-semibold uppercase text-gray-400">Output</span>
      </div>
      <div className="p-3 overflow-y-auto font-mono text-sm flex-grow">
        {logs.length === 0 ? (
           <p className="text-gray-500">No output yet. Click a build or analysis button to begin.</p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex">
              <span className="text-gray-500 mr-2">{log.timestamp}</span>
              <span className={`${getLevelColor(log.level)} font-bold mr-2`}>[{log.level}]</span>
              <span className="text-gray-300 flex-1 whitespace-pre-wrap">
                <AnsiFormattedText text={log.message} />
              </span>
            </div>
          ))
        )}
        <div ref={endOfLogsRef} />
      </div>
    </div>
  );
});

export default TerminalOutput;