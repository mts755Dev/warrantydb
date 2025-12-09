import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Card, Button, Input, Badge, Select } from '../../components/ui';
import { warrantyStorage } from '../../utils/storage';
import { formatDate, getWarrantyStatusDisplay } from '../../utils/helpers';
import { Search, Eye, FileText, Filter } from 'lucide-react';
import type { WarrantyStatus } from '../../types';

export function InstallerWarranties() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<WarrantyStatus | 'all'>('all');

  const warranties = useMemo(() => {
    let result = warrantyStorage.getByInstaller(user?.id || '');
    
    if (statusFilter !== 'all') {
      result = result.filter(w => w.status === statusFilter);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(w =>
        `${w.customer.firstName} ${w.customer.lastName}`.toLowerCase().includes(query) ||
        w.vehicle.registrationNumber.toLowerCase().includes(query) ||
        w.vehicle.vin.toLowerCase().includes(query) ||
        w.activationCode.toLowerCase().includes(query)
      );
    }
    
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [user?.id, searchQuery, statusFilter]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-surface-900">My Warranties</h1>
          <p className="text-surface-500 mt-1">{warranties.length} warranties found</p>
        </div>
        <Link to="/installer/register">
          <Button leftIcon={<FileText className="w-4 h-4" />}>New Warranty</Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by name, rego, VIN, or activation code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="w-48">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as WarrantyStatus | 'all')}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'pending', label: 'Pending' },
                { value: 'activated', label: 'Activated' },
                { value: 'expired', label: 'Expired' },
                { value: 'voided', label: 'Voided' },
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Warranties List */}
      {warranties.length === 0 ? (
        <Card className="text-center py-12">
          <FileText className="w-16 h-16 mx-auto text-surface-300 mb-4" />
          <h3 className="text-xl font-semibold text-surface-900 mb-2">No warranties found</h3>
          <p className="text-surface-500 mb-6">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : "You haven't registered any warranties yet"
            }
          </p>
          {!searchQuery && statusFilter === 'all' && (
            <Link to="/installer/register">
              <Button>Register Your First Warranty</Button>
            </Link>
          )}
        </Card>
      ) : (
        <div className="space-y-4">
          {warranties.map(warranty => {
            const status = getWarrantyStatusDisplay(warranty);
            return (
              <Card key={warranty.id} hover className="group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-surface-900">
                        {warranty.customer.firstName} {warranty.customer.lastName}
                      </h3>
                      <Badge className={`${status.bgColor} ${status.color}`}>
                        {status.text}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-surface-500">Vehicle:</span>
                        <p className="font-medium">{warranty.vehicle.year} {warranty.vehicle.make} {warranty.vehicle.model}</p>
                      </div>
                      <div>
                        <span className="text-surface-500">Registration:</span>
                        <p className="font-medium">{warranty.vehicle.registrationNumber}</p>
                      </div>
                      <div>
                        <span className="text-surface-500">Activation Code:</span>
                        <p className="font-mono font-medium text-primary-600">{warranty.activationCode}</p>
                      </div>
                      <div>
                        <span className="text-surface-500">Created:</span>
                        <p className="font-medium">{formatDate(warranty.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/installer/warranties/${warranty.id}`}>
                      <Button variant="outline" size="sm" leftIcon={<Eye className="w-4 h-4" />}>
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

