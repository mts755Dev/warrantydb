import React, { useState, useMemo } from 'react';
import { Card, CardTitle, Button, Input, Badge, Modal } from '../../components/ui';
import { userStorage, warrantyStorage } from '../../utils/storage';
import { formatDate } from '../../utils/helpers';
import type { User } from '../../types';
import { 
  Search, 
  Users, 
  UserCheck, 
  UserX, 
  Trash2, 
  AlertTriangle,
  Building2,
  Mail,
  Phone,
  FileText,
} from 'lucide-react';

export function AdminInstallers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);

  const installers = useMemo(() => {
    let result = userStorage.getAll().filter(u => u.role === 'installer');
    
    if (!showInactive) {
      result = result.filter(u => u.isActive);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(u =>
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        u.companyName?.toLowerCase().includes(query) ||
        u.licenseNumber?.toLowerCase().includes(query)
      );
    }
    
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [searchQuery, showInactive]);

  const getInstallerStats = (installerId: string) => {
    const warranties = warrantyStorage.getByInstaller(installerId);
    return {
      totalWarranties: warranties.length,
      activeWarranties: warranties.filter(w => w.status === 'activated').length,
    };
  };

  const handleToggleStatus = (user: User) => {
    const updated: User = { ...user, isActive: !user.isActive };
    userStorage.update(updated);
  };

  const handleDelete = () => {
    if (deleteUser) {
      userStorage.delete(deleteUser.id);
      setDeleteUser(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-surface-900">Installers</h1>
          <p className="text-surface-500 mt-1">{installers.length} installers in system</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1">
            <Input
              placeholder="Search by name, email, company, or license..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
              className="w-4 h-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-surface-600">Show inactive</span>
          </label>
        </div>
      </Card>

      {/* Installers List */}
      {installers.length === 0 ? (
        <Card className="text-center py-12">
          <Users className="w-16 h-16 mx-auto text-surface-300 mb-4" />
          <h3 className="text-xl font-semibold text-surface-900 mb-2">No installers found</h3>
          <p className="text-surface-500">
            {searchQuery ? 'Try adjusting your search' : 'No installers have registered yet'}
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {installers.map(installer => {
            const stats = getInstallerStats(installer.id);
            return (
              <Card key={installer.id} className={!installer.isActive ? 'opacity-60' : ''}>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                        <Users className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-surface-900">{installer.name}</h3>
                        <p className="text-sm text-surface-500">{installer.companyName}</p>
                      </div>
                      <Badge variant={installer.isActive ? 'success' : 'default'}>
                        {installer.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-surface-400" />
                        <span className="text-surface-600">{installer.email}</span>
                      </div>
                      {installer.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-surface-400" />
                          <span className="text-surface-600">{installer.phone}</span>
                        </div>
                      )}
                      {installer.licenseNumber && (
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-surface-400" />
                          <span className="text-surface-600">{installer.licenseNumber}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-surface-400" />
                        <span className="text-surface-600">{stats.totalWarranties} warranties</span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-surface-400 mt-3">
                      Joined {formatDate(installer.createdAt)}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant={installer.isActive ? 'outline' : 'primary'}
                      size="sm"
                      onClick={() => handleToggleStatus(installer)}
                      leftIcon={installer.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                    >
                      {installer.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteUser(installer)}
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
      <Modal isOpen={!!deleteUser} onClose={() => setDeleteUser(null)} title="Delete Installer">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-surface-900 mb-2">
            Delete Installer Account?
          </h3>
          <p className="text-surface-500 mb-6">
            This will permanently delete <strong>{deleteUser?.name}</strong>'s account.
            Their warranties will remain in the system.
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={() => setDeleteUser(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete Account
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

