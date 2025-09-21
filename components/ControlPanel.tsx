
import React from 'react';
import { PlayIcon, ResetIcon, SaveIcon } from './Icons';
import { Run, Coverage } from '../types';

interface ControlPanelProps {
  isDrawing: boolean;
  bufferRadius: number;
  coverage: Coverage;
  lastRun: Run | null;
  runs: Run[];
  onStart: () => void;
  onSave: () => void;
  onReset: () => void;
  onBufferChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const StatCard: React.FC<{ title: string; value: string; unit: string }> = ({ title, value, unit }) => (
    <div className="bg-gray-700/50 p-4 rounded-lg text-center">
        <p className="text-xs text-gray-400 uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold text-white">{value}<span className="text-lg ml-1 text-gray-300">{unit}</span></p>
    </div>
);

const ControlPanel: React.FC<ControlPanelProps> = ({
  isDrawing, bufferRadius, coverage, lastRun, runs, onStart, onSave, onReset, onBufferChange
}) => {
  return (
    <div className="absolute top-0 left-0 h-full w-96 bg-gray-900 text-white p-4 z-[1000] shadow-2xl flex flex-col overflow-y-auto">
      <div className="flex-grow">
        <div className="flex items-center justify-between pb-4 border-b border-gray-700">
            <h1 className="text-2xl font-bold">PuneCover</h1>
            <button onClick={onReset} className="p-2 rounded-full hover:bg-gray-700 transition" title="Reset All Data">
                <ResetIcon className="w-5 h-5" />
            </button>
        </div>

        <div className="py-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-300">Total Coverage</h2>
            <div className="grid grid-cols-2 gap-4">
                <StatCard title="Percentage" value={coverage.percentage.toFixed(2)} unit="%" />
                <StatCard title="Area" value={coverage.area.toFixed(2)} unit="km²" />
            </div>
        </div>

        <div className="py-6 space-y-4 border-t border-gray-700">
            <h2 className="text-lg font-semibold text-gray-300">New Run</h2>
            <div className="space-y-4">
                 <button
                    onClick={isDrawing ? onSave : onStart}
                    disabled={!isDrawing && runs.length >= 10}
                    className={`w-full flex items-center justify-center p-3 rounded-lg font-bold transition ${
                        isDrawing 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed'
                    }`}
                >
                    {isDrawing ? <><SaveIcon className="w-5 h-5 mr-2" /> Save Run</> : <><PlayIcon className="w-5 h-5 mr-2" /> Start Run</>}
                </button>
                 {runs.length >= 10 && !isDrawing && <p className="text-xs text-center text-yellow-400">Demo limit of 10 runs reached. Reset to add more.</p>}
            </div>
             <div className="pt-2">
                <label htmlFor="buffer" className="block text-sm font-medium text-gray-400 mb-2">
                    Run Buffer Radius: <span className="font-bold text-white">{bufferRadius}m</span>
                </label>
                <input
                    id="buffer"
                    type="range"
                    min="5"
                    max="50"
                    value={bufferRadius}
                    onChange={onBufferChange}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
            </div>
        </div>
        
        {lastRun && (
            <div className="py-6 space-y-4 border-t border-gray-700 animate-fade-in">
                <h2 className="text-lg font-semibold text-gray-300">Last Run Stats</h2>
                <div className="bg-gray-800 p-4 rounded-lg space-y-2">
                    <p className="flex justify-between"><span>Distance:</span> <span className="font-mono">{lastRun.distance.toFixed(2)} km</span></p>
                    <p className="flex justify-between text-green-400"><span>New Area Added:</span> <span className="font-mono">+{lastRun.newAreaAdded.toFixed(3)} km²</span></p>
                    <p className="flex justify-between text-green-400"><span>Coverage Increase:</span> <span className="font-mono">+{lastRun.newCoveragePercent.toFixed(3)}%</span></p>
                </div>
            </div>
        )}

        <div className="py-6 space-y-4 border-t border-gray-700">
            <h2 className="text-lg font-semibold text-gray-300">Run History ({runs.length})</h2>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {runs.length === 0 && <p className="text-sm text-gray-500">No runs recorded yet.</p>}
                {runs.slice().reverse().map((run) => (
                    <div key={run.id} className="bg-gray-800 p-3 rounded-lg text-sm">
                        <p className="flex justify-between">
                            <span>{new Date(run.startTime).toLocaleTimeString()}</span>
                            <span className="font-mono">{run.distance.toFixed(2)} km</span>
                        </p>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
