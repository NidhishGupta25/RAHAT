export type AppPage = 'landing' | 'login' | 'dashboard' | 'warehouse-dashboard';

export type UserRole =
  | 'USER'
  | 'ADMIN'
  | 'WAREHOUSE_PARTNER'
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

// ==========================================
// Warehouse Owner Dashboard Domain Models
// ==========================================

export type WarehouseResourceCategory =
  | 'Food & Essentials'
  | 'Water & Beverages'
  | 'Medical & First Aid'
  | 'Hygiene & Personal Care'
  | 'Shelter & Bedding'
  | 'Rescue & Safety';

export type StockStatus = 'IN_STOCK' | 'LOW_STOCK' | 'CRITICAL' | 'EXPIRING_SOON';

export interface WarehouseResourceItem {
  id: string;
  category: WarehouseResourceCategory;
  name: string;
  quantity: number;
  unit: string;
  reservedQuantity: number;
  availableQuantity: number;
  expiryDate: string; // YYYY-MM-DD or 'N/A'
  stockStatus: StockStatus;
  minThreshold: number;
  batchNumber?: string;
  rackLocation?: string;
  storageCondition?: 'DRY' | 'COLD_CHAIN' | 'HEAVY_EQUIPMENT' | 'HAZMAT';
  weightPerUnitKg?: number;
}

export type AllocationRequestPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM';
export type AllocationRequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'DISPATCHED';

export interface WarehouseAllocationRequest {
  id: string;
  disasterRefId: string;
  disasterEvent: string;
  affectedLocation: string;
  requiredResources: {
    resourceId?: string;
    name: string;
    category: WarehouseResourceCategory;
    quantity: number;
    unit: string;
  }[];
  quantity: number;
  unit: string;
  priority: AllocationRequestPriority;
  requestDate: string;
  status: AllocationRequestStatus;
  rejectionReason?: string;
  fulfillmentNotes?: string;
  authorizedOfficer?: string;
  targetDeliveryDeadline?: string;
}

export type DispatchStatus = 'SCHEDULED' | 'LOADING' | 'IN_TRANSIT' | 'DELIVERED';

export interface WarehouseDispatch {
  id: string;
  allocationRequestId?: string;
  destination: string;
  state: string;
  resources: {
    name: string;
    quantity: number;
    unit: string;
  }[];
  totalQuantity: number;
  transportDetails: {
    carrierType: 'HEAVY_TRUCK' | 'TEMPERATURE_CONTROLLED' | 'IAF_AIRLIFT' | 'RIVER_BARGE';
    vehicleNumber: string;
    driverName: string;
    driverContact: string;
    escortAgency?: string;
  };
  dispatchDate: string;
  expectedDelivery: string;
  status: DispatchStatus;
  trackingNumber: string;
  etaHours?: number;
  currentMilestone?: string;
}

export type InventoryTransactionType =
  | 'STOCK_RECEIVED'
  | 'STOCK_RESERVED'
  | 'STOCK_DISPATCHED'
  | 'STOCK_RETURNED'
  | 'STOCK_ADJUSTED';

export interface InventoryHistoryTransaction {
  id: string;
  transactionDate: string;
  type: InventoryTransactionType;
  resourceName: string;
  category: WarehouseResourceCategory;
  quantityChange: number; // positive for received/returned, negative for dispatched/reserved
  unit: string;
  referenceId: string;
  updatedStock: number;
  operator: string;
  notes: string;
}

export type WarehouseNotificationType =
  | 'ALLOCATION_REQUEST'
  | 'LOW_STOCK'
  | 'EXPIRING_RESOURCE'
  | 'DISPATCH_UPDATE'
  | 'VERIFICATION';

export interface WarehouseNotification {
  id: string;
  type: WarehouseNotificationType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  actionUrl?: string;
  metaId?: string;
}

export interface WarehouseProfileData {
  id: string;
  name: string;
  code: string;
  organizationType: string;
  warehouseType: string;
  ownerName: string;
  ownerTitle: string;
  ownerEmail: string;
  ownerPhone: string;
  emergencyDeskPhone: string;
  totalStorageCapacityTons: number;
  coveredAreaSqFt: number;
  coldChainCapacityTons: number;
  operatingHours: string;
  operationalStatus: 'ACTIVE' | 'STANDBY' | 'SURGE_EMERGENCY';
  address: string;
  district: string;
  state: string;
  pinCode: string;
  coordinates: [number, number]; // [lat, lng]
  verificationStatus: 'VERIFIED' | 'UNDER_REVIEW' | 'RE_AUDIT_PENDING';
  verificationCertificateId: string;
  ndmaPartnerTier: string;
  auditScore: number;
  lastAuditDate: string;
  nextAuditDate: string;
}

export type PartnerRequestStatus = 'pending' | 'approved' | 'rejected';

export interface WarehousePartnerRequest {
  id: string;
  ownerName: string;
  warehouseName: string;
  email: string;
  mobile: string;
  password?: string;
  organizationType: 'Private Warehouse' | 'NGO' | 'Supplier' | 'Government' | 'Logistics Corporation';
  address: string;
  city: string;
  state: string;
  pincode: string;
  documentType: string;
  documentNumber: string;
  documentFileName?: string;
  status: PartnerRequestStatus;
  rejectionReason?: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

