import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { PerformanceMetric, LogEntry, BuildTarget, BuildStatus, Plugin, ApiCommand, DistributionFormat } from '../types';
import { callGemini } from '../services/geminiService';
import CodeEditor from './CodeEditor';
import TerminalOutput from './TerminalOutput';
import MetricsChart from './MetricsChart';
import { InfoCard } from './InfoCard';
import { AIAssistantChat } from './AIAssistantChat';
import DistributionModal from './DistributionModal';

// Icons
import { BrainCircuitIcon } from './icons/BrainCircuitIcon';
import { PlugIcon } from './icons/PlugIcon';
import { CpuChipIcon } from './icons/CpuChipIcon';
import { CubeIcon } from './icons/CubeIcon';
import { GridIcon } from './icons/GridIcon';
import { CogIcon } from './icons/CogIcon';
import { ShieldIcon } from './icons/ShieldIcon';
import { ScriptIcon } from './icons/ScriptIcon';
import { ChatIcon } from './icons/ChatIcon';
import { LockIcon } from './icons/LockIcon';
import { LinuxIcon } from './icons/LinuxIcon';
import { AppleIcon } from './icons/AppleIcon';
import { WindowsIcon } from './icons/WindowsIcon';
import { AndroidIcon } from './icons/AndroidIcon';
import { PackageIcon } from './icons/PackageIcon';
import { AppStoreIcon } from './icons/AppStoreIcon';
import { GooglePlayIcon } from './icons/GooglePlayIcon';

const INITIAL_RUST_CODE = `// Enter a prompt on the "Generate" tab and click "Generate Code"
// to see the AI in action!
fn main() {
    println!("Hello, World!");
}
`;
const INITIAL_RUST_API_CODE = `// In Rust, define "commands" that can be invoked from the frontend.
// The Security Audit panel below will automatically analyze them.
// Try adding a new command that takes a file path!
#[tauri::command]
fn greet(name: &str) -> String {
  format!("Hello, {}! You've been greeted from Rust!", name)
}
`;
const INITIAL_JS_API_CODE = `// Use the buttons below to generate JS snippets or docstrings for the Rust API.`;
const INITIAL_APP_CONFIG = `{"appName":"My Awesome App","version":"1.0.0","identifier":"com.example.awesome","window":{"title":"My App","width":800,"height":600}}`;
const INITIAL_BUILD_SCRIPT = `#!/bin/bash
# Describe the build steps you want in the prompt above.
# The AI will generate a script here.

echo "Starting build..."
cargo build --release
echo "Build complete."
`;

const INITIAL_METRICS: PerformanceMetric[] = [ { name: 'App Size (MB)', value: 2.5, fill: '#654FF0' } ];

const INITIAL_TARGETS: BuildTarget[] = [
  { platform: 'Linux', status: 'Not Started', icon: <LinuxIcon className="w-5 h-5" />, arch: 'x86_64', bindings: 'WebKitGTK', output: 'app.bin', distributionFormats: [
      { id: 'appimage', name: 'AppImage', icon: <PackageIcon className="w-5 h-5" />},
      { id: 'snap', name: 'Snap', icon: <PackageIcon className="w-5 h-5" />},
      { id: 'deb', name: 'Debian', icon: <PackageIcon className="w-5 h-5" />},
  ]},
  { platform: 'macOS', status: 'Not Started', icon: <AppleIcon className="w-5 h-5" />, arch: 'aarch64', bindings: 'WKWebView', output: 'app.app', distributionFormats: [
      { id: 'dmg', name: 'DMG Installer', icon: <PackageIcon className="w-5 h-5" />},
      { id: 'app_store', name: 'App Store', icon: <AppStoreIcon className="w-5 h-5" />},
  ]},
  { platform: 'Windows', status: 'Not Started', icon: <WindowsIcon className="w-5 h-5" />, arch: 'x86_64', bindings: 'WebView2', output: 'app.exe', distributionFormats: [
       { id: 'msi', name: 'MSI Installer', icon: <PackageIcon className="w-5 h-5" />},
       { id: 'ms_store', name: 'Microsoft Store', icon: <WindowsIcon className="w-5 h-5" />},
  ]},
  { platform: 'Android', status: 'Not Started', icon: <AndroidIcon className="w-5 h-5" />, arch: 'arm64', bindings: 'WebView', output: 'app.apk', distributionFormats: [
      { id: 'google_play', name: 'Google Play', icon: <GooglePlayIcon className="w-5 h-5" />},
      { id: 'apk', name: 'APK Sideload', icon: <PackageIcon className="w-5 h-5" />},
  ]},
  { platform: 'iOS', status: 'Not Started', icon: <AppleIcon className="w-5 h-5" />, arch: 'aarch64', bindings: 'WKWebView', output: 'app.ipa', distributionFormats: [
      { id: 'app_store_ios', name: 'App Store', icon: <AppStoreIcon className="w-5 h-5" />},
      { id: 'testflight', name: 'TestFlight', icon: <AppleIcon className="w-5 h-5" />},
  ]},
];
const INITIAL_PLUGINS: Plugin[] = [
    { 
        id: 'fs', name: 'File System Access', description: 'Read and write files on the host system.', enabled: true,
        components: [
            { type: 'Rust (Core)', status: 'Included' },
            { type: 'JS (Bindings)', status: 'Included' },
            { type: 'Kotlin (Android)', status: 'Included' },
            { type: 'Swift (iOS)', status: 'Included' },
        ]
    },
    { 
        id: 'os', name: 'OS Notifications', description: 'Send native desktop notifications.', enabled: true,
        components: [
            { type: 'Rust (Core)', status: 'Included' },
            { type: 'JS (Bindings)', status: 'Included' },
            { type: 'Kotlin (Android)', status: 'Included' },
            { type: 'Swift (iOS)', status: 'Not Applicable' },
        ]
    },
    { 
        id: 'db', name: 'Database Connector', description: 'Connect to local SQLite databases.', enabled: false,
        components: [
            { type: 'Rust (Core)', status: 'Included' },
            { type: 'JS (Bindings)', status: 'Included' },
            { type: 'Kotlin (Android)', status: 'Not Applicable' },
            { type: 'Swift (iOS)', status: 'Not Applicable' },
        ]
    },
    { 
        id: 'shell', name: 'Shell Access', description: 'Execute shell commands (high-risk).', enabled: false,
        components: [
            { type: 'Rust (Core)', status: 'Included' },
            { type: 'JS (Bindings)', status: 'Included' },
            { type: 'Kotlin (Android)', status: 'Not Applicable' },
            { type: 'Swift (iOS)', status: 'Not Applicable' },
        ]
    },
];
type DevCardTab = 'Generate' | 'Refactor' | 'Test' | 'Explain';

const getStatusColor = (status: BuildStatus) => {
  switch (status) {
    case 'Success': return 'bg-green-500/20 text-accent-green';
    case 'Failed': return 'bg-red-500/20 text-red-500';
    case 'Building': return 'bg-blue-500/20 text-accent-blue animate-pulse';
    case 'Queued': return 'bg-yellow-500/20 text-yellow-400';
    default: return 'bg-gray-700/20 text-gray-400';
  }
};

const Dashboard: React.FC = () => {
  // State for all components
  const [rustCode, setRustCode] = useState(INITIAL_RUST_CODE);
  const [rustApiCode, setRustApiCode] = useState(INITIAL_RUST_API_CODE);
  const [jsApiCode, setJsApiCode] = useState(INITIAL_JS_API_CODE);
  const [appConfig, setAppConfig] = useState(INITIAL_APP_CONFIG);
  const [buildScript, setBuildScript] = useState(INITIAL_BUILD_SCRIPT);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState<Record<string, boolean>>({});
  const [prompt, setPrompt] = useState('Generate a Rust function that calculates the factorial of a number.');
  const [metrics, setMetrics] = useState<PerformanceMetric[]>(INITIAL_METRICS);
  const [targets, setTargets] = useState<BuildTarget[]>(INITIAL_TARGETS);
  const [plugins, setPlugins] = useState<Plugin[]>(INITIAL_PLUGINS);
  const [liveMetrics, setLiveMetrics] = useState<{ time: string; cpu: number; memory: number }[]>([]);
  const liveMetricsInterval = useRef<number | null>(null);
  const [devCardTab, setDevCardTab] = useState<DevCardTab>('Generate');
  const [securityAuditResult, setSecurityAuditResult] = useState('');
  const [distributionModalTarget, setDistributionModalTarget] = useState<BuildTarget | null>(null);
  const [expandedPlugin, setExpandedPlugin] = useState<string | null>(null);
  const [sharedCounter, setSharedCounter] = useState(0);
  const [isStateLocked, setIsStateLocked] = useState(false);


  const setProcessingState = (key: string, value: boolean) => {
    setIsProcessing(prev => ({ ...prev, [key]: value }));
  };

  const addLog = useCallback((level: LogEntry['level'], message: string) => {
    setLogs(prev => [...prev, { id: Date.now() + Math.random(), timestamp: new Date().toLocaleTimeString(), level, message }]);
  }, []);

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

  const handleAiAction = useCallback(async (key: string, systemInstruction: string, userPrompt: string, onSuccess: (response: string) => void) => {
    setProcessingState(key, true);
    addLog('INFO', `Requesting AI for: ${key}...`);
    const result = await callGemini({ prompt: userPrompt, systemInstruction });
    onSuccess(result);
    setProcessingState(key, false);
    addLog('SUCCESS', `AI task '${key}' completed successfully.`);
  }, [addLog]);

  const handleDevAiAction = useCallback((tab: DevCardTab) => {
    const instructions: Record<DevCardTab, string> = {
        Generate: 'You are an expert Rust programmer. Your task is to generate clean, high-quality Rust code based on the user\'s request. ONLY output the raw Rust code. Do NOT include markdown fences or explanations.',
        Refactor: 'You are an expert Rust programmer. Refactor the following Rust code for clarity, performance, and idiomatic style. ONLY output the refactored Rust code. Do NOT include markdown fences or explanations.',
        Test: 'You are an expert Rust programmer. Generate a comprehensive suite of unit tests for the following Rust code using the standard `#[cfg(test)]` mod pattern. ONLY output the Rust test code. Do NOT include markdown fences or explanations.',
        Explain: 'You are an expert code reviewer. Explain the following Rust code in a clear, concise, and easy-to-understand way. Use markdown for formatting your explanation.'
    };
    const currentCode = tab === 'Generate' ? prompt : rustCode;
    handleAiAction(tab, instructions[tab], currentCode, setRustCode);
  }, [prompt, rustCode, handleAiAction]);

  const handleBuildAll = useCallback(async () => {
    setProcessingState('build', true);
    setLogs([]);
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
    setProcessingState('build', false);
    stopLiveMetrics();
  }, [addLog, startLiveMetrics, stopLiveMetrics, appConfig, plugins]);
  
  const handleDistributeClick = useCallback((target: BuildTarget) => {
    setDistributionModalTarget(target);
  }, []);

  const handlePackage = useCallback((target: BuildTarget, format: DistributionFormat) => {
    setDistributionModalTarget(null);
    setProcessingState('package', true);
    addLog('INFO', `Starting packaging for ${target.platform} as ${format.name}...`);
    const packagingSteps = [
      `Validating assets for ${format.name}...`,
      `Running packaging script for ${format.id}...`,
      ...(format.id.includes('store') || format.id === 'dmg' ? [`Signing application with developer certificate...`] : []),
      ...(format.id === 'dmg' ? [`Notarizing with Apple...`] : []),
      `Finalizing package...`
    ];

    packagingSteps.forEach((step, i) => {
        setTimeout(() => {
            addLog('INFO', step);
        }, (i + 1) * 800);
    });

    setTimeout(() => {
        addLog('SUCCESS', `Packaging complete! Output: /dist/release/${target.output.split('.')[0]}.${format.id}`);
        setProcessingState('package', false);
    }, packagingSteps.length * 800 + 500);
  }, [addLog]);

  const handleMutexDemo = useCallback(() => {
    setProcessingState('mutex', true);
    const threads = ['Thread A', 'Thread B'];
    let currentDelay = 0;

    const runThread = (threadName: string, duration: number) => {
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
    };

    addLog('INFO', `Starting Mutex demo with 2 threads.`);
    runThread('Thread A', 1500);
    runThread('Thread B', 1000);
    setTimeout(() => {
      addLog('SUCCESS', 'Mutex demo finished. State is consistent.');
      setProcessingState('mutex', false);
    }, currentDelay);

  }, [addLog]);


  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* Column 1 */}
        <div className="flex flex-col gap-6">
          <InfoCard title="AI-Powered Rust Development" icon={<BrainCircuitIcon />}>
              <div className="flex border-b border-border-dark mb-4">
                  {(['Generate', 'Refactor', 'Test', 'Explain'] as DevCardTab[]).map(tab => (
                      <button key={tab} onClick={() => setDevCardTab(tab)} className={`px-4 py-2 text-sm font-semibold transition-colors ${devCardTab === tab ? 'text-accent-blue border-b-2 border-accent-blue' : 'text-gray-400 hover:text-white'}`}>{tab}</button>
                  ))}
              </div>
              {devCardTab === 'Generate' && <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe the Rust code you want..." className="w-full p-2 mb-4 bg-primary-dark border border-border-dark rounded-md focus:ring-2 focus:ring-accent-blue focus:outline-none font-mono text-sm" rows={2}/>}
              <button onClick={() => handleDevAiAction(devCardTab)} disabled={isProcessing[devCardTab]} className="w-full bg-accent-blue hover:bg-blue-600 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-colors mb-4">
                  {isProcessing[devCardTab] ? `Running ${devCardTab}...` : `Run ${devCardTab}`}
              </button>
              <CodeEditor language={devCardTab === 'Explain' ? 'markdown' : 'rust'} code={rustCode} setCode={setRustCode} />
          </InfoCard>
          
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
               <button onClick={handleMutexDemo} disabled={isProcessing['mutex']} className="w-full bg-graphql-pink hover:bg-pink-700 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-colors">
                  {isProcessing['mutex'] ? 'Simulation Running...' : 'Run Concurrency Simulation'}
              </button>
          </InfoCard>
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-6">
          <InfoCard title="JS-Rust API Bridge & Live Preview" icon={<PlugIcon />}>
              <CodeEditor language="rust" code={rustApiCode} setCode={setRustApiCode} height="h-48" />
              <div className="grid grid-cols-2 gap-2 my-2">
                  <button onClick={() => handleAiAction('docstrings', 'You are a Rust expert. Generate idiomatic Rust docstrings for the following functions. Only output the full, updated code with the new docstrings.', rustApiCode, setRustApiCode)} disabled={isProcessing['docstrings']} className="bg-graphql-pink/80 hover:bg-graphql-pink disabled:bg-gray-600 text-white font-bold py-2 px-2 rounded-md transition-colors text-xs">
                      {isProcessing['docstrings'] ? '...' : 'Generate Docstrings'}
                  </button>
                  <button onClick={() => handleAiAction('snippet', 'You are a TypeScript expert. Given the following Rust tauri commands, generate the corresponding TypeScript functions using `@tauri-apps/api/tauri`. Only output the raw TypeScript code.', rustApiCode, setJsApiCode)} disabled={isProcessing['snippet']} className="bg-graphql-pink/80 hover:bg-graphql-pink disabled:bg-gray-600 text-white font-bold py-2 px-2 rounded-md transition-colors text-xs">
                      {isProcessing['snippet'] ? '...' : 'Generate JS Snippet'}
                  </button>
              </div>
              <CodeEditor language="javascript" code={jsApiCode} setCode={setJsApiCode} isReadOnly={false} height="h-32" />
          </InfoCard>

          <InfoCard title="Plugin Manager" icon={<GridIcon />}>
             <p className="text-xs text-gray-400 mb-2">Enable plugins to extend the core functionality. Builds for mobile will automatically include native Kotlin/Swift components from active plugins.</p>
             <div className="space-y-2">
                {plugins.map(plugin => (
                    <div key={plugin.id} className="bg-primary-dark border border-border-dark rounded-md p-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input type="checkbox" checked={plugin.enabled} onChange={() => setPlugins(prev => prev.map(p => p.id === plugin.id ? {...p, enabled: !p.enabled} : p))} className="h-4 w-4 rounded bg-secondary-dark border-border-dark text-accent-blue focus:ring-accent-blue" />
                                <div className="ml-3">
                                    <p className="text-sm font-semibold text-gray-200">{plugin.name}</p>
                                    <p className="text-xs text-gray-400">{plugin.description}</p>
                                </div>
                            </div>
                            <button onClick={() => setExpandedPlugin(prev => prev === plugin.id ? null : plugin.id)} className="text-gray-400 hover:text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 transition-transform ${expandedPlugin === plugin.id ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            </button>
                        </div>
                        {expandedPlugin === plugin.id && (
                            <div className="mt-3 pt-3 border-t border-border-dark space-y-1">
                                {plugin.components.map(comp => (
                                    <div key={comp.type} className="flex items-center justify-between text-xs">
                                        <span className="text-gray-400">{comp.type}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${comp.status === 'Included' ? 'bg-green-500/20 text-accent-green' : 'bg-gray-700/50 text-gray-400'}`}>{comp.status}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
             </div>
          </InfoCard>

          <InfoCard title="Application Configuration" icon={<CogIcon />}>
              <CodeEditor language="json" code={appConfig} setCode={setAppConfig} height="h-48"/>
              <div className="flex gap-2 mt-2">
                  <input
                      type="text"
                      placeholder="e.g., 'Change title to My Tauri App'"
                      className="flex-grow p-2 bg-primary-dark border border-border-dark rounded-md focus:ring-2 focus:ring-accent-blue focus:outline-none font-mono text-xs"
                      onChange={e => setPrompt(e.target.value)} // Re-using prompt state
                  />
                  <button onClick={() => handleAiAction('config', 'You are a configuration expert. The user provides a JSON config and a request. Modify the JSON to satisfy the request. ONLY output the raw, updated JSON object.', `CONFIG:\n${appConfig}\n\nREQUEST:\n${prompt}`, setAppConfig)} disabled={isProcessing['config']} className="bg-wasm-purple hover:bg-purple-700 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-colors text-xs">
                      {isProcessing['config'] ? '...' : 'Apply'}
                  </button>
              </div>
          </InfoCard>
        </div>

        {/* Column 3 */}
        <div className="flex flex-col gap-6">
          <InfoCard title="Cross-Platform Builds" icon={<CpuChipIcon />}>
              <button onClick={handleBuildAll} disabled={isProcessing['build']} className="w-full bg-rust-orange hover:bg-orange-700 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-colors mb-4">
                  {isProcessing['build'] ? 'Building All...' : 'Build All Targets'}
              </button>
              <div className="space-y-2 mb-4">
                  {targets.map((target) => (
                  <div key={target.platform} className="flex items-center justify-between p-2 bg-primary-dark rounded-md border border-border-dark">
                      <div className="flex items-center space-x-3"><div className="text-gray-400">{target.icon}</div><span className="font-mono text-sm text-gray-300">{target.platform}</span></div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${getStatusColor(target.status)}`}>{target.status}</span>
                        {target.status === 'Success' && (
                          <button onClick={() => handleDistributeClick(target)} className="bg-accent-blue/80 hover:bg-accent-blue text-white font-bold px-3 py-1 rounded-md text-xs transition-colors">
                            Distribute
                          </button>
                        )}
                      </div>
                  </div>
                  ))}
              </div>
              <TerminalOutput logs={logs} />
              {logs.length > 0 && !isProcessing['build'] && <button onClick={() => handleAiAction('analyzeLog', 'You are a build process expert. Analyze the following terminal build log and provide a concise summary with any potential errors or optimization suggestions.', logs.map(l => l.message).join('\n'), (res) => alert(`AI Analysis:\n\n${res}`))} disabled={isProcessing['analyzeLog']} className="mt-2 w-full bg-gray-600 hover:bg-gray-500 disabled:bg-gray-800 text-white font-bold py-2 px-4 rounded-md transition-colors text-xs">
                  {isProcessing['analyzeLog'] ? 'Analyzing...' : 'Analyze Build Log with AI'}
              </button>}
          </InfoCard>
          
          <InfoCard title="AI Assistant" icon={<ChatIcon />}>
              <AIAssistantChat addLog={addLog} />
          </InfoCard>
          
          <InfoCard title="Live Resource Monitoring" icon={<CubeIcon />}>
              <MetricsChart staticData={metrics} liveData={liveMetrics} />
          </InfoCard>
        </div>
      </div>
      <DistributionModal
        target={distributionModalTarget}
        onClose={() => setDistributionModalTarget(null)}
        onPackage={(format) => {
            if (distributionModalTarget) {
                handlePackage(distributionModalTarget, format);
            }
        }}
      />
    </>
  );
};

export default Dashboard;