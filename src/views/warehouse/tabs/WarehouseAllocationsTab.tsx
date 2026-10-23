import React, { useState } from 'react';
import { useWarehouse } from '../../../context/WarehouseContext';
import {
  WarehouseAllocationRequest,
  AllocationRequestStatus,
} from '../../../types';
import {
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  X,
} from 'lucide-react';

export const WarehouseAllocationsTab: React.FC = () => {
  const { allocationRequests, acceptAllocationRequest, rejectAllocationRequest } = useWarehouse();

  const [statusFilter, setStatusFilter] = useState<AllocationRequestStatus | 'ALL'>('ALL');
  const [rejectingRequest, setRejectingRequest] = useState<WarehouseAllocationRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Logistics corridor impassable or inventory earmarked for higher severity epicenter.');

  const filtered = allocationRequests.filter((req) =>
    statusFilter === 'ALL' ? true : req.status === statusFilter
  );

  const handleConfirmReject = (id: string) => {
    rejectAllocationRequest(id, rejectionReason);
    setRejectingRequest(null);
  };

  const getStatusBadge = (status: AllocationRequestStatus) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF4E8] text-[#D9822B] border border-[#FCE2C4] inline-flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Pending Action
          </span>
        );
      case 'ACCEPTED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E5F7ED] text-[#24824F] border border-[#A8E2BF] inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Accepted
          </span>
        );
      case 'DISPATCHED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF2FF] text-[#2853f3] border border-[#CFE2F2] inline-flex items-center gap-1">
            Dispatched
          </span>
        );
      case 'REJECTED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FDF0ED] text-[#D95D58] border border-[#FAC8C3] inline-flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Declined
          </span>
        );
    }
  };

  return (
    <div className="p-5 space-y-4 max-w-[1700px] mx-auto">
      {/* Status Filter Tabs (Optimized Space - Heading Removed) */}
      <div className="bg-white p-3 rounded-xl border border-[#CFE2F2] shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-1.5 bg-[#FAFBFD] p-1 rounded-lg border border-[#CFE2F2] text-xs overflow-x-auto scrollbar-none">
          {(['ALL', 'PENDING', 'ACCEPTED', 'DISPATCHED'] as const).map((st) => {
            const count =
              st === 'ALL'
                ? allocationRequests.length
                : allocationRequests.filter((r) => r.status === st).length;
            const isSelected = statusFilter === st;

            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#2853f3] text-white shadow-2xs'
                    : 'text-[#516C8A] hover:text-[#152B44] hover:bg-white'
                }`}
              >
                <span>{st === 'ALL' ? 'All' : st}</span>
                <span
                  className={`text-[10px] px-1.5 rounded-full font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-[#E8F2FA] text-[#2853f3]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-xl border border-[#CFE2F2] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAFBFD] text-[11px] font-bold text-[#516C8A] uppercase tracking-wider border-b border-[#CFE2F2]">
                <th className="p-3 pl-4">Disaster Event</th>
                <th className="p-3">Affected Location</th>
                <th className="p-3">Required Resources</th>
                <th className="p-3 text-right">Quantity</th>
                <th className="p-3">Request Date</th>
                <th className="p-3">Status</th>
                <th className="p-3 pr-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F5FA] text-xs text-[#152B44]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-[#516C8A]">
                    No allocation requests found matching the selected filter.
                  </td>
                </tr>
              ) : (
                filtered.map((req) => (
                  <tr key={req.id} className="hover:bg-[#F9FCFF] transition-colors">
                    {/* Disaster Event */}
                    <td className="p-3 pl-4">
                      <div className="font-bold text-[#152B44]">{req.disasterEvent}</div>
                      <div className="text-[10px] text-[#516C8A] font-mono mt-0.5">
                        Ref: {req.disasterRefId}
                      </div>
                    </td>

                    {/* Affected Location */}
                    <td className="p-3">
                      <div className="flex items-center gap-1 text-[#152B44] font-medium">
                        <MapPin className="w-3.5 h-3.5 text-[#D95D58] shrink-0" />
                        <span>{req.affectedLocation}</span>
                      </div>
                    </td>

                    {/* Required Resources */}
                    <td className="p-3">
                      <div className="space-y-0.5">
                        {req.requiredResources.map((res, i) => (
                          <div key={i} className="text-[11px] text-[#152B44]">
                            • <span className="font-semibold">{res.quantity.toLocaleString()}</span> {res.name}
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Quantity */}
                    <td className="p-3 text-right font-mono font-bold text-[#152B44]">
                      {req.quantity.toLocaleString()}
                    </td>

                    {/* Date */}
                    <td className="p-3 text-[11px] text-[#516C8A]">{req.requestDate.split(' ')[0]}</td>

                    {/* Status */}
                    <td className="p-3">{getStatusBadge(req.status)}</td>

                    {/* Actions (View button removed, only Accept & Reject) */}
                    <td className="p-3 pr-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {req.status === 'PENDING' ? (
                          <>
                            <button
                              onClick={() => acceptAllocationRequest(req.id)}
                              className="px-2.5 py-1 text-xs font-bold text-white bg-[#359868] hover:bg-[#2A7B54] rounded transition-colors flex items-center gap-1 cursor-pointer"
                              title="Accept and reserve stock"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Accept</span>
                            </button>

                            <button
                              onClick={() => setRejectingRequest(req)}
                              className="px-2 py-1 text-xs font-semibold text-[#D95D58] hover:bg-[#FDF2F2] rounded transition-colors flex items-center gap-1 cursor-pointer"
                              title="Reject request"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </>
                        ) : (
                          <span className="text-[11px] text-[#516C8A]">—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Reject Confirmation */}
      {rejectingRequest && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#CFE2F2] shadow-2xl max-w-md w-full animate-scaleUp">
            <div className="p-4 border-b border-[#CFE2F2] flex items-center justify-between bg-[#FDF0ED] rounded-t-2xl">
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-[#D95D58]" />
                <h3 className="text-sm font-bold text-[#D95D58]">
                  Decline Allocation Requisition
                </h3>
              </div>
              <button
                onClick={() => setRejectingRequest(null)}
                className="text-[#516C8A] hover:text-[#152B44] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#516C8A]">Disaster Event:</span>
                <div className="font-bold text-[#152B44] text-sm mt-0.5">{rejectingRequest.disasterEvent}</div>
                <div className="text-[11px] text-[#516C8A] mt-0.5">{rejectingRequest.affectedLocation}</div>
              </div>

              <div>
                <label className="block font-semibold text-[#152B44] mb-1">
                  Rejection Reason / Operational Justification
                </label>
                <textarea
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#CFE2F2] bg-[#FAFBFD] text-[#152B44] focus:outline-none focus:border-[#2853f3]"
                  placeholder="Provide explicit operational reason..."
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#F0F5FA]">
                <button
                  type="button"
                  onClick={() => setRejectingRequest(null)}
                  className="px-3 py-1.5 rounded-lg border border-[#CFE2F2] text-[#516C8A] hover:bg-[#FAFBFD] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirmReject(rejectingRequest.id)}
                  className="px-3 py-1.5 rounded-lg bg-[#D95D58] hover:bg-[#C24B46] text-white font-bold flex items-center gap-1 cursor-pointer"
                >
                  Confirm Decline
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
