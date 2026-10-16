import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  ShieldCheck,
  Lock,
  Mail,
  UserCircle,
  KeyRound,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Radio,
  CheckCircle2,
  Eye,
  EyeOff,
} from 'lucide-react';
import { RahatLogoText } from '../common/RahatLogoText';

export const LoginPage: React.FC = () => {
  const { login, setCurrentPage, navigateToTab } = useApp();

  // Mode: 'user' or 'admin'
  const [loginMode, setLoginMode] = useState<'user' | 'admin'>('user');

  // Form states for user
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [showUserPassword, setShowUserPassword] = useState(false);

  // Form states for admin
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  const handleModeChange = (mode: 'user' | 'admin') => {
    setLoginMode(mode);
  };

  // Demo auto-fill helpers
  const handleFillUserDemo = () => {
    setUserName('Aarav Mehta');
    setUserEmail('aarav.mehta@relief.gov.in');
    setUserPassword('citizen@pass123');
  };

  const handleFillAdminDemo = () => {
    setAdminEmail('admin.varma@ndma.gov.in');
    setAdminPassword('admin@secure2026');
  };

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({
      id: 'usr-' + Date.now(),
      name: userName || 'Aarav Mehta',
      email: userEmail || 'user@rahat.gov.in',
      role: 'USER',
      roleType: 'user',
      roleLabel: 'Public Assistance & Relief Seeker',
      badgeNumber: 'RAHAT-USR',
    });
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({
      id: 'adm-' + Date.now(),
      name: 'Commandant Varma',
      email: adminEmail || 'admin.varma@ndma.gov.in',
      role: 'ADMIN',
      roleType: 'admin',
      roleLabel: 'Authorized Incident Administrator',
      badgeNumber: 'RAHAT-ADM-001',
    });
  };

  return (
    <div className="min-h-screen w-full bg-[#F0F5FA] text-[#152B44] flex flex-col justify-between selection:bg-[#CFE2F2] selection:text-[#152B44]">
      {/* Top Header with Landing Page Top Left Corner Logo using Disaster1.jpg & Redesigned RAHAT Typography */}
      <header className="w-full bg-[#FFFFFF] border-b border-[#CFE2F2] px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentPage('landing')}
            className="flex items-center gap-2.5 cursor-pointer text-left group"
            title="Return to Public Landing Page"
          >
            <img
              src="/Disaster1.jpg"
              alt="RAHAT Logo"
              className="w-10 h-10 object-contain rounded-full ring-2 ring-[#CFE2F2] group-hover:ring-[#88BCE5] bg-white shadow-xs p-0.5 transition-all"
            />
            <div className="flex flex-col">
              <RahatLogoText className="h-6 w-auto" color="#0A2342" />
            </div>
          </button>
        </div>

        {/* Action navigation */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentPage('landing')}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#516C8A] hover:text-[#2C6EA6] px-3 py-1.5 rounded-lg hover:bg-[#E8F2FA] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Public Overview</span>
          </button>

          <button
            onClick={() => navigateToTab('overview')}
            className="px-3.5 py-1.5 text-xs font-semibold text-[#2C6EA6] bg-[#E8F3FC] hover:bg-[#D2E7F8] border border-[#CFE2F2] rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>Skip to Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Body: Creative Dual Pane (Left: Disaster3.png Showcase, Right: Form) */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-10 flex-1 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          
          {/* Left Side: Creative Image Showcase with Disaster3.png */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="h-full bg-[#FFFFFF] p-5 sm:p-6 rounded-2xl border border-[#CFE2F2] shadow-xs flex flex-col justify-between space-y-4">
              
              {/* Image Frame with Disaster3.png */}
              <div className="relative rounded-xl overflow-hidden border border-[#CFE2F2] bg-[#E8F2FA] flex items-center justify-center p-3 group">
                <img
                  src="/Disaster3.png"
                  alt="Disaster Response Spatial Map"
                  className="w-full h-auto max-h-[460px] object-contain block mx-auto group-hover:scale-[1.01] transition-transform duration-300"
                />

                {/* Floating telemetry tag */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full border border-[#CFE2F2] shadow-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#359868] animate-pulse" />
                  <span className="text-[10px] font-bold text-[#152B44] uppercase tracking-wider">
                    Crisis Command Telemetry
                  </span>
                </div>
              </div>

              {/* Creative role context cards underneath image */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div
                  onClick={() => setLoginMode('user')}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    loginMode === 'user'
                      ? 'bg-[#E8F3FC] border-[#88BCE5] shadow-xs'
                      : 'bg-[#FAFBFD] border-[#CFE2F2] hover:bg-[#F0F6FD]'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <UserCircle className="w-4 h-4 text-[#4688C8]" />
                    <span className="text-xs font-bold text-[#152B44]">User Access</span>
                  </div>
                  <p className="text-[11px] text-[#516C8A] leading-normal">
                    Real-time situational awareness, multi-hazard alerts, GIS layers, and citizen relief support.
                  </p>
                </div>

                <div
                  onClick={() => setLoginMode('admin')}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    loginMode === 'admin'
                      ? 'bg-[#E8F3FC] border-[#88BCE5] shadow-xs'
                      : 'bg-[#FAFBFD] border-[#CFE2F2] hover:bg-[#F0F6FD]'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <ShieldCheck className="w-4 h-4 text-[#4688C8]" />
                    <span className="text-xs font-bold text-[#152B44]">Admin Access</span>
                  </div>
                  <p className="text-[11px] text-[#516C8A] leading-normal">
                    Authorized resource approvals, warehouse dispatch, transport convoys, and model triggers.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Right Side: Creative Form Chamber */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="bg-[#FFFFFF] rounded-2xl border border-[#CFE2F2] p-6 sm:p-8 shadow-xs flex flex-col justify-between">
              
              <div>
                {/* Header title */}
                <div className="mb-5">
                  <h2 className="text-xl font-extrabold text-[#152B44] tracking-tight">
                    Access Portal
                  </h2>
                </div>

                {/* Creative Option Selector: User Login vs Admin Login */}
                <div className="mb-6">
                  <div className="grid grid-cols-2 gap-2 bg-[#E8F2FA] p-1.5 rounded-xl border border-[#CFE2F2]">
                    <button
                      type="button"
                      onClick={() => handleModeChange('user')}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        loginMode === 'user'
                          ? 'bg-[#4688C8] text-white shadow-xs'
                          : 'text-[#516C8A] hover:text-[#152B44] hover:bg-[#F0F6FD]'
                      }`}
                    >
                      <User className="w-4 h-4" />
                      <span>User Login</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleModeChange('admin')}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        loginMode === 'admin'
                          ? 'bg-[#4688C8] text-white shadow-xs'
                          : 'text-[#516C8A] hover:text-[#152B44] hover:bg-[#F0F6FD]'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Admin Login</span>
                    </button>
                  </div>
                </div>

                {/* Conditional Form: User Login vs Admin Login */}
                {loginMode === 'user' ? (
                  /* USER LOGIN FORM */
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#152B44]">
                        <UserCircle className="w-4 h-4 text-[#4688C8]" />
                        <span>Public User Credentials</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleFillUserDemo}
                        className="text-[11px] font-semibold text-[#2C6EA6] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-[#4688C8]" />
                        <span>Fill Demo</span>
                      </button>
                    </div>

                    <form onSubmit={handleUserSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-[#152B44] mb-1">
                          Full Name
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="e.g. Aarav Mehta"
                            className="w-full px-3 py-2 pr-9 text-xs bg-[#FFFFFF] border border-[#CFE2F2] rounded-lg focus:outline-none focus:border-[#4688C8] focus:ring-1 focus:ring-[#88BCE5] text-[#152B44]"
                          />
                          <User className="w-3.5 h-3.5 text-[#516C8A] absolute right-3 top-2.5" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#152B44] mb-1">
                          Email Address
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            required
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            placeholder="e.g. user@rahat.gov.in"
                            className="w-full px-3 py-2 pr-9 text-xs bg-[#FFFFFF] border border-[#CFE2F2] rounded-lg focus:outline-none focus:border-[#4688C8] focus:ring-1 focus:ring-[#88BCE5] text-[#152B44]"
                          />
                          <Mail className="w-3.5 h-3.5 text-[#516C8A] absolute right-3 top-2.5" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#152B44] mb-1">
                          Password
                        </label>
                        <div className="relative">
                          <input
                            type={showUserPassword ? 'text' : 'password'}
                            required
                            value={userPassword}
                            onChange={(e) => setUserPassword(e.target.value)}
                            placeholder="Enter password"
                            className="w-full px-3 py-2 pr-9 text-xs bg-[#FFFFFF] border border-[#CFE2F2] rounded-lg focus:outline-none focus:border-[#4688C8] focus:ring-1 focus:ring-[#88BCE5] text-[#152B44]"
                          />
                          <button
                            type="button"
                            onClick={() => setShowUserPassword(!showUserPassword)}
                            className="text-[#516C8A] hover:text-[#152B44] absolute right-3 top-2.5 cursor-pointer"
                          >
                            {showUserPassword ? (
                              <EyeOff className="w-3.5 h-3.5" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          className="w-full py-2.5 px-4 bg-[#4688C8] hover:bg-[#3374B2] text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>Sign In as Public User</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  /* ADMIN LOGIN FORM */
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#152B44]">
                        <ShieldCheck className="w-4 h-4 text-[#4688C8]" />
                        <span>Incident Administrator Credentials</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleFillAdminDemo}
                        className="text-[11px] font-semibold text-[#2C6EA6] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-[#4688C8]" />
                        <span>Fill Demo</span>
                      </button>
                    </div>

                    <form onSubmit={handleAdminSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-[#152B44] mb-1">
                          Administrator ID / Email
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            required
                            value={adminEmail}
                            onChange={(e) => setAdminEmail(e.target.value)}
                            placeholder="admin.varma@ndma.gov.in"
                            className="w-full px-3 py-2 pr-9 text-xs bg-[#FFFFFF] border border-[#CFE2F2] rounded-lg focus:outline-none focus:border-[#4688C8] focus:ring-1 focus:ring-[#88BCE5] text-[#152B44]"
                          />
                          <Mail className="w-3.5 h-3.5 text-[#516C8A] absolute right-3 top-2.5" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#152B44] mb-1">
                          Security Password
                        </label>
                        <div className="relative">
                          <input
                            type={showAdminPassword ? 'text' : 'password'}
                            required
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            placeholder="Enter password"
                            className="w-full px-3 py-2 pr-9 text-xs bg-[#FFFFFF] border border-[#CFE2F2] rounded-lg focus:outline-none focus:border-[#4688C8] focus:ring-1 focus:ring-[#88BCE5] text-[#152B44]"
                          />
                          <button
                            type="button"
                            onClick={() => setShowAdminPassword(!showAdminPassword)}
                            className="text-[#516C8A] hover:text-[#152B44] absolute right-3 top-2.5 cursor-pointer"
                          >
                            {showAdminPassword ? (
                              <EyeOff className="w-3.5 h-3.5" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          className="w-full py-2.5 px-4 bg-[#4688C8] hover:bg-[#3374B2] text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>Sign In as Administrator</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>

              {/* Optional Sign-In Bypass Footer (Satisfying Requirement 2: Sign in optional initially) */}
              <div className="mt-8 pt-4 border-t border-[#CFE2F2] text-center">
                <button
                  type="button"
                  onClick={() => navigateToTab('overview')}
                  className="w-full py-2 px-3 text-xs font-semibold text-[#516C8A] hover:text-[#2C6EA6] hover:bg-[#F0F6FD] rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Continue without signing in (View Dashboard as Guest)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
