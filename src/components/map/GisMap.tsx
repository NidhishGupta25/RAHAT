import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useApp } from '../../context/AppContext';
import { DisasterEvent, Warehouse, TransportRoute } from '../../types';

interface GisMapProps {
  height?: string;
  onSelectFeature?: (feature: { type: 'disaster' | 'warehouse' | 'route'; data: any }) => void;
  expanded?: boolean;
}

export const GisMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  const {
    disasters,
    warehouses,
    routes,
    selectedDisaster,
    setSelectedDisaster,
    selectedWarehouse,
    setSelectedWarehouse,
    selectedRoute,
    setSelectedRoute,
    hazardFilter,
    severityFilter,
    mapLayers,
  } = useApp();

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Center of India
    const map = L.map(mapContainerRef.current, {
      center: [21.7679, 78.8718],
      zoom: 5,
      minZoom: 4,
      maxZoom: 16,
      zoomControl: false,
    });

    // Light CartoDB Positron basemap
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    // Zoom controls positioned top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    layerGroupRef.current = layerGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers & Layers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // 1. Render Disasters
    const filteredDisasters = disasters.filter((d) => {
      if (hazardFilter !== 'ALL' && d.type !== hazardFilter) return false;
      if (severityFilter !== 'ALL' && d.severity !== severityFilter) return false;
      if (d.type === 'HEAVY_RAIN' && !mapLayers.rain) return false;
      if (d.type === 'CYCLONE' && !mapLayers.cyclone) return false;
      if (d.type === 'EARTHQUAKE' && !mapLayers.earthquake) return false;
      if (d.type === 'TSUNAMI' && !mapLayers.tsunami) return false;
      return true;
    });

    filteredDisasters.forEach((d) => {
      const isSelected = selectedDisaster?.id === d.id;

      let color = '#D97706';
      let bgLight = '#FEF3C7';
      if (d.severity === 'CRITICAL') {
        color = '#DC2626';
        bgLight = '#FEE2E2';
      } else if (d.severity === 'NORMAL') {
        color = '#16A34A';
        bgLight = '#DCFCE7';
      }

      // Icon symbol based on type
      let symbol = '🌧';
      if (d.type === 'CYCLONE') symbol = '🌀';
      if (d.type === 'EARTHQUAKE') symbol = '⚡';
      if (d.type === 'TSUNAMI') symbol = '🌊';

      const customIcon = L.divIcon({
        className: 'custom-disaster-marker',
        html: `
          <div style="
            position: relative;
            width: ${isSelected ? '38px' : '30px'};
            height: ${isSelected ? '38px' : '30px'};
            background: ${bgLight};
            border: 2px solid ${color};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: ${isSelected ? '16px' : '13px'};
            box-shadow: 0 2px 8px rgba(37,99,235,0.15);
            cursor: pointer;
            transition: all 0.2s ease;
            ${isSelected ? 'transform: scale(1.1); outline: 3px solid rgba(37, 99, 235, 0.4);' : ''}
          ">
            <span>${symbol}</span>
            <div style="
              position: absolute;
              bottom: -4px;
              right: -4px;
              width: 10px;
              height: 10px;
              background-color: ${color};
              border: 1.5px solid #ffffff;
              border-radius: 50%;
            "></div>
          </div>
        `,
        iconSize: [isSelected ? 38 : 30, isSelected ? 38 : 30],
        iconAnchor: [isSelected ? 19 : 15, isSelected ? 19 : 15],
      });

      const marker = L.marker(d.coordinates, { icon: customIcon });

      marker.on('click', () => {
        setSelectedDisaster(d);
        setSelectedWarehouse(null);
        setSelectedRoute(null);
      });

      // Buffer ring around critical areas
      if (d.severity === 'CRITICAL' || d.type === 'CYCLONE') {
        const radiusMeters = d.type === 'CYCLONE' ? 120000 : 35000;
        const circle = L.circle(d.coordinates, {
          color: color,
          fillColor: color,
          fillOpacity: 0.12,
          weight: 1.5,
          dashArray: '4, 4',
        });
        circle.addTo(layerGroup);
      }

      marker.addTo(layerGroup);
    });

    // 2. Render Warehouses
    if (mapLayers.warehouses) {
      warehouses.forEach((w) => {
        const isSelected = selectedWarehouse?.id === w.id;
        const warehouseIcon = L.divIcon({
          className: 'custom-warehouse-marker',
          html: `
            <div style="
              width: 24px;
              height: 24px;
              background-color: #2853f3;
              color: #ffffff;
              border: 2px solid #ffffff;
              border-radius: 4px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 11px;
              font-weight: 700;
              box-shadow: 0 2px 6px rgba(40,83,243,0.3);
              cursor: pointer;
              ${isSelected ? 'transform: scale(1.15); outline: 2px solid #2853f3;' : ''}
            ">
              W
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const marker = L.marker(w.coordinates, { icon: warehouseIcon });
        marker.on('click', () => {
          setSelectedWarehouse(w);
          setSelectedDisaster(null);
          setSelectedRoute(null);
        });
        marker.addTo(layerGroup);
      });
    }

    // 3. Render Logistics Routes
    if (mapLayers.routes) {
      routes.forEach((r) => {
        const isSelected = selectedRoute?.id === r.id;
        let routeColor = '#2853f3';
        if (r.status === 'ROUTE_CLEARANCE' || r.bottleneckWarning) {
          routeColor = '#D9822B';
        }

        const polyline = L.polyline(r.waypoints, {
          color: routeColor,
          weight: isSelected ? 3.5 : 2,
          opacity: isSelected ? 0.95 : 0.7,
          dashArray: r.mode === 'IAF_AIRLIFT' ? '6, 8' : undefined,
        });

        polyline.on('click', () => {
          setSelectedRoute(r);
          setSelectedDisaster(null);
          setSelectedWarehouse(null);
        });

        polyline.addTo(layerGroup);
      });
    }
  }, [
    disasters,
    warehouses,
    routes,
    selectedDisaster,
    selectedWarehouse,
    selectedRoute,
    hazardFilter,
    severityFilter,
    mapLayers,
  ]);

  // Center on selected disaster when changed externally
  useEffect(() => {
    if (selectedDisaster && mapInstanceRef.current) {
      mapInstanceRef.current.panTo(selectedDisaster.coordinates, { animate: true, duration: 0.8 });
    }
  }, [selectedDisaster]);

  const resetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([21.7679, 78.8718], 5, { animate: true });
    }
  };

  return (
    <div className="relative w-full h-full bg-[#EBF2F9] rounded-lg overflow-hidden border border-[#CFE2F2]">
      <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: '100%' }} />

      {/* Quick Map Controls Overlay */}
      <div className="absolute top-3 left-3 z-[1000] flex flex-col gap-1.5 bg-white/95 backdrop-blur-xs p-2.5 rounded-md shadow-xs border border-[#CFE2F2] text-xs">
        <div className="font-semibold text-[#152B44] flex items-center justify-between pb-1 border-b border-[#CFE2F2]">
          <span>Legend</span>
          <button
            onClick={resetView}
            title="Reset to India view"
            className="text-[11px] text-[#2853f3] hover:underline cursor-pointer font-normal"
          >
            Reset
          </button>
        </div>
        <div className="grid grid-cols-2 gap-x-2.5 gap-y-1 pt-0.5 text-[11px] text-[#516C8A]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#D95D58] inline-block"></span> Critical
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#D9822B] inline-block"></span> Alert
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-[#2853f3] rounded-xs inline-block"></span> Depot
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#2853f3] inline-block"></span> Route
          </span>
        </div>
      </div>
    </div>
  );
};
