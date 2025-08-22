import { useState, useCallback, useRef, useEffect } from 'react';
import type { BuildTarget, LogEntry, BuildStatus, DistributionFormat, PerformanceMetric, Plugin, AddLogFn } from '../types';
import { INITIAL_TARGETS, INITIAL_METRICS } from '../constants';

export const useBuildSystem = (addLog: AddLogFn, appConfig: string, plugins: Plugin[]) => {
    const [targets, setTargets] = useState<BuildTarget[]>(INITIAL_TARGETS);
    const [metrics, setMetrics] = useState<PerformanceMetric[]>(INITIAL_METRICS);
    const [liveMetrics, setLiveMetrics] = useState<{ time: string; cpu: number; memory: number }[]>([]);
    const liveMetricsInterval = useRef<number | null>(null);
    const [distributionModalTarget, setDistributionModalTarget] = useState<BuildTarget | null>(null);

    const startLiveMetrics = useCallback(() => {
        if (liveMetricsInterval.current) clearInterval(liveMetricsInterval.current);
        setLiveMetrics([]);
        liveMetricsInterval.current = window.setInterval(() => {
            setLiveMetrics(prev => {
                const newPoint = { time: new Date().toLocaleTimeString(), cpu: 10 + Math.random() * 40, memory: 45 + Math.random() * 20 };
                return [...prev.slice(-20), newPoint];
            });
        }, 1500);
    }, []);

    const stopLiveMetrics = useCallback(() => {
        if (liveMetricsInterval.current) {
            clearInterval(liveMetricsInterval.current);
            liveMetricsInterval.current = null;
            setTimeout(() => setLiveMetrics([]), 3000);
        }
    }, []);

    // Add cleanup effect for the interval to prevent memory leaks
    useEffect(() => {
        return () => {
            if (liveMetricsInterval.current) {
                clearInterval(liveMetricsInterval.current);
            }
        };
    }, []);

    const handleBuildAll = useCallback(async (): Promise<void> => {
        startLiveMetrics();
        addLog('INFO', 'Build process started for all targets.');
        addLog('INFO', `Reading config from toolkit.conf.json... App: ${JSON.parse(appConfig).appName}`);

        const activePlugins = plugins.filter(p => p.enabled);
        addLog('INFO', `Bundling active plugins: ${activePlugins.map(p => p.name).join(', ') || 'None'}`);

        const buildPromises = INITIAL_TARGETS.map((target, index) => {
            return new Promise<void>(resolve => {
                setTimeout(() => {
                    setTargets(prev => prev.map(t => t.platform === target.platform ? { ...t, status: 'Building' } : t));
                    addLog('INFO', `Compiling Rust core for ${target.platform} (${target.arch})...`);
                }, index * 1000);

                setTimeout(() => {
                    if (target.platform === 'Android' || target.platform === 'iOS') {
                        activePlugins.forEach(p => {
                            const nativeComponent = p.components.find(c => c.type === (target.platform === 'Android' ? 'Kotlin (Android)' : 'Swift (iOS)'));
                            if (nativeComponent?.status === 'Included') {
                                addLog('INFO', `Compiling ${nativeComponent.type} extensions for plugin '${p.name}'...`);
                            }
                        });
                    }
                    addLog('INFO', `Linking native bindings for ${target.platform} (${target.bindings})...`);
                }, index * 1000 + 1500);

                setTimeout(() => {
                    const isSuccess = Math.random() > 0.1; // 90% success rate
                    const finalStatus: BuildStatus = isSuccess ? 'Success' : 'Failed';
                    setTargets(prev => prev.map(t => t.platform === target.platform ? { ...t, status: finalStatus } : t));
                    addLog(isSuccess ? 'SUCCESS' : 'ERROR', `Build for ${target.platform} finished with status: ${finalStatus}. Output: /dist/${target.output}`);
                    resolve();
                }, index * 1000 + 3000);
            });
        });

        await Promise.all(buildPromises);

        addLog('SUCCESS', 'All build targets processed.');
        stopLiveMetrics();
    }, [addLog, startLiveMetrics, stopLiveMetrics, appConfig, plugins]);

    const handleDistributeClick = useCallback((target: BuildTarget) => {
        setDistributionModalTarget(target);
    }, []);

    const handlePackage = useCallback((target: BuildTarget, format: DistributionFormat) => {
        setDistributionModalTarget(null);
        addLog('INFO', `Starting packaging for ${target.platform} as ${format.name}...`);
        const packagingSteps = [
            `Validating assets for ${format.name}...`,
            `Running packaging script for ${format.id}...`,
            ...(format.id.includes('store') || format.id === 'dmg' ? [`Signing application with developer certificate...`] : []),
            ...(format.id === 'dmg' ? [`Notarizing with Apple...`] : []),
            `Finalizing package...`
        ];

        let promiseChain = Promise.resolve();
        packagingSteps.forEach((step, i) => {
            promiseChain = promiseChain.then(() => new Promise(resolve => {
                setTimeout(() => {
                    addLog('INFO', step);
                    resolve();
                }, 800);
            }));
        });
        
        promiseChain.then(() => {
            addLog('SUCCESS', `Packaging complete! Output: /dist/release/${target.output.split('.')[0]}.${format.id}`);
        });

        return promiseChain;
    }, [addLog]);

    return {
        targets,
        metrics,
        liveMetrics,
        distributionModalTarget,
        setDistributionModalTarget,
        handleBuildAll,
        handleDistributeClick,
        handlePackage,
    };
};