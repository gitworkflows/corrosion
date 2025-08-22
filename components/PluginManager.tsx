import React, { useState, useCallback } from 'react';
import type { Plugin } from '../types';
import { InfoCard } from './InfoCard';
import { GridIcon } from './icons/GridIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface PluginManagerProps {
    plugins: Plugin[];
    onPluginsChange: (plugins: Plugin[]) => void;
}

export const PluginManager: React.FC<PluginManagerProps> = ({ plugins, onPluginsChange }) => {
    const [expandedPlugin, setExpandedPlugin] = useState<string | null>(null);

    const handleTogglePlugin = useCallback((pluginId: string) => {
        const updatedPlugins = plugins.map(p => p.id === pluginId ? { ...p, enabled: !p.enabled } : p);
        onPluginsChange(updatedPlugins);
    }, [plugins, onPluginsChange]);

    return (
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
    );
};