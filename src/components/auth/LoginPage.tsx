import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  ShieldCheck,
  Lock,
  Mail,
  User,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Phone,
  MapPin,
  Building,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Warehouse as WarehouseIcon,
  Clock,
  XCircle,
  RotateCcw,
  FileText,
  Check,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { RahatLogoText } from '../common/RahatLogoText';
import { INITIAL_WAREHOUSE_PROFILE } from '../../data/mockWarehouseData';
import { WarehouseProfileData, WarehousePartnerRequest } from '../../types';
import { DEFAULT_PARTNER_REQUESTS } from '../../views/PartnerRequestsView';

export const LoginPage: React.FC = () => {
  const { login, setCurrentPage, navigateToTab } = useApp();

  // Role: 'warehouse' (Warehouse Partner) or 'admin' (Admin)
  const [role, setRole] = useState<'warehouse' | 'admin'>('warehouse');

  // Sub-mode for Warehouse Partner: 'login' | 'register'
  const [warehouseMode, setWarehouseMode] = useState<'login' | 'register'>('login');

  // Registered partners storage state
  const [registeredPartners, setRegisteredPartners] = useState<WarehousePartnerRequest[]>(() => {
    try {
      const saved = localStorage.getItem('rahat_registered_partners');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return DEFAULT_PARTNER_REQUESTS;
  });

  // Dedicated workflow status screens for partners
  const [pendingReviewPartner, setPendingReviewPartner] = useState<WarehousePartnerRequest | null>(null);
  const [rejectedPartner, setRejectedPartner] = useState<WarehousePartnerRequest | null>(null);

  // -------------------------------------------------------------
  // Warehouse Partner - Sign In Fields
  // -------------------------------------------------------------
  const [partnerName, setPartnerName] = useState('Venkatesh Ramanathan');
  const [partnerEmail, setPartnerEmail] = useState('v.ramanathan@apexlogistics.in');
  const [partnerPassword, setPartnerPassword] = useState('whpartner@2026');
  const [showPartnerPassword, setShowPartnerPassword] = useState(false);
  const [rememberPartner, setRememberPartner] = useState(true);

  // -------------------------------------------------------------
  // Warehouse Partner - Registration Fields
  // -------------------------------------------------------------
  const [regOwnerName, setRegOwnerName] = useState('');
  const [regWarehouseName, setRegWarehouseName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regOrgType, setRegOrgType] = useState<'Private Warehouse' | 'NGO' | 'Supplier' | 'Government' | 'Logistics Corporation'>('Private Warehouse');
  const [regAddress, setRegAddress] = useState('');
  const [regCity, setRegCity] = useState('');
  const [regState, setRegState] = useState('');
  const [regPinCode, setRegPinCode] = useState('');
  const [regDocumentType, setRegDocumentType] = useState('NDMA Warehouse Accreditation');
  const [regDocumentNumber, setRegDocumentNumber] = useState('');
  const [regDocumentFileName, setRegDocumentFileName] = useState('facility_compliance_permit.pdf');
  const [regAgreeTerms, setRegAgreeTerms] = useState(true);

  // -------------------------------------------------------------
  // Admin - Sign In Fields
  // -------------------------------------------------------------
  const [adminEmail, setAdminEmail] = useState('admin.varma@ndma.gov.in');
  const [adminPassword, setAdminPassword] = useState('admin@secure2026');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [rememberAdmin, setRememberAdmin] = useState(true);

  // -------------------------------------------------------------
  // UI Status & Feedback
  // -------------------------------------------------------------
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Clear messages when role or mode toggles
  useEffect(() => {
    setErrorMessage('');
    setSuccessMessage('');
  }, [role, warehouseMode]);

  // Keep registeredPartners in sync with storage & external events
  useEffect(() => {
    const handleSync = () => {
      try {
        const saved = localStorage.getItem('rahat_registered_partners');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setRegisteredPartners(parsed);
          }
        }
      } catch {
        // ignore
      }
    };
    window.addEventListener('rahat_partners_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('rahat_partners_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Persist registered partners
  const saveRegisteredPartner = (partner: WarehousePartnerRequest) => {
    const updated = [partner, ...registeredPartners.filter((p) => p.email.toLowerCase() !== partner.email.toLowerCase())];
    setRegisteredPartners(updated);
    try {
      localStorage.setItem('rahat_registered_partners', JSON.stringify(updated));
      window.dispatchEvent(new Event('rahat_partners_updated'));
    } catch {
      // ignore
    }
  };

  // Helper to sync warehouse profile into active storage
  const syncWarehouseProfile = (partner: WarehousePartnerRequest) => {
    const newProfile: WarehouseProfileData = {
      ...INITIAL_WAREHOUSE_PROFILE,
      id: 'wh-' + partner.city.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now().toString().slice(-4),
      name: partner.warehouseName,
      code: '',
      organizationType: partner.organizationType,
      ownerName: partner.ownerName,
      ownerEmail: partner.email,
      ownerPhone: partner.mobile,
      address: partner.address,
      district: partner.city,
      state: partner.state,
      pinCode: partner.pincode,
      verificationStatus: 'VERIFIED',
      verificationCertificateId: partner.documentNumber || `CERT-${partner.id}`,
    };
    try {
      localStorage.setItem('rahat_active_warehouse_profile', JSON.stringify(newProfile));
    } catch {
      // ignore
    }
  };

  // -------------------------------------------------------------
  // Handle Warehouse Partner Sign In
  // -------------------------------------------------------------
  const handleWarehouseSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    await new Promise((res) => setTimeout(res, 400));

    // Reload latest partners from localStorage
    let currentPartners = registeredPartners;
    try {
      const saved = localStorage.getItem('rahat_registered_partners');
      if (saved) {
        currentPartners = JSON.parse(saved);
      }
    } catch {
      // ignore
    }

    const emailTrimmed = partnerEmail.trim().toLowerCase();
    const existing = currentPartners.find((p) => p.email.toLowerCase() === emailTrimmed);

    if (!existing) {
      setIsLoading(false);
      setErrorMessage(`No warehouse facility found for "${partnerEmail}". Please check your email or register your facility below.`);
      return;
    }

    if (existing.password && partnerPassword !== existing.password) {
      setIsLoading(false);
      setErrorMessage('Incorrect password. Please verify your credentials.');
      return;
    }

    // Step 2 & 3: Check Certification Status!
    if (existing.status === 'pending') {
      setIsLoading(false);
      setPendingReviewPartner(existing);
      return;
    }

    if (existing.status === 'rejected') {
      setIsLoading(false);
      setRejectedPartner(existing);
      return;
    }

    // Status is 'approved': Certified Partner status; warehouse and resource management enabled
    syncWarehouseProfile(existing);

    if (rememberPartner) {
      localStorage.setItem('rahat_saved_partner_email', partnerEmail);
    }

    login({
      id: 'usr-whp-' + Date.now(),
      name: existing.ownerName || partnerName || 'Warehouse Partner',
      email: existing.email,
      role: 'WAREHOUSE_PARTNER',
      roleType: 'admin',
      roleLabel: 'Certified Warehouse Managing Partner & Depot Owner',
      agency: `${existing.warehouseName} (${existing.organizationType})`,
      station: `${existing.address}, ${existing.city}, ${existing.state} - ${existing.pincode}`,
    });

    setIsLoading(false);
    setCurrentPage('warehouse-dashboard');
  };

  // -------------------------------------------------------------
  // Handle Warehouse Partner Registration
  // -------------------------------------------------------------
  const handleWarehouseRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!regOwnerName.trim()) {
      setErrorMessage('Please enter Owner / Organization Name.');
      return;
    }
    if (!regWarehouseName.trim()) {
      setErrorMessage('Please enter Warehouse Name.');
      return;
    }
    if (!regEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail.trim())) {
      setErrorMessage('Please enter a valid Email ID.');
      return;
    }
    if (!regMobile.trim()) {
      setErrorMessage('Please enter Mobile Number.');
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    if (!regAddress.trim() || !regCity.trim() || !regState.trim() || !regPinCode.trim()) {
      setErrorMessage('Please complete all warehouse location fields (Address, City, State, PIN Code).');
      return;
    }

    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 500));

    // Create partner request in 'pending' status
    const newPartner: WarehousePartnerRequest = {
      id: `REQ-WHP-${Math.floor(100000 + Math.random() * 900000)}`,
      ownerName: regOwnerName.trim(),
      warehouseName: regWarehouseName.trim(),
      email: regEmail.trim(),
      mobile: regMobile.trim(),
      password: regPassword,
      organizationType: regOrgType,
      address: regAddress.trim(),
      city: regCity.trim(),
      state: regState.trim(),
      pincode: regPinCode.trim(),
      documentType: 'Warehouse Registration',
      documentNumber: 'REG-VERIFIED',
      documentFileName: regDocumentFileName,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    saveRegisteredPartner(newPartner);

    // Pre-fill sign-in form for subsequent attempts
    setPartnerName(newPartner.ownerName);
    setPartnerEmail(newPartner.email);
    setPartnerPassword(newPartner.password || '');

    setIsLoading(false);
    // Directly present the Request Pending review screen
    setPendingReviewPartner(newPartner);
  };

  // -------------------------------------------------------------
  // Correct Details & Reapply flow
  // -------------------------------------------------------------
  const handleStartReapply = (partner: WarehousePartnerRequest) => {
    setRegOwnerName(partner.ownerName);
    setRegWarehouseName(partner.warehouseName);
    setRegEmail(partner.email);
    setRegMobile(partner.mobile);
    setRegPassword(partner.password || 'whpartner@2026');
    setRegConfirmPassword(partner.password || 'whpartner@2026');
    setRegOrgType(partner.organizationType);
    setRegAddress(partner.address);
    setRegCity(partner.city);
    setRegState(partner.state);
    setRegPinCode(partner.pincode);
    setRegDocumentType(partner.documentType || 'NDMA Warehouse Accreditation');
    setRegDocumentNumber(partner.documentNumber || '');
    setRegDocumentFileName(partner.documentFileName || 'updated_compliance_doc.pdf');

    setRejectedPartner(null);
    setPendingReviewPartner(null);
    setWarehouseMode('register');
    setSuccessMessage('Previous application details pre-filled. Please modify the flagged items and reapply.');
  };

  // Check Status / Refresh for pending partner
  const handleCheckPendingStatus = async () => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 400));
    try {
      const saved = localStorage.getItem('rahat_registered_partners');
      if (saved && pendingReviewPartner) {
        const list: WarehousePartnerRequest[] = JSON.parse(saved);
        const latest = list.find((p) => p.email.toLowerCase() === pendingReviewPartner.email.toLowerCase());
        if (latest) {
          if (latest.status === 'approved') {
            setIsLoading(false);
            setPendingReviewPartner(null);
            // Log in!
            syncWarehouseProfile(latest);
            login({
              id: 'usr-whp-' + Date.now(),
              name: latest.ownerName,
              email: latest.email,
              role: 'WAREHOUSE_PARTNER',
              roleType: 'admin',
              roleLabel: 'Certified Warehouse Managing Partner & Depot Owner',
              agency: `${latest.warehouseName} (${latest.organizationType})`,
              station: `${latest.address}, ${latest.city}, ${latest.state} - ${latest.pincode}`,
            });
            setCurrentPage('warehouse-dashboard');
            return;
          } else if (latest.status === 'rejected') {
            setIsLoading(false);
            setPendingReviewPartner(null);
            setRejectedPartner(latest);
            return;
          } else {
            setPendingReviewPartner(latest);
            setSuccessMessage('Status updated: Application is still under review by the Administrator.');
          }
        }
      }
    } catch {
      // ignore
    }
    setIsLoading(false);
  };

  // -------------------------------------------------------------
  // Handle Admin Sign In
  // -------------------------------------------------------------
  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    await new Promise((res) => setTimeout(res, 400));

    if (!adminEmail.trim()) {
      setIsLoading(false);
      setErrorMessage('Please enter your email.');
      return;
    }

    if (!adminPassword) {
      setIsLoading(false);
      setErrorMessage('Please enter your password.');
      return;
    }

    if (rememberAdmin) {
      localStorage.setItem('rahat_saved_admin_email', adminEmail);
    }

    login({
      id: 'adm-' + Date.now(),
      name: 'Commandant R. K. Varma',
      email: adminEmail.trim(),
      role: 'ADMIN',
      roleType: 'admin',
      roleLabel: 'Chief Disaster Administrator',
      agency: 'National Emergency Operations Command',
      badgeNumber: 'RAHAT-ADM-001',
      station: 'Central Command Headquarters, New Delhi',
    });

    setIsLoading(false);
    setCurrentPage('dashboard');
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return 'Recent';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F0F5FA] text-[#152B44] flex flex-col justify-between selection:bg-[#CFE2F2] selection:text-[#152B44]">
      {/* Top Header */}
      <header className="w-full bg-[#FFFFFF] border-b border-[#CFE2F2] px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentPage('landing')}
            className="flex items-center gap-2.5 cursor-pointer text-left group"
            title="Return to Main Landing Page"
          >
            <img
              src="/Disaster1.jpg"
              alt="RAHAT Logo"
              className="w-10 h-10 object-contain rounded-full ring-2 ring-[#CFE2F2] group-hover:ring-[#2853f3] bg-white shadow-xs p-0.5 transition-all"
            />
            <div className="flex flex-col">
              <RahatLogoText className="text-2xl" color="#141478" />
              <span className="text-[9px] font-bold text-[#516C8A] uppercase tracking-wider mt-0.5">
                Disaster Logistics &amp; Relief Platform
              </span>
            </div>
          </button>
        </div>

        {/* Action navigation */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#516C8A] hover:text-[#2853f3] px-3 py-1.5 rounded-lg hover:bg-[#EEF2FF] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Operations Dashboard</span>
          </button>

          <button
            onClick={() => navigateToTab('overview')}
            className="px-3.5 py-1.5 text-xs font-semibold text-[#2853f3] bg-[#EEF2FF] hover:bg-[#DCE5FF] border border-[#C7D4FE] rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>Skip to Live Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-4 sm:py-6 flex-1 flex flex-col justify-center items-center">
        <div className="flex flex-col md:flex-row min-h-[580px] md:h-[720px] w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-200/80">
          
          {/* Left Side Image: Vertical uninterrupted image */}
          <div className="w-full hidden md:inline-block md:w-1/2 h-full select-none bg-slate-100">
            <img
              className="h-full w-full object-cover object-center"
              src="/rahatsignin.jpeg"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/rahatsignin.jpg';
              }}
              alt="leftSideImage"
            />
          </div>

          {/* Right Side Form Container */}
          <div className="w-full md:w-1/2 flex flex-col items-center justify-start p-6 sm:p-7 md:p-8 overflow-y-auto form-scrollbar">
            
            <div className="w-full max-w-[420px] flex flex-col items-center my-auto py-2">
              
              {/* Header / Title & Subtitle */}
              <div className="w-full flex flex-col items-center justify-center text-center">
                <h2 className="text-3xl sm:text-4xl text-gray-900 font-medium tracking-tight">
                  {pendingReviewPartner
                    ? 'Request Pending'
                    : rejectedPartner
                    ? 'Application Rejected'
                    : role === 'admin'
                    ? 'Admin'
                    : warehouseMode === 'login'
                    ? 'Sign in'
                    : 'Register'}
                </h2>
                <p className="text-sm text-gray-500/90 mt-2">
                  {pendingReviewPartner
                    ? 'Account created but not yet certified by NDMA Admin'
                    : rejectedPartner
                    ? 'Review feedback and correct details to reapply'
                    : role === 'admin'
                    ? 'Disaster emergency command authorization'
                    : warehouseMode === 'login'
                    ? 'Welcome back! Please sign in to continue'
                    : 'Register facility for RAHAT relief supply network'}
                </p>

                {/* Role Switcher: Warehouse Partner vs Admin (only when not in pending/rejected screen) */}
                {!pendingReviewPartner && !rejectedPartner && (
                  <div className="grid grid-cols-2 gap-1.5 bg-gray-100 p-1 rounded-full w-full mt-4 mb-3">
                    <button
                      type="button"
                      onClick={() => {
                        setRole('warehouse');
                        setWarehouseMode('login');
                        setErrorMessage('');
                      }}
                      className={`py-2 px-3 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        role === 'warehouse'
                          ? 'bg-[#2853f3] text-white shadow-xs'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Warehouse Partner</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setRole('admin');
                        setErrorMessage('');
                      }}
                      className={`py-2 px-3 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        role === 'admin'
                          ? 'bg-[#2853f3] text-white shadow-xs'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Admin</span>
                    </button>
                  </div>
                )}

                {/* Success Message Banner */}
                {successMessage && (
                  <div className="mb-3 w-full p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-start gap-2 text-xs text-left">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>{successMessage}</div>
                  </div>
                )}

                {/* Error Message Banner */}
                {errorMessage && (
                  <div className="mb-3 w-full p-2.5 bg-red-50 border border-red-200 text-red-800 rounded-2xl flex items-start gap-2 text-xs text-left">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div>{errorMessage}</div>
                  </div>
                )}
              </div>

              {/* ======================================================== */}
              {/* STATE A: REQUEST PENDING SCREEN                          */}
              {/* ======================================================== */}
              {pendingReviewPartner && (
                <div className="w-full flex flex-col items-center space-y-3 mt-2 text-left">
                  {/* Status Pill */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                    <span>Application Under Review</span>
                  </div>

                  {/* Details Card */}
                  <div className="w-full bg-[#FAFBFD] border border-[#CFE2F2] rounded-2xl p-4 text-xs space-y-2.5">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase block font-semibold">Request ID</span>
                        <span className="font-mono font-bold text-[#152B44] text-xs">{pendingReviewPartner.id}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-gray-500 uppercase block font-semibold">Submitted</span>
                        <span className="text-xs text-[#152B44] font-medium">{formatDate(pendingReviewPartner.submittedAt)}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-gray-500 uppercase block font-semibold">Facility &amp; Owner</span>
                      <div className="font-bold text-[#152B44] text-xs">{pendingReviewPartner.warehouseName}</div>
                      <div className="text-[11px] text-gray-600">{pendingReviewPartner.ownerName} • {pendingReviewPartner.organizationType}</div>
                    </div>

                    <div>
                      <span className="text-[10px] text-gray-500 uppercase block font-semibold">Location</span>
                      <div className="text-[11px] text-gray-700">
                        {pendingReviewPartner.city}, {pendingReviewPartner.state} ({pendingReviewPartner.pincode})
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-gray-500 uppercase block font-semibold">Submitted Document</span>
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#2853f3]">
                        <FileText className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{pendingReviewPartner.documentType} ({pendingReviewPartner.documentNumber})</span>
                      </div>
                    </div>
                  </div>

                  {/* Informational Callout */}
                  <div className="w-full p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <p className="text-[11px] leading-relaxed">
                      <strong>Certified Partner Status Required:</strong> Warehouse and resource management will be enabled once your organization and document details are verified by NDMA Admin.
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="w-full space-y-2 pt-2">
                    <button
                      type="button"
                      onClick={handleCheckPendingStatus}
                      disabled={isLoading}
                      className="w-full h-11 rounded-full text-white bg-[#2853f3] hover:bg-[#1e42d9] transition-all font-semibold shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 text-xs"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Check Approval Status</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setPendingReviewPartner(null);
                        setWarehouseMode('login');
                      }}
                      className="w-full py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 cursor-pointer text-center"
                    >
                      Back to Sign In
                    </button>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* STATE B: REQUEST REJECTED SCREEN                         */}
              {/* ======================================================== */}
              {rejectedPartner && (
                <div className="w-full flex flex-col items-center space-y-3 mt-2 text-left">
                  {/* Status Pill */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">
                    <XCircle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Application Rejected</span>
                  </div>

                  {/* Rejection Reason Box */}
                  <div className="w-full bg-rose-50 border border-rose-200 rounded-2xl p-4 text-xs space-y-2">
                    <div className="font-bold text-rose-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Administrator Rejection Reason:</span>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-rose-200 text-rose-800 text-xs leading-relaxed font-medium">
                      "{rejectedPartner.rejectionReason || 'Compliance documentation unverified. Please check permits and reapply.'}"
                    </div>
                    {rejectedPartner.reviewedBy && (
                      <div className="text-[10px] text-rose-700/80">
                        Audited by {rejectedPartner.reviewedBy} • {formatDate(rejectedPartner.reviewedAt)}
                      </div>
                    )}
                  </div>

                  {/* Summary of rejected facility */}
                  <div className="w-full bg-[#FAFBFD] border border-gray-200 rounded-xl p-3 text-[11px] text-gray-600 space-y-1">
                    <div>Facility: <strong className="text-[#152B44]">{rejectedPartner.warehouseName}</strong></div>
                    <div>Location: {rejectedPartner.city}, {rejectedPartner.state}</div>
                    <div>Document: {rejectedPartner.documentType} ({rejectedPartner.documentNumber})</div>
                  </div>

                  {/* Action Buttons */}
                  <div className="w-full space-y-2 pt-2">
                    <button
                      type="button"
                      onClick={() => handleStartReapply(rejectedPartner)}
                      className="w-full h-11 rounded-full text-white bg-[#2853f3] hover:bg-[#1e42d9] transition-all font-semibold shadow-sm flex items-center justify-center gap-2 cursor-pointer text-xs"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Correct Details &amp; Reapply</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setRejectedPartner(null);
                        setWarehouseMode('login');
                      }}
                      className="w-full py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 cursor-pointer text-center"
                    >
                      Back to Sign In
                    </button>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* 1. WAREHOUSE PARTNER - SIGN IN FORM                      */}
              {/* ======================================================== */}
              {!pendingReviewPartner && !rejectedPartner && role === 'warehouse' && warehouseMode === 'login' && (
                <form onSubmit={handleWarehouseSignIn} className="md:w-96 w-80 flex flex-col items-center justify-center">
                  
                  {/* Name */}
                  <div className="flex items-center w-full bg-transparent border border-gray-300/80 h-12 rounded-full overflow-hidden pl-5 pr-4 gap-2.5 focus-within:border-[#2853f3] focus-within:ring-2 focus-within:ring-[#2853f3]/20 transition-all">
                    <User className="w-4 h-4 text-gray-500 shrink-0" />
                    <input
                      type="text"
                      required
                      value={partnerName}
                      onChange={(e) => setPartnerName(e.target.value)}
                      placeholder="Name"
                      className="bg-transparent text-gray-800 placeholder-gray-500/80 outline-none text-sm w-full h-full"
                    />
                  </div>

                  {/* Email */}
                  <div className="flex items-center mt-3.5 w-full bg-transparent border border-gray-300/80 h-12 rounded-full overflow-hidden pl-5 pr-4 gap-2.5 focus-within:border-[#2853f3] focus-within:ring-2 focus-within:ring-[#2853f3]/20 transition-all">
                    <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                      <path fillRule="evenodd" clipRule="evenodd" d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z" fill="#6B7280"/>
                    </svg>
                    <input
                      type="email"
                      required
                      value={partnerEmail}
                      onChange={(e) => setPartnerEmail(e.target.value)}
                      placeholder="Email"
                      className="bg-transparent text-gray-800 placeholder-gray-500/80 outline-none text-sm w-full h-full"
                    />
                  </div>

                  {/* Password */}
                  <div className="flex items-center mt-3.5 w-full bg-transparent border border-gray-300/80 h-12 rounded-full overflow-hidden pl-5 pr-4 gap-2.5 focus-within:border-[#2853f3] focus-within:ring-2 focus-within:ring-[#2853f3]/20 transition-all">
                    <svg width="13" height="17" viewBox="0 0 13 17" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                      <path d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z" fill="#6B7280"/>
                    </svg>
                    <input
                      type={showPartnerPassword ? 'text' : 'password'}
                      required
                      value={partnerPassword}
                      onChange={(e) => setPartnerPassword(e.target.value)}
                      placeholder="Password"
                      className="bg-transparent text-gray-800 placeholder-gray-500/80 outline-none text-sm w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPartnerPassword(!showPartnerPassword)}
                      className="text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showPartnerPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Remember me & Forgot Password */}
                  <div className="w-full flex items-center justify-between mt-5 text-gray-500/80 text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <input
                        className="h-4 w-4 rounded text-[#2853f3] focus:ring-[#2853f3] cursor-pointer"
                        type="checkbox"
                        id="checkbox-partner"
                        checked={rememberPartner}
                        onChange={(e) => setRememberPartner(e.target.checked)}
                      />
                      <label className="cursor-pointer" htmlFor="checkbox-partner">Remember me</label>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setErrorMessage('For security, warehouse credentials recovery is handled by your district coordinator.');
                      }}
                      className="text-xs text-gray-500/80 hover:text-[#2853f3] hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="mt-6 w-full h-11 rounded-full text-white bg-[#2853f3] hover:bg-[#1e42d9] transition-all font-semibold shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Building2 className="w-4 h-4" />
                        <span>Sign In</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {/* Bottom link */}
                  <p className="text-gray-500/90 text-sm mt-4 text-center">
                    Don’t have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setWarehouseMode('register');
                        setErrorMessage('');
                      }}
                      className="text-[#2853f3] hover:underline font-semibold cursor-pointer"
                    >
                      Register Facility
                    </button>
                  </p>
                </form>
              )}

              {/* ======================================================== */}
              {/* 2. WAREHOUSE PARTNER - REGISTRATION FORM                 */}
              {/* ======================================================== */}
              {!pendingReviewPartner && !rejectedPartner && role === 'warehouse' && warehouseMode === 'register' && (
                <form onSubmit={handleWarehouseRegister} className="w-full flex flex-col items-center justify-center space-y-2 mt-1">
                  
                  {/* Owner & Warehouse Names - 2 Columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                    <div className="flex items-center w-full bg-transparent border border-gray-300/80 h-10 rounded-full overflow-hidden pl-3.5 pr-2 gap-2 focus-within:border-[#2853f3] focus-within:ring-2 focus-within:ring-[#2853f3]/20 transition-all">
                      <User className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                      <input
                        type="text"
                        required
                        value={regOwnerName}
                        onChange={(e) => setRegOwnerName(e.target.value)}
                        placeholder="Owner Name"
                        className="bg-transparent text-gray-800 placeholder-gray-500/80 outline-none text-xs w-full h-full"
                      />
                    </div>

                    <div className="flex items-center w-full bg-transparent border border-gray-300/80 h-10 rounded-full overflow-hidden pl-3.5 pr-2 gap-2 focus-within:border-[#2853f3] focus-within:ring-2 focus-within:ring-[#2853f3]/20 transition-all">
                      <WarehouseIcon className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                      <input
                        type="text"
                        required
                        value={regWarehouseName}
                        onChange={(e) => setRegWarehouseName(e.target.value)}
                        placeholder="Warehouse Name"
                        className="bg-transparent text-gray-800 placeholder-gray-500/80 outline-none text-xs w-full h-full"
                      />
                    </div>
                  </div>

                  {/* Email ID & Mobile Number - 2 Columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                    <div className="flex items-center w-full bg-transparent border border-gray-300/80 h-10 rounded-full overflow-hidden pl-3.5 pr-2 gap-2 focus-within:border-[#2853f3] focus-within:ring-2 focus-within:ring-[#2853f3]/20 transition-all">
                      <Mail className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="Email ID"
                        className="bg-transparent text-gray-800 placeholder-gray-500/80 outline-none text-xs w-full h-full"
                      />
                    </div>

                    <div className="flex items-center w-full bg-transparent border border-gray-300/80 h-10 rounded-full overflow-hidden pl-3.5 pr-2 gap-2 focus-within:border-[#2853f3] focus-within:ring-2 focus-within:ring-[#2853f3]/20 transition-all">
                      <Phone className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                      <input
                        type="tel"
                        required
                        value={regMobile}
                        onChange={(e) => setRegMobile(e.target.value)}
                        placeholder="Mobile Number"
                        className="bg-transparent text-gray-800 placeholder-gray-500/80 outline-none text-xs w-full h-full"
                      />
                    </div>
                  </div>

                  {/* Password & Confirm Password in 2 cols */}
                  <div className="grid grid-cols-2 gap-2 w-full">
                    <div className="flex items-center w-full bg-transparent border border-gray-300/80 h-10 rounded-full overflow-hidden pl-3.5 pr-2 gap-1.5 focus-within:border-[#2853f3] transition-all">
                      <Lock className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Password"
                        className="bg-transparent text-gray-800 placeholder-gray-500/80 outline-none text-xs w-full h-full"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <div className="flex items-center w-full bg-transparent border border-gray-300/80 h-10 rounded-full overflow-hidden pl-3.5 pr-3 gap-1.5 focus-within:border-[#2853f3] transition-all">
                      <Lock className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="Confirm"
                        className="bg-transparent text-gray-800 placeholder-gray-500/80 outline-none text-xs w-full h-full"
                      />
                    </div>
                  </div>

                  {/* Organization Type */}
                  <div className="flex items-center w-full bg-transparent border border-gray-300/80 h-10 rounded-full overflow-hidden pl-3.5 pr-2 gap-1.5 focus-within:border-[#2853f3] transition-all">
                    <Building className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                    <select
                      value={regOrgType}
                      onChange={(e) => setRegOrgType(e.target.value as any)}
                      className="bg-transparent text-gray-800 outline-none text-xs w-full h-full cursor-pointer truncate"
                    >
                      <option value="Private Warehouse">Private Warehouse</option>
                      <option value="NGO">NGO Facility</option>
                      <option value="Supplier">Relief Supplier</option>
                      <option value="Government">Government Depot</option>
                      <option value="Logistics Corporation">Logistics Corp</option>
                    </select>
                  </div>

                  {/* Warehouse Location (Address, City, State, PIN) */}
                  <div className="w-full space-y-1.5 pt-0.5">
                    <div className="flex items-center w-full bg-transparent border border-gray-300/80 h-10 rounded-full overflow-hidden px-3.5 gap-2">
                      <MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                      <input
                        type="text"
                        required
                        value={regAddress}
                        onChange={(e) => setRegAddress(e.target.value)}
                        placeholder="Address / Logistics Corridor"
                        className="bg-transparent text-gray-800 placeholder-gray-500/80 outline-none text-xs w-full h-full"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 w-full">
                      <input
                        type="text"
                        required
                        value={regCity}
                        onChange={(e) => setRegCity(e.target.value)}
                        placeholder="City"
                        className="border border-gray-300/80 h-9 rounded-full px-3 text-xs bg-transparent text-gray-800 placeholder-gray-500/80 outline-none focus:border-[#2853f3]"
                      />
                      <input
                        type="text"
                        required
                        value={regState}
                        onChange={(e) => setRegState(e.target.value)}
                        placeholder="State"
                        className="border border-gray-300/80 h-9 rounded-full px-3 text-xs bg-transparent text-gray-800 placeholder-gray-500/80 outline-none focus:border-[#2853f3]"
                      />
                      <input
                        type="text"
                        required
                        value={regPinCode}
                        onChange={(e) => setRegPinCode(e.target.value)}
                        placeholder="PIN Code"
                        className="border border-gray-300/80 h-9 rounded-full px-3 text-xs bg-transparent text-gray-800 placeholder-gray-500/80 outline-none focus:border-[#2853f3]"
                      />
                    </div>
                  </div>

                  {/* Terms checkbox */}
                  <div className="flex items-start gap-2 w-full pt-1">
                    <input
                      type="checkbox"
                      checked={regAgreeTerms}
                      onChange={(e) => setRegAgreeTerms(e.target.checked)}
                      id="checkbox-terms"
                      className="h-3.5 w-3.5 mt-0.5 rounded text-[#2853f3] focus:ring-[#2853f3] cursor-pointer"
                    />
                    <label htmlFor="checkbox-terms" className="text-[11px] text-gray-500 leading-tight cursor-pointer">
                      I submit this facility for administrative review &amp; certification for emergency dispatch.
                    </label>
                  </div>

                  {/* Submit Registration Button */}
                  <button
                    type="submit"
                    disabled={isLoading || !regAgreeTerms}
                    className="mt-2.5 w-full h-11 rounded-full text-white bg-[#2853f3] hover:bg-[#1e42d9] transition-all font-semibold shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Building2 className="w-4 h-4" />
                        <span>Submit Registration for Review</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {/* Bottom link */}
                  <p className="text-gray-500/90 text-sm mt-2.5 text-center">
                    Already registered?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setWarehouseMode('login');
                        setErrorMessage('');
                      }}
                      className="text-[#2853f3] hover:underline font-semibold cursor-pointer"
                    >
                      Sign In
                    </button>
                  </p>
                </form>
              )}

              {/* ======================================================== */}
              {/* 3. ADMIN - SIGN IN FORM                                  */}
              {/* ======================================================== */}
              {!pendingReviewPartner && !rejectedPartner && role === 'admin' && (
                <form onSubmit={handleAdminSignIn} className="md:w-96 w-80 flex flex-col items-center justify-center">
                  
                  {/* Email */}
                  <div className="flex items-center w-full bg-transparent border border-gray-300/80 h-12 rounded-full overflow-hidden pl-5 pr-4 gap-2.5 focus-within:border-[#2853f3] focus-within:ring-2 focus-within:ring-[#2853f3]/20 transition-all">
                    <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                      <path fillRule="evenodd" clipRule="evenodd" d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z" fill="#6B7280"/>
                    </svg>
                    <input
                      type="email"
                      required
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="Email"
                      className="bg-transparent text-gray-800 placeholder-gray-500/80 outline-none text-sm w-full h-full"
                    />
                  </div>

                  {/* Password */}
                  <div className="flex items-center mt-3.5 w-full bg-transparent border border-gray-300/80 h-12 rounded-full overflow-hidden pl-5 pr-4 gap-2.5 focus-within:border-[#2853f3] focus-within:ring-2 focus-within:ring-[#2853f3]/20 transition-all">
                    <svg width="13" height="17" viewBox="0 0 13 17" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                      <path d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z" fill="#6B7280"/>
                    </svg>
                    <input
                      type={showAdminPassword ? 'text' : 'password'}
                      required
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Password"
                      className="bg-transparent text-gray-800 placeholder-gray-500/80 outline-none text-sm w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPassword(!showAdminPassword)}
                      className="text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Remember me & Forgot password? */}
                  <div className="w-full flex items-center justify-between mt-5 text-gray-500/80 text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <input
                        className="h-4 w-4 rounded text-[#2853f3] focus:ring-[#2853f3] cursor-pointer"
                        type="checkbox"
                        id="checkbox-admin"
                        checked={rememberAdmin}
                        onChange={(e) => setRememberAdmin(e.target.checked)}
                      />
                      <label className="cursor-pointer" htmlFor="checkbox-admin">Remember me</label>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSuccessMessage('Password recovery instructions sent to registered officer email.');
                      }}
                      className="text-[#2853f3] hover:underline font-semibold cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="mt-6 w-full h-11 rounded-full text-white bg-[#2853f3] hover:bg-[#1e42d9] transition-all font-semibold shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Sign In</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
