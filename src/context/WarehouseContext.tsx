import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  WarehouseProfileData,
  WarehouseResourceItem,
  WarehouseAllocationRequest,
  WarehouseDispatch,
  InventoryHistoryTransaction,
  WarehouseNotification,
  WarehouseResourceCategory,
  StockStatus,
  DispatchStatus,
} from '../types';
import {
  INITIAL_WAREHOUSE_PROFILE,
  INITIAL_WAREHOUSE_RESOURCES,
  INITIAL_ALLOCATION_REQUESTS,
  INITIAL_DISPATCHES,
  INITIAL_INVENTORY_HISTORY,
  INITIAL_NOTIFICATIONS,
} from '../data/mockWarehouseData';

export type WarehouseNavSection =
  | 'overview'
  | 'profile'
  | 'inventory'
  | 'allocation-requests'
  | 'history';

interface WarehouseContextType {
  activeSection: WarehouseNavSection;
  setActiveSection: (section: WarehouseNavSection) => void;

  profile: WarehouseProfileData;
  updateProfile: (updated: Partial<WarehouseProfileData>) => void;

  resources: WarehouseResourceItem[];
  addResource: (resource: Omit<WarehouseResourceItem, 'id' | 'availableQuantity' | 'stockStatus'>) => void;
  updateResource: (id: string, updated: Partial<WarehouseResourceItem>) => void;
  deleteResource: (id: string) => void;
  adjustStock: (id: string, newTotal: number, reason: string) => void;

  allocationRequests: WarehouseAllocationRequest[];
  acceptAllocationRequest: (id: string, notes?: string) => void;
  rejectAllocationRequest: (id: string, reason: string) => void;

  dispatches: WarehouseDispatch[];
  updateDispatchStatus: (id: string, status: DispatchStatus, currentMilestone?: string) => void;
  createDispatch: (dispatch: Omit<WarehouseDispatch, 'id' | 'trackingNumber'>) => void;

  history: InventoryHistoryTransaction[];
  addHistoryTransaction: (txn: Omit<InventoryHistoryTransaction, 'id' | 'transactionDate'>) => void;

  notifications: WarehouseNotification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Filter & Search States
  inventorySearch: string;
  setInventorySearch: (q: string) => void;
  selectedCategoryFilter: WarehouseResourceCategory | 'ALL';
  setSelectedCategoryFilter: (cat: WarehouseResourceCategory | 'ALL') => void;
  selectedStockStatusFilter: StockStatus | 'ALL';
  setSelectedStockStatusFilter: (status: StockStatus | 'ALL') => void;

  // Computed Summaries
  summaryMetrics: {
    totalCapacityTons: number;
    utilizedTons: number;
    utilizationPercent: number;
    availableTons: number;
    reservedTons: number;
    totalResourceCount: number;
    totalStockUnits: number;
    availableUnits: number;
    reservedUnits: number;
    pendingRequestsCount: number;
    activeDispatchesCount: number;
    lowStockCount: number;
    expiringCount: number;
    unreadNotificationsCount: number;
  };

  categoryBreakdown: {
    category: WarehouseResourceCategory;
    itemCount: number;
    totalUnits: number;
    percentage: number;
    color: string;
  }[];
}

const WarehouseContext = createContext<WarehouseContextType | undefined>(undefined);

export const WarehouseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSection, setActiveSection] = useState<WarehouseNavSection>('overview');
  const [profile, setProfile] = useState<WarehouseProfileData>(() => {
    try {
      const saved = localStorage.getItem('rahat_active_warehouse_profile');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_WAREHOUSE_PROFILE;
  });
  const [resources, setResources] = useState<WarehouseResourceItem[]>(INITIAL_WAREHOUSE_RESOURCES);
  const [allocationRequests, setAllocationRequests] = useState<WarehouseAllocationRequest[]>(INITIAL_ALLOCATION_REQUESTS);
  const [dispatches, setDispatches] = useState<WarehouseDispatch[]>(INITIAL_DISPATCHES);
  const [history, setHistory] = useState<InventoryHistoryTransaction[]>(INITIAL_INVENTORY_HISTORY);
  const [notifications, setNotifications] = useState<WarehouseNotification[]>(INITIAL_NOTIFICATIONS);

  // Filters
  const [inventorySearch, setInventorySearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<WarehouseResourceCategory | 'ALL'>('ALL');
  const [selectedStockStatusFilter, setSelectedStockStatusFilter] = useState<StockStatus | 'ALL'>('ALL');

  const updateProfile = (updated: Partial<WarehouseProfileData>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  const addHistoryTransaction = (txn: Omit<InventoryHistoryTransaction, 'id' | 'transactionDate'>) => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const newTxn: InventoryHistoryTransaction = {
      ...txn,
      id: `TXN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      transactionDate: dateStr,
    };
    setHistory((prev) => [newTxn, ...prev]);
  };

  const addResource = (res: Omit<WarehouseResourceItem, 'id' | 'availableQuantity' | 'stockStatus'>) => {
    const available = Math.max(0, res.quantity - (res.reservedQuantity || 0));
    let status: StockStatus = 'IN_STOCK';
    if (available <= 0) {
      status = 'CRITICAL';
    } else if (available < res.minThreshold) {
      status = 'LOW_STOCK';
    }

    const newItem: WarehouseResourceItem = {
      ...res,
      id: `res-${Date.now().toString(36)}`,
      availableQuantity: available,
      stockStatus: status,
    };

    setResources((prev) => [newItem, ...prev]);

    addHistoryTransaction({
      type: 'STOCK_RECEIVED',
      resourceName: newItem.name,
      category: newItem.category,
      quantityChange: newItem.quantity,
      unit: newItem.unit,
      referenceId: `NEW-INBOUND-${newItem.id.slice(-4).toUpperCase()}`,
      updatedStock: newItem.availableQuantity,
      operator: `${profile.ownerName} (Owner)`,
      notes: 'New resource catalog item added to warehouse inventory.',
    });
  };

  const updateResource = (id: string, updated: Partial<WarehouseResourceItem>) => {
    setResources((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const merged = { ...item, ...updated };
        const available = Math.max(0, merged.quantity - merged.reservedQuantity);
        let status: StockStatus = 'IN_STOCK';
        if (available <= 0) {
          status = 'CRITICAL';
        } else if (available < merged.minThreshold) {
          status = 'LOW_STOCK';
        }
        return {
          ...merged,
          availableQuantity: available,
          stockStatus: status,
        };
      })
    );
  };

  const deleteResource = (id: string) => {
    const target = resources.find((r) => r.id === id);
    if (!target) return;
    setResources((prev) => prev.filter((r) => r.id !== id));
    addHistoryTransaction({
      type: 'STOCK_ADJUSTED',
      resourceName: target.name,
      category: target.category,
      quantityChange: -target.quantity,
      unit: target.unit,
      referenceId: 'DECOMMISSION',
      updatedStock: 0,
      operator: `${profile.ownerName} (Owner)`,
      notes: 'Resource batch decommissioned from warehouse database.',
    });
  };

  const adjustStock = (id: string, newTotal: number, reason: string) => {
    const target = resources.find((r) => r.id === id);
    if (!target) return;
    const diff = newTotal - target.quantity;
    updateResource(id, { quantity: newTotal });
    addHistoryTransaction({
      type: 'STOCK_ADJUSTED',
      resourceName: target.name,
      category: target.category,
      quantityChange: diff,
      unit: target.unit,
      referenceId: `ADJ-${Date.now().toString().slice(-4)}`,
      updatedStock: Math.max(0, newTotal - target.reservedQuantity),
      operator: `${profile.ownerName} (Owner)`,
      notes: reason || 'Inventory cycle count reconciliation',
    });
  };

  const acceptAllocationRequest = (id: string, notes?: string) => {
    setAllocationRequests((prev) =>
      prev.map((req) => {
        if (req.id !== id) return req;
        return {
          ...req,
          status: 'ACCEPTED',
          fulfillmentNotes: notes || req.fulfillmentNotes || 'Accepted by Warehouse Partner. Preparing staging.',
        };
      })
    );

    const targetReq = allocationRequests.find((r) => r.id === id);
    if (targetReq) {
      // Reserve matching inventory if found
      targetReq.requiredResources.forEach((reqItem) => {
        const match = resources.find(
          (r) =>
            r.category === reqItem.category ||
            r.name.toLowerCase().includes(reqItem.name.toLowerCase().slice(0, 10))
        );
        if (match) {
          const newReserved = match.reservedQuantity + reqItem.quantity;
          updateResource(match.id, {
            reservedQuantity: Math.min(match.quantity, newReserved),
          });
        }
      });

      addHistoryTransaction({
        type: 'STOCK_RESERVED',
        resourceName: targetReq.requiredResources[0]?.name || 'Relief Consignment',
        category: targetReq.requiredResources[0]?.category || 'Food',
        quantityChange: -targetReq.quantity,
        unit: targetReq.unit,
        referenceId: targetReq.id,
        updatedStock: 0,
        operator: `${profile.ownerName} (Owner)`,
        notes: `Accepted emergency allocation for ${targetReq.affectedLocation} (${targetReq.disasterEvent})`,
      });

      // Add notification
      const newNotif: WarehouseNotification = {
        id: `notif-${Date.now()}`,
        type: 'ALLOCATION_REQUEST',
        title: `Request ${targetReq.id} Accepted`,
        message: `Inventory reserved and scheduled for staging for ${targetReq.affectedLocation}.`,
        timestamp: 'Just now',
        isRead: false,
        priority: 'MEDIUM',
        actionUrl: 'allocation-requests',
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }
  };

  const rejectAllocationRequest = (id: string, reason: string) => {
    setAllocationRequests((prev) =>
      prev.map((req) => {
        if (req.id !== id) return req;
        return {
          ...req,
          status: 'REJECTED',
          rejectionReason: reason || 'Capacity constraints or unserviceable route conditions.',
        };
      })
    );

    const targetReq = allocationRequests.find((r) => r.id === id);
    if (targetReq) {
      addHistoryTransaction({
        type: 'STOCK_ADJUSTED',
        resourceName: 'Requisition Declined',
        category: 'Food & Essentials',
        quantityChange: 0,
        unit: targetReq.unit,
        referenceId: targetReq.id,
        updatedStock: 0,
        operator: `${profile.ownerName} (Owner)`,
        notes: `Rejected request ${targetReq.id}: ${reason}`,
      });
    }
  };

  const updateDispatchStatus = (id: string, status: DispatchStatus, currentMilestone?: string) => {
    setDispatches((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        return {
          ...d,
          status,
          currentMilestone: currentMilestone || d.currentMilestone,
        };
      })
    );

    const target = dispatches.find((d) => d.id === id);
    if (target) {
      const newNotif: WarehouseNotification = {
        id: `notif-dsp-${Date.now()}`,
        type: 'DISPATCH_UPDATE',
        title: `Dispatch ${target.id} Status: ${status}`,
        message: currentMilestone || `Dispatch consignment to ${target.destination} updated to ${status}.`,
        timestamp: 'Just now',
        isRead: false,
        priority: status === 'DELIVERED' ? 'LOW' : 'MEDIUM',
        actionUrl: 'dispatch',
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }
  };

  const createDispatch = (dispatchData: Omit<WarehouseDispatch, 'id' | 'trackingNumber'>) => {
    const newDispatch: WarehouseDispatch = {
      ...dispatchData,
      id: `DSP-2026-${Math.floor(5000 + Math.random() * 4000)}`,
      trackingNumber: `TRK-RAHAT-TN-${Math.floor(1000 + Math.random() * 9000)}`,
    };
    setDispatches((prev) => [newDispatch, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  // Summaries
  const summaryMetrics = useMemo(() => {
    let totalStockUnits = 0;
    let availableUnits = 0;
    let reservedUnits = 0;
    let lowStockCount = 0;
    let expiringCount = 0;

    resources.forEach((r) => {
      totalStockUnits += r.quantity;
      availableUnits += r.availableQuantity;
      reservedUnits += r.reservedQuantity;
      if (r.stockStatus === 'LOW_STOCK' || r.stockStatus === 'CRITICAL') {
        lowStockCount++;
      }
      if (r.stockStatus === 'EXPIRING_SOON') {
        expiringCount++;
      }
    });

    const pendingRequestsCount = allocationRequests.filter((r) => r.status === 'PENDING').length;
    const activeDispatchesCount = dispatches.filter((d) => d.status === 'IN_TRANSIT' || d.status === 'LOADING').length;
    const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

    // Volumetric estimation (tons based on ratio)
    const totalCapacityTons = profile.totalStorageCapacityTons || 15000;
    // Estimate utilized tons (~74% standard)
    const utilizationPercent = Math.min(
      95,
      Math.max(45, Math.round((reservedUnits * 1.5 + availableUnits) / (totalStockUnits * 1.3) * 74))
    );
    const utilizedTons = Math.round((totalCapacityTons * utilizationPercent) / 100);
    const availableTons = Math.round(utilizedTons * 0.65);
    const reservedTons = utilizedTons - availableTons;

    return {
      totalCapacityTons,
      utilizedTons,
      utilizationPercent,
      availableTons,
      reservedTons,
      totalResourceCount: resources.length,
      totalStockUnits,
      availableUnits,
      reservedUnits,
      pendingRequestsCount,
      activeDispatchesCount,
      lowStockCount,
      expiringCount,
      unreadNotificationsCount,
    };
  }, [resources, allocationRequests, dispatches, notifications, profile]);

  const categoryBreakdown = useMemo(() => {
    const categories: { category: WarehouseResourceCategory; color: string }[] = [
      { category: 'Food & Essentials', color: '#DE8838' },
      { category: 'Water & Beverages', color: '#2853f3' },
      { category: 'Medical & First Aid', color: '#D95D58' },
      { category: 'Hygiene & Personal Care', color: '#9B51E0' },
      { category: 'Shelter & Bedding', color: '#F2994A' },
      { category: 'Rescue & Safety', color: '#359868' },
    ];

    const totalAllUnits = resources.reduce((sum, r) => sum + r.quantity, 0) || 1;

    return categories.map((cat) => {
      const itemsInCat = resources.filter((r) => r.category === cat.category);
      const catUnits = itemsInCat.reduce((sum, r) => sum + r.quantity, 0);
      const percentage = Math.round((catUnits / totalAllUnits) * 100);
      return {
        category: cat.category,
        itemCount: itemsInCat.length,
        totalUnits: catUnits,
        percentage,
        color: cat.color,
      };
    });
  }, [resources]);

  return (
    <WarehouseContext.Provider
      value={{
        activeSection,
        setActiveSection,
        profile,
        updateProfile,
        resources,
        addResource,
        updateResource,
        deleteResource,
        adjustStock,
        allocationRequests,
        acceptAllocationRequest,
        rejectAllocationRequest,
        dispatches,
        updateDispatchStatus,
        createDispatch,
        history,
        addHistoryTransaction,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        inventorySearch,
        setInventorySearch,
        selectedCategoryFilter,
        setSelectedCategoryFilter,
        selectedStockStatusFilter,
        setSelectedStockStatusFilter,
        summaryMetrics,
        categoryBreakdown,
      }}
    >
      {children}
    </WarehouseContext.Provider>
  );
};

export const useWarehouse = () => {
  const context = useContext(WarehouseContext);
  if (!context) {
    throw new Error('useWarehouse must be used within a WarehouseProvider');
  }
  return context;
};
