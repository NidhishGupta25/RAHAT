import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TransportRoute } from '../types';
import {
  Truck,
  Plane,
  Train,
  Anchor,
  AlertTriangle,
  MapPin,
  Navigation,
  ArrowRight,
} from 'lucide-react';

export const LogisticsView: React.FC = () => {
  const { routes, selectedRoute, setSelectedRoute, setActiveTab } = useApp();
  const [filterMode, setFilterMode] = useState<string>('ALL');

  const filteredRoutes = routes.filter((r) => {
    if (filterMode !== 'ALL' && r.mode !== filterMode) return false;
    return true;
  });

  const getModeIcon = (mode: TransportRoute['mode']) => {
    switch (mode) {
      case 'TRUCK_CONVOY':
        return <Truck className="w-4 h-4 text-[#2853f3]" />;
      case 'IAF_AIRLIFT':
        return <Plane className="w-4 h-4 text-[#2853f3]" />;
      case 'RAIL_FREIGHT':
        return <Train className="w-4 h-4 text-[#D9822B]" />;
      case 'COASTAL_VESSEL':
        return <Anchor className="w-4 h-4 text-[#359868]" />;
    }
  };

  const activeRoute = selectedRoute || routes[0];

  return (
    <div className="p-5 space-y-5 max-w-[1600px] mx-auto bg-[#F0F5FA]">
      {/* Top Filter Bar */}
      <div className="bg-white p-3 rounded-lg border border-[#CFE2F2] shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-[#152B44]">Mode:</span>
          {['ALL', 'TRUCK_CONVOY', 'IAF_AIRLIFT', 'RAIL_FREIGHT'].map((m) => (
            <button
              key={m}
              onClick={() => setFilterMode(m)}
              className={`px-3 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                filterMode === m
                  ? 'bg-[#2853f3] text-white shadow-xs'
                  : 'bg-[#E8F2FA] text-[#152B44] hover:bg-[#CFE2F2]'
              }`}
            >
              {m === 'ALL' ? 'All' : m.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Routes List & Selected Route Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Active Routes List */}
        <div className="lg:col-span-7 space-y-3">
          {filteredRoutes.map((route) => {
            const isSelected = activeRoute?.id === route.id;
            return (
              <div
                key={route.id}
                onClick={() => setSelectedRoute(route)}
                className={`bg-white p-3.5 rounded-lg border transition-all cursor-pointer shadow-2xs ${
                  isSelected
                    ? 'border-[#2853f3] ring-1 ring-[#2853f3] bg-[#FAFBFD]'
                    : 'border-[#CFE2F2] hover:border-[#2853f3]'
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-[#E8F2FA]">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-[#E8F2FA] flex items-center justify-center">
                      {getModeIcon(route.mode)}
                    </div>
                    <span className="font-mono text-xs font-bold text-[#152B44]">{route.id}</span>
                  </div>

                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      route.status === 'IN_TRANSIT'
                        ? 'bg-[#EEF2FF] text-[#2853f3]'
                        : route.status === 'ROUTE_CLEARANCE'
                        ? 'bg-[#FEF4E8] text-[#D9822B]'
                        : 'bg-[#EBF7F1] text-[#359868]'
                    }`}
                  >
                    {route.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="mt-2.5 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="text-[10px] text-[#516C8A]">Origin</div>
                    <div className="font-semibold text-[#152B44]">{route.originName}</div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#2853f3] shrink-0" />
                  <div className="text-right">
                    <div className="text-[10px] text-[#516C8A]">Destination</div>
                    <div className="font-semibold text-[#152B44]">{route.destinationName}</div>
                  </div>
                </div>

                <div className="mt-2 p-2 bg-[#E8F2FA] rounded text-xs">
                  <div className="font-medium text-[#152B44]">{route.cargoSummary}</div>
                </div>

                {route.bottleneckWarning && (
                  <div className="mt-2 p-1.5 bg-[#FEF4E8] text-[#D9822B] rounded border border-[#FCE2C4] text-[11px] flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>{route.bottleneckWarning}</span>
                  </div>
                )}

                <div className="mt-2 pt-1.5 border-t border-[#E8F2FA] flex items-center justify-between text-[11px] text-[#516C8A]">
                  <span>{route.distanceKm} km</span>
                  <span>ETA: {route.estimatedHours} hrs</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Selected Route Telemetry */}
        <div className="lg:col-span-5 bg-white p-4 rounded-lg border border-[#CFE2F2] shadow-2xs sticky top-20">
          {activeRoute ? (
            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#CFE2F2]">
                <div className="flex items-center gap-1.5">
                  <Navigation className="w-4 h-4 text-[#2853f3]" />
                  <h3 className="font-bold text-xs text-[#152B44]">Route Telemetry</h3>
                </div>
                <span className="font-mono text-[10px] text-[#516C8A]">{activeRoute.id}</span>
              </div>

              <div>
                <div className="text-sm font-bold text-[#152B44]">
                  {activeRoute.originName} ➔ {activeRoute.destinationName}
                </div>
                <div className="text-[11px] text-[#516C8A] mt-0.5">
                  Vehicle: {activeRoute.vehicleRegistration}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 bg-[#E8F2FA] rounded border border-[#CFE2F2]">
                  <span className="text-[10px] text-[#516C8A]">Distance</span>
                  <div className="font-bold text-xs text-[#152B44] mt-0.5">{activeRoute.distanceKm} km</div>
                </div>
                <div className="p-2 bg-[#E8F2FA] rounded border border-[#CFE2F2]">
                  <span className="text-[10px] text-[#516C8A]">Duration</span>
                  <div className="font-bold text-xs text-[#2853f3] mt-0.5">{activeRoute.estimatedHours} Hours</div>
                </div>
              </div>

              {/* Corridor Notes */}
              <p className="p-2.5 bg-[#E8F2FA] rounded text-xs text-[#152B44] leading-relaxed">
                {activeRoute.corridorNotes}
              </p>

              {/* Waypoints */}
              <div className="divide-y divide-[#E8F2FA] border border-[#CFE2F2] rounded overflow-hidden text-[11px]">
                {activeRoute.waypoints.map((wp, i) => (
                  <div key={i} className="p-1.5 bg-white flex justify-between">
                    <span className="text-[#516C8A]">Checkpoint {i + 1}</span>
                    <span className="font-mono text-[#152B44]">
                      [{wp[0].toFixed(2)}°, {wp[1].toFixed(2)}°]
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setActiveTab('map')}
                className="w-full py-2 px-3 bg-[#2853f3] hover:bg-[#1e42d9] text-white rounded text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>View on Map</span>
              </button>
            </div>
          ) : (
            <div className="py-20 text-center text-xs text-[#516C8A]">
              Select a route to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
