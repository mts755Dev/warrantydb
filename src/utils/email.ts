import { v4 as uuidv4 } from 'uuid';
import { addDays, parseISO, isBefore } from 'date-fns';
import type { EmailReminder, EmailTemplate, Warranty } from '../types';
import { emailReminderStorage, emailTemplateStorage, warrantyStorage, settingsStorage } from './storage';
import { formatDate } from './helpers';

// Email service simulation (in production, this would integrate with an email provider like SendGrid, AWS SES, etc.)

// Process email template with variables
export function processTemplate(template: EmailTemplate, variables: Record<string, string>): { subject: string; body: string } {
  let subject = template.subject;
  let body = template.body;
  
  Object.entries(variables).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    subject = subject.replace(new RegExp(placeholder, 'g'), value);
    body = body.replace(new RegExp(placeholder, 'g'), value);
  });
  
  return { subject, body };
}

// Create inspection reminder
export function createInspectionReminder(warranty: Warranty): EmailReminder | null {
  const template = emailTemplateStorage.getByType('inspection_due');
  if (!template) return null;
  
  const settings = settingsStorage.get();
  
  const variables: Record<string, string> = {
    customerName: `${warranty.customer.firstName} ${warranty.customer.lastName}`,
    vehicleMake: warranty.vehicle.make,
    vehicleModel: warranty.vehicle.model,
    vehicleYear: warranty.vehicle.year.toString(),
    registrationNumber: warranty.vehicle.registrationNumber,
    activationCode: warranty.activationCode,
    lastInspectionDate: warranty.lastInspectionDate ? formatDate(warranty.lastInspectionDate) : 'N/A',
    nextInspectionDue: warranty.nextInspectionDue ? formatDate(warranty.nextInspectionDue) : 'N/A',
    companyName: settings.companyName,
  };
  
  const { subject, body } = processTemplate(template, variables);
  
  // Calculate when to send (X days before inspection due)
  const scheduledFor = warranty.nextInspectionDue
    ? addDays(parseISO(warranty.nextInspectionDue), -settings.reminderDaysBefore).toISOString()
    : new Date().toISOString();
  
  const reminder: EmailReminder = {
    id: uuidv4(),
    warrantyId: warranty.id,
    customerId: warranty.customer.id,
    customerEmail: warranty.customer.email,
    type: 'inspection_due',
    scheduledFor,
    status: 'pending',
    subject,
    body,
  };
  
  return reminder;
}

// Create warranty activation confirmation email
export function createActivationEmail(warranty: Warranty): EmailReminder | null {
  const template = emailTemplateStorage.getByType('warranty_activated');
  if (!template) return null;
  
  const settings = settingsStorage.get();
  
  const variables: Record<string, string> = {
    customerName: `${warranty.customer.firstName} ${warranty.customer.lastName}`,
    vehicleMake: warranty.vehicle.make,
    vehicleModel: warranty.vehicle.model,
    vehicleYear: warranty.vehicle.year.toString(),
    registrationNumber: warranty.vehicle.registrationNumber,
    activationCode: warranty.activationCode,
    expiryDate: warranty.expiresAt ? formatDate(warranty.expiresAt) : 'N/A',
    companyName: settings.companyName,
  };
  
  const { subject, body } = processTemplate(template, variables);
  
  const reminder: EmailReminder = {
    id: uuidv4(),
    warrantyId: warranty.id,
    customerId: warranty.customer.id,
    customerEmail: warranty.customer.email,
    type: 'activation_reminder',
    scheduledFor: new Date().toISOString(),
    status: 'pending',
    subject,
    body,
  };
  
  return reminder;
}

// Schedule inspection reminders for all eligible warranties
export function scheduleInspectionReminders(): number {
  const warranties = warrantyStorage.getAll();
  const existingReminders = emailReminderStorage.getAll();
  let scheduledCount = 0;
  
  warranties.forEach(warranty => {
    // Only process activated warranties with a next inspection date
    if (warranty.status !== 'activated' || !warranty.nextInspectionDue) return;
    
    // Check if reminder already exists for this warranty and inspection
    const existingReminder = existingReminders.find(
      r => r.warrantyId === warranty.id && 
           r.type === 'inspection_due' && 
           r.status === 'pending'
    );
    
    if (existingReminder) return;
    
    const reminder = createInspectionReminder(warranty);
    if (reminder) {
      emailReminderStorage.add(reminder);
      scheduledCount++;
    }
  });
  
  return scheduledCount;
}

// Process pending email reminders (simulate sending)
export function processPendingReminders(): { sent: number; failed: number } {
  const reminders = emailReminderStorage.getPending();
  let sent = 0;
  let failed = 0;
  
  reminders.forEach(reminder => {
    // Check if it's time to send
    if (isBefore(parseISO(reminder.scheduledFor), new Date())) {
      // Simulate sending email
      const success = simulateSendEmail(reminder);
      
      if (success) {
        reminder.status = 'sent';
        reminder.sentAt = new Date().toISOString();
        sent++;
      } else {
        reminder.status = 'failed';
        failed++;
      }
      
      emailReminderStorage.update(reminder);
    }
  });
  
  return { sent, failed };
}

// Simulate sending email (in production, this would call an actual email API)
function simulateSendEmail(reminder: EmailReminder): boolean {
  // Log the email to console for development
  console.log('📧 Email Sent (Simulated):');
  console.log(`To: ${reminder.customerEmail}`);
  console.log(`Subject: ${reminder.subject}`);
  console.log(`Body: ${reminder.body.substring(0, 200)}...`);
  console.log('---');
  
  // Simulate 95% success rate
  return Math.random() > 0.05;
}

// Get email statistics
export function getEmailStats(): { pending: number; sent: number; failed: number } {
  const reminders = emailReminderStorage.getAll();
  
  return {
    pending: reminders.filter(r => r.status === 'pending').length,
    sent: reminders.filter(r => r.status === 'sent').length,
    failed: reminders.filter(r => r.status === 'failed').length,
  };
}

// Export email service functions
export const emailService = {
  createInspectionReminder,
  createActivationEmail,
  scheduleInspectionReminders,
  processPendingReminders,
  getEmailStats,
  processTemplate,
};

