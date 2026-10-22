import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { WarehousePartnerRequest, PartnerRequestStatus } from '../types';
import {
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Eye,
  FileText,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  X,
  Filter,
  Check,
  Calendar,
  Building,
  User,
  AlertCircle
} from 'lucide-react';

export const DEFAULT_PARTNER_REQUESTS: WarehousePartnerRequest[] = [
  {
    id: 'REQ-WHP-100291',
    ownerName: 'Venkatesh Ramanathan',
    warehouseName: 'Apex Coastal Relief Depository & Logistics Hub',
    email: 'v.ramanathan@apexlogistics.in',
    mobile: '+91 94441 28901',
    password: 'whpartner@2026',
    organizationType: 'Private Warehouse',
    address: 'Plot 42-B, Coastal Logistics Corridor, Mandapam Road, Pamban Gateway',
    city: 'Rameshwaram',
    state: 'Tamil Nadu',
    pincode: '623526',
    documentType: 'NDMA Warehouse Accreditation',
    documentNumber: 'NDMA-TN-RMS-2024-88',
    documentFileName: 'apex_ndma_certificate.pdf',
    status: 'approved',
    submittedAt: '2026-03-15T09:30:00.000Z',
    reviewedAt: '2026-03-16T14:20:00.000Z',
    reviewedBy: 'Commandant R. K. Varma (Admin)',
  },
  {
    id: 'REQ-WHP-100342',
    ownerName: 'Rohit Deshmukh',
    warehouseName: 'Western Coast Relief Hub & Cold Depot',
    email: 'rohit.deshmukh@westrelief.in',
    mobile: '+91 98201 55432',
    password: 'whpartner@2026',
    organizationType: 'Private Warehouse',
    address: 'Survey 14/2, JNPT Port Logistics Expressway, Navi Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400707',
    documentType: 'Commercial Warehousing & Logistics Permit',
    documentNumber: 'MH-CWL-2025-9921',
    documentFileName: 'jnpt_hub_permit.pdf',
    status: 'pending',
    submittedAt: '2026-04-10T11:15:00.000Z',
  },
  {
    id: 'REQ-WHP-100355',
    ownerName: 'Sunita Patel',
    warehouseName: 'Gujarat Disaster Supplies Reserve',
    email: 'sunita.patel@gujrelief.org',
    mobile: '+91 97123 66789',
    password: 'whpartner@2026',
    organizationType: 'NGO',
    address: 'Sector 4, GIDC Industrial Estate, Sanand',
    city: 'Ahmedabad',
    state: 'Gujarat',
    pincode: '382110',
    documentType: 'State Disaster Management Dept Clearance',
    documentNumber: 'GSDMA-NGO-2026-302',
    documentFileName: 'gsdma_sanand_depot.pdf',
    status: 'pending',
    submittedAt: '2026-04-11T16:45:00.000Z',
  },
  {
    id: 'REQ-WHP-100278',
    ownerName: 'Anil Kumar',
    warehouseName: 'Deccan Storage & Relief Depot',
    email: 'anil.kumar@deccanstorage.in',
    mobile: '+91 94400 12345',
    password: 'whpartner@2026',
    organizationType: 'Private Warehouse',
    address: 'Plot 88, Outer Ring Road Logistics Park, Shamshabad',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '501218',
    documentType: 'FSSAI Food Storage & Warehousing License',
    documentNumber: 'FSSAI-TG-HYD-2024-11',
    documentFileName: 'fssai_license_hyd.pdf',
    status: 'rejected',
    rejectionReason: 'Storage facility fire compliance certificate has expired (dated 2024). Please upload updated 2026 safety certification and verify warehouse capacity metric before reapplying.',
    submittedAt: '2026-04-05T10:00:00.000Z',
    reviewedAt: '2026-04-06T15:30:00.000Z',
    reviewedBy: 'Commandant R. K. Varma (Admin)',
  },
];

const PRESET_REJECTION_REASONS = [
  'Storage facility fire & emergency safety certificate is expired or invalid.',
  'Location coordinates and physical address verification failed during district audit.',
  'Commercial warehouse storage license registration number is unverifiable with state registry.',
  'Food & medical storage hygiene standards documentation is missing or incomplete.',
  'Storage capacity and cold-chain claims require certified third-party inspection.'
];

export const PartnerRequestsView: React.FC = () => {
  const { currentUser, addActivity } = useApp();
  const [requests, setRequests] = useState<WarehousePartnerRequest[]>([]);
  const [filterStatus, setFilterStatus] = useState<PartnerRequestStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [selectedRequest, setSelectedRequest] = useState<WarehousePartnerRequest | null>(null);
  const [rejectingRequest, setRejectingRequest] = useState<WarehousePartnerRequest | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');
  const [rejectionError, setRejectionError] = useState('');
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'danger' | 'info' } | null>(null);

  // Load requests from localStorage
  const loadRequests = () => {
    try {
      const stored = localStorage.getItem('rahat_registered_partners');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Normalize entries
          const normalized: WarehousePartnerRequest[] = parsed.map((item: any, idx: number) => ({
            id: item.id || `REQ-WHP-${100300 + idx}`,
            ownerName: item.ownerName || 'Unknown Partner',
            warehouseName: item.warehouseName || 'Warehouse Facility',
            email: item.email || '',
            mobile: item.mobile || '',
            password: item.password || 'whpartner@2026',
            organizationType: item.organizationType || 'Private Warehouse',
            address: item.address || '',
            city: item.city || '',
            state: item.state || '',
            pincode: item.pincode || '',
            documentType: item.documentType || 'NDMA Warehouse Accreditation',
            documentNumber: item.documentNumber || `DOC-${item.city?.slice(0, 3)?.toUpperCase() || 'WH'}-2026`,
            documentFileName: item.documentFileName || `${item.city?.toLowerCase() || 'facility'}_permit.pdf`,
            status: item.status || 'pending',
            rejectionReason: item.rejectionReason,
            submittedAt: item.submittedAt || item.registeredAt || new Date(Date.now() - (idx + 1) * 86400000).toISOString(),
            reviewedAt: item.reviewedAt,
            reviewedBy: item.reviewedBy,
          }));
          setRequests(normalized);
          return;
        }
      }
    } catch {
      // fallback
    }
    // Default seed
    setRequests(DEFAULT_PARTNER_REQUESTS);
    try {
      localStorage.setItem('rahat_registered_partners', JSON.stringify(DEFAULT_PARTNER_REQUESTS));
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadRequests();

    const handleUpdate = () => loadRequests();
    window.addEventListener('rahat_partners_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('rahat_partners_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const saveUpdatedRequests = (updated: WarehousePartnerRequest[]) => {
    setRequests(updated);
    try {
      localStorage.setItem('rahat_registered_partners', JSON.stringify(updated));
      window.dispatchEvent(new Event('rahat_partners_updated'));
    } catch (e) {
      console.error(e);
    }
  };

  const showToast = (text: string, type: 'success' | 'danger' | 'info' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Actions
  const handleApprove = (req: WarehousePartnerRequest) => {
    const reviewer = currentUser?.name || 'Commandant R. K. Varma (Admin)';
    const updated = requests.map((item) => {
      if (item.id === req.id || item.email.toLowerCase() === req.email.toLowerCase()) {
        return {
          ...item,
          status: 'approved' as PartnerRequestStatus,
          rejectionReason: undefined,
          reviewedAt: new Date().toISOString(),
          reviewedBy: reviewer,
        };
      }
      return item;
    });

    saveUpdatedRequests(updated);
    addActivity({
      actor: reviewer,
      role: 'Admin',
      category: 'WAREHOUSE',
      action: `Approved Partner: ${req.warehouseName}`,
      details: `Granted Certified Partner status to ${req.ownerName} (${req.city}, ${req.state}). Warehouse management enabled.`,
    });

    if (selectedRequest?.id === req.id) {
      setSelectedRequest((prev) => (prev ? { ...prev, status: 'approved', rejectionReason: undefined } : null));
    }

    showToast(`Approved ${req.warehouseName}! Certified Partner status granted.`, 'success');
  };

  const openRejectModal = (req: WarehousePartnerRequest) => {
    setRejectingRequest(req);
    setRejectionReasonInput(req.rejectionReason || '');
    setRejectionError('');
  };

  const handleConfirmReject = () => {
    if (!rejectingRequest) return;
    if (!rejectionReasonInput.trim()) {
      setRejectionError('Please enter a rejection reason so the partner knows what to correct before reapplying.');
      return;
    }

    const reviewer = currentUser?.name || 'Commandant R. K. Varma (Admin)';
    const reason = rejectionReasonInput.trim();

    const updated = requests.map((item) => {
      if (item.id === rejectingRequest.id || item.email.toLowerCase() === rejectingRequest.email.toLowerCase()) {
        return {
          ...item,
          status: 'rejected' as PartnerRequestStatus,
          rejectionReason: reason,
          reviewedAt: new Date().toISOString(),
          reviewedBy: reviewer,
        };
      }
      return item;
    });

    saveUpdatedRequests(updated);
    addActivity({
      actor: reviewer,
      role: 'Admin',
      category: 'WAREHOUSE',
      action: `Rejected Partner: ${rejectingRequest.warehouseName}`,
      details: `Reason: ${reason}`,
    });

    if (selectedRequest?.id === rejectingRequest.id) {
      setSelectedRequest((prev) => (prev ? { ...prev, status: 'rejected', rejectionReason: reason } : null));
    }

    const partnerName = rejectingRequest.warehouseName;
    setRejectingRequest(null);
    setRejectionReasonInput('');
    setRejectionError('');
    showToast(`Application for ${partnerName} rejected. Partner will see rejection reason upon login and can reapply.`, 'danger');
  };

  const handleResetToPending = (req: WarehousePartnerRequest) => {
    const updated = requests.map((item) => {
      if (item.id === req.id) {
        return {
          ...item,
          status: 'pending' as PartnerRequestStatus,
          rejectionReason: undefined,
          reviewedAt: undefined,
          reviewedBy: undefined,
        };
      }
      return item;
    });

    saveUpdatedRequests(updated);
    if (selectedRequest?.id === req.id) {
      setSelectedRequest((prev) => (prev ? { ...prev, status: 'pending', rejectionReason: undefined } : null));
    }
    showToast(`Application ${req.id} reset to Pending Review.`, 'info');
  };

  const handleResetDemoData = () => {
    if (confirm('Reset partner requests to initial demonstration data?')) {
      saveUpdatedRequests(DEFAULT_PARTNER_REQUESTS);
      showToast('Demo partner requests reset successfully.', 'info');
    }
  };

  // Filtered requests
  const filteredRequests = requests.filter((req) => {
    if (filterStatus !== 'ALL' && req.status !== filterStatus) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        req.ownerName.toLowerCase().includes(q) ||
        req.warehouseName.toLowerCase().includes(q) ||
        req.email.toLowerCase().includes(q) ||
        req.city.toLowerCase().includes(q) ||
        req.state.toLowerCase().includes(q) ||
        req.id.toLowerCase().includes(q) ||
        req.documentNumber.toLowerCase().includes(q) ||
        req.organizationType.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const pendingCount = requests.filter((r) => r.status === 'pending').length;
  const approvedCount = requests.filter((r) => r.status === 'approved').length;
  const rejectedCount = requests.filter((r) => r.status === 'rejected').length;

  const formatDate = (isoString: string) => {
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
    <div className="p-4 sm:p-6 space-y-6 max-w-[1600px] mx-auto bg-[#F0F5FA] min-h-full">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg border flex items-center gap-2.5 text-xs font-semibold animate-fade-in ${
            toastMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
              : toastMessage.type === 'danger'
              ? 'bg-rose-50 text-rose-900 border-rose-300'
              : 'bg-blue-50 text-blue-900 border-blue-300'
          }`}
        >
          {toastMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
          {toastMessage.type === 'danger' && <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />}
          {toastMessage.type === 'info' && <AlertCircle className="w-4 h-4 text-blue-600 shrink-0" />}
          <span>{toastMessage.text}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Banner / Header */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#CFE2F2] shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] border border-[#C7D4FE] flex items-center justify-center text-[#2853f3]">
            <Building2 className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-[#152B44] tracking-tight">
            Warehouse Partner Requests
          </h1>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#CFE2F2] shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              filterStatus === 'ALL'
                ? 'bg-[#2853f3] text-white shadow-xs'
                : 'bg-[#F4F8FC] text-[#516C8A] hover:bg-[#EEF2FF] hover:text-[#2853f3]'
            }`}
          >
            All ({requests.length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              filterStatus === 'pending'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>Pending ({pendingCount})</span>
          </button>
          <button
            onClick={() => setFilterStatus('approved')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              filterStatus === 'approved'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>Approved ({approvedCount})</span>
          </button>
          <button
            onClick={() => setFilterStatus('rejected')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              filterStatus === 'rejected'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
            }`}
          >
            <XCircle className="w-3 h-3" />
            <span>Rejected ({rejectedCount})</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#516C8A] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search warehouse, owner, city, document..."
            className="w-full pl-9 pr-8 py-1.5 bg-[#F4F8FC] border border-[#CFE2F2] rounded-lg text-xs text-[#152B44] placeholder-[#516C8A] outline-none focus:border-[#2853f3] focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Requests Data Table / List */}
      <div className="bg-white rounded-2xl border border-[#CFE2F2] shadow-2xs overflow-hidden">
        {filteredRequests.length === 0 ? (
          <div className="py-16 text-center">
            <Building2 className="w-12 h-12 text-[#516C8A]/40 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-[#152B44]">No partner requests found</h3>
            <p className="text-xs text-[#516C8A] mt-1 max-w-sm mx-auto">
              {searchQuery
                ? `No applications matched "${searchQuery}". Clear your search or change the status filter.`
                : 'No partner requests in this category at the moment.'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-3 text-xs font-semibold text-[#2853f3] hover:underline"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAFBFD] border-b border-[#CFE2F2] text-[#516C8A] font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Request &amp; Submission</th>
                  <th className="py-3 px-4">Partner &amp; Organization</th>
                  <th className="py-3 px-4">Facility Location</th>
                  <th className="py-3 px-4">Submitted Documents</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8F2FA]">
                {filteredRequests.map((req) => {
                  const isPending = req.status === 'pending';
                  const isApproved = req.status === 'approved';
                  const isRejected = req.status === 'rejected';

                  return (
                    <tr
                      key={req.id}
                      className="hover:bg-[#F9FBFE] transition-colors group"
                    >
                      {/* ID & Date */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="font-mono font-bold text-xs text-[#152B44] flex items-center gap-1.5">
                          <span>{req.id}</span>
                        </div>
                        <div className="text-[11px] text-[#516C8A] flex items-center gap-1 mt-1">
                          <Calendar className="w-3 h-3 text-[#516C8A]" />
                          <span>{formatDate(req.submittedAt)}</span>
                        </div>
                      </td>

                      {/* Partner & Org */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="font-bold text-xs text-[#152B44]">{req.warehouseName}</div>
                        <div className="flex items-center gap-1 text-[11px] text-[#516C8A] mt-0.5">
                          <User className="w-3 h-3" />
                          <span>{req.ownerName}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EEF2FF] text-[#2853f3] border border-[#C7D4FE]">
                            {req.organizationType}
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-500 mt-1 flex flex-col gap-0.5">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-gray-400" />
                            {req.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-gray-400" />
                            {req.mobile}
                          </span>
                        </div>
                      </td>

                      {/* Warehouse Location */}
                      <td className="py-3.5 px-4 align-top max-w-[220px]">
                        <div className="flex items-start gap-1 text-xs text-[#152B44] font-medium">
                          <MapPin className="w-3.5 h-3.5 text-[#2853f3] shrink-0 mt-0.5" />
                          <div>
                            <div className="font-semibold">{req.city}, {req.state}</div>
                            <div className="text-[11px] text-[#516C8A] line-clamp-2 mt-0.5">
                              {req.address}
                            </div>
                            <div className="text-[10px] font-mono text-gray-400 mt-0.5">
                              PIN: {req.pincode}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Submitted Documents */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="bg-[#FAFBFD] p-2 rounded-lg border border-[#CFE2F2] space-y-1">
                          <div className="flex items-center gap-1 font-semibold text-[11px] text-[#152B44]">
                            <FileText className="w-3 h-3 text-[#2853f3]" />
                            <span className="truncate max-w-[170px]">{req.documentType}</span>
                          </div>
                          <div className="font-mono text-[10px] text-[#516C8A] bg-white px-1.5 py-0.5 rounded border border-gray-200 inline-block">
                            ID: {req.documentNumber}
                          </div>
                          {req.documentFileName && (
                            <div className="text-[10px] text-emerald-700 flex items-center gap-1 font-medium">
                              <Check className="w-2.5 h-2.5 text-emerald-600" />
                              <span>{req.documentFileName}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 align-top">
                        {isPending && (
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>Pending Review</span>
                          </div>
                        )}
                        {isApproved && (
                          <div className="space-y-1">
                            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              <span>Certified Partner</span>
                            </div>
                            {req.reviewedBy && (
                              <div className="text-[10px] text-[#516C8A]">
                                Approved by {req.reviewedBy}
                              </div>
                            )}
                          </div>
                        )}
                        {isRejected && (
                          <div className="space-y-1 max-w-[200px]">
                            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                              <XCircle className="w-3 h-3 text-rose-600" />
                              <span>Rejected</span>
                            </div>
                            {req.rejectionReason && (
                              <div className="text-[11px] text-rose-700 bg-rose-50/80 p-1.5 rounded border border-rose-200 mt-1 line-clamp-2">
                                <span className="font-semibold">Reason:</span> {req.rejectionReason}
                              </div>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 align-top text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Details */}
                          <button
                            onClick={() => setSelectedRequest(req)}
                            className="p-1.5 rounded-lg text-[#516C8A] hover:text-[#2853f3] hover:bg-[#EEF2FF] border border-[#CFE2F2] transition-colors cursor-pointer"
                            title="View full facility details and documents"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Approve Button */}
                          {!isApproved && (
                            <button
                              onClick={() => handleApprove(req)}
                              className="px-2.5 py-1 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-2xs flex items-center gap-1 cursor-pointer"
                              title="Approve and certify this warehouse partner"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                          )}

                          {/* Reject Button */}
                          {!isRejected && (
                            <button
                              onClick={() => openRejectModal(req)}
                              className="px-2.5 py-1 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center gap-1 cursor-pointer"
                              title="Reject with specific correction reason"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          )}

                          {/* Re-review button if approved or rejected */}
                          {(isApproved || isRejected) && (
                            <button
                              onClick={() => handleResetToPending(req)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 border border-gray-200 transition-colors cursor-pointer"
                              title="Reset request status back to Pending Review"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: VIEW DETAILS MODAL                              */}
      {/* ======================================================== */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-[#CFE2F2] shadow-2xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-[#CFE2F2] bg-[#FAFBFD] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#EEF2FF] text-[#2853f3] flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm sm:text-base text-[#152B44]">
                      {selectedRequest.warehouseName}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-[#CFE2F2] text-[#516C8A]">
                      {selectedRequest.id}
                    </span>
                  </div>
                  <p className="text-xs text-[#516C8A]">
                    Submitted: {formatDate(selectedRequest.submittedAt)}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedRequest(null)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              {/* Status Header Bar */}
              <div className="flex items-center justify-between p-3 rounded-xl border bg-[#F9FBFE] border-[#CFE2F2]">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#516C8A] font-medium">Certification Status:</span>
                  {selectedRequest.status === 'pending' && (
                    <span className="px-2.5 py-0.5 rounded-full font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      Pending Review
                    </span>
                  )}
                  {selectedRequest.status === 'approved' && (
                    <span className="px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Certified Partner
                    </span>
                  )}
                  {selectedRequest.status === 'rejected' && (
                    <span className="px-2.5 py-0.5 rounded-full font-bold bg-rose-50 text-rose-800 border border-rose-200">
                      Rejected
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-[#516C8A]">
                  Org Type: <strong className="text-[#152B44]">{selectedRequest.organizationType}</strong>
                </div>
              </div>

              {/* Rejection Alert if Rejected */}
              {selectedRequest.status === 'rejected' && selectedRequest.rejectionReason && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-xs text-rose-800">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Official Rejection Notice Given to Partner:</span>
                  </div>
                  <p className="text-xs leading-relaxed bg-white/70 p-2 rounded-lg border border-rose-200/60">
                    "{selectedRequest.rejectionReason}"
                  </p>
                  {selectedRequest.reviewedBy && (
                    <div className="text-[10px] text-rose-700/80 pt-0.5">
                      Audited by {selectedRequest.reviewedBy} on {selectedRequest.reviewedAt ? formatDate(selectedRequest.reviewedAt) : 'N/A'}
                    </div>
                  )}
                </div>
              )}

              {/* Grid 1: Owner & Contact */}
              <div className="bg-[#FAFBFD] p-3.5 rounded-xl border border-[#CFE2F2] space-y-2">
                <h4 className="font-bold text-xs text-[#152B44] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#2853f3]" />
                  <span>Applicant &amp; Organizational Profile</span>
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-[#516C8A] block">Owner / Authorized Representative</span>
                    <span className="font-semibold text-[#152B44]">{selectedRequest.ownerName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#516C8A] block">Organization Structure</span>
                    <span className="font-semibold text-[#152B44]">{selectedRequest.organizationType}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#516C8A] block">Email ID</span>
                    <span className="font-semibold text-[#152B44] flex items-center gap-1">
                      <Mail className="w-3 h-3 text-[#516C8A]" />
                      {selectedRequest.email}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#516C8A] block">Mobile Phone</span>
                    <span className="font-semibold text-[#152B44] flex items-center gap-1">
                      <Phone className="w-3 h-3 text-[#516C8A]" />
                      {selectedRequest.mobile}
                    </span>
                  </div>
                </div>
              </div>

              {/* Grid 2: Physical Facility & Geographic Location */}
              <div className="bg-[#FAFBFD] p-3.5 rounded-xl border border-[#CFE2F2] space-y-2">
                <h4 className="font-bold text-xs text-[#152B44] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#2853f3]" />
                  <span>Warehouse Physical Location</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="sm:col-span-3">
                    <span className="text-[10px] text-[#516C8A] block">Full Street Address &amp; Corridor</span>
                    <span className="font-semibold text-[#152B44]">{selectedRequest.address}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#516C8A] block">City / District</span>
                    <span className="font-semibold text-[#152B44]">{selectedRequest.city}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#516C8A] block">State</span>
                    <span className="font-semibold text-[#152B44]">{selectedRequest.state}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#516C8A] block">Postal PIN Code</span>
                    <span className="font-semibold font-mono text-[#152B44]">{selectedRequest.pincode}</span>
                  </div>
                </div>
              </div>

              {/* Grid 3: Submitted Legal & Compliance Documents */}
              <div className="bg-[#FAFBFD] p-3.5 rounded-xl border border-[#CFE2F2] space-y-2">
                <h4 className="font-bold text-xs text-[#152B44] flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#2853f3]" />
                  <span>Submitted Compliance Documents</span>
                </h4>
                <div className="p-3 bg-white rounded-lg border border-[#CFE2F2] flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-bold text-[#152B44] text-xs">
                      {selectedRequest.documentType}
                    </div>
                    <div className="font-mono text-[11px] text-[#516C8A]">
                      Registration / Permit #: {selectedRequest.documentNumber}
                    </div>
                    {selectedRequest.documentFileName && (
                      <div className="text-[10px] text-emerald-700 flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Attached file: {selectedRequest.documentFileName} (Verified Checksum)</span>
                      </div>
                    )}
                  </div>

                  <span className="px-2.5 py-1 text-[10px] font-semibold rounded bg-[#EEF2FF] text-[#2853f3] border border-[#C7D4FE]">
                    Verified Format
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 sm:p-5 border-t border-[#CFE2F2] bg-[#FAFBFD] flex items-center justify-between gap-3">
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200 bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                {selectedRequest.status !== 'rejected' && (
                  <button
                    onClick={() => {
                      const req = selectedRequest;
                      setSelectedRequest(null);
                      openRejectModal(req);
                    }}
                    className="px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject Application</span>
                  </button>
                )}

                {selectedRequest.status !== 'approved' && (
                  <button
                    onClick={() => {
                      handleApprove(selectedRequest);
                    }}
                    className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve &amp; Certify Partner</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: REJECT REQUEST WITH REASON FIELD                */}
      {/* ======================================================== */}
      {rejectingRequest && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-rose-200 shadow-2xl overflow-hidden my-8">
            {/* Header */}
            <div className="p-5 border-b border-rose-100 bg-rose-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-[#152B44]">
                    Reject Partner Application
                  </h3>
                  <p className="text-xs text-rose-700">
                    {rejectingRequest.warehouseName} ({rejectingRequest.id})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setRejectingRequest(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4 text-xs">
              <p className="text-gray-600 text-xs leading-relaxed">
                Please enter the specific reason for rejecting this warehouse partner application. The partner will see this reason upon logging in and can click <strong>"Correct Details &amp; Reapply"</strong> to fix the flagged items.
              </p>

              {/* Preset Reason Quick-Picks */}
              <div>
                <label className="text-[11px] font-bold text-[#516C8A] block mb-1.5">
                  Select a common reason preset:
                </label>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {PRESET_REJECTION_REASONS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setRejectionReasonInput(preset);
                        setRejectionError('');
                      }}
                      className="w-full text-left p-2 rounded-lg text-[11px] bg-[#FAFBFD] hover:bg-rose-50 hover:text-rose-800 border border-gray-200 hover:border-rose-200 transition-all cursor-pointer text-gray-700"
                    >
                      • {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rejection Reason Input Field (Required) */}
              <div>
                <label className="text-xs font-bold text-[#152B44] flex items-center justify-between mb-1">
                  <span>Rejection Reason (Required) *</span>
                  <span className="text-[10px] text-gray-400 font-normal">Shown directly to partner</span>
                </label>
                <textarea
                  rows={3}
                  value={rejectionReasonInput}
                  onChange={(e) => {
                    setRejectionReasonInput(e.target.value);
                    if (e.target.value.trim()) setRejectionError('');
                  }}
                  placeholder="Detail the exact missing documents, failed verification checks, or incorrect information..."
                  className="w-full p-2.5 bg-[#FAFBFD] border border-gray-300 rounded-xl text-xs text-[#152B44] placeholder-gray-400 outline-none focus:border-rose-500 focus:bg-white focus:ring-2 focus:ring-rose-500/20 transition-all resize-none"
                />
                {rejectionError && (
                  <p className="text-xs text-rose-600 mt-1 flex items-center gap-1 font-medium">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{rejectionError}</span>
                  </p>
                )}
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Partner Reapplication Guarantee:</strong> The applicant's credentials remain stored. They will receive access to an automated pre-filled reapplication form to update their details and resubmit without starting over.
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-5 border-t border-gray-200 bg-[#FAFBFD] flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setRejectingRequest(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200 bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Confirm Rejection</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
