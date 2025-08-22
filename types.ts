export interface PerformanceMetric {
  name: string;
  value: number;
  fill: string;
}

export interface LogEntry {
  id: number;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS';
  message: string;
}

export type BuildPlatform = 'Linux' | 'macOS' | 'Windows' | 'Android' | 'iOS';
export type BuildStatus = 'Queued' | 'Building' | 'Success' | 'Failed' | 'Not Started';

export interface DistributionFormat {
    id: string;
    name: string;
    icon: React.ReactNode;
}

export interface BuildTarget {
  platform: BuildPlatform;
  status: BuildStatus;
  icon: React.ReactNode;
  arch: string;
  bindings: string;
  output: string;
  distributionFormats: DistributionFormat[];
}

export type PluginComponentType = 'Rust (Core)' | 'JS (Bindings)' | 'Kotlin (Android)' | 'Swift (iOS)';

export interface PluginComponent {
    type: PluginComponentType;
    status: 'Included' | 'Not Applicable';
}

export interface Plugin {
    id: string;
    name: string;
    description: string;
    enabled: boolean;
    components: PluginComponent[];
}

export interface ApiCommand {
    name: string;
    args: string[];
    risk: 'Low' | 'Medium' | 'High';
    suggestion: string;
}