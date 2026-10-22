import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DataSourceHealth, ModelExecutionStatus } from '../types';
import {
  Database,
  Cpu,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  Terminal,
} from 'lucide-react';

export const DataModelsView: React.FC = () => {
  const { dataSources, models, refreshFeeds, isRefreshing } = useApp();
  const [selectedSource, setSelectedSource] = useState<DataSourceHealth | null>(dataSources[0]);
  const [selectedModel, setSelectedModel] = useState<ModelExecutionStatus | null>(models[0]);

  return (
    <div className="p-5 space-y-5 max-w-[1600px] mx-auto bg-[#F0F5FA]">
      {/* Header Banner */}
      <div className="bg-white p-3.5 rounded-lg border border-[#CFE2F2] shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xs font-bold text-[#152B44] flex items-center gap-2">
          <Database className="w-4 h-4 text-[#2853f3]" />
          Data Feeds & Model Telemetry
        </h2>

        <button
          onClick={refreshFeeds}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-[#2853f3] bg-[#EEF2FF] hover:bg-[#D8E8F7] border border-[#CFE2F2] rounded-md transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Ping Feeds</span>
        </button>
      </div>

      {/* 1. Data Source Health Section */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold text-[#152B44] flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#2853f3]" />
          Data Sources ({dataSources.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {dataSources.map((ds) => {
            const isSelected = selectedSource?.id === ds.id;
            return (
              <div
                key={ds.id}
                onClick={() => setSelectedSource(ds)}
                className={`bg-white p-3.5 rounded-lg border transition-all cursor-pointer shadow-2xs ${
                  isSelected
                    ? 'border-[#2853f3] ring-1 ring-[#2853f3] bg-[#FAFBFD]'
                    : 'border-[#CFE2F2] hover:border-[#2853f3]'
                }`}
              >
                <div className="flex items-center justify-between pb-1.5 border-b border-[#E8F2FA]">
                  <span className="font-semibold text-xs text-[#152B44]">{ds.name}</span>
                  <span className="flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#EBF7F1] text-[#359868] border border-[#CEEEDF]">
                    <CheckCircle2 className="w-3 h-3" /> {ds.status}
                  </span>
                </div>

                <div className="mt-2 text-xs space-y-1">
                  <div className="text-[11px] text-[#516C8A]">Agency: {ds.agency}</div>
                  <div className="text-[11px] text-[#516C8A]">Hazard: {ds.hazardFocus}</div>
                  <div className="font-mono text-[10px] text-[#516C8A] truncate bg-[#E8F2FA] p-1 rounded">
                    {ds.protocol} • {ds.endpointUrl}
                  </div>
                </div>

                <div className="mt-2.5 pt-1.5 border-t border-[#E8F2FA] flex items-center justify-between text-[11px] text-[#516C8A]">
                  <span>Ping: <strong className="text-[#152B44]">{ds.latencyMs}ms</strong></span>
                  <span>Sync: <strong className="text-[#152B44]">{ds.lastRefresh}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Model Execution Status Section */}
      <div className="space-y-2.5 pt-1">
        <h3 className="text-xs font-bold text-[#152B44] flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-[#2853f3]" />
          Models ({models.length})
        </h3>

        <div className="bg-white rounded-lg border border-[#CFE2F2] shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#E8F2FA] text-[#152B44] font-semibold border-b border-[#CFE2F2]">
                <tr>
                  <th className="py-2.5 px-3">Pipeline</th>
                  <th className="py-2.5 px-3">Domain</th>
                  <th className="py-2.5 px-3">Version</th>
                  <th className="py-2.5 px-3 text-center">State</th>
                  <th className="py-2.5 px-3">Last Run</th>
                  <th className="py-2.5 px-3">Latency</th>
                  <th className="py-2.5 px-3">Input</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8F2FA] text-[#152B44]">
                {models.map((mdl) => (
                  <tr
                    key={mdl.id}
                    onClick={() => setSelectedModel(mdl)}
                    className="hover:bg-[#FAFBFD] transition-colors cursor-pointer"
                  >
                    <td className="py-2.5 px-3 font-semibold text-[#152B44]">
                      {mdl.modelName}
                    </td>

                    <td className="py-2.5 px-3 text-[#516C8A]">
                      <span className="text-[10px] bg-[#E8F2FA] px-1.5 py-0.5 rounded font-medium text-[#152B44]">
                        {mdl.hazardType}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 font-mono text-[11px] text-[#516C8A]">{mdl.version}</td>

                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          mdl.executionState === 'COMPLETED'
                            ? 'bg-[#EBF7F1] text-[#359868] border border-[#CEEEDF]'
                            : mdl.executionState === 'NOT_CALLED'
                            ? 'bg-[#E8F2FA] text-[#516C8A] border border-[#CFE2F2]'
                            : 'bg-[#FDEEEB] text-[#D95D58]'
                        }`}
                      >
                        {mdl.executionState === 'NOT_CALLED' ? 'STANDBY' : mdl.executionState}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 font-mono text-[11px] text-[#516C8A]">{mdl.lastRunTime}</td>

                    <td className="py-2.5 px-3 font-mono text-[11px] text-[#152B44]">
                      {mdl.durationMs > 0 ? `${mdl.durationMs} ms` : '—'}
                    </td>

                    <td className="py-2.5 px-3 text-[11px] text-[#516C8A]">{mdl.dataSourceInput}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Model Parameters */}
      {selectedModel && (
        <div className="bg-white p-3.5 rounded-lg border border-[#CFE2F2] shadow-2xs text-xs space-y-2">
          <div className="flex items-center justify-between pb-1.5 border-b border-[#E8F2FA]">
            <div className="font-bold text-xs text-[#152B44] flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-[#2853f3]" />
              Parameters: {selectedModel.modelName}
            </div>
            <span className="text-[10px] font-mono text-[#516C8A]">{selectedModel.id}</span>
          </div>
          <div className="p-2.5 bg-[#E8F2FA] rounded border border-[#CFE2F2] font-mono text-[11px] text-[#152B44]">
            {selectedModel.parameters}
          </div>
        </div>
      )}
    </div>
  );
};
