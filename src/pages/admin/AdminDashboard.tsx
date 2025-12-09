import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardTitle, Button, Badge } from '../../components/ui';
import { warrantyStorage, userStorage, emailReminderStorage } from '../../utils/storage';
import { calculateDashboardStats, formatDate, getWarrantyStatusDisplay, isInspectionDue } from '../../utils/helpers';
import { emailService } from '../../utils/email';
import {
  FileText,
  Users,
  ClipboardCheck,
  Mail,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  ArrowRight,
  RefreshCw,
  Shield,
} from 'lucide-react';

export function AdminDashboard() {
  const stats = useMemo(() => {
    const warranties = warrantyStorage.getAll();
    const users = userStorage.getAll();
    const installers = users.filter(u => u.role === 'installer');
    const emailStats = emailService.getEmailStats();
    
    const baseStats = calculateDashboardStats(warranties);
    
    return {
      ...baseStats,
      totalInstallers: installers.length,
      activeInstallers: installers.filter(i => i.isActive).length,
      pendingEmails: emailStats.pending,
      sentEmails: emailStats.sent,
    };
  }, []);

  const recentWarranties = useMemo(() => {
    return warrantyStorage.getAll()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, []);

  const inspectionsDueWarranties = useMemo(() => {
    return warrantyStorage.getAll()
      .filter(w => w.status === 'activated' && w.nextInspectionDue && isInspectionDue(w.nextInspectionDue))
      .slice(0, 5);
  }, []);

  const handleProcessReminders = () => {
    const scheduled = emailService.scheduleInspectionReminders();
    const processed = emailService.processPendingReminders();
    alert(`Scheduled ${scheduled} new reminders. Processed: ${processed.sent} sent, ${processed.failed} failed.`);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-surface-900">Admin Dashboard</h1>
          <p className="text-surface-500 mt-1">System overview and management</p>
        </div>
        <Button onClick={handleProcessReminders} leftIcon={<RefreshCw className="w-4 h-4" />}>
          Process Email Reminders
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<FileText className="w-6 h-6" />}
          label="Total Warranties"
          value={stats.totalWarranties}
          color="primary"
          link="/admin/warranties"
        />
        <StatCard
          icon={<CheckCircle className="w-6 h-6" />}
          label="Active Warranties"
          value={stats.activeWarranties}
          color="green"
        />
        <StatCard
          icon={<Clock className="w-6 h-6" />}
          label="Pending Activation"
          value={stats.pendingActivations}
          color="yellow"
        />
        <StatCard
          icon={<AlertTriangle className="w-6 h-6" />}
          label="Inspections Due"
          value={stats.inspectionsDue}
          color="orange"
          highlight={stats.inspectionsDue > 0}
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Users className="w-6 h-6" />}
          label="Total Installers"
          value={stats.totalInstallers}
          color="blue"
          link="/admin/installers"
        />
        <StatCard
          icon={<Users className="w-6 h-6" />}
          label="Active Installers"
          value={stats.activeInstallers}
          color="teal"
        />
        <StatCard
          icon={<ClipboardCheck className="w-6 h-6" />}
          label="Recent Inspections"
          value={stats.recentInspections}
          color="purple"
          subtitle="Last 30 days"
        />
        <StatCard
          icon={<Mail className="w-6 h-6" />}
          label="Pending Emails"
          value={stats.pendingEmails}
          color="indigo"
        />
      </div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Warranties */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Recent Warranties</CardTitle>
            <Link to="/admin/warranties">
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                View All
              </Button>
            </Link>
          </div>
          
          {recentWarranties.length === 0 ? (
            <div className="text-center py-8 bg-surface-50 rounded-xl">
              <FileText className="w-12 h-12 mx-auto text-surface-300 mb-3" />
              <p className="text-surface-500">No warranties registered yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentWarranties.map(warranty => {
                const status = getWarrantyStatusDisplay(warranty);
                return (
                  <Link key={warranty.id} to={`/admin/warranties/${warranty.id}`}>
                    <div className="flex items-center justify-between p-4 bg-surface-50 hover:bg-surface-100 rounded-xl transition-colors">
                      <div>
                        <p className="font-medium text-surface-900">
                          {warranty.customer.firstName} {warranty.customer.lastName}
                        </p>
                        <p className="text-sm text-surface-500">
                          {warranty.vehicle.make} {warranty.vehicle.model} • {warranty.vehicle.registrationNumber}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className={`${status.bgColor} ${status.color}`}>
                          {status.text}
                        </Badge>
                        <p className="text-xs text-surface-400 mt-1">
                          {formatDate(warranty.createdAt)}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </Card>

        {/* Inspections Due */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-orange-600">
              <AlertTriangle className="w-5 h-5 inline mr-2" />
              Inspections Due
            </CardTitle>
            <Link to="/admin/inspections">
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                View All
              </Button>
            </Link>
          </div>
          
          {inspectionsDueWarranties.length === 0 ? (
            <div className="text-center py-8 bg-green-50 rounded-xl">
              <CheckCircle className="w-12 h-12 mx-auto text-green-300 mb-3" />
              <p className="text-green-600">All inspections up to date!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {inspectionsDueWarranties.map(warranty => (
                <Link key={warranty.id} to={`/admin/warranties/${warranty.id}`}>
                  <div className="flex items-center justify-between p-4 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors">
                    <div>
                      <p className="font-medium text-surface-900">
                        {warranty.customer.firstName} {warranty.customer.lastName}
                      </p>
                      <p className="text-sm text-surface-500">
                        {warranty.vehicle.registrationNumber} • {warranty.customer.email}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-orange-600">
                        Due: {formatDate(warranty.nextInspectionDue || '')}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardTitle>Quick Actions</CardTitle>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <Link to="/admin/warranties">
            <QuickAction icon={<FileText />} label="Manage Warranties" color="primary" />
          </Link>
          <Link to="/admin/installers">
            <QuickAction icon={<Users />} label="Manage Installers" color="blue" />
          </Link>
          <Link to="/admin/search">
            <QuickAction icon={<Shield />} label="Search System" color="green" />
          </Link>
          <Link to="/admin/settings">
            <QuickAction icon={<TrendingUp />} label="System Settings" color="purple" />
          </Link>
        </div>
      </Card>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: 'primary' | 'green' | 'yellow' | 'orange' | 'blue' | 'teal' | 'purple' | 'indigo';
  highlight?: boolean;
  link?: string;
  subtitle?: string;
}

function StatCard({ icon, label, value, color, highlight, link, subtitle }: StatCardProps) {
  const colors = {
    primary: 'bg-primary-100 text-primary-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    orange: 'bg-orange-100 text-orange-600',
    blue: 'bg-blue-100 text-blue-600',
    teal: 'bg-teal-100 text-teal-600',
    purple: 'bg-purple-100 text-purple-600',
    indigo: 'bg-indigo-100 text-indigo-600',
  };

  const content = (
    <Card className={`${highlight ? 'ring-2 ring-orange-400 ring-offset-2' : ''} ${link ? 'hover:shadow-lg cursor-pointer' : ''}`}>
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl ${colors[color]} flex items-center justify-center`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-surface-900">{value}</p>
          <p className="text-sm text-surface-500">{label}</p>
          {subtitle && <p className="text-xs text-surface-400">{subtitle}</p>}
        </div>
      </div>
    </Card>
  );

  if (link) {
    return <Link to={link}>{content}</Link>;
  }

  return content;
}

interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  color: 'primary' | 'blue' | 'green' | 'purple';
}

function QuickAction({ icon, label, color }: QuickActionProps) {
  const colors = {
    primary: 'bg-primary-50 text-primary-600 hover:bg-primary-100',
    blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
    green: 'bg-green-50 text-green-600 hover:bg-green-100',
    purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
  };

  return (
    <div className={`flex items-center gap-3 p-4 rounded-xl transition-colors cursor-pointer ${colors[color]}`}>
      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
        {icon}
      </div>
      <span className="font-medium">{label}</span>
    </div>
  );
}

