// User Roles
export type UserRole = 'admin' | 'installer' | 'customer' | 'viewer';

// User Interface
export interface User {
  id: string;
  email: string;
  password: string; // In production, this would be hashed
  name: string;
  role: UserRole;
  phone?: string;
  companyName?: string;
  licenseNumber?: string;
  address?: string;
  state?: AustralianState;
  createdAt: string;
  isActive: boolean;
}

// Australian States
export type AustralianState = 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT';

// Customer Details
export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  suburb: string;
  state: AustralianState;
  postcode: string;
  createdAt: string;
}

// Vehicle Details
export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  registrationNumber: string;
  registrationState: AustralianState;
  color?: string;
  bodyType?: string;
}

// Installation Details
export interface InstallationDetails {
  installationDate: string;
  installerNotes?: string;
  generatorSerialNumbers: string[];
  couplerCount: number;
  couplerPlacements: CouplerPlacement[];
  corrosionCheckPassed: boolean;
  corrosionNotes?: string;
  photos: PhotoUpload[];
}

// Coupler Placement
export interface CouplerPlacement {
  id: string;
  location: string;
  type: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
}

// Photo Upload
export interface PhotoUpload {
  id: string;
  filename: string;
  url: string; // Base64 data URL for local storage
  type: 'installation' | 'inspection' | 'corrosion' | 'general';
  description?: string;
  uploadedAt: string;
}

// Warranty Status
export type WarrantyStatus = 'pending' | 'activated' | 'expired' | 'voided';

// Warranty Record
export interface Warranty {
  id: string;
  activationCode: string;
  status: WarrantyStatus;
  customer: Customer;
  vehicle: Vehicle;
  installation: InstallationDetails;
  installerId: string;
  installerName: string;
  installerCompany: string;
  storeLocation?: string;
  createdAt: string;
  activatedAt?: string;
  expiresAt?: string;
  lastInspectionDate?: string;
  nextInspectionDue?: string;
  inspections: Inspection[];
}

// Inspection Record
export interface Inspection {
  id: string;
  warrantyId: string;
  inspectorId: string;
  inspectorName: string;
  inspectionDate: string;
  findings: string;
  corrosionFound: boolean;
  corrosionSeverity?: 'none' | 'minor' | 'moderate' | 'severe';
  corrosionNotes?: string;
  overallCondition: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  recommendations?: string;
  photos: PhotoUpload[];
  passed: boolean;
  nextInspectionDue: string;
  createdAt: string;
}

// Email Reminder
export interface EmailReminder {
  id: string;
  warrantyId: string;
  customerId: string;
  customerEmail: string;
  type: 'inspection_due' | 'warranty_expiring' | 'activation_reminder';
  scheduledFor: string;
  sentAt?: string;
  status: 'pending' | 'sent' | 'failed';
  subject: string;
  body: string;
}

// Email Template
export interface EmailTemplate {
  id: string;
  name: string;
  type: 'inspection_due' | 'warranty_expiring' | 'activation_reminder' | 'warranty_activated';
  subject: string;
  body: string;
  variables: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Search Filters
export interface SearchFilters {
  query?: string;
  searchBy?: 'customer_name' | 'vin' | 'registration' | 'activation_code' | 'all';
  status?: WarrantyStatus | 'all';
  state?: AustralianState | 'all';
  dateFrom?: string;
  dateTo?: string;
  installerId?: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalWarranties: number;
  activeWarranties: number;
  pendingActivations: number;
  inspectionsDue: number;
  recentInspections: number;
  totalInstallers: number;
  activeInstallers: number;
}

// System Settings
export interface SystemSettings {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  warrantyDurationYears: number;
  inspectionIntervalMonths: number;
  reminderDaysBefore: number;
  enableEmailReminders: boolean;
  enableSmsReminders: boolean;
  autoActivateWarranties: boolean;
}

// Auth Context
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Form States
export interface WarrantyFormData {
  customer: Omit<Customer, 'id' | 'createdAt'>;
  vehicle: Omit<Vehicle, 'id'>;
  installation: Omit<InstallationDetails, 'photos'> & { photos: File[] };
}

