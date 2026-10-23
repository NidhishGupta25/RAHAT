import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowRight,
  LogIn,
  Activity,
  Layers,
  Truck,
  Wifi,
  Battery,
} from 'lucide-react';
import { RahatLogoText } from '../components/common/RahatLogoText';

export const LandingPageView: React.FC = () => {
  const { setCurrentPage } = useApp();

  return (
    <div className="min-h-screen w-full bg-[#F3F7FB] text-[#152B44] flex flex-col selection:bg-[#DCE5FF] selection:text-[#2853f3]">
      {/* 
        TOP NAVBAR
        Both buttons (Operations Dashboard & Sign In) filled with #2853F3 and white text/icons.
        Clicking the RAHAT logo redirects to the main landing page.
      */}
      <header className="sticky top-0 z-50 w-full h-16 bg-white/90 backdrop-blur-md border-b border-[#D8E6F3] shadow-2xs">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Logo with Disaster1.jpg & RAHAT in Luckiest Guy font (Redirects to main landing page on click) */}
          <div
            onClick={() => setCurrentPage('landing')}
            className="flex items-center gap-3 select-none cursor-pointer group"
            title="Return to Main Landing Page"
          >
            <div className="relative">
              <img
                src="/Disaster1.jpg"
                alt="RAHAT Official Emblem"
                className="w-10 h-10 object-contain rounded-full ring-2 ring-[#CFE2F2] group-hover:ring-[#2853f3] bg-white shadow-2xs p-0.5 transition-all"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#359868] border-2 border-white rounded-full" />
            </div>
            <div className="flex flex-col">
              <RahatLogoText className="text-2xl leading-none group-hover:opacity-90 transition-opacity" color="#141478" />
              <span className="text-[9px] font-bold text-[#516C8A] uppercase tracking-wider mt-0.5">
                Disaster Intelligence Platform
              </span>
            </div>
          </div>

          {/* Nav Actions: Operations Dashboard & Sign In with background-color: #2853f3 */}
          <nav className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={() => setCurrentPage('dashboard')}
              className="px-4 py-2 rounded-xl bg-[#2853f3] hover:bg-[#1e42d9] border border-[#2853f3] text-xs sm:text-sm font-semibold text-white shadow-xs hover:shadow-md transition-all duration-150 cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0"
            >
              <span>Operations Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </button>

            <button
              onClick={() => setCurrentPage('login')}
              className="px-4 py-2 rounded-xl bg-[#2853f3] hover:bg-[#1e42d9] border border-[#2853f3] text-xs sm:text-sm font-semibold text-white shadow-xs hover:shadow-md transition-all duration-150 cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0"
            >
              <LogIn className="w-3.5 h-3.5 text-white" />
              <span>Sign In</span>
            </button>
          </nav>
        </div>
      </header>

      {/* 
        FIRST MAIN HERO SECTION:
        - Faded and low-visibility background image from rahatbg.png
        - Left side headline split into 3 lines with color: #141478
        - Padding: pt-[35px] pb-[48px]
      */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[35px] pb-[48px] min-h-[calc(100vh-4rem)] flex items-center justify-center">
        {/* Faded and very low visibility background image from rahatbg.png */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center -z-10 select-none">
          <img
            src="/rahatbg.png"
            alt=""
            className="w-full h-full object-cover object-center opacity-[0.15] mix-blend-multiply pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F3F7FB]/75 via-transparent to-[#F3F7FB]/40" />
        </div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headline arranged across 3 distinct lines, color: #141478 */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left -translate-y-4 lg:-translate-y-8">
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-black text-[#141478] tracking-tight leading-[1.12]">
                <span className="block text-[#141478] pt-0 mb-0">Rapid Allocation</span>
                <span className="block text-[#141478] mb-0 pb-0">for Hazard Assessment</span>
                <span className="block text-[#141478] pb-0">and Transport</span>
              </h1>

              <p className="text-sm sm:text-base text-[#4D6582] font-normal leading-relaxed max-w-lg mx-auto lg:mx-0 pb-[30px]">
                A unified platform connecting multi-hazard surveillance, predictive depot stockpiling, and priority green-corridor response for disaster relief across India.
              </p>
            </div>
          </div>

          {/* Right Column: iPad Pro UI with pr-[40px] pb-0 pl-0 h-[558.125px] */}
          <div
            className="lg:col-span-6 flex justify-center lg:justify-end items-center pr-[40px] pb-0 pl-0 h-[558.125px]"
          >
            <div className="relative w-full max-w-[340px] sm:max-w-[370px] lg:max-w-[390px] lg:translate-x-6 xl:translate-x-8">
              {/* Soft Ambient Depth Glow with #2853f3 tint */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#2853f3]/15 via-[#2853f3]/15 to-[#359868]/10 rounded-[2.5rem] blur-2xl pointer-events-none" />

              {/* Realistic iPad Hardware Unibody Chassis with pt-[14px] */}
              <div className="relative bg-[#1C1D21] p-3 sm:p-3.5 pt-[14px] rounded-[32px] sm:rounded-[36px] shadow-[0_24px_50px_-12px_rgba(10,35,66,0.35),0_10px_20px_-8px_rgba(10,35,66,0.2)] ring-1 ring-black/40 border border-[#3A3D45]">
                {/* Hardware Power / Sleep button on top edge */}
                <div className="absolute -top-[3px] right-12 w-12 h-[3px] bg-[#3A3D45] rounded-t-sm" />
                
                {/* Hardware Volume rocker buttons on right edge */}
                <div className="absolute -right-[3px] top-12 w-[3px] h-8 bg-[#3A3D45] rounded-r-sm" />
                <div className="absolute -right-[3px] top-22 w-[3px] h-8 bg-[#3A3D45] rounded-r-sm" />

                {/* Top Chamfered Bezel with Front FaceTime Camera & Ambient Sensor */}
                <div className="flex items-center justify-center pb-2">
                  <div className="flex items-center gap-2">
                    {/* Camera Lens */}
                    <div className="w-2.5 h-2.5 rounded-full bg-[#0A0A0C] ring-1 ring-slate-800 flex items-center justify-center">
                      <div className="w-1 h-1 rounded-full bg-[#18233C]" />
                    </div>
                    {/* Ambient Light Sensor */}
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0D0E11]" />
                  </div>
                </div>

                {/* iPad Liquid Retina Display Screen (Lengthwise 3:4 portrait ratio) */}
                <div className="relative bg-white rounded-[22px] overflow-hidden shadow-inner flex flex-col border border-slate-200 aspect-[3/4]">
                  {/* iPadOS Status Bar */}
                  <div className="w-full px-4 py-1.5 flex items-center justify-between text-[11px] font-semibold text-slate-700 select-none bg-white border-b border-slate-100 shrink-0">
                    {/* Time */}
                    <div className="flex items-center gap-1">
                      <span>9:41</span>
                    </div>

                    {/* iPadOS Multitasking 3-dots Pill */}
                    <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-slate-100/80">
                      <span className="w-1 h-1 rounded-full bg-slate-400" />
                      <span className="w-1 h-1 rounded-full bg-slate-400" />
                      <span className="w-1 h-1 rounded-full bg-slate-400" />
                    </div>

                    {/* Status Icons: Wi-Fi, Reception, Battery */}
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Wifi className="w-3 h-3 text-slate-700" />
                      <div className="flex items-center gap-0.5">
                        <span className="text-[10px] font-medium text-slate-500">100%</span>
                        <Battery className="w-3.5 h-3.5 text-slate-700" />
                      </div>
                    </div>
                  </div>

                  {/* 
                    Seamless 3D Disaster Simulation Video
                    - Centered and scaled inside the lengthwise iPad viewport
                    - Zero controls, zero labels, zero black space
                    - Background matches pure white canvas
                  */}
                  <div className="relative flex-1 w-full bg-white flex items-center justify-center overflow-hidden p-2">
                    <video
                      src="/RAHATvideo.mp4"
                      autoPlay
                      loop
                      muted
                      playsInline
                      poster="/Disaster3.png"
                      className="w-full h-full object-contain select-none pointer-events-none border-0 outline-none"
                      style={{
                        border: 'none',
                        outline: 'none',
                        transform: 'translateZ(0)',
                        WebkitTransform: 'translateZ(0)',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        clipPath: 'inset(1.5px)',
                      }}
                    />
                  </div>

                  {/* iPadOS Bottom Home Indicator Bar */}
                  <div className="w-full py-2 bg-white flex justify-center items-center shrink-0">
                    <div className="w-28 sm:w-32 h-1 bg-slate-300 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Realistic Soft Contact Shadow beneath iPad */}
              <div className="h-3 w-4/5 mx-auto bg-slate-900/10 rounded-full blur-md mt-2" />
            </div>
          </div>
        </div>
      </section>

      {/* 
        THREE HORIZONTAL BLOCKS (Restored on scroll below main hero section):
        1. HAZARD INGESTION
        2. INTELLIGENT STOCKING
        3. RELIEF TRANSPORT
      */}
      <section className="w-full bg-white border-t border-[#D8E6F3] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Block 1: HAZARD INGESTION */}
            <div className="bg-[#F8FAFD] p-6 rounded-2xl border border-[#D8E6F3] hover:border-[#2853f3] transition-all space-y-3.5 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#2853f3] flex items-center justify-center shrink-0">
                <Activity className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="text-[11px] font-black text-[#2853f3] uppercase tracking-wider">
                  1. HAZARD INGESTION
                </div>
                <h3 className="text-base font-bold text-[#141478] leading-snug">
                  Multi-Hazard Monitoring &amp; Risk Assessment
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#516C8A] leading-relaxed">
                Integrate disaster data and predictive models for heavy rainfall, earthquakes, cyclones, and tsunami threats to support early awareness and risk assessment.
              </p>
            </div>

            {/* Block 2: INTELLIGENT STOCKING */}
            <div className="bg-[#F8FAFD] p-6 rounded-2xl border border-[#D8E6F3] hover:border-[#2853f3] transition-all space-y-3.5 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#E6F6EE] text-[#24824F] flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="text-[11px] font-black text-[#24824F] uppercase tracking-wider">
                  2. INTELLIGENT STOCKING
                </div>
                <h3 className="text-base font-bold text-[#141478] leading-snug">
                  Relief Demand &amp; Resource Allocation
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#516C8A] leading-relaxed">
                Assess relief requirements in affected areas and support the allocation of available food, medical supplies, and essential resources from depots based on local needs and stock availability.
              </p>
            </div>

            {/* Block 3: RELIEF TRANSPORT */}
            <div className="bg-[#F8FAFD] p-6 rounded-2xl border border-[#D8E6F3] hover:border-[#2853f3] transition-all space-y-3.5 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#FEF4E8] text-[#DE8838] flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="text-[11px] font-black text-[#DE8838] uppercase tracking-wider">
                  3. RELIEF TRANSPORT
                </div>
                <h3 className="text-base font-bold text-[#141478] leading-snug">
                  Route Planning &amp; Logistics Coordination
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#516C8A] leading-relaxed">
                Support the movement of relief supplies by connecting resource availability, affected locations, and transport routes to help coordinate timely and efficient disaster response.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 
        FOOTER SECTION:
        Increased font sizes calibrated with the UI measurement system.
        Clicking the RAHAT logo redirects to the main landing page.
      */}
      <footer className="w-full bg-white border-t border-[#D8E6F3] py-6 sm:py-8 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[#516C8A]">
          {/* Brand & Descriptor (Redirects to landing page on click) */}
          <div
            onClick={() => setCurrentPage('landing')}
            className="flex items-center gap-3 cursor-pointer group select-none"
            title="Return to Main Landing Page"
          >
            <img
              src="/Disaster1.jpg"
              alt="RAHAT Logo"
              className="w-[38px] h-[38px] rounded-full object-contain ring-1 ring-[#CFE2F2] group-hover:ring-[#2853f3] p-0.5 bg-white shadow-2xs transition-all"
            />
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <span
                className="font-extrabold text-[#141478] text-[20px] w-[60px] inline-block tracking-[0.06em] group-hover:text-[#2853f3] transition-colors"
                style={{ fontFamily: "'Luckiest Guy', cursive, sans-serif" }}
              >
                RAHAT
              </span>
              <span className="text-xs sm:text-sm text-[#516C8A]">
                · Rapid Allocation for Hazard Assessment and Transport
              </span>
            </div>
          </div>

          {/* Navigation Links with Proportional Font Sizing */}
          <div className="flex items-center gap-5 text-xs sm:text-sm font-semibold">
            <button
              onClick={() => setCurrentPage('dashboard')}
              className="text-[#516C8A] hover:text-[#2853f3] transition-colors cursor-pointer py-1 px-2 rounded-lg hover:bg-[#EEF2FF]"
            >
              Operations Dashboard
            </button>
            <span className="text-slate-300" aria-hidden="true">·</span>
            <button
              onClick={() => setCurrentPage('login')}
              className="text-[#516C8A] hover:text-[#2853f3] transition-colors cursor-pointer py-1 px-2 rounded-lg hover:bg-[#EEF2FF]"
            >
              Sign In
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
