import { useState, useCallback } from 'react';
import type { AddLogFn } from '../types';

export const useMutexDemo = (addLog: AddLogFn) => {
    const [sharedCounter, setSharedCounter] = useState(0);
    const [isStateLocked, setIsStateLocked] = useState(false);
    
    const runSimulation = useCallback(() => {
        const threads = ['Thread A', 'Thread B'];
        let currentDelay = 0;

        const runThread = (threadName: string, duration: number) => {
            return new Promise<void>(resolve => {
                setTimeout(() => addLog('INFO', `\x1b[33m[${threadName}]\x1b[0m requesting lock on shared state...`), currentDelay);
                currentDelay += 500;
                setTimeout(() => {
                    setIsStateLocked(true);
                    addLog('SUCCESS', `\x1b[33m[${threadName}]\x1b[0m acquired lock.`);
                }, currentDelay);
                currentDelay += 500;
                setTimeout(() => {
                    addLog('INFO', `\x1b[33m[${threadName}]\x1b[0m is modifying the state...`);
                    setSharedCounter(prev => prev + 1);
                }, currentDelay);
                currentDelay += duration;
                setTimeout(() => {
                    setIsStateLocked(false);
                    addLog('WARN', `\x1b[33m[${threadName}]\x1b[0m released lock.`);
                }, currentDelay);
                currentDelay += 500;
                setTimeout(resolve, currentDelay);
            });
        };

        addLog('INFO', `Starting Mutex demo with 2 threads.`);
        
        return new Promise<void>(resolve => {
            runThread('Thread A', 1500).then(() => runThread('Thread B', 1000)).then(() => {
                addLog('SUCCESS', 'Mutex demo finished. State is consistent.');
                resolve();
            });
        });

    }, [addLog]);

    return { sharedCounter, isStateLocked, runSimulation };
};