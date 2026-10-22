import React, { useState } from 'react';
import { useWarehouse } from '../../../context/WarehouseContext';
import {
  Building2,
  User,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Save,
  CheckCircle2,
  Calendar,
  Layers,
  ThermometerSnowflake,
  MapPin,
} from 'lucide-react';

export const WarehouseProfileTab: React.FC = () => {
  const { profile, updateProfile } = useWarehouse();

  const [formData, setFormData] = useState({
    name: profile.name,
    organizationType: profile.organizationType,
    warehouseType: profile.warehouseType,
    ownerName: profile.ownerName,
    ownerTitle: profile.ownerTitle,
    ownerEmail: profile.ownerEmail,
    ownerPhone: profile.ownerPhone,
    emergencyDeskPhone: profile.emergencyDeskPhone,
    totalStorageCapacityTons: profile.totalStorageCapacityTons,
    coveredAreaSqFt: profile.coveredAreaSqFt,
    coldChainCapacityTons: profile.coldChainCapacityTons,
    operatingHours: profile.operatingHours,
    operationalStatus: profile.operationalStatus,
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="p-5 space-y-6 max-w-[1400px] mx-auto">
      {/* Header Profile Summary */}
      <div className="bg-white p-5 rounded-xl border border-[#CFE2F2] shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#EEF2FF] border border-[#CFE2F2] flex items-center justify-center text-[#2853f3] shrink-0 shadow-xs">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#152B44]">{profile.name}</h2>
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-[#FAFBFD] border border-[#CFE2F2] text-[#2853f3]">
                {profile.code}
              </span>
            </div>
            <p className="text-xs text-[#516C8A] mt-0.5">
              {profile.organizationType} • {profile.district}, {profile.state}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E5F7ED] border border-[#A8E2BF] text-xs font-bold text-[#24824F]">
            <ShieldCheck className="w-4 h-4" />
            <span>{profile.ndmaPartnerTier}</span>
          </div>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-[#E5F7ED] border border-[#A8E2BF] text-[#24824F] rounded-lg text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4" />
          <span>Warehouse Profile and facility specifications updated successfully!</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Section 1: Facility Specifications */}
          <div className="bg-white p-5 rounded-xl border border-[#CFE2F2] shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#F0F5FA]">
              <Building2 className="w-4 h-4 text-[#2853f3]" />
              <h3 className="text-sm font-bold text-[#152B44]">Facility Specifications</h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#152B44] mb-1">
                  Warehouse Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-[#CFE2F2] bg-[#FAFBFD] text-[#152B44] focus:outline-none focus:border-[#2853f3]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#152B44] mb-1">
                  Organization Type
                </label>
                <input
                  type="text"
                  value={formData.organizationType}
                  onChange={(e) => setFormData({ ...formData, organizationType: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-[#CFE2F2] bg-[#FAFBFD] text-[#152B44] focus:outline-none focus:border-[#2853f3]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#152B44] mb-1">
                  Warehouse Type / Classification
                </label>
                <input
                  type="text"
                  value={formData.warehouseType}
                  onChange={(e) => setFormData({ ...formData, warehouseType: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-[#CFE2F2] bg-[#FAFBFD] text-[#152B44] focus:outline-none focus:border-[#2853f3]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#152B44] mb-1">
                    Operating Hours
                  </label>
                  <input
                    type="text"
                    value={formData.operatingHours}
                    onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-[#CFE2F2] bg-[#FAFBFD] text-[#152B44] focus:outline-none focus:border-[#2853f3]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#152B44] mb-1">
                    Operational Status
                  </label>
                  <select
                    value={formData.operationalStatus}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        operationalStatus: e.target.value as any,
                      })
                    }
                    className="w-full text-xs px-3 py-2 rounded-lg border border-[#CFE2F2] bg-[#FAFBFD] text-[#152B44] focus:outline-none focus:border-[#2853f3]"
                  >
                    <option value="ACTIVE">ACTIVE (Normal Ops)</option>
                    <option value="STANDBY">STANDBY</option>
                    <option value="SURGE_EMERGENCY">SURGE EMERGENCY</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Storage Capacities */}
          <div className="bg-white p-5 rounded-xl border border-[#CFE2F2] shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#F0F5FA]">
              <Layers className="w-4 h-4 text-[#2853f3]" />
              <h3 className="text-sm font-bold text-[#152B44]">Storage Capacity & Dimensions</h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#152B44] mb-1">
                  Total Storage Capacity (Metric Tons - MT)
                </label>
                <input
                  type="number"
                  value={formData.totalStorageCapacityTons}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      totalStorageCapacityTons: Number(e.target.value),
                    })
                  }
                  className="w-full text-xs px-3 py-2 rounded-lg border border-[#CFE2F2] bg-[#FAFBFD] text-[#152B44] focus:outline-none focus:border-[#2853f3]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#152B44] mb-1">
                  Covered Floor Area (Square Feet)
                </label>
                <input
                  type="number"
                  value={formData.coveredAreaSqFt}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      coveredAreaSqFt: Number(e.target.value),
                    })
                  }
                  className="w-full text-xs px-3 py-2 rounded-lg border border-[#CFE2F2] bg-[#FAFBFD] text-[#152B44] focus:outline-none focus:border-[#2853f3]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#152B44] mb-1">
                  Cold-Chain Storage Capacity (MT)
                </label>
                <input
                  type="number"
                  value={formData.coldChainCapacityTons}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      coldChainCapacityTons: Number(e.target.value),
                    })
                  }
                  className="w-full text-xs px-3 py-2 rounded-lg border border-[#CFE2F2] bg-[#FAFBFD] text-[#152B44] focus:outline-none focus:border-[#2853f3]"
                  required
                />
              </div>

              {/* Readonly Accreditation Badges */}
              <div className="p-3 bg-[#FAFBFD] rounded-lg border border-[#CFE2F2] text-xs space-y-1.5">
                <div className="text-[10px] font-bold uppercase text-[#516C8A]">Official Registrations:</div>
                <div className="flex justify-between text-[#152B44]">
                  <span>Registration ID:</span>
                  <span className="font-mono font-semibold">{profile.verificationCertificateId}</span>
                </div>
                <div className="flex justify-between text-[#152B44]">
                  <span>Last Facility Audit:</span>
                  <span className="font-semibold">{profile.lastAuditDate} (Score: {profile.auditScore}%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Owner Details & Management */}
          <div className="bg-white p-5 rounded-xl border border-[#CFE2F2] shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#F0F5FA]">
              <User className="w-4 h-4 text-[#2853f3]" />
              <h3 className="text-sm font-bold text-[#152B44]">Owner & Managing Partner Details</h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#152B44] mb-1">
                  Owner Full Name
                </label>
                <input
                  type="text"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-[#CFE2F2] bg-[#FAFBFD] text-[#152B44] focus:outline-none focus:border-[#2853f3]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#152B44] mb-1">
                  Official Title / Role
                </label>
                <input
                  type="text"
                  value={formData.ownerTitle}
                  onChange={(e) => setFormData({ ...formData, ownerTitle: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-[#CFE2F2] bg-[#FAFBFD] text-[#152B44] focus:outline-none focus:border-[#2853f3]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#152B44] mb-1">
                  Official Email
                </label>
                <input
                  type="email"
                  value={formData.ownerEmail}
                  onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-[#CFE2F2] bg-[#FAFBFD] text-[#152B44] focus:outline-none focus:border-[#2853f3]"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 4: Contact & Emergency Dispatch Information */}
          <div className="bg-white p-5 rounded-xl border border-[#CFE2F2] shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#F0F5FA]">
              <Phone className="w-4 h-4 text-[#2853f3]" />
              <h3 className="text-sm font-bold text-[#152B44]">Contact & Emergency Dispatch Desk</h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#152B44] mb-1">
                  Owner Direct Mobile
                </label>
                <input
                  type="text"
                  value={formData.ownerPhone}
                  onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-[#CFE2F2] bg-[#FAFBFD] text-[#152B44] focus:outline-none focus:border-[#2853f3]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#152B44] mb-1">
                  24x7 Emergency Dispatch Hotline
                </label>
                <input
                  type="text"
                  value={formData.emergencyDeskPhone}
                  onChange={(e) => setFormData({ ...formData, emergencyDeskPhone: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-[#CFE2F2] bg-[#FAFBFD] text-[#152B44] focus:outline-none focus:border-[#2853f3]"
                  required
                />
              </div>

              <div className="p-3 bg-[#EEF2FF] rounded-lg border border-[#CFE2F2] text-xs text-[#2853f3]">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#359868]" />
                  <span>Direct Satellite Interlink Enabled</span>
                </div>
                <p className="text-[11px] text-[#516C8A] mt-1">
                  This emergency contact is registered with the National Disaster Management Authority (NDMA) automated paging gateway.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#2853f3] hover:bg-[#1e42d9] rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
