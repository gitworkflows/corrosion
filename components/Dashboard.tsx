import React, { useState, useCallback } from 'react';
import type { LogEntry, Plugin } from '../types';

// Constants
import { INITIAL_PLUGINS, INITIAL_RUST_API_CODE, INITIAL_APP_CONFIG } from '../constants';

// Hooks
import { useAiApi } from '../hooks/useAiApi';
import { useBuildSystem } from '../hooks/useBuildSystem';
import { useMutexDemo } from '../hooks/useMutexDemo';

// Components
import MetricsChart from './MetricsChart';
import { InfoCard } from './InfoCard';
import { AIAssistantChat } from './AIAssistantChat';
import DistributionModal from './DistributionModal';
import { AiDevelopmentCard } from './AiDevelopmentCard';
import { BuildsCard } from './BuildsCard';
import { ApiBridgeCard } from './ApiBridgeCard';
import { SecurityAuditCard } from './SecurityAuditCard';
import { PluginManager } from './PluginManager';
import { AppConfigCard } from './AppConfigCard';
import { ProjectHealthCard } from './ProjectHealthCard';
import { SpinnerIcon } from './icons/SpinnerIcon';

// Icons
import { CubeIcon } from './icons/CubeIcon';
import { ChatIcon } from './icons/ChatIcon';
import { LockIcon } from './icons/LockIcon';


const Dashboard: React.FC = () => {
  // Master log state
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const addLog = useCallback((level: LogEntry['level'], message: string) => {
    setLogs(prev => [...prev, { id: Date.now() + Math.random(), timestamp: new Date().toLocaleTimeString(), level, message }]);
  }, []);

  // State shared between components
  const [rustApiCode, setRustApiCode] = useState(INITIAL_RUST_API_CODE);
  const [plugins, setPlugins] = useState<Plugin[]>(INITIAL_PLUGINS);
  const [appConfig, setAppConfig] = useState(INITIAL_APP_CONFIG);

  // Local state for complex simulations
  const [ciStatus, setCiStatus] = useState<'Passing' | 'Failing' | 'Running'>('Passing');

  // Custom Hooks for complex logic
  const { isProcessing, performAiAction, setProcessingState } = useAiApi(addLog);
  
  const {
    targets, metrics, liveMetrics, distributionModalTarget, setDistributionModalTarget, handleBuildAll, handleDistributeClick, handlePackage
  } = useBuildSystem(addLog, appConfig, plugins);
  
  const { sharedCounter, isStateLocked, runSimulation } = useMutexDemo(addLog);

  // --- Handlers for Child Components ---
  const handleBuildSystemAction = useCallback(async () => {
    setProcessingState('build', true);
    setLogs([]);
    await handleBuildAll();
    setProcessingState('build', false);
  }, [handleBuildAll, setLogs, setProcessingState]);

  const handleMutexDemoAction = useCallback(async () => {
    setProcessingState('mutex', true);
    await runSimulation();
    setProcessingState('mutex', false);
  }, [runSimulation, setProcessingState]);

  const handlePackageAction = useCallback(async (...args: Parameters<typeof handlePackage>) => {
      setProcessingState('package', true);
      await handlePackage(...args);
      setProcessingState('package', false);
  }, [handlePackage, setProcessingState]);

  const handleAnalyzeLog = useCallback(async () => {
    return await performAiAction(
        'analyzeLog', 
        'You are a build process expert. Analyze the following terminal build log and provide a concise summary with any potential errors or optimization suggestions. Format your response with markdown.', 
        logs.map(l => `[${l.level}] ${l.message}`).join('\n')
    );
  }, [logs, performAiAction]);
  
  const handleCiCdRun = useCallback(async () => {
    setProcessingState('ci', true);
    setCiStatus('Running');
    addLog('INFO', 'CI/CD Pipeline triggered manually...');

    const steps = [
        { name: 'Install Dependencies', duration: 2000, success: true },
        { name: 'Lint Code', duration: 1500, success: true },
        { name: 'Run Tests', duration: 3000, success: Math.random() > 0.1 }, // 10% chance to fail
        { name: 'Build Project', duration: 4000, success: true },
    ];
    
    let pipelineSuccess = true;
    for (const step of steps) {
        if (!pipelineSuccess && step.name === 'Build Project') {
            addLog('WARN', 'Skipping build step due to previous test failure.');
            break;
        }
        addLog('INFO', `\x1b[36m[CI]\x1b[0m Starting step: ${step.name}`);
        await new Promise(res => setTimeout(res, step.duration));
        if (step.success) {
            addLog('SUCCESS', `\x1b[36m[CI]\x1b[0m Step '${step.name}' completed successfully.`);
        } else {
            addLog('ERROR', `\x1b[36m[CI]\x1b[0m Step '${step.name}' failed.`);
            pipelineSuccess = false;
        }
    }
    
    if (pipelineSuccess) {
        addLog('SUCCESS', '\x1b[32mCI/CD Pipeline finished successfully.\x1b[0m');
        setCiStatus('Passing');
    } else {
        addLog('ERROR', '\x1b[31mCI/CD Pipeline finished with errors.\x1b[0m');
        setCiStatus('Failing');
    }
    
    setProcessingState('ci', false);
}, [addLog, setProcessingState]);


  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* Column 1 */}
        <div className="flex flex-col gap-6">
          <AiDevelopmentCard isProcessing={isProcessing} performAiAction={performAiAction} />
          
          <InfoCard title="Managed State & Mutability" icon={<LockIcon />}>
              <p className="text-xs text-gray-400 mb-4">Demonstrate how Rust's `Mutex` prevents data races by locking state during concurrent access. Run the simulation to see threads safely increment a shared counter.</p>
              <div className="flex items-center justify-center bg-primary-dark border border-border-dark rounded-lg p-6 my-4">
                  <div className="flex flex-col items-center">
                      <span className="text-sm text-gray-400">Shared Counter</span>
                      <span className="text-5xl font-bold text-white my-2">{sharedCounter}</span>
                      <div className={`flex items-center space-x-2 px-3 py-1 rounded-full transition-colors ${isStateLocked ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-accent-green'}`}>
                          <LockIcon className="w-4 h-4" />
                          <span className="text-sm font-semibold">{isStateLocked ? 'Locked' : 'Unlocked'}</span>
                      </div>
                  </div>
              </div>
               <button onClick={handleMutexDemoAction} disabled={isProcessing['mutex']} className="w-full bg-graphql-pink hover:bg-pink-700 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-colors flex items-center justify-center space-x-2">
                  {isProcessing['mutex'] && <SpinnerIcon />}
                  <span>{isProcessing['mutex'] ? 'Simulation Running...' : 'Run Concurrency Simulation'}</span>
              </button>
          </InfoCard>

           <InfoCard title="Live Resource Monitoring" icon={<CubeIcon />}>
              <MetricsChart staticData={metrics} liveData={liveMetrics} />
          </InfoCard>
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-6">
            <ApiBridgeCard
                isProcessing={isProcessing}
                performAiAction={performAiAction}
                rustApiCode={rustApiCode}
                setRustApiCode={setRustApiCode}
            />
            <SecurityAuditCard
                isProcessing={isProcessing}
                performAiAction={performAiAction}
                rustApiCode={rustApiCode}
            />
            <PluginManager plugins={plugins} onPluginsChange={setPlugins} />
        </div>

        {/* Column 3 */}
        <div className="flex flex-col gap-6">
          <BuildsCard 
            targets={targets}
            logs={logs}
            isBuilding={isProcessing['build']}
            isPackaging={isProcessing['package']}
            isAnalyzing={isProcessing['analyzeLog']}
            handleBuildAll={handleBuildSystemAction}
            handleDistributeClick={handleDistributeClick}
            handleAnalyzeLog={handleAnalyzeLog}
          />
          
          <InfoCard title="AI Assistant" icon={<ChatIcon />}>
              <AIAssistantChat addLog={addLog} />
          </InfoCard>
          
          <AppConfigCard
            appConfig={appConfig}
            setAppConfig={setAppConfig}
            isProcessing={isProcessing}
            performAiAction={performAiAction}
            addLog={addLog}
          />

          <ProjectHealthCard 
            isProcessing={isProcessing['ci']}
            ciStatus={ciStatus}
            handleCiCdRun={handleCiCdRun}
          />
        </div>
      </div>

      <DistributionModal
        target={distributionModalTarget}
        onClose={() => setDistributionModalTarget(null)}
        isPackaging={isProcessing['package']}
        onPackage={(format) => {
            if (distributionModalTarget) {
                handlePackageAction(distributionModalTarget, format);
            }
        }}
      />
    </>
  );
};

export default Dashboard;