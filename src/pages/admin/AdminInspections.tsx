import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardTitle, Button, Input, Badge, Select } from '../../components/ui';
import { warrantyStorage } from '../../utils/storage';
import { formatDate, isInspectionDue, isInspectionOverdue } from '../../utils/helpers';
import type { Warranty } from '../../types';
import { 
  Search, 
  ClipboardCheck, 
  AlertTriangle, 
  CheckCircle,
  Eye,
  Calendar,
  Filter,
} from 'lucide-react';

type InspectionFilter = 'all' | 'due' | 'overdue' | 'completed';

export function AdminInspections() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<InspectionFilter>('all');

  const warrantiesWithInspections = useMemo(() => {
    let warranties = warrantyStorage.getAll().filter(w => w.status === 'activated');
    
    if (filter === 'due') {
      warranties = warranties.filter(w => 
        w.nextInspectionDue && isInspectionDue(w.nextInspectionDue) && !isInspectionOverdue(w.nextInspectionDue)
      );
    } else if (filter === 'overdue') {
      warranties = warranties.filter(w => 
        w.nextInspectionDue && isInspectionOverdue(w.nextInspectionDue)
      );
    } else if (filter === 'completed') {
      warranties = warranties.filter(w => w.inspections.length > 0);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      warranties = warranties.filter(w =>
        `${w.customer.firstName} ${w.customer.lastName}`.toLowerCase().includes(query) ||
        w.vehicle.registrationNumber.toLowerCase().includes(query) ||
        w.activationCode.toLowerCase().includes(query)
      );
    }
    
    return warranties.sort((a, b) => {
      // Sort overdue first, then by next inspection date
      const aOverdue = a.nextInspectionDue && isInspectionOverdue(a.nextInspectionDue);
      const bOverdue = b.nextInspectionDue && isInspectionOverdue(b.nextInspectionDue);
      
      if (aOverdue && !bOverdue) return -1;
      if (!aOverdue && bOverdue) return 1;
      
      if (a.nextInspectionDue && b.nextInspectionDue) {
        return new Date(a.nextInspectionDue).getTime() - new Date(b.nextInspectionDue).getTime();
      }
      return 0;
    });
  }, [searchQuery, filter]);

  const stats = useMemo(() => {
    const allActivated = warrantyStorage.getAll().filter(w => w.status === 'activated');
    return {
      total: allActivated.length,
      due: allActivated.filter(w => w.nextInspectionDue && isInspectionDue(w.nextInspectionDue) && !isInspectionOverdue(w.nextInspectionDue)).length,
      overdue: allActivated.filter(w => w.nextInspectionDue && isInspectionOverdue(w.nextInspectionDue)).length,
      completed: allActivated.reduce((sum, w) => sum + w.inspections.length, 0),
    };
  }, []);

  const getInspectionStatus = (warranty: Warranty) => {
    if (!warranty.nextInspectionDue) return { text: 'Not Set', color: 'text-surface-500', bgColor: 'bg-surface-100' };
    if (isInspectionOverdue(warranty.nextInspectionDue)) return { text: 'Overdue', color: 'text-red-700', bgColor: 'bg-red-100' };
    if (isInspectionDue(warranty.nextInspectionDue)) return { text: 'Due Soon', color: 'text-orange-700', bgColor: 'bg-orange-100' };
    return { text: 'Up to Date', color: 'text-green-700', bgColor: 'bg-green-100' };
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-surface-900">Inspections</h1>
          <p className="text-surface-500 mt-1">Manage and track warranty inspections</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => setFilter('all')}
          className={`p-4 rounded-xl border-2 transition-all ${filter === 'all' ? 'border-primary-500 bg-primary-50' : 'border-surface-200 bg-white hover:border-surface-300'}`}
        >
          <div className="text-2xl font-bold text-surface-900">{stats.total}</div>
          <div className="text-sm text-surface-500">Total Active</div>
        </button>
        <button
          onClick={() => setFilter('due')}
          className={`p-4 rounded-xl border-2 transition-all ${filter === 'due' ? 'border-orange-500 bg-orange-50' : 'border-surface-200 bg-white hover:border-surface-300'}`}
        >
          <div className="text-2xl font-bold text-orange-600">{stats.due}</div>
          <div className="text-sm text-surface-500">Due Soon</div>
        </button>
        <button
          onClick={() => setFilter('overdue')}
          className={`p-4 rounded-xl border-2 transition-all ${filter === 'overdue' ? 'border-red-500 bg-red-50' : 'border-surface-200 bg-white hover:border-surface-300'}`}
        >
          <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
          <div className="text-sm text-surface-500">Overdue</div>
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`p-4 rounded-xl border-2 transition-all ${filter === 'completed' ? 'border-green-500 bg-green-50' : 'border-surface-200 bg-white hover:border-surface-300'}`}
        >
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-sm text-surface-500">Completed</div>
        </button>
      </div>

      {/* Search */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by name, registration, or activation code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
        </div>
      </Card>

      {/* Warranties List */}
      {warrantiesWithInspections.length === 0 ? (
        <Card className="text-center py-12">
          <ClipboardCheck className="w-16 h-16 mx-auto text-surface-300 mb-4" />
          <h3 className="text-xl font-semibold text-surface-900 mb-2">No warranties found</h3>
          <p className="text-surface-500">
            {searchQuery || filter !== 'all'
              ? 'Try adjusting your search or filter'
              : 'No activated warranties in the system'
            }
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {warrantiesWithInspections.map(warranty => {
            const status = getInspectionStatus(warranty);
            const lastInspection = warranty.inspections[warranty.inspections.length - 1];
            
            return (
              <Card key={warranty.id} hover>
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
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-surface-500">Vehicle:</span>
                        <p className="font-medium">{warranty.vehicle.registrationNumber}</p>
                      </div>
                      <div>
                        <span className="text-surface-500">Next Due:</span>
                        <p className={`font-medium ${status.color}`}>
                          {warranty.nextInspectionDue ? formatDate(warranty.nextInspectionDue) : 'Not set'}
                        </p>
                      </div>
                      <div>
                        <span className="text-surface-500">Last Inspection:</span>
                        <p className="font-medium">
                          {lastInspection ? formatDate(lastInspection.inspectionDate) : 'Never'}
                        </p>
                      </div>
                      <div>
                        <span className="text-surface-500">Total Inspections:</span>
                        <p className="font-medium">{warranty.inspections.length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/admin/warranties/${warranty.id}`}>
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

