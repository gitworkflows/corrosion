import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, Legend } from 'recharts';
import type { PerformanceMetric } from '../types';

interface MetricsChartProps {
  staticData: PerformanceMetric[];
  liveData: { time: string; cpu: number; memory: number }[];
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-secondary-dark border border-border-dark rounded-md shadow-lg text-sm">
          <p className="label text-gray-400">{`${label}`}</p>
          {payload.map((p: any, index: number) => (
            <p key={index} style={{ color: p.color }}>{`${p.name}: ${p.value.toFixed(1)}${p.name === 'cpu' ? '%' : ' MB'}`}</p>
          ))}
        </div>
      );
    }
  
    return null;
  };

const MetricsChart: React.FC<MetricsChartProps> = React.memo(({ staticData, liveData }) => {
  return (
    <div className="w-full h-full flex flex-col">
        <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={staticData} margin={{ top: 20, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
                    <XAxis dataKey="name" stroke="#8892B0" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#8892B0" fontSize={12} tickLine={false} axisLine={false} unit=" MB"/>
                    <Tooltip
                        contentStyle={{
                        backgroundColor: '#161B22',
                        border: '1px solid #30363D',
                        borderRadius: '0.5rem',
                        color: '#c9d1d9'
                        }}
                        cursor={{ fill: 'rgba(139, 148, 158, 0.1)' }}
                    />
                    <Bar dataKey="value" fill="#654FF0" barSize={40} />
                </BarChart>
            </ResponsiveContainer>
        </div>
        <div className="flex-grow mt-4">
             <h3 className="text-sm font-semibold text-gray-300 mb-2 text-center">Live Usage</h3>
             {liveData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={liveData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
                        <XAxis dataKey="time" stroke="#8892B0" fontSize={10} tickLine={false} axisLine={false} hide/>
                        <YAxis stroke="#8892B0" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{fontSize: "12px"}} />
                        <Line type="monotone" dataKey="cpu" stroke="#58A6FF" strokeWidth={2} dot={false} name="CPU (%)" />
                        <Line type="monotone" dataKey="memory" stroke="#3FB950" strokeWidth={2} dot={false} name="Memory (MB)" />
                    </LineChart>
                </ResponsiveContainer>
             ) : (
                <div className="flex items-center justify-center h-full text-sm text-gray-500">
                    Run a build or test an API to see live metrics.
                </div>
             )}
        </div>
    </div>
  );
});

export default MetricsChart;