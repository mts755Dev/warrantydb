import React, { useState, useMemo } from 'react';
import { Card, CardTitle, Button, Input, Textarea, Badge, Modal } from '../../components/ui';
import { emailTemplateStorage, emailReminderStorage } from '../../utils/storage';
import { formatDate } from '../../utils/helpers';
import type { EmailTemplate, EmailReminder } from '../../types';
import { 
  Mail, 
  Edit2, 
  Save, 
  X, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { emailService } from '../../utils/email';

export function AdminEmails() {
  const [templates, setTemplates] = useState(emailTemplateStorage.getAll());
  const [reminders, setReminders] = useState(emailReminderStorage.getAll());
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [editForm, setEditForm] = useState({ subject: '', body: '' });

  const stats = useMemo(() => ({
    pending: reminders.filter(r => r.status === 'pending').length,
    sent: reminders.filter(r => r.status === 'sent').length,
    failed: reminders.filter(r => r.status === 'failed').length,
  }), [reminders]);

  const handleEditTemplate = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setEditForm({ subject: template.subject, body: template.body });
  };

  const handleSaveTemplate = () => {
    if (!editingTemplate) return;
    
    const updated: EmailTemplate = {
      ...editingTemplate,
      subject: editForm.subject,
      body: editForm.body,
      updatedAt: new Date().toISOString(),
    };
    
    emailTemplateStorage.update(updated);
    setTemplates(emailTemplateStorage.getAll());
    setEditingTemplate(null);
  };

  const handleProcessReminders = () => {
    const scheduled = emailService.scheduleInspectionReminders();
    const processed = emailService.processPendingReminders();
    setReminders(emailReminderStorage.getAll());
    alert(`Scheduled ${scheduled} new reminders.\nProcessed: ${processed.sent} sent, ${processed.failed} failed.`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-surface-900">Email Management</h1>
          <p className="text-surface-500 mt-1">Manage email templates and view reminder queue</p>
        </div>
        <Button onClick={handleProcessReminders} leftIcon={<RefreshCw className="w-4 h-4" />}>
          Process Email Queue
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-surface-900">{stats.pending}</p>
              <p className="text-sm text-surface-500">Pending</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-surface-900">{stats.sent}</p>
              <p className="text-sm text-surface-500">Sent</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-surface-900">{stats.failed}</p>
              <p className="text-sm text-surface-500">Failed</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Email Templates */}
      <Card>
        <CardTitle subtitle="Configure email content for automated messages">
          Email Templates
        </CardTitle>
        <div className="space-y-4 mt-4">
          {templates.map(template => (
            <div key={template.id} className="p-4 bg-surface-50 rounded-xl">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-surface-900">{template.name}</h4>
                  <p className="text-sm text-surface-500">Type: {template.type}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={template.isActive ? 'success' : 'default'}>
                    {template.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleEditTemplate(template)}
                    leftIcon={<Edit2 className="w-4 h-4" />}
                  >
                    Edit
                  </Button>
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-surface-200">
                <p className="text-sm font-medium text-surface-700 mb-1">Subject:</p>
                <p className="text-sm text-surface-600 mb-3">{template.subject}</p>
                <p className="text-sm font-medium text-surface-700 mb-1">Body Preview:</p>
                <p className="text-sm text-surface-600 whitespace-pre-line line-clamp-3">{template.body}</p>
              </div>
              <div className="mt-3">
                <p className="text-xs text-surface-400">
                  Variables: {template.variables.map(v => `{{${v}}}`).join(', ')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Reminders */}
      <Card>
        <CardTitle subtitle="Recent email reminders in the system">
          Email Queue
        </CardTitle>
        <div className="mt-4">
          {reminders.length === 0 ? (
            <div className="text-center py-8 bg-surface-50 rounded-xl">
              <Mail className="w-12 h-12 mx-auto text-surface-300 mb-3" />
              <p className="text-surface-500">No emails in queue</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {reminders.slice(0, 20).map(reminder => (
                <div key={reminder.id} className="flex items-center justify-between p-3 bg-surface-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-surface-900 truncate">{reminder.customerEmail}</p>
                    <p className="text-xs text-surface-500 truncate">{reminder.subject}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-surface-400">
                      {reminder.status === 'sent' && reminder.sentAt
                        ? `Sent ${formatDate(reminder.sentAt)}`
                        : `Scheduled ${formatDate(reminder.scheduledFor)}`
                      }
                    </span>
                    <Badge 
                      variant={
                        reminder.status === 'sent' ? 'success' : 
                        reminder.status === 'failed' ? 'danger' : 
                        'warning'
                      }
                      size="sm"
                    >
                      {reminder.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Edit Template Modal */}
      <Modal 
        isOpen={!!editingTemplate} 
        onClose={() => setEditingTemplate(null)} 
        title={`Edit Template: ${editingTemplate?.name}`}
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Subject"
            value={editForm.subject}
            onChange={(e) => setEditForm(prev => ({ ...prev, subject: e.target.value }))}
            hint="Use {{variableName}} for dynamic content"
          />
          <Textarea
            label="Body"
            value={editForm.body}
            onChange={(e) => setEditForm(prev => ({ ...prev, body: e.target.value }))}
            className="min-h-[300px] font-mono text-sm"
            hint="Use {{variableName}} for dynamic content"
          />
          {editingTemplate && (
            <div className="p-3 bg-surface-50 rounded-lg">
              <p className="text-xs font-medium text-surface-600 mb-2">Available Variables:</p>
              <div className="flex flex-wrap gap-2">
                {editingTemplate.variables.map(v => (
                  <code key={v} className="px-2 py-1 bg-white rounded text-xs text-primary-600 border">
                    {`{{${v}}}`}
                  </code>
                ))}
              </div>
            </div>
          )}
          <div className="flex justify-end gap-3 pt-4 border-t border-surface-200">
            <Button variant="outline" onClick={() => setEditingTemplate(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTemplate} leftIcon={<Save className="w-4 h-4" />}>
              Save Template
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

