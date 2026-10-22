import React, { useState, useMemo } from 'react';
import { useWarehouse } from '../../../context/WarehouseContext';
import {
  WarehouseResourceItem,
  WarehouseResourceCategory,
  StockStatus,
} from '../../../types';
import {
  Search,
  Filter,
  PlusCircle,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Boxes,
  ArrowUpDown,
  SlidersHorizontal,
  X,
  Save,
  Clock,
} from 'lucide-react';

const CATEGORIES: (WarehouseResourceCategory | 'ALL')[] = [
  'ALL',
  'Food & Essentials',
  'Water & Beverages',
  'Medical & First Aid',
  'Hygiene & Personal Care',
  'Shelter & Bedding',
  'Rescue & Safety',
];

interface ResourceFormData {
  category: WarehouseResourceCategory;
  name: string;
  quantity: number;
  unit: string;
  reservedQuantity: number;
  minThreshold: number;
  expiryDate: string;
  storageCondition: 'DRY' | 'COLD_CHAIN' | 'HEAVY_EQUIPMENT' | 'HAZMAT';
  rackLocation: string;
  batchNumber: string;
}

export const WarehouseInventoryTab: React.FC = () => {
  const {
    resources,
    addResource,
    updateResource,
    deleteResource,
    adjustStock,
    inventorySearch,
    setInventorySearch,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    selectedStockStatusFilter,
    setSelectedStockStatusFilter,
  } = useWarehouse();

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<WarehouseResourceItem | null>(null);
  const [adjustingResource, setAdjustingResource] = useState<WarehouseResourceItem | null>(null);
  const [adjustQty, setAdjustQty] = useState<number>(0);
  const [adjustReason, setAdjustReason] = useState<string>('Cycle count physical verification');

  // New Resource Form
  const [formData, setFormData] = useState<ResourceFormData>({
    category: 'Food & Essentials',
    name: '',
    quantity: 1000,
    unit: '',
    reservedQuantity: 0,
    minThreshold: 200,
    expiryDate: '2027-12-31',
    storageCondition: 'DRY',
    rackLocation: 'Zone-A / Rack 01',
    batchNumber: 'BAT-2026-01',
  });

  // Filtered resources
  const filteredResources = useMemo(() => {
    return resources.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
        item.category.toLowerCase().includes(inventorySearch.toLowerCase()) ||
        (item.batchNumber && item.batchNumber.toLowerCase().includes(inventorySearch.toLowerCase())) ||
        (item.rackLocation && item.rackLocation.toLowerCase().includes(inventorySearch.toLowerCase()));

      const matchesCategory =
        selectedCategoryFilter === 'ALL' || item.category === selectedCategoryFilter;

      const matchesStatus =
        selectedStockStatusFilter === 'ALL' || item.stockStatus === selectedStockStatusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [resources, inventorySearch, selectedCategoryFilter, selectedStockStatusFilter]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addResource(formData);
    setIsAddModalOpen(false);
    // Reset form
    setFormData({
      category: 'Food & Essentials',
      name: '',
      quantity: 1000,
      unit: '',
      reservedQuantity: 0,
      minThreshold: 200,
      expiryDate: '2027-12-31',
      storageCondition: 'DRY',
      rackLocation: 'Zone-A / Rack 01',
      batchNumber: 'BAT-2026-01',
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResource) return;
    updateResource(editingResource.id, {
      name: editingResource.name,
      category: editingResource.category,
      quantity: editingResource.quantity,
      unit: editingResource.unit,
      reservedQuantity: editingResource.reservedQuantity,
      minThreshold: editingResource.minThreshold,
      expiryDate: editingResource.expiryDate,
      storageCondition: editingResource.storageCondition,
      rackLocation: editingResource.rackLocation,
      batchNumber: editingResource.batchNumber,
    });
    setEditingResource(null);
  };

  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingResource) return;
    adjustStock(adjustingResource.id, adjustQty, adjustReason);
    setAdjustingResource(null);
  };

  const getStatusBadge = (status: StockStatus) => {
    switch (status) {
      case 'IN_STOCK':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E5F7ED] text-[#24824F] border border-[#A8E2BF] inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#359868]"></span>
            In Stock
          </span>
        );
      case 'LOW_STOCK':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FEF4E8] text-[#D9822B] border border-[#FCE2C4] inline-flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-[#DE8838]" />
            Low Stock
          </span>
        );
      case 'CRITICAL':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FDF0ED] text-[#D95D58] border border-[#FAC8C3] inline-flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-[#D95D58]" />
            Critical Deficit
          </span>
        );
      case 'EXPIRING_SOON':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FFF9E6] text-[#B87B00] border border-[#FFE7A3] inline-flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#B87B00]" />
            Expiring Soon
          </span>
        );
    }
  };

  const getCategoryColor = (category: WarehouseResourceCategory) => {
    switch (category) {
      case 'Food & Essentials':
        return 'text-[#DE8838] bg-[#FEF4E8] border-[#FCE2C4]';
      case 'Water & Beverages':
        return 'text-[#2853f3] bg-[#EEF2FF] border-[#CFE2F2]';
      case 'Medical & First Aid':
        return 'text-[#D95D58] bg-[#FDF0ED] border-[#FAC8C3]';
      case 'Hygiene & Personal Care':
        return 'text-[#9B51E0] bg-[#F5EEFB] border-[#E8D4F7]';
      case 'Shelter & Bedding':
        return 'text-[#E67E22] bg-[#FFF6ED] border-[#FAD7B5]';
      case 'Rescue & Safety':
        return 'text-[#24824F] bg-[#E5F7ED] border-[#A8E2BF]';
      default:
        return 'text-[#516C8A] bg-[#FAFBFD] border-[#CFE2F2]';
    }
  };

  return (
    <div className="p-5 space-y-5 max-w-[1700px] mx-auto">
      {/* Top Header Bar & Quick Add */}
      <div className="bg-white p-4 rounded-xl border border-[#CFE2F2] shadow-2xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#516C8A] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by resource name, batch number, or rack..."
            value={inventorySearch}
            onChange={(e) => setInventorySearch(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2 rounded-lg border border-[#CFE2F2] bg-[#FAFBFD] text-[#152B44] focus:outline-none focus:border-[#2853f3]"
          />
          {inventorySearch && (
            <button
              onClick={() => setInventorySearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#516C8A] hover:text-[#152B44]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Controls & Add Resource Action */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Stock Status Filter */}
          <div className="flex items-center gap-1.5 text-xs text-[#516C8A]">
            <Filter className="w-3.5 h-3.5 text-[#2853f3]" />
            <select
              value={selectedStockStatusFilter}
              onChange={(e) => setSelectedStockStatusFilter(e.target.value as any)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-[#CFE2F2] bg-white text-[#152B44] focus:outline-none focus:border-[#2853f3]"
            >
              <option value="ALL">All Stock Statuses</option>
              <option value="IN_STOCK">In Stock</option>
              <option value="LOW_STOCK">Low Stock</option>
              <option value="CRITICAL">Critical Deficit</option>
              <option value="EXPIRING_SOON">Expiring Soon</option>
            </select>
          </div>

          {/* Add Resource Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#2853f3] hover:bg-[#1e42d9] rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Resource</span>
          </button>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategoryFilter === cat;
          const count =
            cat === 'ALL'
              ? resources.length
              : resources.filter((r) => r.category === cat).length;

          return (
            <button
              key={cat}
              onClick={() => setSelectedCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-[#2853f3] text-white border-[#2853f3] shadow-xs'
                  : 'bg-white text-[#516C8A] border-[#CFE2F2] hover:bg-[#F0F6FD] hover:text-[#2853f3]'
              }`}
            >
              <span>{cat === 'ALL' ? 'All Categories' : cat}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-[#E8F2FA] text-[#2853f3]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Inventory Table Card */}
      <div className="bg-white rounded-xl border border-[#CFE2F2] shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-[#CFE2F2] flex items-center justify-between text-xs">
          <div className="font-bold text-[#152B44] flex items-center gap-2">
            <Boxes className="w-4 h-4 text-[#2853f3]" />
            <span>Warehouse Stock Registry</span>
            <span className="text-[#516C8A] font-normal">
              (Showing {filteredResources.length} of {resources.length} SKUs)
            </span>
          </div>

          <div className="text-[11px] text-[#516C8A]">
            Auto-synced with National Emergency Operations Center (NEOC)
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAFBFD] text-[11px] font-bold text-[#516C8A] uppercase tracking-wider border-b border-[#CFE2F2]">
                <th className="p-3 pl-4">Resource & Batch</th>
                <th className="p-3">Category</th>
                <th className="p-3 text-right">Total Stock</th>
                <th className="p-3 text-right">Reserved</th>
                <th className="p-3 text-right">Available</th>
                <th className="p-3">Status</th>
                <th className="p-3">Expiry Date</th>
                <th className="p-3">Storage Location</th>
                <th className="p-3 pr-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F5FA] text-xs text-[#152B44]">
              {filteredResources.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-xs text-[#516C8A]">
                    No resource items found matching the selected filters.
                  </td>
                </tr>
              ) : (
                filteredResources.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F9FCFF] transition-colors">
                    {/* Name & Batch */}
                    <td className="p-3 pl-4">
                      <div className="font-semibold text-[#152B44]">{item.name}</div>
                      <div className="text-[10px] text-[#516C8A] font-mono mt-0.5">
                        Batch: {item.batchNumber || 'N/A'}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-3">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getCategoryColor(
                          item.category
                        )}`}
                      >
                        {item.category}
                      </span>
                    </td>

                    {/* Total Stock */}
                    <td className="p-3 text-right font-mono font-bold text-[#152B44]">
                      {item.quantity.toLocaleString()}
                    </td>

                    {/* Reserved */}
                    <td className="p-3 text-right font-mono font-semibold text-[#DE8838]">
                      {item.reservedQuantity.toLocaleString()}
                    </td>

                    {/* Available */}
                    <td className="p-3 text-right font-mono font-bold text-[#24824F]">
                      {item.availableQuantity.toLocaleString()}
                    </td>

                    {/* Status */}
                    <td className="p-3">{getStatusBadge(item.stockStatus)}</td>

                    {/* Expiry Date */}
                    <td className="p-3 font-mono text-[11px] text-[#516C8A]">
                      {item.expiryDate === 'N/A' ? (
                        <span className="text-[#88A2BF]">Non-perishable</span>
                      ) : (
                        item.expiryDate
                      )}
                    </td>

                    {/* Storage Location */}
                    <td className="p-3 text-[11px]">
                      <div className="text-[#152B44] font-medium">{item.rackLocation || 'Bay Standard'}</div>
                      <span className="text-[9px] text-[#516C8A] uppercase font-semibold">
                        {item.storageCondition || 'DRY'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-3 pr-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => {
                            setAdjustingResource(item);
                            setAdjustQty(item.quantity);
                          }}
                          className="p-1 rounded text-[#2853f3] hover:bg-[#EEF2FF] transition-colors"
                          title="Quick Stock Adjustment"
                        >
                          <ArrowUpDown className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setEditingResource(item)}
                          className="p-1 rounded text-[#516C8A] hover:text-[#2853f3] hover:bg-[#F0F6FD] transition-colors"
                          title="Edit Resource"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete ${item.name}?`)) {
                              deleteResource(item.id);
                            }
                          }}
                          className="p-1 rounded text-[#D95D58] hover:bg-[#FDF2F2] transition-colors"
                          title="Delete Resource"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Add New Resource */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#CFE2F2] shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto animate-scaleUp">
            <div className="p-4 border-b border-[#CFE2F2] flex items-center justify-between bg-[#FAFBFD] rounded-t-2xl">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-[#2853f3]" />
                <h3 className="text-sm font-bold text-[#152B44]">Add New Disaster Relief Resource</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#516C8A] hover:text-[#152B44] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block font-semibold text-[#152B44] mb-1">Resource Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Purified Drinking Water (1L Bottles)"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#CFE2F2] bg-[#FAFBFD] text-[#152B44] focus:outline-none focus:border-[#2853f3]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#152B44] mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as WarehouseResourceCategory })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#CFE2F2] bg-[#FAFBFD] text-[#152B44] focus:outline-none focus:border-[#2853f3]"
                  >
                    <option value="Food & Essentials">Food & Essentials</option>
                    <option value="Water & Beverages">Water & Beverages</option>
                    <option value="Medical & First Aid">Medical & First Aid</option>
                    <option value="Hygiene & Personal Care">Hygiene & Personal Care</option>
                    <option value="Shelter & Bedding">Shelter & Bedding</option>
                    <option value="Rescue & Safety">Rescue & Safety</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#152B44] mb-1">Initial Total Quantity</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-[#CFE2F2] bg-[#FAFBFD] text-[#152B44] focus:outline-none focus:border-[#2853f3]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#152B44] mb-1">Min Low-Stock Threshold</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.minThreshold}
                    onChange={(e) => setFormData({ ...formData, minThreshold: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-[#CFE2F2] bg-[#FAFBFD] text-[#152B44] focus:outline-none focus:border-[#2853f3]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#152B44] mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#CFE2F2] bg-[#FAFBFD] text-[#152B44] focus:outline-none focus:border-[#2853f3]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#152B44] mb-1">Storage Condition</label>
                  <select
                    value={formData.storageCondition}
                    onChange={(e) =>
                      setFormData({ ...formData, storageCondition: e.target.value as any })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#CFE2F2] bg-[#FAFBFD] text-[#152B44] focus:outline-none focus:border-[#2853f3]"
                  >
                    <option value="DRY">Dry Ambient</option>
                    <option value="COLD_CHAIN">Cold Chain (-4°C to 4°C)</option>
                    <option value="HEAVY_EQUIPMENT">Heavy Equipment Bay</option>
                    <option value="HAZMAT">Hazardous / Chemical Vault</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#152B44] mb-1">Rack / Bay Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Zone-B / Pallet 04"
                    value={formData.rackLocation}
                    onChange={(e) => setFormData({ ...formData, rackLocation: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#CFE2F2] bg-[#FAFBFD] text-[#152B44] focus:outline-none focus:border-[#2853f3]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#152B44] mb-1">Batch Number</label>
                  <input
                    type="text"
                    placeholder="e.g. MRE-2026-08B"
                    value={formData.batchNumber}
                    onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#CFE2F2] bg-[#FAFBFD] text-[#152B44] focus:outline-none focus:border-[#2853f3]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#F0F5FA] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-2 rounded-lg border border-[#CFE2F2] text-[#516C8A] hover:bg-[#FAFBFD]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#2853f3] hover:bg-[#1e42d9] text-white font-bold"
                >
                  Save Resource to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Edit Resource */}
      {editingResource && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#CFE2F2] shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto animate-scaleUp">
            <div className="p-4 border-b border-[#CFE2F2] flex items-center justify-between bg-[#FAFBFD] rounded-t-2xl">
              <div className="flex items-center gap-2">
                <Edit className="w-4 h-4 text-[#2853f3]" />
                <h3 className="text-sm font-bold text-[#152B44]">Edit Resource Specifications</h3>
              </div>
              <button
                onClick={() => setEditingResource(null)}
                className="text-[#516C8A] hover:text-[#152B44] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block font-semibold text-[#152B44] mb-1">Resource Name</label>
                  <input
                    type="text"
                    required
                    value={editingResource.name}
                    onChange={(e) =>
                      setEditingResource({ ...editingResource, name: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#CFE2F2] bg-[#FAFBFD] text-[#152B44] focus:outline-none focus:border-[#2853f3]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#152B44] mb-1">Category</label>
                  <select
                    value={editingResource.category}
                    onChange={(e) =>
                      setEditingResource({
                        ...editingResource,
                        category: e.target.value as WarehouseResourceCategory,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#CFE2F2] bg-[#FAFBFD] text-[#152B44] focus:outline-none focus:border-[#2853f3]"
                  >
                    <option value="Food & Essentials">Food & Essentials</option>
                    <option value="Water & Beverages">Water & Beverages</option>
                    <option value="Medical & First Aid">Medical & First Aid</option>
                    <option value="Hygiene & Personal Care">Hygiene & Personal Care</option>
                    <option value="Shelter & Bedding">Shelter & Bedding</option>
                    <option value="Rescue & Safety">Rescue & Safety</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#152B44] mb-1">Total Quantity</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={editingResource.quantity}
                    onChange={(e) =>
                      setEditingResource({
                        ...editingResource,
                        quantity: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#CFE2F2] bg-[#FAFBFD] text-[#152B44] focus:outline-none focus:border-[#2853f3]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#152B44] mb-1">Reserved Quantity</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={editingResource.reservedQuantity}
                    onChange={(e) =>
                      setEditingResource({
                        ...editingResource,
                        reservedQuantity: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#CFE2F2] bg-[#FAFBFD] text-[#152B44] focus:outline-none focus:border-[#2853f3]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#152B44] mb-1">Min Threshold</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={editingResource.minThreshold}
                    onChange={(e) =>
                      setEditingResource({
                        ...editingResource,
                        minThreshold: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#CFE2F2] bg-[#FAFBFD] text-[#152B44] focus:outline-none focus:border-[#2853f3]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#152B44] mb-1">Expiry Date</label>
                  <input
                    type="text"
                    value={editingResource.expiryDate}
                    onChange={(e) =>
                      setEditingResource({
                        ...editingResource,
                        expiryDate: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#CFE2F2] bg-[#FAFBFD] text-[#152B44] focus:outline-none focus:border-[#2853f3]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#152B44] mb-1">Rack Location</label>
                  <input
                    type="text"
                    value={editingResource.rackLocation || ''}
                    onChange={(e) =>
                      setEditingResource({
                        ...editingResource,
                        rackLocation: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#CFE2F2] bg-[#FAFBFD] text-[#152B44] focus:outline-none focus:border-[#2853f3]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#152B44] mb-1">Batch Number</label>
                  <input
                    type="text"
                    value={editingResource.batchNumber || ''}
                    onChange={(e) =>
                      setEditingResource({
                        ...editingResource,
                        batchNumber: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#CFE2F2] bg-[#FAFBFD] text-[#152B44] focus:outline-none focus:border-[#2853f3]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#F0F5FA] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingResource(null)}
                  className="px-3 py-2 rounded-lg border border-[#CFE2F2] text-[#516C8A] hover:bg-[#FAFBFD]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#2853f3] hover:bg-[#1e42d9] text-white font-bold flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Update SKU Record</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Quick Stock Adjustment */}
      {adjustingResource && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#CFE2F2] shadow-2xl max-w-md w-full animate-scaleUp">
            <div className="p-4 border-b border-[#CFE2F2] flex items-center justify-between bg-[#FAFBFD] rounded-t-2xl">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-[#2853f3]" />
                <h3 className="text-sm font-bold text-[#152B44]">Reconcile / Adjust Stock</h3>
              </div>
              <button
                onClick={() => setAdjustingResource(null)}
                className="text-[#516C8A] hover:text-[#152B44] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAdjustSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#516C8A]">Resource Item:</span>
                <div className="font-bold text-[#152B44] text-sm mt-0.5">{adjustingResource.name}</div>
                <div className="text-[11px] text-[#516C8A] mt-0.5">
                  Current Stock: <b>{adjustingResource.quantity.toLocaleString()}</b> (Reserved: {adjustingResource.reservedQuantity.toLocaleString()})
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#152B44] mb-1">New Total Stock Quantity</label>
                <input
                  type="number"
                  min={adjustingResource.reservedQuantity}
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-[#CFE2F2] bg-[#FAFBFD] text-sm font-bold font-mono text-[#152B44] focus:outline-none focus:border-[#2853f3]"
                  required
                />
                <span className="text-[10px] text-[#516C8A] mt-1 block">
                  Must be at least the reserved quantity ({adjustingResource.reservedQuantity.toLocaleString()}).
                </span>
              </div>

              <div>
                <label className="block font-semibold text-[#152B44] mb-1">Reconciliation Reason / Audit Reference</label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g. Inbound shipment arrival, damage disposal, physical recount"
                  className="w-full px-3 py-2 rounded-lg border border-[#CFE2F2] bg-[#FAFBFD] text-[#152B44] focus:outline-none focus:border-[#2853f3]"
                  required
                />
              </div>

              <div className="pt-3 border-t border-[#F0F5FA] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustingResource(null)}
                  className="px-3 py-2 rounded-lg border border-[#CFE2F2] text-[#516C8A] hover:bg-[#FAFBFD]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#2853f3] hover:bg-[#1e42d9] text-white font-bold"
                >
                  Confirm Stock Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
