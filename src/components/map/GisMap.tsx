import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useApp } from '../../context/AppContext';
import { DisasterEvent, Warehouse, HazardType } from '../../types';
import { ChevronDown, ChevronUp } from 'lucide-react';

// Complete geographical bounds for India region (including Ladakh/Kashmir, Kanyakumari, Gujarat, Arunachal Pradesh, Andaman & Nicobar)
export const INDIA_BOUNDS: L.LatLngBoundsLiteral = [
  [6.8, 68.0],
  [37.2, 97.4],
];

// Resolve image URL for disaster types
export const getDisasterIconUrl = (type: HazardType | string): string => {
  switch (type) {
    case 'HEAVY_RAIN':
      return '/heavy-rain.png';
    case 'CYCLONE':
      return '/tornado.png';
    case 'EARTHQUAKE':
      return '/earthquake.png';
    case 'TSUNAMI':
      return '/tsunami.png';
    default:
      return '/heavy-rain.png';
  }
};

// Create minimal standard Leaflet icon using PNG images as-is
const createDisasterIcon = (type: HazardType | string, isSelected: boolean) => {
  const iconUrl = getDisasterIconUrl(type);
  const size = isSelected ? 28 : 24; // minimal standard size
  return L.icon({
    iconUrl,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -Math.floor(size / 2)],
    className: isSelected ? 'leaflet-marker-active' : '',
  });
};

const createWarehouseIcon = (isSelected: boolean) => {
  const size = isSelected ? 28 : 24; // minimal standard size
  return L.icon({
    iconUrl: '/warehouse.png',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -Math.floor(size / 2)],
    className: isSelected ? 'leaflet-marker-active' : '',
  });
};

// Controller to synchronize external state (selections, resets) and automatically fit India bounds
const MapController: React.FC<{
  selectedDisaster: DisasterEvent | null;
  selectedWarehouse: Warehouse | null;
  resetTrigger: number;
}> = ({ selectedDisaster, selectedWarehouse, resetTrigger }) => {
  const map = useMap();

  useEffect(() => {
    // Invalidate size on initial mount and perfectly frame India
    const timer = setTimeout(() => {
      map.invalidateSize();
      map.fitBounds(INDIA_BOUNDS, { padding: [24, 24], maxZoom: 6 });
    }, 120);

    const handleResize = () => {
      map.invalidateSize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [map]);

  useEffect(() => {
    if (selectedDisaster) {
      map.panTo(selectedDisaster.coordinates, { animate: true, duration: 0.8 });
    }
  }, [selectedDisaster, map]);

  useEffect(() => {
    if (selectedWarehouse) {
      map.panTo(selectedWarehouse.coordinates, { animate: true, duration: 0.8 });
    }
  }, [selectedWarehouse, map]);

  useEffect(() => {
    if (resetTrigger > 0) {
      map.fitBounds(INDIA_BOUNDS, { padding: [24, 24], maxZoom: 6 });
    }
  }, [resetTrigger, map]);

  return null;
};

export const GisMap: React.FC = () => {
  const [resetTrigger, setResetTrigger] = useState(0);
  const [isLegendOpen, setIsLegendOpen] = useState(false);

  const {
    disasters,
    warehouses,
    selectedDisaster,
    setSelectedDisaster,
    selectedWarehouse,
    setSelectedWarehouse,
    hazardFilter,
    severityFilter,
    mapLayers,
  } = useApp();

  // Filter disasters according to active filters & layer toggles
  const filteredDisasters = useMemo(() => {
    return disasters.filter((d) => {
      if (hazardFilter !== 'ALL' && d.type !== hazardFilter) return false;
      if (severityFilter !== 'ALL' && d.severity !== severityFilter) return false;
      if (d.type === 'HEAVY_RAIN' && !mapLayers.rain) return false;
      if (d.type === 'CYCLONE' && !mapLayers.cyclone) return false;
      if (d.type === 'EARTHQUAKE' && !mapLayers.earthquake) return false;
      if (d.type === 'TSUNAMI' && !mapLayers.tsunami) return false;
      return true;
    });
  }, [disasters, hazardFilter, severityFilter, mapLayers]);

  return (
    <div className="relative w-full h-full bg-[#EBF2F9] rounded-lg overflow-hidden border border-[#CFE2F2]">
      <MapContainer
        bounds={INDIA_BOUNDS}
        boundsOptions={{ padding: [24, 24] }}
        minZoom={3.5}
        maxZoom={18}
        zoomSnap={0.25}
        zoomDelta={0.5}
        zoomControl={false}
        className="w-full h-full z-0"
        style={{ minHeight: '100%', height: '100%', width: '100%' }}
      >
        {/* OpenStreetMap Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        <MapController
          selectedDisaster={selectedDisaster}
          selectedWarehouse={selectedWarehouse}
          resetTrigger={resetTrigger}
        />

        {/* 1. Disaster Markers & Impact Rings */}
        {filteredDisasters.map((d) => {
          const isSelected = selectedDisaster?.id === d.id;
          const markerIcon = createDisasterIcon(d.type, isSelected);

          let color = '#D97706';
          if (d.severity === 'CRITICAL') {
            color = '#DC2626';
          } else if (d.severity === 'NORMAL') {
            color = '#16A34A';
          }

          const hasBufferRing = d.severity === 'CRITICAL' || d.type === 'CYCLONE';
          const radiusMeters = d.type === 'CYCLONE' ? 120000 : 35000;

          return (
            <React.Fragment key={d.id}>
              <Marker
                position={d.coordinates}
                icon={markerIcon}
                eventHandlers={{
                  click: () => {
                    setSelectedDisaster(d);
                    setSelectedWarehouse(null);
                  },
                }}
              />
              {hasBufferRing && (
                <Circle
                  center={d.coordinates}
                  radius={radiusMeters}
                  pathOptions={{
                    color,
                    fillColor: color,
                    fillOpacity: 0.12,
                    weight: 1.5,
                    dashArray: '4, 4',
                  }}
                />
              )}
            </React.Fragment>
          );
        })}

        {/* 2. Warehouse Markers */}
        {mapLayers.warehouses &&
          warehouses.map((w) => {
            const isSelected = selectedWarehouse?.id === w.id;
            const markerIcon = createWarehouseIcon(isSelected);

            return (
              <Marker
                key={w.id}
                position={w.coordinates}
                icon={markerIcon}
                eventHandlers={{
                  click: () => {
                    setSelectedWarehouse(w);
                    setSelectedDisaster(null);
                  },
                }}
              />
            );
          })}
      </MapContainer>

      {/* Space-Optimized Collapsible Legend Dropdown */}
      <div className="absolute top-3 left-3 z-[1000] select-none">
        <button
          onClick={() => setIsLegendOpen((prev) => !prev)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 hover:bg-white text-[#152B44] text-xs font-semibold rounded-lg shadow-sm border border-[#CFE2F2] cursor-pointer transition-all backdrop-blur-xs"
          title="Toggle map legend"
          aria-expanded={isLegendOpen}
        >
          <span>Legend</span>
          {isLegendOpen ? (
            <ChevronUp className="w-3.5 h-3.5 text-[#516C8A]" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-[#516C8A]" />
          )}
        </button>

        {isLegendOpen && (
          <div className="mt-1.5 p-3 bg-white/95 backdrop-blur-xs rounded-lg shadow-md border border-[#CFE2F2] text-xs min-w-[190px]">
            <div className="font-semibold text-[#152B44] pb-1.5 mb-2 border-b border-[#CFE2F2] flex items-center justify-between text-[11px]">
              <span>All Hazards & Depots</span>
              <button
                onClick={() => setResetTrigger((prev) => prev + 1)}
                title="Reset to full India view"
                className="text-[10px] text-[#2853f3] hover:underline cursor-pointer font-medium"
              >
                Reset Map
              </button>
            </div>
            <div className="flex flex-col gap-2 text-xs text-[#152B44]">
              <div className="flex items-center gap-2">
                <img src="/heavy-rain.png" className="w-4 h-4 object-contain shrink-0" alt="Heavy Rain" />
                <span>Heavy Rain</span>
              </div>
              <div className="flex items-center gap-2">
                <img src="/tornado.png" className="w-4 h-4 object-contain shrink-0" alt="Cyclone" />
                <span>Cyclone</span>
              </div>
              <div className="flex items-center gap-2">
                <img src="/earthquake.png" className="w-4 h-4 object-contain shrink-0" alt="Earthquake" />
                <span>Earthquake</span>
              </div>
              <div className="flex items-center gap-2">
                <img src="/tsunami.png" className="w-4 h-4 object-contain shrink-0" alt="Tsunami" />
                <span>Tsunami</span>
              </div>
              <div className="flex items-center gap-2">
                <img src="/warehouse.png" className="w-4 h-4 object-contain shrink-0" alt="Warehouse" />
                <span>Warehouse</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
