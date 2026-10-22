import React from 'react';
import { GisMap } from '../components/map/GisMap';
import { useApp } from '../context/AppContext';
import { Layers, Truck, Building2 } from 'lucide-react';

export const LiveMapView: React.FC = () => {
  const {
    mapLayers,
    toggleMapLayer,
    severityFilter,
    setSeverityFilter,
    selectedDisaster,
    selectedWarehouse,
    selectedRoute,
  } = useApp();

  return (
    <div className="p-5 space-y-4 max-w-[1700px] mx-auto h-[calc(100vh-76px)] flex flex-col bg-[#F0F5FA]">
      {/* Top Filter and Layer Bar */}
      <div className="bg-white p-3 rounded-lg border border-[#CFE2F2] shadow-2xs flex flex-wrap items-center justify-between gap-3 shrink-0">
        {/* Layer Toggles */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-[#152B44] flex items-center gap-1.5 mr-1">
            <Layers className="w-3.5 h-3.5 text-[#2853f3]" /> Layers:
          </span>

          <button
            onClick={() => toggleMapLayer('rain')}
            className={`px-2 py-1 rounded text-xs font-medium border cursor-pointer flex items-center gap-1.5 ${
              mapLayers.rain
                ? 'bg-[#EEF2FF] border-[#C7D4FE] text-[#2853f3]'
                : 'bg-[#E8F2FA] border-[#CFE2F2] text-[#516C8A] opacity-60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#2853f3]"></span> Rain & Flood
          </button>

          <button
            onClick={() => toggleMapLayer('cyclone')}
            className={`px-2 py-1 rounded text-xs font-medium border cursor-pointer flex items-center gap-1.5 ${
              mapLayers.cyclone
                ? 'bg-[#FEF4E8] border-[#FCE2C4] text-[#D9822B]'
                : 'bg-[#E8F2FA] border-[#CFE2F2] text-[#516C8A] opacity-60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#D9822B]"></span> Cyclones
          </button>

          <button
            onClick={() => toggleMapLayer('earthquake')}
            className={`px-2 py-1 rounded text-xs font-medium border cursor-pointer flex items-center gap-1.5 ${
              mapLayers.earthquake
                ? 'bg-[#FEF4E8] border-[#FCE2C4] text-[#D9822B]'
                : 'bg-[#E8F2FA] border-[#CFE2F2] text-[#516C8A] opacity-60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#D9822B]"></span> Earthquakes
          </button>

          <button
            onClick={() => toggleMapLayer('tsunami')}
            className={`px-2 py-1 rounded text-xs font-medium border cursor-pointer flex items-center gap-1.5 ${
              mapLayers.tsunami
                ? 'bg-[#EBF7F1] border-[#CEEEDF] text-[#359868]'
                : 'bg-[#E8F2FA] border-[#CFE2F2] text-[#516C8A] opacity-60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#359868]"></span> Tsunamis
          </button>

          <span className="text-[#CFE2F2] hidden md:inline">|</span>

          <button
            onClick={() => toggleMapLayer('warehouses')}
            className={`px-2 py-1 rounded text-xs font-medium border cursor-pointer flex items-center gap-1.5 ${
              mapLayers.warehouses
                ? 'bg-[#EEF2FF] border-[#C7D4FE] text-[#2853f3]'
                : 'bg-[#E8F2FA] border-[#CFE2F2] text-[#516C8A] opacity-60'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-[#2853f3]" /> Depots
          </button>

          <button
            onClick={() => toggleMapLayer('routes')}
            className={`px-2 py-1 rounded text-xs font-medium border cursor-pointer flex items-center gap-1.5 ${
              mapLayers.routes
                ? 'bg-[#EEF2FF] border-[#C7D4FE] text-[#2853f3]'
                : 'bg-[#E8F2FA] border-[#CFE2F2] text-[#516C8A] opacity-60'
            }`}
          >
            <Truck className="w-3.5 h-3.5 text-[#2853f3]" /> Routes
          </button>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-2 text-xs">
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

      {/* Main Map View & Context Panel */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">
        <div className="lg:col-span-9 h-full rounded-lg overflow-hidden border border-[#CFE2F2]">
          <GisMap />
        </div>

        {/* Right Inspector Drawer */}
        <div className="lg:col-span-3 bg-white p-3.5 rounded-lg border border-[#CFE2F2] shadow-2xs overflow-y-auto h-full flex flex-col justify-between text-xs">
          <div>
            <div className="pb-2 border-b border-[#CFE2F2] flex items-center justify-between">
              <span className="font-bold text-xs text-[#152B44]">
                Inspector
              </span>
            </div>

            {selectedDisaster ? (
              <div className="mt-3 space-y-3">
                <div className="flex items-center gap-1.5">
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

                <p className="text-xs text-[#152B44] bg-[#FAFBFD] p-2 rounded border border-[#CFE2F2] leading-relaxed">
                  {selectedDisaster.impactDetails}
                </p>

                <div className="text-[10px] text-[#516C8A]">
                  <div>Source: {selectedDisaster.source}</div>
                  <div>Timestamp: {selectedDisaster.timestamp}</div>
                </div>
              </div>
            ) : selectedWarehouse ? (
              <div className="mt-3 space-y-3">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#EEF2FF] text-[#2853f3]">
                  Logistics Depot
                </span>
                <h4 className="font-bold text-xs text-[#152B44]">{selectedWarehouse.name}</h4>
                <div className="text-[11px] text-[#516C8A]">
                  {selectedWarehouse.city}, {selectedWarehouse.state}
                </div>

                <div className="p-2.5 bg-[#E8F2FA] rounded border border-[#CFE2F2]">
                  <div className="text-[10px] text-[#516C8A]">Capacity</div>
                  <div className="text-sm font-bold text-[#2853f3]">
                    {selectedWarehouse.currentStockTons} / {selectedWarehouse.totalCapacityTons} Tons
                  </div>
                </div>

                <div className="space-y-1">
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
            ) : selectedRoute ? (
              <div className="mt-3 space-y-3">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#EEF2FF] text-[#2853f3]">
                  Route: {selectedRoute.mode.replace('_', ' ')}
                </span>
                <h4 className="font-bold text-xs text-[#152B44]">
                  {selectedRoute.originName} ➔ {selectedRoute.destinationName}
                </h4>

                <div className="p-2.5 bg-[#E8F2FA] rounded border border-[#CFE2F2] text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[#516C8A]">Distance:</span>
                    <span className="font-semibold text-[#152B44]">{selectedRoute.distanceKm} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#516C8A]">ETA:</span>
                    <span className="font-semibold text-[#2853f3]">{selectedRoute.estimatedHours} hrs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#516C8A]">Status:</span>
                    <span className="font-semibold text-[#152B44]">{selectedRoute.status}</span>
                  </div>
                </div>

                {selectedRoute.bottleneckWarning && (
                  <div className="p-2 bg-[#FEF4E8] text-[#D9822B] rounded border border-[#FCE2C4] text-[11px]">
                    {selectedRoute.bottleneckWarning}
                  </div>
                )}
              </div>
            ) : (
              <div className="py-20 text-center text-xs text-[#516C8A]">
                Select a map feature to view details.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
