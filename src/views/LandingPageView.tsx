import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  ArrowRight,
  Activity,
  Layers,
  Building2,
  Truck,
  Radio,
  Navigation,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  PhoneCall,
  Compass,
  Waves,
  CloudRain,
  Wind,
} from 'lucide-react';
import { RahatLogoText } from '../components/common/RahatLogoText';

export const LandingPageView: React.FC = () => {
  const { setCurrentPage, navigateToTab, disasters, warehouses, routes, dataSources } = useApp();
  const [activeSchemaTab, setActiveSchemaTab] = useState<'telemetry' | 'allocation' | 'corridors'>('telemetry');

  const healthyFeedsCount = dataSources.filter((d) => d.status === 'HEALTHY').length;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen w-full bg-[#F0F5FA] text-[#152B44] flex flex-col selection:bg-[#CFE2F2] selection:text-[#152B44]">
      {/* 
        NAVBAR:
        Contains ONLY:
        1. Home
        2. Dashboard Operations ->
        3. Login/Signin
      */}
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-[#CFE2F2] shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo with Disaster1.jpg & Redesigned RAHAT Typography */}
          <div
            onClick={scrollToTop}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative">
              <img
                src="/Disaster1.jpg"
                alt="RAHAT Official Emblem"
                className="w-10 h-10 object-contain rounded-full ring-2 ring-[#CFE2F2] bg-white shadow-2xs p-0.5 group-hover:ring-[#4688C8] transition-all"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#359868] border-2 border-white rounded-full animate-pulse" />
            </div>
            <div className="flex flex-col">
              <RahatLogoText className="h-6 w-auto" color="#0A2342" />
              <span className="text-[9px] font-bold text-[#516C8A] uppercase tracking-wider mt-1">
                Disaster Intelligence & Logistics
              </span>
            </div>
          </div>

          {/* 
            Navigation Items: ONLY Home, Dashboard Operations ->, and Login/Signin 
          */}
          <nav className="flex items-center gap-2 sm:gap-3">
            {/* 1. Home */}
            <button
              onClick={scrollToTop}
              className="px-3.5 py-1.5 text-xs font-semibold text-[#152B44] hover:text-[#2C6EA6] hover:bg-[#E8F3FC] rounded-lg transition-colors cursor-pointer"
            >
              Home
            </button>

            {/* 2. Dashboard Operations -> */}
            <button
              onClick={() => navigateToTab('overview')}
              className="px-3.5 py-1.5 text-xs font-bold text-[#2C6EA6] bg-[#E8F3FC] hover:bg-[#D2E7F8] border border-[#CFE2F2] rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <span>Dashboard Operations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* 3. Login/Signin */}
            <button
              onClick={() => setCurrentPage('login')}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#4688C8] hover:bg-[#3374B2] rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Login / Sign In</span>
            </button>
          </nav>
        </div>
      </header>

      {/* MAIN BODY */}
      <main className="flex-1">
        {/* HERO SECTION - REFERENCING STRUCTURE & SCHEMA */}
        <section className="relative overflow-hidden pt-8 pb-14 md:pt-12 md:pb-18 border-b border-[#CFE2F2] bg-gradient-to-b from-[#F0F5FA] via-[#FAFBFD] to-[#F0F5FA]">
          {/* Subtle background ambient glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-[#E8F2FA]/50 via-[#CFE2F2]/30 to-[#E8F3FC]/50 blur-3xl -z-10 pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Mission, Title, and Action Triggers */}
              <div className="lg:col-span-6 space-y-5">
                {/* Status Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F3FC] border border-[#CFE2F2] text-[#2C6EA6] text-xs font-semibold shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-[#359868] animate-pulse" />
                  <span>National Crisis Command & Telemetry Grid</span>
                </div>

                {/* Main Heading */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#152B44] tracking-tight leading-[1.15]">
                  Rapid Allocation for Hazard Assessment & Transport
                </h1>

                {/* Purpose Description */}
                <p className="text-sm sm:text-base text-[#516C8A] leading-relaxed font-normal">
                  India's unified disaster response intelligence system. Combining real-time multi-hazard telemetry, automated district relief demand computation, and multimodal transport logistics to accelerate life-saving delivery during critical windows.
                </p>

                {/* Action CTAs */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => navigateToTab('overview')}
                    className="px-5 py-2.5 bg-[#4688C8] hover:bg-[#3374B2] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>Dashboard Operations</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setCurrentPage('login')}
                    className="px-4 py-2.5 bg-white hover:bg-[#FAFBFD] text-[#2C6EA6] font-semibold text-xs sm:text-sm rounded-xl border border-[#CFE2F2] shadow-2xs hover:border-[#88BCE5] transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#4688C8]" />
                    <span>Login / Sign In</span>
                  </button>
                </div>

                {/* Quick Feature Metric Highlights */}
                <div className="pt-3 grid grid-cols-3 gap-3 border-t border-[#CFE2F2]/80">
                  <div className="bg-white/80 p-2.5 rounded-xl border border-[#CFE2F2]">
                    <div className="text-[10px] font-semibold text-[#516C8A] uppercase">
                      Hazard Types
                    </div>
                    <div className="text-lg font-bold text-[#152B44] mt-0.5">
                      8 Monitored
                    </div>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded-xl border border-[#CFE2F2]">
                    <div className="text-[10px] font-semibold text-[#516C8A] uppercase">
                      Depots Linked
                    </div>
                    <div className="text-lg font-bold text-[#152B44] mt-0.5">
                      {warehouses.length} Active Hubs
                    </div>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded-xl border border-[#CFE2F2]">
                    <div className="text-[10px] font-semibold text-[#516C8A] uppercase">
                      Sensor Feeds
                    </div>
                    <div className="text-lg font-bold text-[#359868] mt-0.5">
                      {healthyFeedsCount} Online
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Visual - High-Resolution India Disaster Response Map */}
              <div className="lg:col-span-6">
                <div className="relative rounded-2xl p-2 bg-gradient-to-tr from-[#CFE2F2] via-white to-[#E8F3FC] border border-[#CFE2F2] shadow-sm">
                  <div className="relative rounded-xl overflow-hidden bg-white border border-[#CFE2F2] shadow-inner group">
                    <img
                      src="/rahat_login_hero.jpg"
                      alt="Disaster Response & Relief Map: India"
                      className="w-full h-auto max-h-[460px] object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
                    />

                    {/* Floating Telemetry Badges */}
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#CFE2F2] shadow-xs flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#D95D58] animate-ping" />
                      <span className="text-[11px] font-bold text-[#152B44]">
                        Live Spatial Telemetry
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-lg border border-[#CFE2F2] shadow-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#359868]" />
                        <span className="text-[11px] font-semibold text-[#152B44]">
                          National Logistics Grid Active
                        </span>
                      </div>
                      <button
                        onClick={() => navigateToTab('map')}
                        className="text-[11px] font-bold text-[#4688C8] hover:text-[#2C6EA6] flex items-center gap-1 cursor-pointer"
                      >
                        <span>Open GIS Map</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LIVE OPERATIONAL METRICS BAR */}
        <section className="py-6 bg-white border-b border-[#CFE2F2]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div
                onClick={() => navigateToTab('monitoring')}
                className="bg-[#FAFBFD] hover:bg-[#F0F5FA] p-3.5 rounded-xl border border-[#CFE2F2] shadow-2xs transition-all cursor-pointer flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-[#FBEAE9] text-[#D95D58] flex items-center justify-center shrink-0">
                  <Radio className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#516C8A] uppercase tracking-wider">
                    Hazard Alerts
                  </div>
                  <div className="text-lg font-extrabold text-[#152B44]">
                    {disasters.length} Active Events
                  </div>
                </div>
              </div>

              <div
                onClick={() => navigateToTab('warehouses')}
                className="bg-[#FAFBFD] hover:bg-[#F0F5FA] p-3.5 rounded-xl border border-[#CFE2F2] shadow-2xs transition-all cursor-pointer flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-[#E8F3FC] text-[#4688C8] flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#516C8A] uppercase tracking-wider">
                    Depot Inventory
                  </div>
                  <div className="text-lg font-extrabold text-[#152B44]">
                    {warehouses.length} National Hubs
                  </div>
                </div>
              </div>

              <div
                onClick={() => navigateToTab('logistics')}
                className="bg-[#FAFBFD] hover:bg-[#F0F5FA] p-3.5 rounded-xl border border-[#CFE2F2] shadow-2xs transition-all cursor-pointer flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-[#E8F3FC] text-[#4688C8] flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#516C8A] uppercase tracking-wider">
                    Transit Corridors
                  </div>
                  <div className="text-lg font-extrabold text-[#152B44]">
                    {routes.length} Active Convoys
                  </div>
                </div>
              </div>

              <div
                onClick={() => navigateToTab('overview')}
                className="bg-[#FAFBFD] hover:bg-[#F0F5FA] p-3.5 rounded-xl border border-[#CFE2F2] shadow-2xs transition-all cursor-pointer flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-[#EAF5EF] text-[#359868] flex items-center justify-center shrink-0">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#516C8A] uppercase tracking-wider">
                    Telemetry Uptime
                  </div>
                  <div className="text-lg font-extrabold text-[#359868]">
                    {healthyFeedsCount}/{dataSources.length} Feeds Online
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CORE DISASTER RESPONSE SCHEMA & STRUCTURE */}
        <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#4688C8] bg-[#E8F3FC] px-3 py-1 rounded-full border border-[#CFE2F2]">
              Operational Framework
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#152B44] tracking-tight pt-1">
              Three-Tier Disaster Response Schema
            </h2>
            <p className="text-xs sm:text-sm text-[#516C8A]">
              From real-time atmospheric sensing to multimodal delivery coordination on the ground.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Schema Stage 1 */}
            <div className="bg-white p-6 rounded-2xl border border-[#CFE2F2] shadow-2xs flex flex-col justify-between hover:border-[#88BCE5] transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#E8F3FC] text-[#4688C8] flex items-center justify-center font-bold">
                    <CloudRain className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8F2FA] text-[#2C6EA6] border border-[#CFE2F2]">
                    Phase 01
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#152B44] mb-2">
                  Multi-Hazard Telemetry Ingestion
                </h3>
                <p className="text-xs text-[#516C8A] leading-relaxed mb-4">
                  Continuous ingestion of IMD Doppler radar reflectivity, Central Water Commission flood gauge stages, seismic waves, and coastal tsunami warning buoys.
                </p>
                <div className="space-y-2 text-xs text-[#152B44]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#359868] shrink-0" />
                    <span>Real-time storm tracking and cyclone landfall radius</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#359868] shrink-0" />
                    <span>Sub-minute automated warning triage</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigateToTab('monitoring')}
                className="mt-5 pt-3 border-t border-[#CFE2F2] text-xs font-semibold text-[#2C6EA6] hover:text-[#152B44] flex items-center justify-between cursor-pointer"
              >
                <span>Inspect Hazard Telemetry</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Schema Stage 2 */}
            <div className="bg-white p-6 rounded-2xl border border-[#CFE2F2] shadow-2xs flex flex-col justify-between hover:border-[#88BCE5] transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#E8F3FC] text-[#4688C8] flex items-center justify-center font-bold">
                    <Layers className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8F2FA] text-[#2C6EA6] border border-[#CFE2F2]">
                    Phase 02
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#152B44] mb-2">
                  Deficit & Need Allocation Engine
                </h3>
                <p className="text-xs text-[#516C8A] leading-relaxed mb-4">
                  Translates spatial impact zones into exact relief supply requirements, matching displaced population metrics with central warehouse stock reserves.
                </p>
                <div className="space-y-2 text-xs text-[#152B44]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#359868] shrink-0" />
                    <span>Dynamic drinking water, ration pack & medical kits estimation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#359868] shrink-0" />
                    <span>Inventory reservation locks preventing double-booking</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigateToTab('allocation')}
                className="mt-5 pt-3 border-t border-[#CFE2F2] text-xs font-semibold text-[#2C6EA6] hover:text-[#152B44] flex items-center justify-between cursor-pointer"
              >
                <span>View Allocation Engine</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Schema Stage 3 */}
            <div className="bg-white p-6 rounded-2xl border border-[#CFE2F2] shadow-2xs flex flex-col justify-between hover:border-[#88BCE5] transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#E8F3FC] text-[#4688C8] flex items-center justify-center font-bold">
                    <Truck className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8F2FA] text-[#2C6EA6] border border-[#CFE2F2]">
                    Phase 03
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#152B44] mb-2">
                  Multimodal Route Logistics
                </h3>
                <p className="text-xs text-[#516C8A] leading-relaxed mb-4">
                  Dynamic transit navigation routing road convoys around landslides and flood inundation zones, while synchronizing IAF air-drops and rail logistics.
                </p>
                <div className="space-y-2 text-xs text-[#152B44]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#359868] shrink-0" />
                    <span>Automated green corridor transit authorization</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#359868] shrink-0" />
                    <span>Live GPS waypoint dispatch tracking</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigateToTab('logistics')}
                className="mt-5 pt-3 border-t border-[#CFE2F2] text-xs font-semibold text-[#2C6EA6] hover:text-[#152B44] flex items-center justify-between cursor-pointer"
              >
                <span>Review Transport Corridors</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>

        {/* INTERACTIVE INTELLIGENCE SHOWCASE (Disaster3.png & Interactive Schema Tabs) */}
        <section className="py-14 bg-[#FAFBFD] border-y border-[#CFE2F2]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-[#152B44] tracking-tight">
                Disaster Intelligence Architecture
              </h2>
              <p className="text-xs sm:text-sm text-[#516C8A]">
                Intelligent situational awareness coordinating response units across the subcontinent.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#CFE2F2] p-6 sm:p-8 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Schema Tabs & Information */}
              <div className="lg:col-span-6 space-y-5">
                <div className="flex gap-2 p-1 bg-[#E8F2FA] rounded-xl border border-[#CFE2F2]">
                  <button
                    onClick={() => setActiveSchemaTab('telemetry')}
                    className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      activeSchemaTab === 'telemetry'
                        ? 'bg-[#4688C8] text-white shadow-xs'
                        : 'text-[#516C8A] hover:text-[#152B44]'
                    }`}
                  >
                    Spatial Sensing
                  </button>
                  <button
                    onClick={() => setActiveSchemaTab('allocation')}
                    className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      activeSchemaTab === 'allocation'
                        ? 'bg-[#4688C8] text-white shadow-xs'
                        : 'text-[#516C8A] hover:text-[#152B44]'
                    }`}
                  >
                    Relief Modeling
                  </button>
                  <button
                    onClick={() => setActiveSchemaTab('corridors')}
                    className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      activeSchemaTab === 'corridors'
                        ? 'bg-[#4688C8] text-white shadow-xs'
                        : 'text-[#516C8A] hover:text-[#152B44]'
                    }`}
                  >
                    Fleet Routing
                  </button>
                </div>

                {activeSchemaTab === 'telemetry' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-[#152B44]">
                      Geospatial Surveillance & Radar Feeds
                    </h3>
                    <p className="text-xs text-[#516C8A] leading-relaxed">
                      Unified layer blending satellite thermal sensing, Doppler storm radar, river gauge levels, and seismic event telemetry.
                    </p>
                    <ul className="space-y-2 text-xs text-[#152B44]">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#359868] shrink-0" />
                        <span>Interactive 100km radius impact containment zones</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#359868] shrink-0" />
                        <span>High-frequency automated threat level classification</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#359868] shrink-0" />
                        <span>Integration with verified observer telemetry</span>
                      </li>
                    </ul>
                  </div>
                )}

                {activeSchemaTab === 'allocation' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-[#152B44]">
                      Automated Relief Deficit Computation
                    </h3>
                    <p className="text-xs text-[#516C8A] leading-relaxed">
                      Computes immediate district relief quotas based on displacement modeling and inventory reserves across key regional depots.
                    </p>
                    <ul className="space-y-2 text-xs text-[#152B44]">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#359868] shrink-0" />
                        <span>Rationing algorithms for water pouches, food kits & tents</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#359868] shrink-0" />
                        <span>Critical deficit alerts for quick warehouse replenishment</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#359868] shrink-0" />
                        <span>Audit-ready requisition proposals for command clearance</span>
                      </li>
                    </ul>
                  </div>
                )}

                {activeSchemaTab === 'corridors' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-[#152B44]">
                      Safe Transit & Multimodal Freight
                    </h3>
                    <p className="text-xs text-[#516C8A] leading-relaxed">
                      Directs rescue convoys through open national highways, orchestrates rail rakes, and triggers emergency air drops for isolated valleys.
                    </p>
                    <ul className="space-y-2 text-xs text-[#152B44]">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#359868] shrink-0" />
                        <span>Automated detour around landslides and washed-out bridges</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#359868] shrink-0" />
                        <span>Live GPS convoy telemetry and delivery verification</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#359868] shrink-0" />
                        <span>Seamless handoff to NDRF and local district authorities</span>
                      </li>
                    </ul>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    onClick={() => navigateToTab('overview')}
                    className="px-4 py-2 bg-[#E8F3FC] hover:bg-[#D2E7F8] text-[#2C6EA6] font-bold text-xs rounded-xl border border-[#CFE2F2] transition-colors flex items-center gap-2 cursor-pointer shadow-2xs"
                  >
                    <span>Dashboard Operations</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Right Column: 3D Isometric Disaster Response Illustration (Disaster3.png) */}
              <div className="lg:col-span-6">
                <div className="bg-[#E8F2FA] p-3 sm:p-4 rounded-2xl border border-[#CFE2F2]">
                  <div className="relative rounded-xl overflow-hidden border border-[#CFE2F2] bg-white shadow-2xs">
                    <img
                      src="/Disaster3.png"
                      alt="Disaster Response Cutout: India"
                      className="w-full h-auto max-h-[360px] object-contain block mx-auto py-2"
                    />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-white/95 backdrop-blur-xs p-2.5 rounded-lg border border-[#CFE2F2] shadow-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#359868] animate-ping" />
                        <span className="text-[11px] font-bold text-[#152B44]">
                          National Crisis Coordination Grid
                        </span>
                      </div>
                      <button
                        onClick={() => navigateToTab('map')}
                        className="text-[10px] font-bold text-[#4688C8] hover:text-[#2C6EA6] flex items-center gap-1 cursor-pointer"
                      >
                        <span>Interactive Map</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CORE CAPABILITIES MODULES */}
        <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-[#152B44] tracking-tight">
              Operational Command Capabilities
            </h2>
            <p className="text-xs sm:text-sm text-[#516C8A]">
              Modular tools tailored for district collectors, warehouse superintendents, and logistics officers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Capability 1 */}
            <div
              onClick={() => navigateToTab('map')}
              className="bg-white p-5 rounded-2xl border border-[#CFE2F2] shadow-2xs hover:border-[#88BCE5] transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#E8F3FC] text-[#4688C8] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Navigation className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-[#152B44] mb-1.5">
                  Live GIS Geospatial Map
                </h4>
                <p className="text-xs text-[#516C8A] leading-relaxed">
                  Interactive multi-layer geospatial visualization tracking storm tracks, seismic epicenters, river gauge levels, and warehouses.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#CFE2F2] text-[11px] font-bold text-[#2C6EA6] flex items-center justify-between">
                <span>Open GIS Map</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Capability 2 */}
            <div
              onClick={() => navigateToTab('monitoring')}
              className="bg-white p-5 rounded-2xl border border-[#CFE2F2] shadow-2xs hover:border-[#88BCE5] transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#E8F3FC] text-[#4688C8] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Activity className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-[#152B44] mb-1.5">
                  Multi-Hazard Feeds
                </h4>
                <p className="text-xs text-[#516C8A] leading-relaxed">
                  Real-time telemetry ingestion from IMD Doppler Radars, Central Water Commission flood monitors, and seismological sensors.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#CFE2F2] text-[11px] font-bold text-[#2C6EA6] flex items-center justify-between">
                <span>View Hazard Feeds</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Capability 3 */}
            <div
              onClick={() => navigateToTab('warehouses')}
              className="bg-white p-5 rounded-2xl border border-[#CFE2F2] shadow-2xs hover:border-[#88BCE5] transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#E8F3FC] text-[#4688C8] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Building2 className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-[#152B44] mb-1.5">
                  Depot Inventory Control
                </h4>
                <p className="text-xs text-[#516C8A] leading-relaxed">
                  Real-time auditing across national warehouses, reservation locks, stock replenishment alerts, and batch allocation tracking.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#CFE2F2] text-[11px] font-bold text-[#2C6EA6] flex items-center justify-between">
                <span>Inspect Warehouses</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Capability 4 */}
            <div
              onClick={() => navigateToTab('logistics')}
              className="bg-white p-5 rounded-2xl border border-[#CFE2F2] shadow-2xs hover:border-[#88BCE5] transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#E8F3FC] text-[#4688C8] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Truck className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-[#152B44] mb-1.5">
                  Logistics & Transport
                </h4>
                <p className="text-xs text-[#516C8A] leading-relaxed">
                  Multimodal route computation covering highway convoys, freight trains, air force drops, and coastal watercraft corridors.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#CFE2F2] text-[11px] font-bold text-[#2C6EA6] flex items-center justify-between">
                <span>Track Convoys</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </section>

        {/* LOGO & COMMAND ACCESS CALLOUT BANNER */}
        <section className="py-12 bg-white border-t border-[#CFE2F2]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="bg-gradient-to-r from-[#FAFBFD] via-[#F0F5FA] to-[#E8F3FC] p-6 sm:p-8 rounded-2xl border border-[#CFE2F2] shadow-2xs flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Left: Official Circular Crest + Text */}
              <div className="flex items-center gap-5">
                <img
                  src="/rahat_logo.jpg"
                  alt="RAHAT Seal"
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-full ring-2 ring-[#CFE2F2] bg-white shadow-xs shrink-0"
                />
                <div className="space-y-1 text-center md:text-left">
                  <div className="pt-0.5">
                    <RahatLogoText className="h-6 sm:h-7 w-auto" color="#0A2342" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#152B44]">
                    Ready to access national disaster operations?
                  </h3>
                  <p className="text-xs text-[#516C8A] max-w-md">
                    Open visibility into live feeds and public assistance. Secure credentials required for inventory dispatch and convoy authorization.
                  </p>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5 shrink-0 w-full md:w-auto">
                <button
                  onClick={() => navigateToTab('overview')}
                  className="w-full sm:w-auto px-4 py-2.5 bg-[#4688C8] hover:bg-[#3374B2] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Dashboard Operations</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setCurrentPage('login')}
                  className="w-full sm:w-auto px-4 py-2.5 bg-white hover:bg-[#FAFBFD] text-[#2C6EA6] border border-[#CFE2F2] text-xs font-bold rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Login / Sign In</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="w-full bg-[#FAFBFD] border-t border-[#CFE2F2] py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#516C8A]">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-2.5">
            <img
              src="/Disaster1.jpg"
              alt="RAHAT Logo"
              className="w-7 h-7 object-contain rounded-full ring-1 ring-[#CFE2F2] bg-white"
            />
            <RahatLogoText className="h-4.5 w-auto" color="#0A2342" />
            <span className="text-[#CFE2F2]">|</span>
            <span>Rapid Allocation for Hazard Assessment & Transport</span>
          </div>

          {/* Nav links matching the 3 components + Emergency */}
          <div className="flex items-center gap-5 text-xs font-medium">
            <button
              onClick={scrollToTop}
              className="hover:text-[#2C6EA6] cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => navigateToTab('overview')}
              className="hover:text-[#2C6EA6] cursor-pointer"
            >
              Dashboard Operations
            </button>
            <button
              onClick={() => setCurrentPage('login')}
              className="text-[#2C6EA6] font-semibold hover:underline cursor-pointer"
            >
              Login / Sign In
            </button>
            <span className="text-[#CFE2F2]">|</span>
            <span className="text-[#516C8A] font-semibold flex items-center gap-1">
              <PhoneCall className="w-3 h-3 text-[#359868]" />
              <span>Emergency: 1070 / 112</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
