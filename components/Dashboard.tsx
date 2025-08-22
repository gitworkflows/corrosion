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
import { Modal } from './Modal';

// Icons
import { PlugIcon } from './icons/PlugIcon';
import { CubeIcon } from './icons/CubeIcon';
import { GridIcon } from './icons/GridIcon';
import { CogIcon } from './icons/CogIcon';
import { ShieldIcon } from './icons/ShieldIcon';
import { ScriptIcon } from './icons/ScriptIcon';
import { ChatIcon } from './icons/ChatIcon';
import { LockIcon } from './icons/LockIcon';
import { GithubIcon } from './icons/GithubIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';


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
  const [ciStatus, setCiStatus] = useState<'Passing' | 'Failing' | 'Running'>('Passing');
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [securityAuditResult, setSecurityAuditResult] = useState('');

  // Custom Hooks for complex logic
  const { isProcessing, performAiAction, setProcessingState } = useAiApi(addLog);
  
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

  const handleAnalyzeLog = useCallback(async () => {
    return await performAiAction(
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
    setSecurityAuditResult(result);
    setIsSecurityModalOpen(true);
  }, [performAiAction, rustApiCode]);

  const handleTogglePlugin = useCallback((pluginId: string) => {
    setPlugins(prev => prev.map(p => p.id === pluginId ? { ...p, enabled: !p.enabled } : p));
  }, []);

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
          <InfoCard title="JS-Rust API Bridge" icon={<PlugIcon />}>
              <CodeEditor language="rust" code={rustApiCode} setCode={setRustApiCode} height="h-40" />
              <div className="grid grid-cols-2 gap-2 my-2">
                  <button onClick={() => handleApiBridgeAi('docstrings')} disabled={isProcessing['docstrings']} className="bg-graphql-pink/80 hover:bg-graphql-pink disabled:bg-gray-600 text-white font-bold py-2 px-2 rounded-md transition-colors text-xs flex items-center justify-center space-x-2">
                       {isProcessing['docstrings'] && <SpinnerIcon className="w-4 h-4" />}
                       <span>{isProcessing['docstrings'] ? '...' : 'Generate Docstrings'}</span>
                  </button>
                  <button onClick={() => handleApiBridgeAi('snippet')} disabled={isProcessing['snippet']} className="bg-graphql-pink/80 hover:bg-graphql-pink disabled:bg-gray-600 text-white font-bold py-2 px-2 rounded-md transition-colors text-xs flex items-center justify-center space-x-2">
                      {isProcessing['snippet'] && <SpinnerIcon className="w-4 h-4" />}
                      <span>{isProcessing['snippet'] ? '...' : 'Generate JS Snippet'}</span>
                  </button>
              </div>
              <CodeEditor language="javascript" code={jsApiCode} setCode={setJsApiCode} isReadOnly={false} height="h-24" />
          </InfoCard>

          <InfoCard title="API Security Audit" icon={<ShieldIcon />}>
              <p className="text-xs text-gray-400 mb-4">The AI will analyze the Rust commands from the API bridge panel for potential security vulnerabilities like path traversal or command injection.</p>
              <button onClick={handleSecurityAudit} disabled={isProcessing['security']} className="w-full bg-rust-orange hover:bg-orange-700 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-colors flex items-center justify-center space-x-2">
                  {isProcessing['security'] && <SpinnerIcon />}
                  <span>{isProcessing['security'] ? 'Analyzing...' : 'Run AI Security Audit'}</span>
              </button>
          </InfoCard>

          <InfoCard title="Plugin Manager" icon={<GridIcon />}>
            <p className="text-xs text-gray-400 mb-4">Enable or disable plugins to extend core functionality. The build process will include code for active plugins.</p>
            <div className="space-y-2">
              {plugins.map((plugin) => (
                <div key={plugin.id} className="bg-primary-dark border border-border-dark rounded-md transition-all duration-200">
                  <button
                    onClick={() => setExpandedPlugin(expandedPlugin === plugin.id ? null : plugin.id)}
                    className="w-full flex items-center justify-between p-3 text-left"
                  >
                    <span className="font-semibold text-gray-200">{plugin.name}</span>
                    <div className="flex items-center space-x-3">
                      <label htmlFor={`plugin-toggle-${plugin.id}`} className="flex items-center cursor-pointer" onClick={(e) => e.stopPropagation()}>
                        <div className="relative">
                          <input id={`plugin-toggle-${plugin.id}`} type="checkbox" className="sr-only" checked={plugin.enabled} onChange={() => handleTogglePlugin(plugin.id)} />
                          <div className={`block w-10 h-6 rounded-full transition-colors ${plugin.enabled ? 'bg-accent-blue' : 'bg-gray-600'}`}></div>
                          <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${plugin.enabled ? 'transform translate-x-4' : ''}`}></div>
                        </div>
                      </label>
                      <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${expandedPlugin === plugin.id ? 'rotate-180' : ''}`} />
                    </div>
                  </button>
                  {expandedPlugin === plugin.id && (
                    <div className="p-3 border-t border-border-dark">
                      <p className="text-xs text-gray-400 mb-3">{plugin.description}</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {plugin.components.map(comp => (
                          <div key={comp.type} className="flex items-center space-x-2">
                            <span className={`w-2 h-2 rounded-full ${comp.status === 'Included' ? 'bg-accent-green' : 'bg-gray-500'}`}></span>
                            <span className="text-gray-400">{comp.type}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </InfoCard>
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

          <InfoCard title="Application Configuration" icon={<CogIcon />}>
              <CodeEditor language="json" code={appConfig} setCode={setAppConfig} height="h-40"/>
              <div className="flex gap-2 mt-2">
                  <input type="text" placeholder="e.g., 'Change title to My Tauri App'" onChange={e => setConfigPrompt(e.target.value)} className="flex-grow p-2 bg-primary-dark border border-border-dark rounded-md focus:ring-2 focus:ring-accent-blue focus:outline-none font-mono text-xs" />
                  <button onClick={handleConfigAi} disabled={isProcessing['config']} className="bg-wasm-purple hover:bg-purple-700 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-colors text-xs flex items-center justify-center space-x-2">
                      {isProcessing['config'] && <SpinnerIcon className="w-4 h-4" />}
                      <span>{isProcessing['config'] ? '...' : 'Apply'}</span>
                  </button>
              </div>
          </InfoCard>

          <InfoCard title="Project Health & CI/CD" icon={<GithubIcon />}>
            <div className="flex items-center justify-between p-3 bg-primary-dark rounded-md border border-border-dark mb-4">
                <span className="text-sm font-semibold">CI/CD Status</span>
                <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                    ciStatus === 'Passing' ? 'bg-green-500/20 text-accent-green' :
                    ciStatus === 'Failing' ? 'bg-red-500/20 text-red-500' :
                    'bg-blue-500/20 text-accent-blue animate-pulse'
                }`}>
                    {ciStatus}
                </span>
            </div>
            <div className="space-y-2 mb-4 text-sm">
                <a href="./docs/contributing.md" target="_blank" rel="noopener noreferrer" className="block text-accent-blue hover:underline">› Contribution Guide</a>
                <a href="./docs/roadmap.md" target="_blank" rel="noopener noreferrer" className="block text-accent-blue hover:underline">› Project Roadmap</a>
                <a href="./docs/labels.md" target="_blank" rel="noopener noreferrer" className="block text-accent-blue hover:underline">› Issue Labels Guide</a>
            </div>
            <p className="text-xs text-gray-500 text-center mb-4">
              Automated releases are triggered by pushing a version tag.
            </p>
            <button onClick={handleCiCdRun} disabled={isProcessing['ci']} className="w-full mt-auto bg-gray-600 hover:bg-gray-500 disabled:bg-gray-800 text-white font-bold py-2 px-4 rounded-md transition-colors flex items-center justify-center space-x-2">
                {isProcessing['ci'] && <SpinnerIcon />}
                <span>{isProcessing['ci'] ? 'Pipeline Running...' : 'Run CI/CD Pipeline'}</span>
            </button>
          </InfoCard>
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
      <Modal isOpen={isSecurityModalOpen} onClose={() => setIsSecurityModalOpen(false)} title="AI Security Audit Results">
          {securityAuditResult}
      </Modal>
    </>
  );
};

export default Dashboard;