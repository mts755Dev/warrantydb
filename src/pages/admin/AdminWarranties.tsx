import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Input, Badge, Select, Modal } from '../../components/ui';
import { warrantyStorage } from '../../utils/storage';
import { formatDate, getWarrantyStatusDisplay } from '../../utils/helpers';
import type { Warranty, WarrantyStatus } from '../../types';
import { Search, Eye, Trash2, FileText, AlertTriangle, Filter } from 'lucide-react';

export function AdminWarranties() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<WarrantyStatus | 'all'>('all');
  const [deleteWarranty, setDeleteWarranty] = useState<Warranty | null>(null);

  const warranties = useMemo(() => {
    let result = warrantyStorage.getAll();
    
    if (statusFilter !== 'all') {
      result = result.filter(w => w.status === statusFilter);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(w =>
        `${w.customer.firstName} ${w.customer.lastName}`.toLowerCase().includes(query) ||
        w.vehicle.registrationNumber.toLowerCase().includes(query) ||
        w.vehicle.vin.toLowerCase().includes(query) ||
        w.activationCode.toLowerCase().includes(query) ||
        w.installerName.toLowerCase().includes(query)
      );
    }
    
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [searchQuery, statusFilter]);

  const handleDelete = () => {
    if (deleteWarranty) {
      warrantyStorage.delete(deleteWarranty.id);
      setDeleteWarranty(null);
    }
  };

  const handleVoid = (warranty: Warranty) => {
    const updated: Warranty = { ...warranty, status: 'voided' };
    warrantyStorage.update(updated);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-surface-900">All Warranties</h1>
          <p className="text-surface-500 mt-1">{warranties.length} warranties in system</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by name, rego, VIN, code, or installer..."
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
          <p className="text-surface-500">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : "No warranties have been registered yet"
            }
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {warranties.map(warranty => {
            const status = getWarrantyStatusDisplay(warranty);
            return (
              <Card key={warranty.id} hover className="group">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-surface-900">
                        {warranty.customer.firstName} {warranty.customer.lastName}
                      </h3>
                      <Badge className={`${status.bgColor} ${status.color}`}>
                        {status.text}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
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
                        <span className="text-surface-500">Installer:</span>
                        <p className="font-medium">{warranty.installerName}</p>
                      </div>
                      <div>
                        <span className="text-surface-500">Created:</span>
                        <p className="font-medium">{formatDate(warranty.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/admin/warranties/${warranty.id}`}>
                      <Button variant="outline" size="sm" leftIcon={<Eye className="w-4 h-4" />}>
                        View
                      </Button>
                    </Link>
                    {warranty.status !== 'voided' && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleVoid(warranty)}
                        className="text-orange-600 hover:bg-orange-50"
                      >
                        Void
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setDeleteWarranty(warranty)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deleteWarranty} onClose={() => setDeleteWarranty(null)} title="Delete Warranty">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-surface-900 mb-2">
            Are you sure you want to delete this warranty?
          </h3>
          <p className="text-surface-500 mb-6">
            This action cannot be undone. The warranty for{' '}
            <strong>{deleteWarranty?.customer.firstName} {deleteWarranty?.customer.lastName}</strong>{' '}
            ({deleteWarranty?.activationCode}) will be permanently removed.
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={() => setDeleteWarranty(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete Warranty
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

