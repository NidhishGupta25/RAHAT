import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HazardType } from '../types';
import {
  CloudRain,
  Activity,
  Wind,
  Waves,
  MapPin,
} from 'lucide-react';

export const MonitoringView: React.FC = () => {
  const {
    disasters,
    selectedDisaster,
    setSelectedDisaster,
    hazardFilter,
    setHazardFilter,
    setActiveTab,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');

  const filteredDisasters = disasters.filter((d) => {
    if (hazardFilter !== 'ALL' && d.type !== hazardFilter) return false;
    if (
      searchQuery &&
      !d.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !d.location.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !d.state.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const getHazardIcon = (type: HazardType) => {
    switch (type) {
      case 'HEAVY_RAIN':
        return <CloudRain className="w-4 h-4 text-[#4688C8]" />;
      case 'CYCLONE':
        return <Wind className="w-4 h-4 text-[#D9822B]" />;
      case 'EARTHQUAKE':
        return <Activity className="w-4 h-4 text-[#D9822B]" />;
      case 'TSUNAMI':
        return <Waves className="w-4 h-4 text-[#359868]" />;
    }
  };

  return (
    <div className="p-5 space-y-5 max-w-[1600px] mx-auto bg-[#F0F5FA]">
      {/* Top Filter Bar */}
      <div className="bg-white p-3.5 rounded-lg border border-[#CFE2F2] shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Hazard Category Tabs */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setHazardFilter('ALL')}
              className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                hazardFilter === 'ALL'
                  ? 'bg-[#4688C8] text-white shadow-xs'
                  : 'bg-[#E8F2FA] text-[#152B44] hover:bg-[#CFE2F2]'
              }`}
            >
              All Hazards ({disasters.length})
            </button>
            <button
              onClick={() => setHazardFilter('HEAVY_RAIN')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                hazardFilter === 'HEAVY_RAIN'
                  ? 'bg-[#4688C8] text-white shadow-xs'
                  : 'bg-[#E8F2FA] text-[#152B44] hover:bg-[#CFE2F2]'
              }`}
            >
              <CloudRain className="w-3.5 h-3.5" />
              Heavy Rain & Flood
            </button>
            <button
              onClick={() => setHazardFilter('CYCLONE')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                hazardFilter === 'CYCLONE'
                  ? 'bg-[#4688C8] text-white shadow-xs'
                  : 'bg-[#E8F2FA] text-[#152B44] hover:bg-[#CFE2F2]'
              }`}
            >
              <Wind className="w-3.5 h-3.5" />
              Cyclones & Storms
            </button>
            <button
              onClick={() => setHazardFilter('EARTHQUAKE')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                hazardFilter === 'EARTHQUAKE'
                  ? 'bg-[#4688C8] text-white shadow-xs'
                  : 'bg-[#E8F2FA] text-[#152B44] hover:bg-[#CFE2F2]'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              Earthquakes
            </button>
            <button
              onClick={() => setHazardFilter('TSUNAMI')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                hazardFilter === 'TSUNAMI'
                  ? 'bg-[#4688C8] text-white shadow-xs'
                  : 'bg-[#E8F2FA] text-[#152B44] hover:bg-[#CFE2F2]'
              }`}
            >
              <Waves className="w-3.5 h-3.5" />
              Tsunamis
            </button>
          </div>

          {/* Search Input */}
          <div className="w-full sm:w-60">
            <input
              type="text"
              placeholder="Search alerts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-[#FFFFFF] border border-[#CFE2F2] rounded-md focus:outline-none focus:border-[#4688C8] text-[#152B44]"
            />
          </div>
        </div>
      </div>

      {/* Main Split Layout: Observations List and Contextual Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Observations List */}
        <div className="lg:col-span-7 space-y-3">
          {filteredDisasters.length === 0 ? (
            <div className="bg-white p-8 rounded-lg border border-[#CFE2F2] text-center text-xs text-[#516C8A]">
              No alerts match current filter.
            </div>
          ) : (
            filteredDisasters.map((disaster) => {
              const isSelected = selectedDisaster?.id === disaster.id;
              return (
                <div
                  key={disaster.id}
                  onClick={() => setSelectedDisaster(disaster)}
                  className={`bg-white p-3.5 rounded-lg border transition-all cursor-pointer shadow-2xs ${
                    isSelected
                      ? 'border-[#4688C8] ring-1 ring-[#4688C8] bg-[#FAFBFD]'
                      : 'border-[#CFE2F2] hover:border-[#4688C8]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded bg-[#E8F2FA] flex items-center justify-center shrink-0 mt-0.5">
                        {getHazardIcon(disaster.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-[#516C8A] bg-[#E8F2FA] px-1.5 py-0.5 rounded">
                            {disaster.id}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              disaster.severity === 'CRITICAL'
                                ? 'bg-[#FDEEEB] text-[#D95D58] border border-[#F9D5CF]'
                                : disaster.severity === 'NORMAL'
                                ? 'bg-[#EBF7F1] text-[#359868] border border-[#CEEEDF]'
                                : 'bg-[#FEF4E8] text-[#D9822B] border border-[#FCE2C4]'
                            }`}
                          >
                            {disaster.severityLabel}
                          </span>
                        </div>
                        <h3 className="font-bold text-xs text-[#152B44] mt-1">{disaster.title}</h3>
                        <p className="text-[11px] text-[#516C8A] flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#4688C8]" />
                          {disaster.location}, {disaster.state}
                        </p>
                      </div>
                    </div>

                    {/* Key Metric Display */}
                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold text-[#4688C8]">
                        {disaster.keyMetric.value}{' '}
                        <span className="font-normal text-[#516C8A]">
                          {disaster.keyMetric.unit}
                        </span>
                      </div>
                      <div className="text-[10px] text-[#516C8A]">{disaster.keyMetric.label}</div>
                    </div>
                  </div>

                  <p className="text-xs text-[#152B44] mt-2 line-clamp-2 bg-[#E8F2FA] p-2 rounded">
                    {disaster.impactDetails}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-[#E8F2FA] flex items-center justify-between text-[10px] text-[#516C8A]">
                    <span>Source: {disaster.source}</span>
                    <span className="font-mono">{disaster.timestamp}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Detailed Dossier */}
        <div className="lg:col-span-5 bg-white p-4 rounded-lg border border-[#CFE2F2] shadow-2xs sticky top-20">
          {selectedDisaster ? (
            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#CFE2F2]">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-[#E8F2FA] flex items-center justify-center">
                    {getHazardIcon(selectedDisaster.type)}
                  </div>
                  <span className="text-xs font-bold text-[#152B44]">
                    Alert Details
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#516C8A]">{selectedDisaster.id}</span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#152B44] leading-snug">
                  {selectedDisaster.title}
                </h3>
                <div className="text-[11px] text-[#516C8A] mt-0.5">
                  {selectedDisaster.location}, {selectedDisaster.state}
                </div>
              </div>

              {/* Verified Observational Metrics */}
              <div className="divide-y divide-[#E8F2FA] border border-[#CFE2F2] rounded overflow-hidden text-xs">
                {selectedDisaster.metrics.map((m, idx) => (
                  <div key={idx} className="flex justify-between p-2 bg-white">
                    <span className="text-[#516C8A]">{m.label}</span>
                    <span className="font-semibold text-[#152B44]">{m.value}</span>
                  </div>
                ))}
              </div>

              {/* Assessment Description */}
              <p className="text-xs text-[#152B44] bg-[#E8F2FA] p-2.5 rounded leading-relaxed">
                {selectedDisaster.impactDetails}
              </p>

              {/* Source & Model Status */}
              <div className="p-2.5 bg-[#FAFBFD] rounded border border-[#CFE2F2] text-[11px] space-y-1">
                <div className="flex items-center justify-between text-[#152B44]">
                  <span>Model: {selectedDisaster.modelStatus.modelName}</span>
                  <span className="font-semibold text-[#4688C8]">
                    {selectedDisaster.modelStatus.executed ? 'Executed' : 'Standby'}
                  </span>
                </div>
                <div className="text-[#516C8A]">Source: {selectedDisaster.source}</div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => setActiveTab('map')}
                  className="w-full py-2 px-3 bg-[#E8F2FA] text-[#152B44] rounded text-xs font-medium hover:bg-[#CFE2F2] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#4688C8]" />
                  <span>View on Map</span>
                </button>
                <button
                  onClick={() => setActiveTab('allocation')}
                  className="w-full py-2 px-3 bg-[#4688C8] text-white rounded text-xs font-medium hover:bg-[#3374B2] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Relief Allocation</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-xs text-[#516C8A]">
              Select an alert to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
