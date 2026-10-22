import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AppPage,
  UserSession,
  DisasterEvent,
  Warehouse,
  ReliefAllocation,
  TransportRoute,
  DataSourceHealth,
  ModelExecutionStatus,
  OperationalActivity,
  HazardType,
  SeverityLevel,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_DISASTERS,
  INITIAL_WAREHOUSES,
  INITIAL_ALLOCATIONS,
  INITIAL_ROUTES,
  INITIAL_DATA_SOURCES,
  INITIAL_MODEL_STATUS,
  INITIAL_ACTIVITIES,
} from '../data/mockData';

export type ActiveTab =
  | 'overview'
  | 'monitoring'
  | 'map'
  | 'allocation'
  | 'warehouses'
  | 'partner-requests'
  | 'logistics'
  | 'data-models';

interface AppContextType {
  currentPage: AppPage;
  setCurrentPage: (page: AppPage) => void;
  navigateToTab: (tab: ActiveTab) => void;
  currentUser: UserSession | null;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  login: (userKey: keyof typeof INITIAL_USERS | UserSession) => void;
  logout: () => void;

  // Data states
  disasters: DisasterEvent[];
  warehouses: Warehouse[];
  allocations: ReliefAllocation[];
  routes: TransportRoute[];
  dataSources: DataSourceHealth[];
  models: ModelExecutionStatus[];
  activities: OperationalActivity[];

  // Selection & interaction
  selectedDisaster: DisasterEvent | null;
  setSelectedDisaster: (disaster: DisasterEvent | null) => void;
  selectedAllocation: ReliefAllocation | null;
  setSelectedAllocation: (allocation: ReliefAllocation | null) => void;
  selectedWarehouse: Warehouse | null;
  setSelectedWarehouse: (warehouse: Warehouse | null) => void;
  selectedRoute: TransportRoute | null;
  setSelectedRoute: (route: TransportRoute | null) => void;

  // Filters
  hazardFilter: HazardType | 'ALL';
  setHazardFilter: (filter: HazardType | 'ALL') => void;
  severityFilter: SeverityLevel | 'ALL';
  setSeverityFilter: (filter: SeverityLevel | 'ALL') => void;

  // Layer toggles for map
  mapLayers: {
    rain: boolean;
    cyclone: boolean;
    earthquake: boolean;
    tsunami: boolean;
    warehouses: boolean;
    routes: boolean;
  };
  toggleMapLayer: (layer: keyof AppContextType['mapLayers']) => void;

  // Actions
  lastRefreshTime: string;
  refreshFeeds: () => void;
  isRefreshing: boolean;
  confirmAllocation: (id: string, allocatedQty: number) => void;
  dispatchAllocation: (id: string) => void;
  addActivity: (activity: Omit<OperationalActivity, 'id' | 'timestamp'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Creative minimalist landing page as first impression
  const [currentPage, setCurrentPage] = useState<AppPage>('landing');
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  const [disasters, setDisasters] = useState<DisasterEvent[]>(INITIAL_DISASTERS);
  const [warehouses, setWarehouses] = useState<Warehouse[]>(INITIAL_WAREHOUSES);
  const [allocations, setAllocations] = useState<ReliefAllocation[]>(INITIAL_ALLOCATIONS);
  const [routes, setRoutes] = useState<TransportRoute[]>(INITIAL_ROUTES);
  const [dataSources, setDataSources] = useState<DataSourceHealth[]>(INITIAL_DATA_SOURCES);
  const [models, setModels] = useState<ModelExecutionStatus[]>(INITIAL_MODEL_STATUS);
  const [activities, setActivities] = useState<OperationalActivity[]>(INITIAL_ACTIVITIES);

  const [selectedDisaster, setSelectedDisaster] = useState<DisasterEvent | null>(INITIAL_DISASTERS[0]);
  const [selectedAllocation, setSelectedAllocation] = useState<ReliefAllocation | null>(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<TransportRoute | null>(null);

  const [hazardFilter, setHazardFilter] = useState<HazardType | 'ALL'>('ALL');
  const [severityFilter, setSeverityFilter] = useState<SeverityLevel | 'ALL'>('ALL');

  const [mapLayers, setMapLayers] = useState({
    rain: true,
    cyclone: true,
    earthquake: true,
    tsunami: true,
    warehouses: true,
    routes: true,
  });

  const [lastRefreshTime, setLastRefreshTime] = useState<string>('05:45 IST');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const toggleMapLayer = (layer: keyof typeof mapLayers) => {
    setMapLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  const navigateToTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    setCurrentPage('dashboard');
  };

  const login = (userOrKey: keyof typeof INITIAL_USERS | UserSession) => {
    let session: UserSession | null = null;
    if (typeof userOrKey === 'string' && INITIAL_USERS[userOrKey]) {
      session = INITIAL_USERS[userOrKey];
    } else if (typeof userOrKey === 'object') {
      session = userOrKey;
    }
    setCurrentUser(session);

    if (session?.role === 'WAREHOUSE_PARTNER' || session?.role === 'WAREHOUSE_OPERATOR') {
      setCurrentPage('warehouse-dashboard');
    } else {
      setCurrentPage('dashboard');
      setActiveTab('overview');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentPage('landing');
  };

  const refreshFeeds = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} IST`;
      setLastRefreshTime(timeStr);
      setDataSources((prev) =>
        prev.map((ds) => ({
          ...ds,
          lastRefresh: `${timeStr}`,
          latencyMs: Math.floor(Math.random() * 120) + 70,
        }))
      );
      setIsRefreshing(false);
      addActivity({
        actor: currentUser?.name || 'Automated Sync',
        role: currentUser?.roleLabel || 'System',
        category: 'SYSTEM',
        action: 'Manual Source Refresh',
        details: 'Refreshed 5 primary disaster feeds from IMD, NCS, INCOIS, CWC and NDMA registries.',
      });
    }, 600);
  };

  const addActivity = (act: Omit<OperationalActivity, 'id' | 'timestamp'>) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} IST`;
    const newAct: OperationalActivity = {
      ...act,
      id: `ACT-${Date.now().toString().slice(-4)}`,
      timestamp: timeStr,
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  const confirmAllocation = (id: string, allocatedQty: number) => {
    setAllocations((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newShortage = Math.max(0, item.estimatedDemand - allocatedQty);
          return {
            ...item,
            confirmedAllocation: allocatedQty,
            shortageQuantity: newShortage,
            status: 'CONFIRMED',
            lastUpdated: 'Just now',
          };
        }
        return item;
      })
    );
    const target = allocations.find((a) => a.id === id);
    if (target) {
      addActivity({
        actor: currentUser?.name || 'Relief Coordinator',
        role: currentUser?.roleLabel || 'Coordinator',
        category: 'ALLOCATION',
        action: `Allocation Confirmed: ${target.resourceType}`,
        details: `Confirmed ${allocatedQty.toLocaleString()} ${target.unit} for ${target.destination}. Remaining shortage: ${Math.max(0, target.estimatedDemand - allocatedQty).toLocaleString()}.`,
      });
    }
  };

  const dispatchAllocation = (id: string) => {
    setAllocations((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status: 'DISPATCHED',
            lastUpdated: 'Just now',
          };
        }
        return item;
      })
    );
    const target = allocations.find((a) => a.id === id);
    if (target) {
      addActivity({
        actor: currentUser?.name || 'Logistics Officer',
        role: currentUser?.roleLabel || 'Warehouse',
        category: 'DISPATCH',
        action: `Conveyance Dispatched: ${target.resourceType}`,
        details: `Dispatched from ${target.warehouseOriginName} to ${target.destination}.`,
      });
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        navigateToTab,
        currentUser,
        activeTab,
        setActiveTab,
        login,
        logout,
        disasters,
        warehouses,
        allocations,
        routes,
        dataSources,
        models,
        activities,
        selectedDisaster,
        setSelectedDisaster,
        selectedAllocation,
        setSelectedAllocation,
        selectedWarehouse,
        setSelectedWarehouse,
        selectedRoute,
        setSelectedRoute,
        hazardFilter,
        setHazardFilter,
        severityFilter,
        setSeverityFilter,
        mapLayers,
        toggleMapLayer,
        lastRefreshTime,
        refreshFeeds,
        isRefreshing,
        confirmAllocation,
        dispatchAllocation,
        addActivity,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
