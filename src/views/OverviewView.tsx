import React from 'react';
import { useApp } from '../context/AppContext';
import { GisMap } from '../components/map/GisMap';
import {
  CloudRain,
  Activity,
  Wind,
  Waves,
  Users,
  Package,
  AlertOctagon,
  Truck,
  ExternalLink,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { HazardType } from '../types';

export const OverviewView: React.FC = () => {
  const {
    disasters,
    allocations,
    routes,
    selectedDisaster,
    setActiveTab,
    setHazardFilter,
    activities,
  } = useApp();

  // Summary counts per hazard
  const rainAlerts = disasters.filter((d) => d.type === 'HEAVY_RAIN' && d.severity !== 'NORMAL').length;
  const quakeAlerts = disasters.filter((d) => d.type === 'EARTHQUAKE' && d.severity !== 'NORMAL').length;
  const cycloneAlerts = disasters.filter((d) => d.type === 'CYCLONE' && d.severity !== 'NORMAL').length;

  // Operational metrics
  const totalAffected = disasters.reduce((acc, d) => acc + d.affectedPopulationEstimate, 0);
  const totalDemand = allocations.reduce((acc, a) => acc + a.estimatedDemand, 0);
  const totalShortage = allocations.reduce((acc, a) => acc + a.shortageQuantity, 0);
  const activeDispatches = routes.filter((r) => r.status === 'IN_TRANSIT' || r.status === 'ROUTE_CLEARANCE').length;

  const handleSelectHazard = (type: HazardType) => {
    setHazardFilter(type);
    setActiveTab('monitoring');
  };

  return (
    <div className="p-5 space-y-5 max-w-[1600px] mx-auto bg-[#F0F5FA]">
      {/* 1. Hazard Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Heavy Rain & Flood Card */}
        <div
          onClick={() => handleSelectHazard('HEAVY_RAIN')}
          className="bg-white p-3.5 rounded-lg border border-[#CFE2F2] hover:border-[#2853f3] transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-[#EEF2FF] text-[#2853f3] flex items-center justify-center">
                <CloudRain className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-xs text-[#152B44]">Heavy Rain / Flood</h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FDEEEB] text-[#D95D58] border border-[#F9D5CF]">
              {rainAlerts} Active
            </span>
          </div>
          <div className="text-xs text-[#516C8A] truncate">
            Wayanad 228mm • Cachar Basin rising
          </div>
        </div>

        {/* Cyclones Card */}
        <div
          onClick={() => handleSelectHazard('CYCLONE')}
          className="bg-white p-3.5 rounded-lg border border-[#CFE2F2] hover:border-[#2853f3] transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-[#FEF4E8] text-[#D9822B] flex items-center justify-center">
                <Wind className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-xs text-[#152B44]">Cyclones & Storms</h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FEF4E8] text-[#D9822B] border border-[#FCE2C4]">
              {cycloneAlerts} Tracking
            </span>
          </div>
          <div className="text-xs text-[#516C8A] truncate">
            Deep Depression BOB-03 (65 km/h)
          </div>
        </div>

        {/* Earthquakes Card */}
        <div
          onClick={() => handleSelectHazard('EARTHQUAKE')}
          className="bg-white p-3.5 rounded-lg border border-[#CFE2F2] hover:border-[#2853f3] transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-[#FEF4E8] text-[#D9822B] flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-xs text-[#152B44]">Earthquakes</h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FEF4E8] text-[#D9822B] border border-[#FCE2C4]">
              {quakeAlerts} Events
            </span>
          </div>
          <div className="text-xs text-[#516C8A] truncate">
            M5.4 Manipur Border • M4.1 Chamoli
          </div>
        </div>

        {/* Tsunamis Card */}
        <div
          onClick={() => handleSelectHazard('TSUNAMI')}
          className="bg-white p-3.5 rounded-lg border border-[#CFE2F2] hover:border-[#2853f3] transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-[#EBF7F1] text-[#359868] flex items-center justify-center">
                <Waves className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-xs text-[#152B44]">Tsunamis</h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EBF7F1] text-[#359868] border border-[#CEEEDF]">
              Normal
            </span>
          </div>
          <div className="text-xs text-[#516C8A] truncate">
            No Tsunami Threat Detected
          </div>
        </div>
      </div>

      {/* 2. Operational Metrics Row */}
      <div className="bg-white p-4 rounded-lg border border-[#CFE2F2] shadow-2xs">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 divide-y sm:divide-y-0 sm:divide-x divide-[#CFE2F2]">
          <div className="pt-2 sm:pt-0 sm:px-3">
            <div className="text-[11px] text-[#516C8A] flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-[#2853f3]" /> Affected Population
            </div>
            <div className="text-base font-bold text-[#152B44] mt-1">
              {totalAffected.toLocaleString()}
            </div>
          </div>

          <div className="pt-2 sm:pt-0 sm:px-3">
            <div className="text-[11px] text-[#516C8A] flex items-center gap-1">
              <Package className="w-3.5 h-3.5 text-[#2853f3]" /> Relief Demand
            </div>
            <div className="text-base font-bold text-[#2853f3] mt-1">
              {totalDemand.toLocaleString()}
            </div>
          </div>

          <div className="pt-2 sm:pt-0 sm:px-3">
            <div className="text-[11px] text-[#516C8A] flex items-center gap-1">
              <AlertOctagon className="w-3.5 h-3.5 text-[#D95D58]" /> Shortages
            </div>
            <div className="text-base font-bold text-[#D95D58] mt-1">
              {totalShortage.toLocaleString()}
            </div>
          </div>

          <div className="pt-2 sm:pt-0 sm:px-3">
            <div className="text-[11px] text-[#516C8A] flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-[#359868]" /> Confirmed Allocs
            </div>
            <div className="text-base font-bold text-[#359868] mt-1">
              12,286
            </div>
          </div>

          <div className="pt-2 sm:pt-0 sm:px-3">
            <div className="text-[11px] text-[#516C8A] flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-[#2853f3]" /> Active Convoys
            </div>
            <div className="text-base font-bold text-[#2853f3] mt-1">
              {activeDispatches}
            </div>
          </div>

          <div className="pt-2 sm:pt-0 sm:px-3">
            <div className="text-[11px] text-[#516C8A] flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-[#359868]" /> Response Teams
            </div>
            <div className="text-base font-bold text-[#152B44] mt-1">
              14 Battalions
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Workspace: Map & Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Interactive GIS Map */}
        <div className="lg:col-span-8 bg-white p-3.5 rounded-lg border border-[#CFE2F2] shadow-2xs">
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-xs font-bold text-[#152B44]">Hazard & Logistics Map</h2>
            <button
              onClick={() => setActiveTab('map')}
              className="text-xs text-[#2853f3] font-medium hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Full Screen</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="h-[460px] w-full">
            <GisMap />
          </div>
        </div>

        {/* Right: Detail Panel */}
        <div className="lg:col-span-4 bg-white p-4 rounded-lg border border-[#CFE2F2] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-[#CFE2F2]">
              <div className="text-xs font-bold text-[#152B44]">
                Incident Details
              </div>
              {selectedDisaster && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    selectedDisaster.severity === 'CRITICAL'
                      ? 'bg-[#FDEEEB] text-[#D95D58] border border-[#F9D5CF]'
                      : selectedDisaster.severity === 'NORMAL'
                      ? 'bg-[#EBF7F1] text-[#359868] border border-[#CEEEDF]'
                      : 'bg-[#FEF4E8] text-[#D9822B] border border-[#FCE2C4]'
                  }`}
                >
                  {selectedDisaster.severityLabel}
                </span>
              )}
            </div>

            {selectedDisaster ? (
              <div className="mt-3 space-y-3.5 text-xs">
                <div>
                  <h3 className="font-bold text-sm text-[#152B44] leading-snug">
                    {selectedDisaster.title}
                  </h3>
                  <div className="text-[11px] text-[#516C8A] mt-0.5">
                    {selectedDisaster.location}, {selectedDisaster.state}
                  </div>
                </div>

                {/* Key Metric Banner */}
                <div className="p-2.5 bg-[#E8F2FA] rounded border border-[#CFE2F2] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#516C8A]">{selectedDisaster.keyMetric.label}</span>
                    <div className="text-base font-bold text-[#2853f3]">
                      {selectedDisaster.keyMetric.value}{' '}
                      <span className="text-xs font-normal text-[#516C8A]">
                        {selectedDisaster.keyMetric.unit}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#516C8A]">Affected</span>
                    <div className="text-xs font-semibold text-[#152B44]">
                      ~{selectedDisaster.affectedPopulationEstimate.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Impact details */}
                <p className="text-xs text-[#152B44] leading-relaxed bg-[#FAFBFD] p-2.5 rounded border border-[#CFE2F2]">
                  {selectedDisaster.impactDetails}
                </p>

                {/* Observational Metrics Table */}
                <div className="divide-y divide-[#E8F2FA] border border-[#CFE2F2] rounded overflow-hidden text-[11px]">
                  {selectedDisaster.metrics.map((m, idx) => (
                    <div key={idx} className="flex justify-between p-2 bg-[#FFFFFF]">
                      <span className="text-[#516C8A]">{m.label}</span>
                      <span className="font-medium text-[#152B44]">{m.value}</span>
                    </div>
                  ))}
                </div>

                {/* Data Source & Timestamp */}
                <div className="text-[11px] text-[#516C8A] flex items-center justify-between pt-1">
                  <span>Source: {selectedDisaster.source}</span>
                  <span className="font-mono text-[10px]">{selectedDisaster.timestamp}</span>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-[#516C8A]">
                Select a hazard on the map to view details.
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-[#CFE2F2] mt-3 flex gap-2">
            <button
              onClick={() => setActiveTab('allocation')}
              className="flex-1 py-1.5 px-3 bg-[#2853f3] text-white rounded text-xs font-medium hover:bg-[#1e42d9] transition-colors cursor-pointer text-center shadow-xs"
            >
              Allocate Relief
            </button>
            <button
              onClick={() => setActiveTab('monitoring')}
              className="py-1.5 px-3 bg-[#E8F2FA] text-[#152B44] rounded text-xs font-medium hover:bg-[#CFE2F2] transition-colors cursor-pointer"
            >
              All Alerts
            </button>
          </div>
        </div>
      </div>

      {/* 4. Activity Stream */}
      <div className="bg-white p-4 rounded-lg border border-[#CFE2F2] shadow-2xs">
        <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-[#CFE2F2]">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-[#2853f3]" />
            <h3 className="text-xs font-bold text-[#152B44]">
              Recent Activity
            </h3>
          </div>
        </div>

        <div className="divide-y divide-[#E8F2FA] text-xs">
          {activities.slice(0, 4).map((act) => (
            <div key={act.id} className="py-2 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-[#516C8A] bg-[#E8F2FA] px-1.5 py-0.5 rounded">
                  {act.timestamp}
                </span>
                <span className="font-medium text-[#152B44]">{act.action}</span>
                <span className="text-[11px] text-[#516C8A] hidden sm:inline">• {act.details}</span>
              </div>
              <span
                className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
                  act.category === 'DISASTER_ALERT'
                    ? 'bg-[#FDEEEB] text-[#D95D58]'
                    : act.category === 'ALLOCATION'
                    ? 'bg-[#EEF2FF] text-[#2853f3]'
                    : act.category === 'DISPATCH'
                    ? 'bg-[#EEF2FF] text-[#2853f3]'
                    : 'bg-[#E8F2FA] text-[#516C8A]'
                }`}
              >
                {act.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
