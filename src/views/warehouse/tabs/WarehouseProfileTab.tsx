import React, { useState } from 'react';
import { useWarehouse } from '../../../context/WarehouseContext';
import {
  Building2,
  User,
  Layers,
  Save,
  CheckCircle2,
} from 'lucide-react';

export const WarehouseProfileTab: React.FC = () => {
  const { profile, updateProfile } = useWarehouse();

  const [formData, setFormData] = useState({
    name: profile.name,
    organizationType: profile.organizationType,
    warehouseType: profile.warehouseType,
    ownerName: profile.ownerName,
    ownerEmail: profile.ownerEmail,
    ownerPhone: profile.ownerPhone,
    totalStorageCapacityTons: profile.totalStorageCapacityTons,
    coveredAreaSqFt: profile.coveredAreaSqFt,
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
      {saveSuccess && (
        <div className="p-3 bg-[#E5F7ED] border border-[#A8E2BF] text-[#24824F] rounded-lg text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4" />
          <span>Warehouse Profile updated successfully!</span>
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
            </div>
          </div>

          {/* Section 3: Owner Details */}
          <div className="bg-white p-5 rounded-xl border border-[#CFE2F2] shadow-2xs space-y-4 md:col-span-2">
            <div className="flex items-center gap-2 pb-2 border-b border-[#F0F5FA]">
              <User className="w-4 h-4 text-[#2853f3]" />
              <h3 className="text-sm font-bold text-[#152B44]">Owner Details</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#152B44] mb-1">
                  Name
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
                  Email ID
                </label>
                <input
                  type="email"
                  value={formData.ownerEmail}
                  onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-[#CFE2F2] bg-[#FAFBFD] text-[#152B44] focus:outline-none focus:border-[#2853f3]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#152B44] mb-1">
                  Contact Number
                </label>
                <input
                  type="text"
                  value={formData.ownerPhone}
                  onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-[#CFE2F2] bg-[#FAFBFD] text-[#152B44] focus:outline-none focus:border-[#2853f3]"
                  required
                />
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
