export type AppPage = 'landing' | 'login' | 'dashboard';

export type UserRole =
  | 'USER'
  | 'ADMIN'
  | 'MONITORING_OFFICER'
  | 'RELIEF_COORDINATOR'
  | 'WAREHOUSE_OPERATOR'
  | 'ADMIN_EVALUATOR';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleType: 'user' | 'admin';
  roleLabel: string;
  agency?: string;
  badgeNumber?: string;
  station?: string;
}

export type HazardType = 'HEAVY_RAIN' | 'EARTHQUAKE' | 'CYCLONE' | 'TSUNAMI';

export type SeverityLevel = 'CRITICAL' | 'WARNING' | 'WATCH' | 'NORMAL';

export interface DisasterEvent {
  id: string;
  type: HazardType;
  title: string;
  location: string;
  state: string;
  coordinates: [number, number]; // [lat, lng]
  severity: SeverityLevel;
  severityLabel: string;
  alertCode: 'RED' | 'ORANGE' | 'YELLOW' | 'GREEN';
  timestamp: string;
  source: string;
  impactDetails: string;
  keyMetric: {
    label: string;
    value: string;
    unit: string;
  };
  metrics: { label: string; value: string }[];
  modelStatus: {
    modelName: string;
    executed: boolean;
    statusText: string;
    isModelOutput: boolean;
  };
  affectedPopulationEstimate: number;
  reliefStatus: 'DEMAND_IDENTIFIED' | 'ALLOCATION_IN_PROGRESS' | 'DISPATCH_UNDERWAY' | 'ASSESSMENT_ONLY';
}

export interface InventoryItem {
  id: string;
  resourceName: string;
  category: 'Water' | 'Food' | 'Medical' | 'Shelter' | 'Sanitation' | 'Rescue Equipment';
  total: number;
  reserved: number;
  available: number;
  unit: string;
  minThreshold: number;
  isLowStock: boolean;
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  city: string;
  state: string;
  coordinates: [number, number];
  officerInCharge: string;
  contactNumber: string;
  totalCapacityTons: number;
  currentStockTons: number;
  inventory: InventoryItem[];
  lastAudit: string;
}

export interface ReliefAllocation {
  id: string;
  destination: string;
  state: string;
  disasterRefId: string;
  disasterTitle: string;
  resourceType: string;
  unit: string;
  estimatedDemand: number;
  availableStock: number;
  shortageQuantity: number;
  proposedAllocation: number;
  confirmedAllocation: number;
  status: 'PROPOSED' | 'CONFIRMED' | 'PENDING_DISPATCH' | 'DISPATCHED' | 'DELIVERED';
  warehouseOriginId: string;
  warehouseOriginName: string;
  lastUpdated: string;
  rationale: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface TransportRoute {
  id: string;
  originWarehouseId: string;
  originName: string;
  destinationName: string;
  destinationCoords: [number, number];
  originCoords: [number, number];
  status: 'IN_TRANSIT' | 'ROUTE_CLEARANCE' | 'DISPATCHED' | 'DELIVERED' | 'DIVERTED';
  mode: 'TRUCK_CONVOY' | 'IAF_AIRLIFT' | 'COASTAL_VESSEL' | 'RAIL_FREIGHT';
  distanceKm: number;
  estimatedHours: number;
  cargoSummary: string;
  vehicleRegistration: string;
  waypoints: [number, number][];
  corridorNotes: string;
  bottleneckWarning?: string;
}

export interface DataSourceHealth {
  id: string;
  name: string;
  hazardFocus: string;
  agency: string;
  protocol: string;
  endpointUrl: string;
  status: 'HEALTHY' | 'DEGRADED' | 'UNAVAILABLE';
  lastRefresh: string;
  latencyMs: number;
  isStale: boolean;
  notes: string;
}

export interface ModelExecutionStatus {
  id: string;
  modelName: string;
  version: string;
  hazardType: HazardType | 'ALLOCATION';
  executionState: 'COMPLETED' | 'EXECUTING' | 'NOT_CALLED' | 'FAILED';
  lastRunTime: string;
  durationMs: number;
  parameters: string;
  dataSourceInput: string;
  notes: string;
}

export interface OperationalActivity {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  category: 'DISASTER_ALERT' | 'ALLOCATION' | 'DISPATCH' | 'WAREHOUSE' | 'SYSTEM';
  action: string;
  details: string;
}
