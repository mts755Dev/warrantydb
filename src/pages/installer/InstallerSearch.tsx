import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardTitle, Button, Input, Select, Badge } from '../../components/ui';
import { warrantyStorage } from '../../utils/storage';
import { formatDate, getWarrantyStatusDisplay } from '../../utils/helpers';
import type { Warranty } from '../../types';
import { Search, Eye, FileText, Filter } from 'lucide-react';

export function InstallerSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBy, setSearchBy] = useState<'all' | 'customer_name' | 'vin' | 'registration' | 'activation_code'>('all');
  const [results, setResults] = useState<Warranty[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }
    
    const found = warrantyStorage.search(searchQuery, searchBy);
    setResults(found);
    setHasSearched(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-surface-900">Search Warranties</h1>
        <p className="text-surface-500 mt-1">Find warranty records by customer, vehicle, or activation code</p>
      </div>

      {/* Search Form */}
      <Card>
        <CardTitle subtitle="Search across all stores">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-primary-600" />
            Search
          </div>
        </CardTitle>
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <div className="flex-1">
            <Input
              placeholder="Enter search term..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="w-full md:w-48">
            <Select
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value as typeof searchBy)}
              options={[
                { value: 'all', label: 'All Fields' },
                { value: 'customer_name', label: 'Customer Name' },
                { value: 'vin', label: 'VIN' },
                { value: 'registration', label: 'Registration' },
                { value: 'activation_code', label: 'Activation Code' },
              ]}
            />
          </div>
          <Button onClick={handleSearch} leftIcon={<Search className="w-4 h-4" />}>
            Search
          </Button>
        </div>

        <div className="mt-4 p-4 bg-surface-50 rounded-xl">
          <h4 className="font-medium text-surface-700 mb-2 flex items-center gap-2">
            <Filter className="w-4 h-4" /> Search Tips
          </h4>
          <ul className="text-sm text-surface-600 space-y-1">
            <li>• <strong>Customer Name:</strong> Search by first or last name</li>
            <li>• <strong>VIN:</strong> Full or partial Vehicle Identification Number</li>
            <li>• <strong>Registration:</strong> Vehicle registration number (e.g., ABC123)</li>
            <li>• <strong>Activation Code:</strong> 8-character warranty code</li>
          </ul>
        </div>
      </Card>

      {/* Search Results */}
      {hasSearched && (
        <div>
          <p className="text-sm text-surface-500 mb-4">
            {results.length} {results.length === 1 ? 'result' : 'results'} found
          </p>
          
          {results.length === 0 ? (
            <Card className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto text-surface-300 mb-4" />
              <h3 className="text-xl font-semibold text-surface-900 mb-2">No results found</h3>
              <p className="text-surface-500">
                Try adjusting your search term or search by a different field
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {results.map(warranty => {
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
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-surface-500">Vehicle:</span>
                            <p className="font-medium">{warranty.vehicle.year} {warranty.vehicle.make} {warranty.vehicle.model}</p>
                          </div>
                          <div>
                            <span className="text-surface-500">Registration:</span>
                            <p className="font-medium">{warranty.vehicle.registrationNumber} ({warranty.vehicle.registrationState})</p>
                          </div>
                          <div>
                            <span className="text-surface-500">VIN:</span>
                            <p className="font-mono text-xs">{warranty.vehicle.vin}</p>
                          </div>
                          <div>
                            <span className="text-surface-500">Activation Code:</span>
                            <p className="font-mono font-medium text-primary-600">{warranty.activationCode}</p>
                          </div>
                        </div>
                        <div className="mt-3 text-sm text-surface-500">
                          <span>Installer: {warranty.installerName}</span>
                          <span className="mx-2">•</span>
                          <span>Created: {formatDate(warranty.createdAt)}</span>
                          {warranty.lastInspectionDate && (
                            <>
                              <span className="mx-2">•</span>
                              <span>Last Inspection: {formatDate(warranty.lastInspectionDate)}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link to={`/installer/warranties/${warranty.id}`}>
                          <Button variant="outline" size="sm" leftIcon={<Eye className="w-4 h-4" />}>
                            View Details
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
      )}
    </div>
  );
}

