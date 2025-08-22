import React, { useEffect, useRef } from 'react';
import type { LogEntry } from '../types';
import { parseAnsi } from '../utils/ansi';

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

const AnsiFormattedText: React.FC<{ text: string }> = React.memo(({ text }) => {
    const elements = parseAnsi(text);
    return <>{elements}</>;
});

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