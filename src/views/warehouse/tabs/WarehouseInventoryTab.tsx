import React, { useState, useMemo } from 'react';
import { useWarehouse } from '../../../context/WarehouseContext';
import {
  WarehouseResourceItem,
  WarehouseResourceCategory,
} from '../../../types';
import {
  Search,
  Filter,
  PlusCircle,
  Edit,
  Trash2,
  Boxes,
  X,
  Save,
} from 'lucide-react';

const CATEGORIES: { label: string; value: WarehouseResourceCategory | 'ALL' }[] = [
  { label: 'All Categories', value: 'ALL' },
  { label: 'Food & Essentials', value: 'Food & Essentials' },
  { label: 'Water & Beverages', value: 'Water & Beverages' },
  { label: 'Medical & First Aid', value: 'Medical & First Aid' },
  { label: 'Hygiene & Personal Care', value: 'Hygiene & Personal Care' },
  { label: 'Shelter & Bedding', value: 'Shelter & Bedding' },
  { label: 'Rescue & Safety', value: 'Rescue & Safety' },
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
    inventorySearch,
    setInventorySearch,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
  } = useWarehouse();

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<WarehouseResourceItem | null>(null);

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
        item.category.toLowerCase().includes(inventorySearch.toLowerCase());

      const matchesCategory =
        selectedCategoryFilter === 'ALL' || item.category === selectedCategoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [resources, inventorySearch, selectedCategoryFilter]);

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
    <div className="p-5 space-y-4 max-w-[1700px] mx-auto">
      {/* Top Header Bar with Search, Category Dropdown, and Add Resource */}
      <div className="bg-white p-3.5 rounded-xl border border-[#CFE2F2] shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#516C8A] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search resources..."
              value={inventorySearch}
              onChange={(e) => setInventorySearch(e.target.value)}
              className="w-full text-xs pl-9 pr-8 py-2 rounded-lg border border-[#CFE2F2] bg-[#FAFBFD] text-[#152B44] focus:outline-none focus:border-[#2853f3]"
            />
            {inventorySearch && (
              <button
                onClick={() => setInventorySearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#516C8A] hover:text-[#152B44] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter Dropdown for space optimization */}
          <div className="flex items-center gap-1.5 text-xs text-[#516C8A]">
            <Filter className="w-3.5 h-3.5 text-[#2853f3] shrink-0" />
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value as any)}
              className="text-xs px-3 py-2 rounded-lg border border-[#CFE2F2] bg-white text-[#152B44] focus:outline-none focus:border-[#2853f3] font-medium cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Add Resource Button */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#2853f3] hover:bg-[#1e42d9] rounded-lg shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Resource</span>
        </button>
      </div>

      {/* Inventory Table Card */}
      <div className="bg-white rounded-xl border border-[#CFE2F2] shadow-2xs overflow-hidden">
        <div className="p-3.5 border-b border-[#CFE2F2] flex items-center justify-between text-xs">
          <div className="font-bold text-[#152B44] flex items-center gap-2">
            <Boxes className="w-4 h-4 text-[#2853f3]" />
            <span>Warehouse Stock Registry</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAFBFD] text-[11px] font-bold text-[#516C8A] uppercase tracking-wider border-b border-[#CFE2F2]">
                <th className="p-3 pl-4">Resources</th>
                <th className="p-3 text-right">Total Stock</th>
                <th className="p-3 text-right">Available</th>
                <th className="p-3">Expiry Date</th>
                <th className="p-3 pr-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F5FA] text-xs text-[#152B44]">
              {filteredResources.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-xs text-[#516C8A]">
                    No resource items found matching the selected filters.
                  </td>
                </tr>
              ) : (
                filteredResources.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F9FCFF] transition-colors">
                    {/* Resources: Name with Category label beside it */}
                    <td className="p-3 pl-4">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-semibold text-[#152B44]">{item.name}</span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getCategoryColor(
                            item.category
                          )}`}
                        >
                          {item.category}
                        </span>
                      </div>
                    </td>

                    {/* Total Stock */}
                    <td className="p-3 text-right font-mono font-bold text-[#152B44]">
                      {item.quantity.toLocaleString()}
                    </td>

                    {/* Available */}
                    <td className="p-3 text-right font-mono font-bold text-[#24824F]">
                      {item.availableQuantity.toLocaleString()}
                    </td>

                    {/* Expiry Date */}
                    <td className="p-3 font-mono text-[11px] text-[#516C8A]">
                      {item.expiryDate === 'N/A' ? (
                        <span className="text-[#88A2BF]">Non-perishable</span>
                      ) : (
                        item.expiryDate
                      )}
                    </td>

                    {/* Actions: Edit and Delete only (Quick stock adjustment icon removed) */}
                    <td className="p-3 pr-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setEditingResource(item)}
                          className="p-1 rounded text-[#516C8A] hover:text-[#2853f3] hover:bg-[#F0F6FD] transition-colors cursor-pointer"
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
                          className="p-1 rounded text-[#D95D58] hover:bg-[#FDF2F2] transition-colors cursor-pointer"
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
          <div className="bg-white rounded-2xl border border-[#CFE2F2] shadow-2xl max-w-lg w-full animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-[#CFE2F2] flex items-center justify-between bg-[#FAFBFD] rounded-t-2xl">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-[#2853f3]" />
                <h3 className="text-sm font-bold text-[#152B44]">Add New Resource</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#516C8A] hover:text-[#152B44] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-5 space-y-4 text-xs">
              <div className="space-y-3">
                <div>
                  <label className="block font-semibold text-[#152B44] mb-1">Resource Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rice, Drinking Water, Blankets"
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
              </div>

              <div className="pt-3 border-t border-[#F0F5FA] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-2 rounded-lg border border-[#CFE2F2] text-[#516C8A] hover:bg-[#FAFBFD] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#2853f3] hover:bg-[#1e42d9] text-white font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save SKU</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Edit Resource */}
      {editingResource && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#CFE2F2] shadow-2xl max-w-lg w-full animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-[#CFE2F2] flex items-center justify-between bg-[#FAFBFD] rounded-t-2xl">
              <div className="flex items-center gap-2">
                <Edit className="w-4 h-4 text-[#2853f3]" />
                <h3 className="text-sm font-bold text-[#152B44]">Edit Resource: {editingResource.name}</h3>
              </div>
              <button
                onClick={() => setEditingResource(null)}
                className="text-[#516C8A] hover:text-[#152B44] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-5 space-y-4 text-xs">
              <div className="space-y-3">
                <div>
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
                  <label className="block font-semibold text-[#152B44] mb-1">Min Low-Stock Threshold</label>
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
              </div>

              <div className="pt-3 border-t border-[#F0F5FA] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingResource(null)}
                  className="px-3 py-2 rounded-lg border border-[#CFE2F2] text-[#516C8A] hover:bg-[#FAFBFD] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#2853f3] hover:bg-[#1e42d9] text-white font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Update SKU Record</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
