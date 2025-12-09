import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardTitle, Button, Input, Select, Textarea, PhotoUpload } from '../../components/ui';
import { warrantyStorage } from '../../utils/storage';
import { 
  generateId, 
  generateActivationCode, 
  australianStates, 
  vehicleBodyTypes,
  couplerLocations,
  couplerTypes
} from '../../utils/helpers';
import type { Warranty, Customer, Vehicle, InstallationDetails, PhotoUpload as PhotoUploadType, CouplerPlacement, AustralianState } from '../../types';
import { 
  User, 
  Car, 
  Wrench, 
  CheckCircle, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Trash2,
  AlertCircle,
  Copy
} from 'lucide-react';

type Step = 'customer' | 'vehicle' | 'installation' | 'review';

const steps: { id: Step; label: string; icon: React.ReactNode }[] = [
  { id: 'customer', label: 'Customer Details', icon: <User className="w-5 h-5" /> },
  { id: 'vehicle', label: 'Vehicle Details', icon: <Car className="w-5 h-5" /> },
  { id: 'installation', label: 'Installation', icon: <Wrench className="w-5 h-5" /> },
  { id: 'review', label: 'Review', icon: <CheckCircle className="w-5 h-5" /> },
];

export function WarrantyRegistration() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState<Step>('customer');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successCode, setSuccessCode] = useState<string | null>(null);

  // Form State
  const [customer, setCustomer] = useState<Omit<Customer, 'id' | 'createdAt'>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    suburb: '',
    state: 'NSW',
    postcode: '',
  });

  const [vehicle, setVehicle] = useState<Omit<Vehicle, 'id'>>({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    vin: '',
    registrationNumber: '',
    registrationState: 'NSW',
    color: '',
    bodyType: '',
  });

  const [installation, setInstallation] = useState<Omit<InstallationDetails, 'photos'>>({
    installationDate: new Date().toISOString().split('T')[0],
    installerNotes: '',
    generatorSerialNumbers: [''],
    couplerCount: 1,
    couplerPlacements: [],
    corrosionCheckPassed: true,
    corrosionNotes: '',
  });

  const [photos, setPhotos] = useState<PhotoUploadType[]>([]);

  const getCurrentStepIndex = () => steps.findIndex(s => s.id === currentStep);
  
  const goToNextStep = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    }
  };
  
  const goToPreviousStep = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  const addSerialNumber = () => {
    setInstallation(prev => ({
      ...prev,
      generatorSerialNumbers: [...prev.generatorSerialNumbers, '']
    }));
  };

  const removeSerialNumber = (index: number) => {
    setInstallation(prev => ({
      ...prev,
      generatorSerialNumbers: prev.generatorSerialNumbers.filter((_, i) => i !== index)
    }));
  };

  const updateSerialNumber = (index: number, value: string) => {
    setInstallation(prev => ({
      ...prev,
      generatorSerialNumbers: prev.generatorSerialNumbers.map((s, i) => i === index ? value : s)
    }));
  };

  const addCoupler = () => {
    const newCoupler: CouplerPlacement = {
      id: generateId(),
      location: '',
      type: '',
      condition: 'excellent'
    };
    setInstallation(prev => ({
      ...prev,
      couplerPlacements: [...prev.couplerPlacements, newCoupler],
      couplerCount: prev.couplerCount + 1
    }));
  };

  const removeCoupler = (id: string) => {
    setInstallation(prev => ({
      ...prev,
      couplerPlacements: prev.couplerPlacements.filter(c => c.id !== id),
      couplerCount: Math.max(0, prev.couplerCount - 1)
    }));
  };

  const updateCoupler = (id: string, field: keyof CouplerPlacement, value: string) => {
    setInstallation(prev => ({
      ...prev,
      couplerPlacements: prev.couplerPlacements.map(c => 
        c.id === id ? { ...c, [field]: value } : c
      )
    }));
  };

  const validateStep = (step: Step): boolean => {
    switch (step) {
      case 'customer':
        return !!(customer.firstName && customer.lastName && customer.email && customer.phone && customer.address && customer.suburb && customer.postcode);
      case 'vehicle':
        return !!(vehicle.make && vehicle.model && vehicle.year && vehicle.vin && vehicle.registrationNumber);
      case 'installation':
        return !!(installation.installationDate && installation.generatorSerialNumbers.some(s => s.trim()));
      case 'review':
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    setError('');
    setIsSubmitting(true);

    try {
      const activationCode = generateActivationCode();
      
      const warranty: Warranty = {
        id: generateId(),
        activationCode,
        status: 'pending',
        customer: {
          ...customer,
          id: generateId(),
          createdAt: new Date().toISOString(),
        },
        vehicle: {
          ...vehicle,
          id: generateId(),
        },
        installation: {
          ...installation,
          photos,
          generatorSerialNumbers: installation.generatorSerialNumbers.filter(s => s.trim()),
        },
        installerId: user?.id || '',
        installerName: user?.name || '',
        installerCompany: user?.companyName || '',
        createdAt: new Date().toISOString(),
        inspections: [],
      };

      warrantyStorage.add(warranty);
      setSuccessCode(activationCode);
    } catch {
      setError('Failed to register warranty. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyActivationCode = () => {
    if (successCode) {
      navigator.clipboard.writeText(successCode);
    }
  };

  // Success State
  if (successCode) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-in">
        <Card className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-display font-bold text-surface-900 mb-2">
            Warranty Registered Successfully!
          </h2>
          <p className="text-surface-600 mb-8">
            The warranty has been created. Give the activation code to the customer.
          </p>
          
          <div className="bg-surface-50 rounded-2xl p-6 mb-8">
            <p className="text-sm text-surface-500 mb-2">Activation Code</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-4xl font-mono font-bold text-primary-600 tracking-wider">
                {successCode}
              </span>
              <Button variant="ghost" size="sm" onClick={copyActivationCode}>
                <Copy className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={() => navigate('/installer/warranties')}>
              View Warranties
            </Button>
            <Button onClick={() => {
              setSuccessCode(null);
              setCurrentStep('customer');
              setCustomer({ firstName: '', lastName: '', email: '', phone: '', address: '', suburb: '', state: 'NSW', postcode: '' });
              setVehicle({ make: '', model: '', year: new Date().getFullYear(), vin: '', registrationNumber: '', registrationState: 'NSW', color: '', bodyType: '' });
              setInstallation({ installationDate: new Date().toISOString().split('T')[0], installerNotes: '', generatorSerialNumbers: [''], couplerCount: 1, couplerPlacements: [], corrosionCheckPassed: true, corrosionNotes: '' });
              setPhotos([]);
            }}>
              Register Another
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-surface-900">
          Register New Warranty
        </h1>
        <p className="text-surface-500 mt-1">
          Complete all steps to generate an activation code for the customer
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isActive = step.id === currentStep;
            const isCompleted = getCurrentStepIndex() > index;
            
            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => setCurrentStep(step.id)}
                  className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all
                    ${isActive ? 'bg-primary-100 text-primary-700' : ''}
                    ${isCompleted ? 'text-green-600' : 'text-surface-400'}
                    ${!isActive && !isCompleted ? 'hover:bg-surface-100' : ''}
                  `}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    ${isActive ? 'bg-primary-600 text-white' : ''}
                    ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-surface-100'}
                  `}>
                    {isCompleted ? <CheckCircle className="w-4 h-4" /> : index + 1}
                  </div>
                  <span className="hidden md:block font-medium">{step.label}</span>
                </button>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${isCompleted ? 'bg-green-300' : 'bg-surface-200'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <Card>
        {/* Customer Details Step */}
        {currentStep === 'customer' && (
          <div className="space-y-6">
            <CardTitle>Customer Details</CardTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={customer.firstName}
                onChange={(e) => setCustomer(prev => ({ ...prev, firstName: e.target.value }))}
                required
              />
              <Input
                label="Last Name"
                value={customer.lastName}
                onChange={(e) => setCustomer(prev => ({ ...prev, lastName: e.target.value }))}
                required
              />
              <Input
                label="Email"
                type="email"
                value={customer.email}
                onChange={(e) => setCustomer(prev => ({ ...prev, email: e.target.value }))}
                required
              />
              <Input
                label="Phone"
                type="tel"
                value={customer.phone}
                onChange={(e) => setCustomer(prev => ({ ...prev, phone: e.target.value }))}
                required
              />
            </div>
            <Input
              label="Street Address"
              value={customer.address}
              onChange={(e) => setCustomer(prev => ({ ...prev, address: e.target.value }))}
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Suburb"
                value={customer.suburb}
                onChange={(e) => setCustomer(prev => ({ ...prev, suburb: e.target.value }))}
                required
              />
              <Select
                label="State"
                value={customer.state}
                onChange={(e) => setCustomer(prev => ({ ...prev, state: e.target.value as AustralianState }))}
                options={australianStates}
                required
              />
              <Input
                label="Postcode"
                value={customer.postcode}
                onChange={(e) => setCustomer(prev => ({ ...prev, postcode: e.target.value }))}
                required
                maxLength={4}
              />
            </div>
          </div>
        )}

        {/* Vehicle Details Step */}
        {currentStep === 'vehicle' && (
          <div className="space-y-6">
            <CardTitle>Vehicle Details</CardTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Make"
                value={vehicle.make}
                onChange={(e) => setVehicle(prev => ({ ...prev, make: e.target.value }))}
                placeholder="e.g., Toyota"
                required
              />
              <Input
                label="Model"
                value={vehicle.model}
                onChange={(e) => setVehicle(prev => ({ ...prev, model: e.target.value }))}
                placeholder="e.g., Hilux"
                required
              />
              <Input
                label="Year"
                type="number"
                value={vehicle.year}
                onChange={(e) => setVehicle(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                min={1990}
                max={new Date().getFullYear() + 1}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="VIN"
                value={vehicle.vin}
                onChange={(e) => setVehicle(prev => ({ ...prev, vin: e.target.value.toUpperCase() }))}
                placeholder="17-character VIN"
                required
                maxLength={17}
                hint="Vehicle Identification Number"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Registration"
                  value={vehicle.registrationNumber}
                  onChange={(e) => setVehicle(prev => ({ ...prev, registrationNumber: e.target.value.toUpperCase() }))}
                  placeholder="ABC123"
                  required
                />
                <Select
                  label="State"
                  value={vehicle.registrationState}
                  onChange={(e) => setVehicle(prev => ({ ...prev, registrationState: e.target.value as AustralianState }))}
                  options={australianStates}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Color"
                value={vehicle.color || ''}
                onChange={(e) => setVehicle(prev => ({ ...prev, color: e.target.value }))}
                placeholder="e.g., White"
              />
              <Select
                label="Body Type"
                value={vehicle.bodyType || ''}
                onChange={(e) => setVehicle(prev => ({ ...prev, bodyType: e.target.value }))}
                options={vehicleBodyTypes.map(t => ({ value: t, label: t }))}
                placeholder="Select body type"
              />
            </div>
          </div>
        )}

        {/* Installation Details Step */}
        {currentStep === 'installation' && (
          <div className="space-y-6">
            <CardTitle>Installation Details</CardTitle>
            
            <Input
              label="Installation Date"
              type="date"
              value={installation.installationDate}
              onChange={(e) => setInstallation(prev => ({ ...prev, installationDate: e.target.value }))}
              required
            />

            {/* Generator Serial Numbers */}
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Generator Serial Numbers *
              </label>
              {installation.generatorSerialNumbers.map((serial, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    value={serial}
                    onChange={(e) => updateSerialNumber(index, e.target.value)}
                    placeholder={`Serial #${index + 1}`}
                  />
                  {installation.generatorSerialNumbers.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => removeSerialNumber(index)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSerialNumber}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Add Serial Number
              </Button>
            </div>

            {/* Couplers */}
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Coupler Placements ({installation.couplerPlacements.length})
              </label>
              {installation.couplerPlacements.map((coupler) => (
                <div key={coupler.id} className="flex gap-2 mb-2 p-4 bg-surface-50 rounded-lg">
                  <Select
                    value={coupler.location}
                    onChange={(e) => updateCoupler(coupler.id, 'location', e.target.value)}
                    options={couplerLocations.map(l => ({ value: l, label: l }))}
                    placeholder="Location"
                  />
                  <Select
                    value={coupler.type}
                    onChange={(e) => updateCoupler(coupler.id, 'type', e.target.value)}
                    options={couplerTypes.map(t => ({ value: t, label: t }))}
                    placeholder="Type"
                  />
                  <Select
                    value={coupler.condition}
                    onChange={(e) => updateCoupler(coupler.id, 'condition', e.target.value as CouplerPlacement['condition'])}
                    options={[
                      { value: 'excellent', label: 'Excellent' },
                      { value: 'good', label: 'Good' },
                      { value: 'fair', label: 'Fair' },
                      { value: 'poor', label: 'Poor' },
                    ]}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => removeCoupler(coupler.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCoupler}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Add Coupler
              </Button>
            </div>

            {/* Corrosion Check */}
            <div className="bg-surface-50 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-4">
                <input
                  type="checkbox"
                  id="corrosionCheck"
                  checked={installation.corrosionCheckPassed}
                  onChange={(e) => setInstallation(prev => ({ ...prev, corrosionCheckPassed: e.target.checked }))}
                  className="w-5 h-5 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="corrosionCheck" className="font-medium text-surface-900">
                  Corrosion check passed
                </label>
              </div>
              {!installation.corrosionCheckPassed && (
                <Textarea
                  label="Corrosion Notes"
                  value={installation.corrosionNotes || ''}
                  onChange={(e) => setInstallation(prev => ({ ...prev, corrosionNotes: e.target.value }))}
                  placeholder="Describe any corrosion findings..."
                />
              )}
            </div>

            <Textarea
              label="Installation Notes"
              value={installation.installerNotes || ''}
              onChange={(e) => setInstallation(prev => ({ ...prev, installerNotes: e.target.value }))}
              placeholder="Any additional notes about the installation..."
            />

            {/* Photo Upload */}
            <PhotoUpload
              label="Installation Photos"
              photos={photos}
              onChange={setPhotos}
              type="installation"
              maxPhotos={10}
            />
          </div>
        )}

        {/* Review Step */}
        {currentStep === 'review' && (
          <div className="space-y-6">
            <CardTitle>Review & Submit</CardTitle>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-surface-50 rounded-xl p-4">
                <h4 className="font-medium text-surface-900 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" /> Customer
                </h4>
                <dl className="space-y-2 text-sm">
                  <div><dt className="text-surface-500">Name</dt><dd className="font-medium">{customer.firstName} {customer.lastName}</dd></div>
                  <div><dt className="text-surface-500">Email</dt><dd>{customer.email}</dd></div>
                  <div><dt className="text-surface-500">Phone</dt><dd>{customer.phone}</dd></div>
                  <div><dt className="text-surface-500">Address</dt><dd>{customer.address}, {customer.suburb} {customer.state} {customer.postcode}</dd></div>
                </dl>
              </div>
              
              <div className="bg-surface-50 rounded-xl p-4">
                <h4 className="font-medium text-surface-900 mb-3 flex items-center gap-2">
                  <Car className="w-4 h-4" /> Vehicle
                </h4>
                <dl className="space-y-2 text-sm">
                  <div><dt className="text-surface-500">Vehicle</dt><dd className="font-medium">{vehicle.year} {vehicle.make} {vehicle.model}</dd></div>
                  <div><dt className="text-surface-500">VIN</dt><dd className="font-mono text-xs">{vehicle.vin}</dd></div>
                  <div><dt className="text-surface-500">Registration</dt><dd>{vehicle.registrationNumber} ({vehicle.registrationState})</dd></div>
                  {vehicle.color && <div><dt className="text-surface-500">Color</dt><dd>{vehicle.color}</dd></div>}
                </dl>
              </div>
              
              <div className="bg-surface-50 rounded-xl p-4 md:col-span-2">
                <h4 className="font-medium text-surface-900 mb-3 flex items-center gap-2">
                  <Wrench className="w-4 h-4" /> Installation
                </h4>
                <dl className="grid md:grid-cols-2 gap-4 text-sm">
                  <div><dt className="text-surface-500">Date</dt><dd className="font-medium">{installation.installationDate}</dd></div>
                  <div><dt className="text-surface-500">Corrosion Check</dt><dd className={installation.corrosionCheckPassed ? 'text-green-600' : 'text-red-600'}>{installation.corrosionCheckPassed ? 'Passed' : 'Issues Found'}</dd></div>
                  <div><dt className="text-surface-500">Serial Numbers</dt><dd>{installation.generatorSerialNumbers.filter(s => s).join(', ')}</dd></div>
                  <div><dt className="text-surface-500">Couplers</dt><dd>{installation.couplerPlacements.length} installed</dd></div>
                  <div><dt className="text-surface-500">Photos</dt><dd>{photos.length} uploaded</dd></div>
                </dl>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-surface-200">
          <Button
            variant="ghost"
            onClick={goToPreviousStep}
            disabled={getCurrentStepIndex() === 0}
            leftIcon={<ChevronLeft className="w-4 h-4" />}
          >
            Previous
          </Button>
          
          {currentStep === 'review' ? (
            <Button
              onClick={handleSubmit}
              isLoading={isSubmitting}
              leftIcon={<CheckCircle className="w-4 h-4" />}
            >
              Submit Warranty
            </Button>
          ) : (
            <Button
              onClick={goToNextStep}
              disabled={!validateStep(currentStep)}
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              Next Step
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

