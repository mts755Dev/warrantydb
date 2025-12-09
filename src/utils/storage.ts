// Local Storage Keys
const STORAGE_KEYS = {
  USERS: 'warrantydb_users',
  WARRANTIES: 'warrantydb_warranties',
  INSPECTIONS: 'warrantydb_inspections',
  EMAIL_REMINDERS: 'warrantydb_email_reminders',
  EMAIL_TEMPLATES: 'warrantydb_email_templates',
  SETTINGS: 'warrantydb_settings',
  CURRENT_USER: 'warrantydb_current_user',
} as const;

// Generic storage functions
export function getItem<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error reading from localStorage: ${key}`, error);
    return null;
  }
}

export function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage: ${key}`, error);
  }
}

export function removeItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage: ${key}`, error);
  }
}

// User Storage
import type { User, Warranty, Inspection, EmailReminder, EmailTemplate, SystemSettings } from '../types';

export const userStorage = {
  getAll: (): User[] => getItem<User[]>(STORAGE_KEYS.USERS) || [],
  
  save: (users: User[]): void => setItem(STORAGE_KEYS.USERS, users),
  
  getById: (id: string): User | undefined => {
    const users = userStorage.getAll();
    return users.find(u => u.id === id);
  },
  
  getByEmail: (email: string): User | undefined => {
    const users = userStorage.getAll();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },
  
  add: (user: User): void => {
    const users = userStorage.getAll();
    users.push(user);
    userStorage.save(users);
  },
  
  update: (user: User): void => {
    const users = userStorage.getAll();
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users[index] = user;
      userStorage.save(users);
    }
  },
  
  delete: (id: string): void => {
    const users = userStorage.getAll();
    const filtered = users.filter(u => u.id !== id);
    userStorage.save(filtered);
  },
};

// Warranty Storage
export const warrantyStorage = {
  getAll: (): Warranty[] => getItem<Warranty[]>(STORAGE_KEYS.WARRANTIES) || [],
  
  save: (warranties: Warranty[]): void => setItem(STORAGE_KEYS.WARRANTIES, warranties),
  
  getById: (id: string): Warranty | undefined => {
    const warranties = warrantyStorage.getAll();
    return warranties.find(w => w.id === id);
  },
  
  getByActivationCode: (code: string): Warranty | undefined => {
    const warranties = warrantyStorage.getAll();
    return warranties.find(w => w.activationCode.toUpperCase() === code.toUpperCase());
  },
  
  getByInstaller: (installerId: string): Warranty[] => {
    const warranties = warrantyStorage.getAll();
    return warranties.filter(w => w.installerId === installerId);
  },
  
  add: (warranty: Warranty): void => {
    const warranties = warrantyStorage.getAll();
    warranties.push(warranty);
    warrantyStorage.save(warranties);
  },
  
  update: (warranty: Warranty): void => {
    const warranties = warrantyStorage.getAll();
    const index = warranties.findIndex(w => w.id === warranty.id);
    if (index !== -1) {
      warranties[index] = warranty;
      warrantyStorage.save(warranties);
    }
  },
  
  delete: (id: string): void => {
    const warranties = warrantyStorage.getAll();
    const filtered = warranties.filter(w => w.id !== id);
    warrantyStorage.save(filtered);
  },
  
  search: (query: string, searchBy: string): Warranty[] => {
    const warranties = warrantyStorage.getAll();
    const lowerQuery = query.toLowerCase();
    
    return warranties.filter(w => {
      switch (searchBy) {
        case 'customer_name':
          return `${w.customer.firstName} ${w.customer.lastName}`.toLowerCase().includes(lowerQuery);
        case 'vin':
          return w.vehicle.vin.toLowerCase().includes(lowerQuery);
        case 'registration':
          return w.vehicle.registrationNumber.toLowerCase().includes(lowerQuery);
        case 'activation_code':
          return w.activationCode.toLowerCase().includes(lowerQuery);
        case 'all':
        default:
          return (
            `${w.customer.firstName} ${w.customer.lastName}`.toLowerCase().includes(lowerQuery) ||
            w.vehicle.vin.toLowerCase().includes(lowerQuery) ||
            w.vehicle.registrationNumber.toLowerCase().includes(lowerQuery) ||
            w.activationCode.toLowerCase().includes(lowerQuery) ||
            w.customer.email.toLowerCase().includes(lowerQuery)
          );
      }
    });
  },
};

// Inspection Storage
export const inspectionStorage = {
  getAll: (): Inspection[] => getItem<Inspection[]>(STORAGE_KEYS.INSPECTIONS) || [],
  
  save: (inspections: Inspection[]): void => setItem(STORAGE_KEYS.INSPECTIONS, inspections),
  
  getById: (id: string): Inspection | undefined => {
    const inspections = inspectionStorage.getAll();
    return inspections.find(i => i.id === id);
  },
  
  getByWarranty: (warrantyId: string): Inspection[] => {
    const inspections = inspectionStorage.getAll();
    return inspections.filter(i => i.warrantyId === warrantyId);
  },
  
  add: (inspection: Inspection): void => {
    const inspections = inspectionStorage.getAll();
    inspections.push(inspection);
    inspectionStorage.save(inspections);
  },
  
  update: (inspection: Inspection): void => {
    const inspections = inspectionStorage.getAll();
    const index = inspections.findIndex(i => i.id === inspection.id);
    if (index !== -1) {
      inspections[index] = inspection;
      inspectionStorage.save(inspections);
    }
  },
};

// Email Reminder Storage
export const emailReminderStorage = {
  getAll: (): EmailReminder[] => getItem<EmailReminder[]>(STORAGE_KEYS.EMAIL_REMINDERS) || [],
  
  save: (reminders: EmailReminder[]): void => setItem(STORAGE_KEYS.EMAIL_REMINDERS, reminders),
  
  getPending: (): EmailReminder[] => {
    const reminders = emailReminderStorage.getAll();
    return reminders.filter(r => r.status === 'pending');
  },
  
  add: (reminder: EmailReminder): void => {
    const reminders = emailReminderStorage.getAll();
    reminders.push(reminder);
    emailReminderStorage.save(reminders);
  },
  
  update: (reminder: EmailReminder): void => {
    const reminders = emailReminderStorage.getAll();
    const index = reminders.findIndex(r => r.id === reminder.id);
    if (index !== -1) {
      reminders[index] = reminder;
      emailReminderStorage.save(reminders);
    }
  },
};

// Email Template Storage
export const emailTemplateStorage = {
  getAll: (): EmailTemplate[] => getItem<EmailTemplate[]>(STORAGE_KEYS.EMAIL_TEMPLATES) || [],
  
  save: (templates: EmailTemplate[]): void => setItem(STORAGE_KEYS.EMAIL_TEMPLATES, templates),
  
  getByType: (type: string): EmailTemplate | undefined => {
    const templates = emailTemplateStorage.getAll();
    return templates.find(t => t.type === type && t.isActive);
  },
  
  add: (template: EmailTemplate): void => {
    const templates = emailTemplateStorage.getAll();
    templates.push(template);
    emailTemplateStorage.save(templates);
  },
  
  update: (template: EmailTemplate): void => {
    const templates = emailTemplateStorage.getAll();
    const index = templates.findIndex(t => t.id === template.id);
    if (index !== -1) {
      templates[index] = template;
      emailTemplateStorage.save(templates);
    }
  },
};

// Settings Storage
export const settingsStorage = {
  get: (): SystemSettings => {
    const settings = getItem<SystemSettings>(STORAGE_KEYS.SETTINGS);
    return settings || getDefaultSettings();
  },
  
  save: (settings: SystemSettings): void => setItem(STORAGE_KEYS.SETTINGS, settings),
};

// Current User Session
export const sessionStorage = {
  get: (): User | null => getItem<User>(STORAGE_KEYS.CURRENT_USER),
  
  set: (user: User): void => setItem(STORAGE_KEYS.CURRENT_USER, user),
  
  clear: (): void => removeItem(STORAGE_KEYS.CURRENT_USER),
};

// Default Settings
function getDefaultSettings(): SystemSettings {
  return {
    companyName: 'WarrantyDB Australia',
    companyEmail: 'support@warrantydb.com.au',
    companyPhone: '1300 WARRANTY',
    warrantyDurationYears: 5,
    inspectionIntervalMonths: 12,
    reminderDaysBefore: 30,
    enableEmailReminders: true,
    enableSmsReminders: false,
    autoActivateWarranties: false,
  };
}

// Initialize default data
export function initializeDefaultData(): void {
  // Check if data already exists
  const users = userStorage.getAll();
  
  if (users.length === 0) {
    // Create default admin user
    const adminUser: User = {
      id: 'admin-001',
      email: 'admin@warrantydb.com.au',
      password: 'admin123', // In production, this would be hashed
      name: 'System Administrator',
      role: 'admin',
      phone: '1300 WARRANTY',
      companyName: 'WarrantyDB Australia',
      createdAt: new Date().toISOString(),
      isActive: true,
    };
    
    // Create demo installer
    const installerUser: User = {
      id: 'installer-001',
      email: 'installer@demo.com',
      password: 'demo123',
      name: 'Demo Installer',
      role: 'installer',
      phone: '0400 000 000',
      companyName: 'Demo Auto Electrical',
      licenseNumber: 'LIC-12345',
      address: '123 Demo Street',
      state: 'NSW',
      createdAt: new Date().toISOString(),
      isActive: true,
    };
    
    userStorage.save([adminUser, installerUser]);
  }
  
  // Initialize email templates if not exist
  const templates = emailTemplateStorage.getAll();
  
  if (templates.length === 0) {
    const defaultTemplates: EmailTemplate[] = [
      {
        id: 'template-001',
        name: 'Inspection Due Reminder',
        type: 'inspection_due',
        subject: 'Your Annual Warranty Inspection is Due - {{customerName}}',
        body: `Dear {{customerName}},

This is a friendly reminder that your annual warranty inspection is due for your {{vehicleMake}} {{vehicleModel}} (Rego: {{registrationNumber}}).

Your warranty remains valid as long as you complete your annual inspection. Please contact your nearest authorized installer to schedule your inspection.

Warranty Details:
- Activation Code: {{activationCode}}
- Last Inspection: {{lastInspectionDate}}
- Due Date: {{nextInspectionDue}}

If you have any questions, please don't hesitate to contact us.

Best regards,
{{companyName}}`,
        variables: ['customerName', 'vehicleMake', 'vehicleModel', 'registrationNumber', 'activationCode', 'lastInspectionDate', 'nextInspectionDue', 'companyName'],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'template-002',
        name: 'Warranty Activated',
        type: 'warranty_activated',
        subject: 'Your Warranty Has Been Activated - {{activationCode}}',
        body: `Dear {{customerName}},

Congratulations! Your warranty has been successfully activated.

Warranty Details:
- Activation Code: {{activationCode}}
- Vehicle: {{vehicleMake}} {{vehicleModel}} ({{vehicleYear}})
- Registration: {{registrationNumber}}
- Warranty Valid Until: {{expiryDate}}

Important: To maintain your warranty coverage, please ensure you complete your annual inspection. You will receive a reminder when your inspection is due.

Thank you for choosing {{companyName}}.

Best regards,
{{companyName}} Team`,
        variables: ['customerName', 'activationCode', 'vehicleMake', 'vehicleModel', 'vehicleYear', 'registrationNumber', 'expiryDate', 'companyName'],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    
    emailTemplateStorage.save(defaultTemplates);
  }
}

