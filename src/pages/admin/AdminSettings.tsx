import React, { useState } from 'react';
import { Card, CardTitle, Button, Input, Select } from '../../components/ui';
import { settingsStorage } from '../../utils/storage';
import type { SystemSettings } from '../../types';
import { Save, Building2, Clock, Mail, Bell, CheckCircle } from 'lucide-react';

export function AdminSettings() {
  const [settings, setSettings] = useState<SystemSettings>(settingsStorage.get());
  const [saved, setSaved] = useState(false);

  const handleChange = (field: keyof SystemSettings, value: string | number | boolean) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    settingsStorage.save(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-surface-900">System Settings</h1>
          <p className="text-surface-500 mt-1">Configure system-wide settings</p>
        </div>
        <Button onClick={handleSave} leftIcon={saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}>
          {saved ? 'Saved!' : 'Save Settings'}
        </Button>
      </div>

      {/* Company Settings */}
      <Card>
        <CardTitle subtitle="Company information displayed on documents">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary-600" />
            Company Information
          </div>
        </CardTitle>
        <div className="space-y-4 mt-4">
          <Input
            label="Company Name"
            value={settings.companyName}
            onChange={(e) => handleChange('companyName', e.target.value)}
          />
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Company Email"
              type="email"
              value={settings.companyEmail}
              onChange={(e) => handleChange('companyEmail', e.target.value)}
            />
            <Input
              label="Company Phone"
              type="tel"
              value={settings.companyPhone}
              onChange={(e) => handleChange('companyPhone', e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Warranty Settings */}
      <Card>
        <CardTitle subtitle="Configure warranty duration and inspection intervals">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary-600" />
            Warranty Configuration
          </div>
        </CardTitle>
        <div className="space-y-4 mt-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Warranty Duration (Years)"
              type="number"
              value={settings.warrantyDurationYears}
              onChange={(e) => handleChange('warrantyDurationYears', parseInt(e.target.value) || 5)}
              min={1}
              max={20}
            />
            <Input
              label="Inspection Interval (Months)"
              type="number"
              value={settings.inspectionIntervalMonths}
              onChange={(e) => handleChange('inspectionIntervalMonths', parseInt(e.target.value) || 12)}
              min={1}
              max={24}
            />
          </div>
          <Input
            label="Reminder Days Before Due"
            type="number"
            value={settings.reminderDaysBefore}
            onChange={(e) => handleChange('reminderDaysBefore', parseInt(e.target.value) || 30)}
            min={1}
            max={90}
            hint="How many days before the inspection due date to send reminders"
          />
        </div>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardTitle subtitle="Configure automated notification preferences">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary-600" />
            Notifications
          </div>
        </CardTitle>
        <div className="space-y-4 mt-4">
          <div className="flex items-center justify-between p-4 bg-surface-50 rounded-xl">
            <div>
              <p className="font-medium text-surface-900">Email Reminders</p>
              <p className="text-sm text-surface-500">Send automatic inspection reminder emails</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableEmailReminders}
                onChange={(e) => handleChange('enableEmailReminders', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-surface-50 rounded-xl">
            <div>
              <p className="font-medium text-surface-900">SMS Reminders</p>
              <p className="text-sm text-surface-500">Send automatic inspection reminder SMS (Coming soon)</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableSmsReminders}
                onChange={(e) => handleChange('enableSmsReminders', e.target.checked)}
                className="sr-only peer"
                disabled
              />
              <div className="w-11 h-6 bg-surface-200 rounded-full peer cursor-not-allowed opacity-50"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-surface-50 rounded-xl">
            <div>
              <p className="font-medium text-surface-900">Auto-Activate Warranties</p>
              <p className="text-sm text-surface-500">Automatically activate warranties upon registration</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoActivateWarranties}
                onChange={(e) => handleChange('autoActivateWarranties', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </Card>

      {/* Data Management */}
      <Card>
        <CardTitle subtitle="Manage system data">
          Data Management
        </CardTitle>
        <div className="space-y-4 mt-4">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> This system uses browser local storage for data persistence. 
              Data will be lost if browser storage is cleared. For production use, integrate with 
              a proper backend database.
            </p>
          </div>
          <div className="flex gap-4">
            <Button 
              variant="outline"
              onClick={() => {
                const data = {
                  users: localStorage.getItem('warrantydb_users'),
                  warranties: localStorage.getItem('warrantydb_warranties'),
                  settings: localStorage.getItem('warrantydb_settings'),
                  templates: localStorage.getItem('warrantydb_email_templates'),
                };
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `warrantydb-backup-${new Date().toISOString().split('T')[0]}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              Export Data Backup
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

