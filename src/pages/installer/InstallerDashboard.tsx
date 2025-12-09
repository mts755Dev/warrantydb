import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardTitle, Button, Badge } from '../../components/ui';
import { warrantyStorage } from '../../utils/storage';
import { 
  PlusCircle, 
  FileText, 
  ClipboardCheck, 
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { formatDate, getWarrantyStatusDisplay, isInspectionDue } from '../../utils/helpers';

export function InstallerDashboard() {
  const { user } = useAuth();

  const stats = useMemo(() => {
    const myWarranties = warrantyStorage.getByInstaller(user?.id || '');
    
    const active = myWarranties.filter(w => w.status === 'activated');
    const pending = myWarranties.filter(w => w.status === 'pending');
    const inspectionsDue = myWarranties.filter(
      w => w.status === 'activated' && w.nextInspectionDue && isInspectionDue(w.nextInspectionDue)
    );
    
    const recentWarranties = [...myWarranties]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    return {
      total: myWarranties.length,
      active: active.length,
      pending: pending.length,
      inspectionsDue: inspectionsDue.length,
      recentWarranties,
    };
  }, [user?.id]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-surface-900">
            Welcome back, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-surface-500 mt-1">
            {user?.companyName && `${user.companyName} • `}
            {user?.licenseNumber && `License: ${user.licenseNumber}`}
          </p>
        </div>
        <Link to="/installer/register">
          <Button leftIcon={<PlusCircle className="w-5 h-5" />}>
            Register New Warranty
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<FileText className="w-6 h-6" />}
          label="Total Warranties"
          value={stats.total}
          color="primary"
        />
        <StatCard
          icon={<CheckCircle className="w-6 h-6" />}
          label="Active"
          value={stats.active}
          color="green"
        />
        <StatCard
          icon={<Clock className="w-6 h-6" />}
          label="Pending Activation"
          value={stats.pending}
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

      {/* Quick Actions & Recent Warranties */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardTitle>Quick Actions</CardTitle>
          <div className="space-y-3 mt-4">
            <Link to="/installer/register" className="block">
              <QuickActionButton
                icon={<PlusCircle className="w-5 h-5" />}
                label="Register New Warranty"
                description="Submit a new warranty registration"
              />
            </Link>
            <Link to="/installer/inspection" className="block">
              <QuickActionButton
                icon={<ClipboardCheck className="w-5 h-5" />}
                label="Log Inspection"
                description="Record an annual inspection"
              />
            </Link>
            <Link to="/installer/search" className="block">
              <QuickActionButton
                icon={<FileText className="w-5 h-5" />}
                label="Search Warranties"
                description="Find a warranty record"
              />
            </Link>
          </div>
        </Card>

        {/* Recent Warranties */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Recent Warranties</CardTitle>
            <Link to="/installer/warranties">
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                View All
              </Button>
            </Link>
          </div>
          
          {stats.recentWarranties.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 mx-auto text-surface-300 mb-3" />
              <p className="text-surface-500">No warranties registered yet</p>
              <Link to="/installer/register" className="mt-4 inline-block">
                <Button variant="outline" size="sm">
                  Register Your First Warranty
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentWarranties.map(warranty => {
                const status = getWarrantyStatusDisplay(warranty);
                return (
                  <Link 
                    key={warranty.id} 
                    to={`/installer/warranties/${warranty.id}`}
                    className="block"
                  >
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
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: 'primary' | 'green' | 'yellow' | 'orange';
  highlight?: boolean;
}

function StatCard({ icon, label, value, color, highlight }: StatCardProps) {
  const colors = {
    primary: 'bg-primary-100 text-primary-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  return (
    <Card className={highlight ? 'ring-2 ring-orange-400 ring-offset-2' : ''}>
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl ${colors[color]} flex items-center justify-center`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-surface-900">{value}</p>
          <p className="text-sm text-surface-500">{label}</p>
        </div>
      </div>
    </Card>
  );
}

interface QuickActionButtonProps {
  icon: React.ReactNode;
  label: string;
  description: string;
}

function QuickActionButton({ icon, label, description }: QuickActionButtonProps) {
  return (
    <div className="flex items-center gap-4 p-4 bg-surface-50 hover:bg-primary-50 rounded-xl transition-colors group cursor-pointer">
      <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center group-hover:bg-primary-200 transition-colors">
        {icon}
      </div>
      <div className="flex-1">
        <p className="font-medium text-surface-900 group-hover:text-primary-700">{label}</p>
        <p className="text-sm text-surface-500">{description}</p>
      </div>
      <ArrowRight className="w-5 h-5 text-surface-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
    </div>
  );
}

