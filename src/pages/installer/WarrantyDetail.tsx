import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardTitle, Button, Badge, Modal } from '../../components/ui';
import { warrantyStorage } from '../../utils/storage';
import { formatDate, getWarrantyStatusDisplay } from '../../utils/helpers';
import type { Warranty } from '../../types';
import {
  ArrowLeft,
  User,
  Car,
  Wrench,
  Calendar,
  ClipboardCheck,
  Copy,
  CheckCircle,
  Image as ImageIcon,
  MapPin,
  Mail,
  Phone,
  AlertTriangle,
} from 'lucide-react';

export function WarrantyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [warranty, setWarranty] = useState<Warranty | null>(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  useEffect(() => {
    if (id) {
      const found = warrantyStorage.getById(id);
      setWarranty(found || null);
    }
  }, [id]);

  if (!warranty) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-16 h-16 mx-auto text-surface-300 mb-4" />
        <h2 className="text-xl font-semibold text-surface-900 mb-2">Warranty Not Found</h2>
        <p className="text-surface-500 mb-6">The warranty you're looking for doesn't exist.</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const status = getWarrantyStatusDisplay(warranty);
  const photos = warranty.installation.photos || [];

  const copyActivationCode = () => {
    navigator.clipboard.writeText(warranty.activationCode);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-display font-bold text-surface-900">
                Warranty Details
              </h1>
              <Badge className={`${status.bgColor} ${status.color}`}>
                {status.text}
              </Badge>
            </div>
            <p className="text-surface-500">Created on {formatDate(warranty.createdAt)}</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Link to={`/installer/inspection?warranty=${warranty.id}`}>
            <Button variant="outline" leftIcon={<ClipboardCheck className="w-4 h-4" />}>
              Log Inspection
            </Button>
          </Link>
        </div>
      </div>

      {/* Activation Code Card */}
      <Card className="bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-primary-600 font-medium">Activation Code</p>
            <p className="text-3xl font-mono font-bold text-primary-700 tracking-wider mt-1">
              {warranty.activationCode}
            </p>
          </div>
          <Button variant="outline" onClick={copyActivationCode} leftIcon={<Copy className="w-4 h-4" />}>
            Copy Code
          </Button>
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Customer Details */}
        <Card>
          <CardTitle subtitle="Customer information">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary-600" />
              Customer Details
            </div>
          </CardTitle>
          <dl className="space-y-4 mt-4">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-surface-400 mt-0.5" />
              <div>
                <dt className="text-sm text-surface-500">Full Name</dt>
                <dd className="font-medium text-surface-900">
                  {warranty.customer.firstName} {warranty.customer.lastName}
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-surface-400 mt-0.5" />
              <div>
                <dt className="text-sm text-surface-500">Email</dt>
                <dd className="font-medium text-surface-900">{warranty.customer.email}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-surface-400 mt-0.5" />
              <div>
                <dt className="text-sm text-surface-500">Phone</dt>
                <dd className="font-medium text-surface-900">{warranty.customer.phone}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-surface-400 mt-0.5" />
              <div>
                <dt className="text-sm text-surface-500">Address</dt>
                <dd className="font-medium text-surface-900">
                  {warranty.customer.address}<br />
                  {warranty.customer.suburb}, {warranty.customer.state} {warranty.customer.postcode}
                </dd>
              </div>
            </div>
          </dl>
        </Card>

        {/* Vehicle Details */}
        <Card>
          <CardTitle subtitle="Vehicle information">
            <div className="flex items-center gap-2">
              <Car className="w-5 h-5 text-primary-600" />
              Vehicle Details
            </div>
          </CardTitle>
          <dl className="space-y-4 mt-4">
            <div>
              <dt className="text-sm text-surface-500">Vehicle</dt>
              <dd className="font-medium text-surface-900">
                {warranty.vehicle.year} {warranty.vehicle.make} {warranty.vehicle.model}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-surface-500">VIN</dt>
              <dd className="font-mono text-sm text-surface-900">{warranty.vehicle.vin}</dd>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-surface-500">Registration</dt>
                <dd className="font-medium text-surface-900">{warranty.vehicle.registrationNumber}</dd>
              </div>
              <div>
                <dt className="text-sm text-surface-500">State</dt>
                <dd className="font-medium text-surface-900">{warranty.vehicle.registrationState}</dd>
              </div>
            </div>
            {warranty.vehicle.color && (
              <div>
                <dt className="text-sm text-surface-500">Color</dt>
                <dd className="font-medium text-surface-900">{warranty.vehicle.color}</dd>
              </div>
            )}
          </dl>
        </Card>

        {/* Installation Details */}
        <Card className="lg:col-span-2">
          <CardTitle subtitle="Installation records">
            <div className="flex items-center gap-2">
              <Wrench className="w-5 h-5 text-primary-600" />
              Installation Details
            </div>
          </CardTitle>
          <div className="grid md:grid-cols-2 gap-6 mt-4">
            <dl className="space-y-4">
              <div>
                <dt className="text-sm text-surface-500">Installation Date</dt>
                <dd className="font-medium text-surface-900">{formatDate(warranty.installation.installationDate)}</dd>
              </div>
              <div>
                <dt className="text-sm text-surface-500">Installer</dt>
                <dd className="font-medium text-surface-900">{warranty.installerName}</dd>
                <dd className="text-sm text-surface-500">{warranty.installerCompany}</dd>
              </div>
              <div>
                <dt className="text-sm text-surface-500">Generator Serial Numbers</dt>
                <dd className="font-mono text-sm space-y-1">
                  {warranty.installation.generatorSerialNumbers.map((sn, i) => (
                    <span key={i} className="block text-surface-900">{sn}</span>
                  ))}
                </dd>
              </div>
            </dl>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm text-surface-500">Corrosion Check</dt>
                <dd className={`font-medium flex items-center gap-2 ${warranty.installation.corrosionCheckPassed ? 'text-green-600' : 'text-red-600'}`}>
                  {warranty.installation.corrosionCheckPassed ? (
                    <><CheckCircle className="w-4 h-4" /> Passed</>
                  ) : (
                    <><AlertTriangle className="w-4 h-4" /> Issues Found</>
                  )}
                </dd>
                {warranty.installation.corrosionNotes && (
                  <dd className="text-sm text-surface-600 mt-1">{warranty.installation.corrosionNotes}</dd>
                )}
              </div>
              <div>
                <dt className="text-sm text-surface-500">Couplers Installed</dt>
                <dd className="font-medium text-surface-900">{warranty.installation.couplerCount}</dd>
              </div>
              {warranty.installation.installerNotes && (
                <div>
                  <dt className="text-sm text-surface-500">Notes</dt>
                  <dd className="text-surface-900">{warranty.installation.installerNotes}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Photos */}
          {photos.length > 0 && (
            <div className="mt-6 pt-6 border-t border-surface-200">
              <h4 className="font-medium text-surface-900 mb-4 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" /> Installation Photos ({photos.length})
              </h4>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {photos.map((photo, index) => (
                  <button
                    key={photo.id}
                    onClick={() => {
                      setSelectedPhotoIndex(index);
                      setShowPhotoModal(true);
                    }}
                    className="aspect-square rounded-lg overflow-hidden border border-surface-200 hover:border-primary-400 transition-colors"
                  >
                    <img src={photo.url} alt={photo.filename} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Inspection History */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <CardTitle subtitle={`${warranty.inspections.length} inspections recorded`}>
              <div className="flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-primary-600" />
                Inspection History
              </div>
            </CardTitle>
            <Link to={`/installer/inspection?warranty=${warranty.id}`}>
              <Button size="sm">Log New Inspection</Button>
            </Link>
          </div>
          
          {warranty.inspections.length === 0 ? (
            <div className="text-center py-8 bg-surface-50 rounded-xl">
              <Calendar className="w-12 h-12 mx-auto text-surface-300 mb-3" />
              <p className="text-surface-500">No inspections recorded yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {warranty.inspections.map(inspection => (
                <div key={inspection.id} className="p-4 bg-surface-50 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${inspection.passed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {inspection.passed ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-medium text-surface-900">{formatDate(inspection.inspectionDate)}</p>
                        <p className="text-sm text-surface-500">By {inspection.inspectorName}</p>
                      </div>
                    </div>
                    <Badge variant={inspection.passed ? 'success' : 'danger'}>
                      {inspection.passed ? 'Passed' : 'Failed'}
                    </Badge>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-surface-500">Overall Condition:</span>
                      <span className="ml-2 capitalize">{inspection.overallCondition}</span>
                    </div>
                    <div>
                      <span className="text-surface-500">Corrosion:</span>
                      <span className="ml-2 capitalize">{inspection.corrosionSeverity || 'None'}</span>
                    </div>
                  </div>
                  {inspection.findings && (
                    <p className="mt-3 text-sm text-surface-600">{inspection.findings}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Photo Modal */}
      <Modal isOpen={showPhotoModal} onClose={() => setShowPhotoModal(false)} size="xl">
        {photos[selectedPhotoIndex] && (
          <div>
            <img
              src={photos[selectedPhotoIndex].url}
              alt={photos[selectedPhotoIndex].filename}
              className="w-full max-h-[70vh] object-contain rounded-lg"
            />
            <div className="flex justify-center gap-2 mt-4">
              {photos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedPhotoIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === selectedPhotoIndex ? 'bg-primary-600' : 'bg-surface-300 hover:bg-surface-400'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

