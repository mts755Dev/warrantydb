import { v4 as uuidv4 } from 'uuid';
import { format, addYears, addMonths, parseISO, isAfter, isBefore, differenceInDays } from 'date-fns';
import type { Warranty, DashboardStats, AustralianState } from '../types';

// Generate unique ID
export function generateId(): string {
  return uuidv4();
}

// Generate activation code (8 characters, alphanumeric, uppercase)
export function generateActivationCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluding similar characters (0, O, 1, I)
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Format date for display
export function formatDate(date: string | Date, formatStr: string = 'dd/MM/yyyy'): string {
  if (!date) return 'N/A';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
}

// Format date and time
export function formatDateTime(date: string | Date): string {
  return formatDate(date, 'dd/MM/yyyy HH:mm');
}

// Calculate warranty expiry date
export function calculateExpiryDate(activationDate: string, yearsValid: number = 5): string {
  const date = parseISO(activationDate);
  return addYears(date, yearsValid).toISOString();
}

// Calculate next inspection date
export function calculateNextInspectionDate(fromDate: string, monthsInterval: number = 12): string {
  const date = parseISO(fromDate);
  return addMonths(date, monthsInterval).toISOString();
}

// Check if warranty is expired
export function isWarrantyExpired(expiryDate: string): boolean {
  return isBefore(parseISO(expiryDate), new Date());
}

// Check if inspection is due
export function isInspectionDue(nextInspectionDate: string, reminderDays: number = 30): boolean {
  const dueDate = parseISO(nextInspectionDate);
  const daysUntilDue = differenceInDays(dueDate, new Date());
  return daysUntilDue <= reminderDays;
}

// Check if inspection is overdue
export function isInspectionOverdue(nextInspectionDate: string): boolean {
  return isBefore(parseISO(nextInspectionDate), new Date());
}

// Days until inspection due
export function daysUntilInspection(nextInspectionDate: string): number {
  return differenceInDays(parseISO(nextInspectionDate), new Date());
}

// Get warranty status display
export function getWarrantyStatusDisplay(warranty: Warranty): { text: string; color: string; bgColor: string } {
  if (warranty.status === 'voided') {
    return { text: 'Voided', color: 'text-red-700', bgColor: 'bg-red-100' };
  }
  
  if (warranty.status === 'pending') {
    return { text: 'Pending Activation', color: 'text-yellow-700', bgColor: 'bg-yellow-100' };
  }
  
  if (warranty.expiresAt && isWarrantyExpired(warranty.expiresAt)) {
    return { text: 'Expired', color: 'text-gray-700', bgColor: 'bg-gray-100' };
  }
  
  if (warranty.nextInspectionDue && isInspectionOverdue(warranty.nextInspectionDue)) {
    return { text: 'Inspection Overdue', color: 'text-orange-700', bgColor: 'bg-orange-100' };
  }
  
  if (warranty.nextInspectionDue && isInspectionDue(warranty.nextInspectionDue)) {
    return { text: 'Inspection Due Soon', color: 'text-blue-700', bgColor: 'bg-blue-100' };
  }
  
  return { text: 'Active', color: 'text-green-700', bgColor: 'bg-green-100' };
}

// Calculate dashboard stats
export function calculateDashboardStats(warranties: Warranty[]): DashboardStats {
  const now = new Date();
  
  const activeWarranties = warranties.filter(w => 
    w.status === 'activated' && 
    (!w.expiresAt || isAfter(parseISO(w.expiresAt), now))
  );
  
  const pendingActivations = warranties.filter(w => w.status === 'pending');
  
  const inspectionsDue = warranties.filter(w => 
    w.status === 'activated' && 
    w.nextInspectionDue && 
    isInspectionDue(w.nextInspectionDue)
  );
  
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentInspections = warranties.reduce((count, w) => {
    const recentOnes = w.inspections.filter(i => 
      isAfter(parseISO(i.inspectionDate), thirtyDaysAgo)
    );
    return count + recentOnes.length;
  }, 0);
  
  return {
    totalWarranties: warranties.length,
    activeWarranties: activeWarranties.length,
    pendingActivations: pendingActivations.length,
    inspectionsDue: inspectionsDue.length,
    recentInspections,
    totalInstallers: 0,
    activeInstallers: 0,
  };
}

// Australian states list
export const australianStates: { value: AustralianState; label: string }[] = [
  { value: 'NSW', label: 'New South Wales' },
  { value: 'VIC', label: 'Victoria' },
  { value: 'QLD', label: 'Queensland' },
  { value: 'WA', label: 'Western Australia' },
  { value: 'SA', label: 'South Australia' },
  { value: 'TAS', label: 'Tasmania' },
  { value: 'ACT', label: 'Australian Capital Territory' },
  { value: 'NT', label: 'Northern Territory' },
];

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate phone (Australian format)
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+61|0)[2-9]\d{8}$/;
  const cleaned = phone.replace(/\s|-/g, '');
  return phoneRegex.test(cleaned);
}

// Validate VIN
export function isValidVIN(vin: string): boolean {
  // VIN should be 17 characters, alphanumeric, excluding I, O, Q
  const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/i;
  return vinRegex.test(vin);
}

// Validate postcode (Australian)
export function isValidPostcode(postcode: string): boolean {
  const postcodeRegex = /^\d{4}$/;
  return postcodeRegex.test(postcode);
}

// Format phone number
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10 && cleaned.startsWith('0')) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  return phone;
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

// Convert file to base64
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

// Get file size display
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Vehicle body types
export const vehicleBodyTypes = [
  'Sedan',
  'Hatchback',
  'Wagon',
  'SUV',
  'Ute',
  'Van',
  'Coupe',
  'Convertible',
  'Other',
];

// Coupler locations
export const couplerLocations = [
  'Front Left',
  'Front Right',
  'Rear Left',
  'Rear Right',
  'Front Center',
  'Rear Center',
  'Roof',
  'Under Body',
  'Engine Bay',
  'Other',
];

// Coupler types
export const couplerTypes = [
  'Standard',
  'Heavy Duty',
  'Marine Grade',
  'Quick Release',
  'Threaded',
  'Compression',
  'Other',
];

