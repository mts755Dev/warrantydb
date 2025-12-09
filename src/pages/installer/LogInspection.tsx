import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardTitle, Button, Input, Select, Textarea, PhotoUpload } from '../../components/ui';
import { warrantyStorage } from '../../utils/storage';
import { generateId, calculateNextInspectionDate, formatDate } from '../../utils/helpers';
import { emailService } from '../../utils/email';
import type { Warranty, Inspection, PhotoUpload as PhotoUploadType } from '../../types';
import {
  Search,
  ClipboardCheck,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';

export function LogInspection() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWarranty, setSelectedWarranty] = useState<Warranty | null>(null);
  const [searchResults, setSearchResults] = useState<Warranty[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [inspection, setInspection] = useState<{
    inspectionDate: string;
    findings: string;
    corrosionFound: boolean;
    corrosionSeverity: 'none' | 'minor' | 'moderate' | 'severe';
    corrosionNotes: string;
    overallCondition: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
    recommendations: string;
    passed: boolean;
  }>({
    inspectionDate: new Date().toISOString().split('T')[0],
    findings: '',
    corrosionFound: false,
    corrosionSeverity: 'none',
    corrosionNotes: '',
    overallCondition: 'good',
    recommendations: '',
    passed: true,
  });

  const [photos, setPhotos] = useState<PhotoUploadType[]>([]);

  // Load warranty from URL parameter
  useEffect(() => {
    const warrantyId = searchParams.get('warranty');
    if (warrantyId) {
      const warranty = warrantyStorage.getById(warrantyId);
      if (warranty) {
        setSelectedWarranty(warranty);
      }
    }
  }, [searchParams]);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
    const results = warrantyStorage.search(searchQuery, 'all');
    setSearchResults(results.filter(w => w.status === 'activated'));
  };

  const handleSubmit = async () => {
    if (!selectedWarranty || !user) return;
    
    setError('');
    setIsSubmitting(true);

    try {
      const newInspection: Inspection = {
        id: generateId(),
        warrantyId: selectedWarranty.id,
        inspectorId: user.id,
        inspectorName: user.name,
        inspectionDate: inspection.inspectionDate,
        findings: inspection.findings,
        corrosionFound: inspection.corrosionFound,
        corrosionSeverity: inspection.corrosionSeverity,
        corrosionNotes: inspection.corrosionNotes,
        overallCondition: inspection.overallCondition,
        recommendations: inspection.recommendations,
        photos,
        passed: inspection.passed,
        nextInspectionDue: calculateNextInspectionDate(inspection.inspectionDate),
        createdAt: new Date().toISOString(),
      };

      // Update warranty with new inspection
      const updatedWarranty: Warranty = {
        ...selectedWarranty,
        lastInspectionDate: inspection.inspectionDate,
        nextInspectionDue: newInspection.nextInspectionDue,
        inspections: [...selectedWarranty.inspections, newInspection],
      };

      warrantyStorage.update(updatedWarranty);
      
      // Schedule next inspection reminder
      emailService.createInspectionReminder(updatedWarranty);
      
      setSuccess(true);
    } catch {
      setError('Failed to log inspection. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success State
  if (success) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-in">
        <Card className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-display font-bold text-surface-900 mb-2">
            Inspection Logged Successfully!
          </h2>
          <p className="text-surface-600 mb-8">
            The inspection has been recorded and the next inspection reminder has been scheduled.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={() => navigate(`/installer/warranties/${selectedWarranty?.id}`)}>
              View Warranty
            </Button>
            <Button onClick={() => {
              setSuccess(false);
              setSelectedWarranty(null);
              setSearchQuery('');
              setPhotos([]);
              setInspection({
                inspectionDate: new Date().toISOString().split('T')[0],
                findings: '',
                corrosionFound: false,
                corrosionSeverity: 'none',
                corrosionNotes: '',
                overallCondition: 'good',
                recommendations: '',
                passed: true,
              });
            }}>
              Log Another Inspection
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-display font-bold text-surface-900">Log Inspection</h1>
          <p className="text-surface-500 mt-1">Record an annual warranty inspection</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Warranty Selection */}
      {!selectedWarranty ? (
        <Card>
          <CardTitle subtitle="Search by customer name, registration, VIN, or activation code">
            Find Warranty
          </CardTitle>
          <div className="flex gap-3 mt-4">
            <div className="flex-1">
              <Input
                placeholder="Search for warranty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>
            <Button onClick={handleSearch}>Search</Button>
          </div>

          {searchResults.length > 0 && (
            <div className="mt-6 space-y-3">
              <p className="text-sm text-surface-500">{searchResults.length} activated warranties found</p>
              {searchResults.map(warranty => (
                <button
                  key={warranty.id}
                  onClick={() => setSelectedWarranty(warranty)}
                  className="w-full p-4 bg-surface-50 hover:bg-primary-50 rounded-xl text-left transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-surface-900">
                        {warranty.customer.firstName} {warranty.customer.lastName}
                      </p>
                      <p className="text-sm text-surface-500">
                        {warranty.vehicle.year} {warranty.vehicle.make} {warranty.vehicle.model} • {warranty.vehicle.registrationNumber}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm text-primary-600">{warranty.activationCode}</p>
                      <p className="text-xs text-surface-400">
                        Last inspection: {warranty.lastInspectionDate ? formatDate(warranty.lastInspectionDate) : 'Never'}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {searchQuery && searchResults.length === 0 && (
            <div className="mt-6 text-center py-8 bg-surface-50 rounded-xl">
              <Search className="w-12 h-12 mx-auto text-surface-300 mb-3" />
              <p className="text-surface-500">No activated warranties found matching your search</p>
            </div>
          )}
        </Card>
      ) : (
        <>
          {/* Selected Warranty Info */}
          <Card className="bg-primary-50 border-primary-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-primary-600 font-medium">Inspecting Warranty</p>
                <p className="text-xl font-semibold text-surface-900 mt-1">
                  {selectedWarranty.customer.firstName} {selectedWarranty.customer.lastName}
                </p>
                <p className="text-surface-600">
                  {selectedWarranty.vehicle.year} {selectedWarranty.vehicle.make} {selectedWarranty.vehicle.model} • {selectedWarranty.vehicle.registrationNumber}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedWarranty(null)}>
                Change
              </Button>
            </div>
          </Card>

          {/* Inspection Form */}
          <Card>
            <CardTitle>Inspection Details</CardTitle>
            <div className="space-y-6 mt-4">
              <Input
                label="Inspection Date"
                type="date"
                value={inspection.inspectionDate}
                onChange={(e) => setInspection(prev => ({ ...prev, inspectionDate: e.target.value }))}
                required
              />

              <Select
                label="Overall Condition"
                value={inspection.overallCondition}
                onChange={(e) => setInspection(prev => ({ 
                  ...prev, 
                  overallCondition: e.target.value as typeof inspection.overallCondition,
                  passed: e.target.value !== 'critical' && e.target.value !== 'poor'
                }))}
                options={[
                  { value: 'excellent', label: 'Excellent' },
                  { value: 'good', label: 'Good' },
                  { value: 'fair', label: 'Fair' },
                  { value: 'poor', label: 'Poor' },
                  { value: 'critical', label: 'Critical' },
                ]}
                required
              />

              <Textarea
                label="Inspection Findings"
                value={inspection.findings}
                onChange={(e) => setInspection(prev => ({ ...prev, findings: e.target.value }))}
                placeholder="Describe the findings from the inspection..."
                required
              />

              {/* Corrosion Check */}
              <div className="bg-surface-50 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-4">
                  <input
                    type="checkbox"
                    id="corrosionFound"
                    checked={inspection.corrosionFound}
                    onChange={(e) => setInspection(prev => ({ 
                      ...prev, 
                      corrosionFound: e.target.checked,
                      corrosionSeverity: e.target.checked ? 'minor' : 'none'
                    }))}
                    className="w-5 h-5 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="corrosionFound" className="font-medium text-surface-900">
                    Corrosion found during inspection
                  </label>
                </div>
                
                {inspection.corrosionFound && (
                  <div className="space-y-4 mt-4">
                    <Select
                      label="Corrosion Severity"
                      value={inspection.corrosionSeverity}
                      onChange={(e) => setInspection(prev => ({ 
                        ...prev, 
                        corrosionSeverity: e.target.value as typeof inspection.corrosionSeverity 
                      }))}
                      options={[
                        { value: 'minor', label: 'Minor' },
                        { value: 'moderate', label: 'Moderate' },
                        { value: 'severe', label: 'Severe' },
                      ]}
                    />
                    <Textarea
                      label="Corrosion Notes"
                      value={inspection.corrosionNotes}
                      onChange={(e) => setInspection(prev => ({ ...prev, corrosionNotes: e.target.value }))}
                      placeholder="Describe the corrosion location and extent..."
                    />
                  </div>
                )}
              </div>

              <Textarea
                label="Recommendations"
                value={inspection.recommendations}
                onChange={(e) => setInspection(prev => ({ ...prev, recommendations: e.target.value }))}
                placeholder="Any recommendations for the customer..."
              />

              {/* Pass/Fail */}
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-surface-700">Inspection Result:</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={inspection.passed}
                      onChange={() => setInspection(prev => ({ ...prev, passed: true }))}
                      className="w-4 h-4 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-green-600 font-medium">Passed</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={!inspection.passed}
                      onChange={() => setInspection(prev => ({ ...prev, passed: false }))}
                      className="w-4 h-4 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-red-600 font-medium">Failed</span>
                  </label>
                </div>
              </div>

              {/* Photo Upload */}
              <PhotoUpload
                label="Inspection Photos"
                photos={photos}
                onChange={setPhotos}
                type="inspection"
                maxPhotos={10}
              />

              <div className="flex justify-end gap-4 pt-4 border-t border-surface-200">
                <Button variant="outline" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  isLoading={isSubmitting}
                  leftIcon={<ClipboardCheck className="w-4 h-4" />}
                >
                  Submit Inspection
                </Button>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

