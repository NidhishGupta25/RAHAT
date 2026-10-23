import React from 'react';
import { GisMap, getDisasterIconUrl } from '../components/map/GisMap';
import { useApp } from '../context/AppContext';
import { Layers, X, Info } from 'lucide-react';

export const LiveMapView: React.FC = () => {
  const {
    mapLayers,
    toggleMapLayer,
    severityFilter,
    setSeverityFilter,
    selectedDisaster,
    setSelectedDisaster,
    selectedWarehouse,
    setSelectedWarehouse,
  } = useApp();

  const hasSelection = Boolean(selectedDisaster || selectedWarehouse);

  return (
    <div className="p-3 sm:p-4 space-y-2.5 w-full h-[calc(100vh-68px)] flex flex-col bg-[#F0F5FA]">
      {/* Top Filter and Layer Bar */}
      <div className="bg-white px-3.5 py-2.5 rounded-lg border border-[#CFE2F2] shadow-2xs flex flex-wrap items-center justify-between gap-3 shrink-0">
        {/* Layer Toggles */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-[#152B44] flex items-center gap-1.5 mr-1">
            <Layers className="w-3.5 h-3.5 text-[#2853f3]" /> Active Layers:
          </span>

          <button
            onClick={() => toggleMapLayer('rain')}
            className={`px-2.5 py-1 rounded text-xs font-medium border cursor-pointer flex items-center gap-1.5 transition-colors ${
              mapLayers.rain
                ? 'bg-[#EEF2FF] border-[#C7D4FE] text-[#2853f3]'
                : 'bg-[#E8F2FA] border-[#CFE2F2] text-[#516C8A] opacity-60'
            }`}
          >
            <img src="/heavy-rain.png" className="w-3.5 h-3.5 object-contain" alt="" /> Rain & Flood
          </button>

          <button
            onClick={() => toggleMapLayer('cyclone')}
            className={`px-2.5 py-1 rounded text-xs font-medium border cursor-pointer flex items-center gap-1.5 transition-colors ${
              mapLayers.cyclone
                ? 'bg-[#FEF4E8] border-[#FCE2C4] text-[#D9822B]'
                : 'bg-[#E8F2FA] border-[#CFE2F2] text-[#516C8A] opacity-60'
            }`}
          >
            <img src="/tornado.png" className="w-3.5 h-3.5 object-contain" alt="" /> Cyclones
          </button>

          <button
            onClick={() => toggleMapLayer('earthquake')}
            className={`px-2.5 py-1 rounded text-xs font-medium border cursor-pointer flex items-center gap-1.5 transition-colors ${
              mapLayers.earthquake
                ? 'bg-[#FEF4E8] border-[#FCE2C4] text-[#D9822B]'
                : 'bg-[#E8F2FA] border-[#CFE2F2] text-[#516C8A] opacity-60'
            }`}
          >
            <img src="/earthquake.png" className="w-3.5 h-3.5 object-contain" alt="" /> Earthquakes
          </button>

          <button
            onClick={() => toggleMapLayer('tsunami')}
            className={`px-2.5 py-1 rounded text-xs font-medium border cursor-pointer flex items-center gap-1.5 transition-colors ${
              mapLayers.tsunami
                ? 'bg-[#EBF7F1] border-[#CEEEDF] text-[#359868]'
                : 'bg-[#E8F2FA] border-[#CFE2F2] text-[#516C8A] opacity-60'
            }`}
          >
            <img src="/tsunami.png" className="w-3.5 h-3.5 object-contain" alt="" /> Tsunamis
          </button>

          <span className="text-[#CFE2F2] hidden md:inline">|</span>

          <button
            onClick={() => toggleMapLayer('warehouses')}
            className={`px-2.5 py-1 rounded text-xs font-medium border cursor-pointer flex items-center gap-1.5 transition-colors ${
              mapLayers.warehouses
                ? 'bg-[#EEF2FF] border-[#C7D4FE] text-[#2853f3]'
                : 'bg-[#E8F2FA] border-[#CFE2F2] text-[#516C8A] opacity-60'
            }`}
          >
            <img src="/warehouse.png" className="w-3.5 h-3.5 object-contain" alt="" /> Depots
          </button>
        </div>

        {/* Right Controls: Severity Filter */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-[#516C8A]">Severity:</span>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as any)}
            className="px-2 py-1 bg-white border border-[#CFE2F2] rounded text-xs text-[#152B44] focus:outline-none"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="WARNING">Warning</option>
            <option value="WATCH">Watch</option>
            <option value="NORMAL">Normal</option>
          </select>
        </div>
      </div>

      {/* Main Map View - Full Size, Maximized Extent */}
      <div className="relative flex-1 w-full h-full min-h-0 rounded-lg overflow-hidden border border-[#CFE2F2] shadow-2xs">
        <GisMap />

        {/* Floating Context Inspector Drawer (Slides in on right when an item is selected) */}
        {hasSelection && (
          <div className="absolute top-3 right-3 bottom-3 z-[1000] w-80 sm:w-88 bg-white/95 backdrop-blur-md p-4 rounded-lg border border-[#CFE2F2] shadow-lg overflow-y-auto flex flex-col justify-between text-xs animate-in fade-in slide-in-from-right-4 duration-200">
            <div>
              <div className="pb-2.5 border-b border-[#CFE2F2] flex items-center justify-between">
                <span className="font-bold text-xs text-[#152B44] flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-[#2853f3]" /> Feature Details
                </span>
                <button
                  onClick={() => {
                    setSelectedDisaster(null);
                    setSelectedWarehouse(null);
                  }}
                  title="Close panel"
                  className="p-1 text-[#516C8A] hover:text-[#152B44] hover:bg-slate-100 rounded cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {selectedDisaster && (
                <div className="mt-3 space-y-3">
                  <div className="flex items-center gap-2">
                    <img
                      src={getDisasterIconUrl(selectedDisaster.type)}
                      className="w-4 h-4 object-contain"
                      alt=""
                    />
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        selectedDisaster.severity === 'CRITICAL'
                          ? 'bg-[#FDEEEB] text-[#D95D58]'
                          : 'bg-[#FEF4E8] text-[#D9822B]'
                      }`}
                    >
                      {selectedDisaster.severityLabel}
                    </span>
                    <span className="text-[10px] font-mono text-[#516C8A]">{selectedDisaster.id}</span>
                  </div>

                  <h4 className="font-bold text-xs text-[#152B44]">{selectedDisaster.title}</h4>
                  <div className="text-[11px] text-[#516C8A]">
                    {selectedDisaster.location}, {selectedDisaster.state}
                  </div>

                  <div className="p-2.5 bg-[#E8F2FA] rounded border border-[#CFE2F2]">
                    <div className="text-[10px] text-[#516C8A]">{selectedDisaster.keyMetric.label}</div>
                    <div className="text-base font-bold text-[#2853f3]">
                      {selectedDisaster.keyMetric.value} {selectedDisaster.keyMetric.unit}
                    </div>
                  </div>

                  <p className="text-xs text-[#152B44] bg-[#FAFBFD] p-2.5 rounded border border-[#CFE2F2] leading-relaxed">
                    {selectedDisaster.impactDetails}
                  </p>

                  <div className="text-[10px] text-[#516C8A] space-y-0.5 pt-1">
                    <div>Source: {selectedDisaster.source}</div>
                    <div>Timestamp: {selectedDisaster.timestamp}</div>
                  </div>
                </div>
              )}

              {selectedWarehouse && (
                <div className="mt-3 space-y-3">
                  <div className="flex items-center gap-2">
                    <img src="/warehouse.png" className="w-4 h-4 object-contain" alt="" />
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#EEF2FF] text-[#2853f3]">
                      Logistics Depot
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-[#152B44]">{selectedWarehouse.name}</h4>
                  <div className="text-[11px] text-[#516C8A]">
                    {selectedWarehouse.city}, {selectedWarehouse.state}
                  </div>

                  <div className="p-2.5 bg-[#E8F2FA] rounded border border-[#CFE2F2]">
                    <div className="text-[10px] text-[#516C8A]">Capacity Utilization</div>
                    <div className="text-sm font-bold text-[#2853f3]">
                      {selectedWarehouse.currentStockTons} / {selectedWarehouse.totalCapacityTons} Tons
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <div className="text-[10px] font-semibold text-[#516C8A]">Stock Breakdown:</div>
                    {selectedWarehouse.inventory.slice(0, 4).map((inv) => (
                      <div
                        key={inv.id}
                        className="p-1.5 bg-white border border-[#CFE2F2] rounded flex justify-between text-[11px]"
                      >
                        <span className="text-[#152B44] truncate max-w-[130px]">{inv.resourceName}</span>
                        <span className="font-semibold text-[#2853f3]">
                          {inv.available.toLocaleString()} {inv.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#CFE2F2] flex items-center justify-between text-[11px] text-[#516C8A]">
              <span>Click on any marker to switch</span>
              <button
                onClick={() => {
                  setSelectedDisaster(null);
                  setSelectedWarehouse(null);
                }}
                className="text-[#2853f3] hover:underline cursor-pointer"
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
