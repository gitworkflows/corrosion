import React, { useState, useCallback } from 'react';
import type { LogEntry, Plugin } from '../types';

// Constants
import { INITIAL_PLUGINS, INITIAL_RUST_API_CODE, INITIAL_JS_API_CODE, INITIAL_APP_CONFIG, INITIAL_BUILD_SCRIPT } from '../constants';

// Hooks
import { useAiApi } from '../hooks/useAiApi';
import { useBuildSystem } from '../hooks/useBuildSystem';
import { useMutexDemo } from '../hooks/useMutexDemo';

// Components
import CodeEditor from './CodeEditor';
import MetricsChart from './MetricsChart';
import { InfoCard } from './InfoCard';
import { AIAssistantChat } from './AIAssistantChat';
import DistributionModal from './DistributionModal';
import { AiDevelopmentCard } from './AiDevelopmentCard';
import { BuildsCard } from './BuildsCard';
import { SpinnerIcon } from './icons/SpinnerIcon';

// Icons
import { PlugIcon } from './icons/PlugIcon';
import { CubeIcon } from './icons/CubeIcon';
import { GridIcon } from './icons/GridIcon';
import { CogIcon } from './icons/CogIcon';
import { ShieldIcon } from './icons/ShieldIcon';
import { ScriptIcon } from './icons/ScriptIcon';
import { ChatIcon } from './icons/ChatIcon';
import { LockIcon } from './icons/LockIcon';


const Dashboard: React.FC = () => {
  // Master log state
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const addLog = useCallback((level: LogEntry['level'], message: string) => {
    setLogs(prev => [...prev, { id: Date.now() + Math.random(), timestamp: new Date().toLocaleTimeString(), level, message }]);
  }, []);

  // State for simple components that remain in Dashboard
  const [rustApiCode, setRustApiCode] = useState(INITIAL_RUST_API_CODE);
  const [jsApiCode, setJsApiCode] = useState(INITIAL_JS_API_CODE);
  const [appConfig, setAppConfig] = useState(INITIAL_APP_CONFIG);
  const [buildScript, setBuildScript] = useState(INITIAL_BUILD_SCRIPT);
  const [plugins, setPlugins] = useState<Plugin[]>(INITIAL_PLUGINS);
  const [expandedPlugin, setExpandedPlugin] = useState<string | null>(null);
  const [configPrompt, setConfigPrompt] = useState('');
  const [scriptPrompt, setScriptPrompt] = useState('');

  // Custom Hooks for complex logic
  const { isProcessing: isAiProcessing, performAiAction, setProcessingState } = useAiApi(addLog);
  
  const {
    targets, metrics, liveMetrics, distributionModalTarget, setDistributionModalTarget, handleBuildAll, handleDistributeClick, handlePackage
  } = useBuildSystem(addLog, appConfig, plugins);
  
  const { sharedCounter, isStateLocked, runSimulation } = useMutexDemo(addLog);

  // Handlers that use the hooks
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

  const handleAnalyzeLog = useCallback(() => {
    return performAiAction(
        'analyzeLog', 
        'You are a build process expert. Analyze the following terminal build log and provide a concise summary with any potential errors or optimization suggestions. Format your response with markdown.', 
        logs.map(l => `[${l.level}] ${l.message}`).join('\n')
    );
  }, [logs, performAiAction]);

  const handleApiBridgeAi = useCallback(async (action: 'docstrings' | 'snippet') => {
      if (action === 'docstrings') {
          const result = await performAiAction('docstrings', 'You are a Rust expert. Generate idiomatic Rust docstrings for the following functions. Only output the full, updated code with the new docstrings.', rustApiCode);
          setRustApiCode(result);
      } else {
          const result = await performAiAction('snippet', 'You are a TypeScript expert. Given the following Rust tauri commands, generate the corresponding TypeScript functions using `@tauri-apps/api/tauri`. Only output the raw TypeScript code.', rustApiCode);
          setJsApiCode(result);
      }
  }, [performAiAction, rustApiCode]);

  const handleConfigAi = useCallback(async () => {
      const result = await performAiAction('config', 'You are a configuration expert. The user provides a JSON config and a request. Modify the JSON to satisfy the request. ONLY output the raw, updated JSON object.', `CONFIG:\n${appConfig}\n\nREQUEST:\n${configPrompt}`);
      try {
        JSON.parse(result); // Validate JSON
        setAppConfig(result);
      } catch {
        addLog('ERROR', 'AI returned invalid JSON for configuration.');
      }
  }, [performAiAction, appConfig, configPrompt, addLog]);

  const handleScriptAi = useCallback(async () => {
    const result = await performAiAction('script', 'You are a shell scripting expert. Generate a `build.sh` script based on the user\'s request. Only output the raw script code without markdown fences.', scriptPrompt);
    setBuildScript(result);
  }, [performAiAction, scriptPrompt]);
  
  const handleSecurityAudit = useCallback(async () => {
    const result = await performAiAction('security', 'You are a security expert specializing in Rust and web applications. Analyze the following Rust Tauri commands for potential security vulnerabilities like command injection, path traversal, or excessive permissions. Provide a concise summary of findings and recommendations. If no issues are found, state that. Use markdown for formatting.', rustApiCode);
    alert(`AI Security Audit:\n\n${result}`); // Keeping alert for this one for brevity, could be a modal.
  }, [performAiAction, rustApiCode]);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* Column 1 */}
        <div className="flex flex-col gap-6">
          <AiDevelopmentCard isProcessing={isAiProcessing} performAiAction={performAiAction} />
          
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
               <button onClick={handleMutexDemoAction} disabled={isAiProcessing['mutex']} className="w-full bg-graphql-pink hover:bg-pink-700 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-colors flex items-center justify-center space-x-2">
                  {isAiProcessing['mutex'] && <SpinnerIcon />}
                  <span>{isAiProcessing['mutex'] ? 'Simulation Running...' : 'Run Concurrency Simulation'}</span>
              </button>
          </InfoCard>

           <InfoCard title="Live Resource Monitoring" icon={<CubeIcon />}>
              <MetricsChart staticData={metrics} liveData={liveMetrics} />
          </InfoCard>
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-6">
          <InfoCard title="JS-Rust API Bridge" icon={<PlugIcon />}>
              <CodeEditor language="rust" code={rustApiCode} setCode={setRustApiCode} height="h-40" />
              <div className="grid grid-cols-2 gap-2 my-2">
                  <button onClick={() => handleApiBridgeAi('docstrings')} disabled={isAiProcessing['docstrings']} className="bg-graphql-pink/80 hover:bg-graphql-pink disabled:bg-gray-600 text-white font-bold py-2 px-2 rounded-md transition-colors text-xs flex items-center justify-center space-x-2">
                       {isAiProcessing['docstrings'] && <SpinnerIcon className="w-4 h-4" />}
                       <span>{isAiProcessing['docstrings'] ? '...' : 'Generate Docstrings'}</span>
                  </button>
                  <button onClick={() => handleApiBridgeAi('snippet')} disabled={isAiProcessing['snippet']} className="bg-graphql-pink/80 hover:bg-graphql-pink disabled:bg-gray-600 text-white font-bold py-2 px-2 rounded-md transition-colors text-xs flex items-center justify-center space-x-2">
                      {isAiProcessing['snippet'] && <SpinnerIcon className="w-4 h-4" />}
                      <span>{isAiProcessing['snippet'] ? '...' : 'Generate JS Snippet'}</span>
                  </button>
              </div>
              <CodeEditor language="javascript" code={jsApiCode} setCode={setJsApiCode} isReadOnly={false} height="h-24" />
          </InfoCard>

          <InfoCard title="API Security Audit" icon={<ShieldIcon />}>
              <p className="text-xs text-gray-400 mb-4">The AI will analyze the Rust commands from the API bridge panel for potential security vulnerabilities like path traversal or command injection.</p>
              <button onClick={handleSecurityAudit} disabled={isAiProcessing['security']} className="w-full bg-rust-orange hover:bg-orange-700 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-colors flex items-center justify-center space-x-2">
                  {isAiProcessing['security'] && <SpinnerIcon />}
                  <span>{isAiProcessing['security'] ? 'Analyzing...' : 'Run AI Security Audit'}</span>
              </button>
          </InfoCard>

          <InfoCard title="Application Configuration" icon={<CogIcon />}>
              <CodeEditor language="json" code={appConfig} setCode={setAppConfig} height="h-40"/>
              <div className="flex gap-2 mt-2">
                  <input type="text" placeholder="e.g., 'Change title to My Tauri App'" onChange={e => setConfigPrompt(e.target.value)} className="flex-grow p-2 bg-primary-dark border border-border-dark rounded-md focus:ring-2 focus:ring-accent-blue focus:outline-none font-mono text-xs" />
                  <button onClick={handleConfigAi} disabled={isAiProcessing['config']} className="bg-wasm-purple hover:bg-purple-700 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-colors text-xs flex items-center justify-center space-x-2">
                      {isAiProcessing['config'] && <SpinnerIcon className="w-4 h-4" />}
                      <span>{isAiProcessing['config'] ? '...' : 'Apply'}</span>
                  </button>
              </div>
          </InfoCard>
        </div>

        {/* Column 3 */}
        <div className="flex flex-col gap-6">
          <BuildsCard 
            targets={targets}
            logs={logs}
            isBuilding={isAiProcessing['build']}
            isPackaging={isAiProcessing['package']}
            isAnalyzing={isAiProcessing['analyzeLog']}
            handleBuildAll={handleBuildSystemAction}
            handleDistributeClick={handleDistributeClick}
            handleAnalyzeLog={handleAnalyzeLog}
          />
          
          <InfoCard title="AI Assistant" icon={<ChatIcon />}>
              <AIAssistantChat addLog={addLog} />
          </InfoCard>
        </div>
      </div>
      <DistributionModal
        target={distributionModalTarget}
        onClose={() => setDistributionModalTarget(null)}
        isPackaging={isAiProcessing['package']}
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
