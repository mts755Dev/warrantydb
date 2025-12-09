import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardTitle, Button, Input } from '../../components/ui';
import { warrantyStorage, settingsStorage } from '../../utils/storage';
import { calculateExpiryDate, calculateNextInspectionDate, formatDate } from '../../utils/helpers';
import { emailService } from '../../utils/email';
import type { Warranty } from '../../types';
import {
  Shield,
  CheckCircle,
  AlertCircle,
  Key,
  Loader2,
} from 'lucide-react';

export function CustomerPortal() {
  const navigate = useNavigate();
  const [activationCode, setActivationCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activatedWarranty, setActivatedWarranty] = useState<Warranty | null>(null);

  const handleActivate = async () => {
    if (!activationCode.trim()) {
      setError('Please enter your activation code');
      return;
    }

    setError('');
    setIsLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const warranty = warrantyStorage.getByActivationCode(activationCode.trim());

    if (!warranty) {
      setError('Invalid activation code. Please check and try again.');
      setIsLoading(false);
      return;
    }

    if (warranty.status === 'activated') {
      setError('This warranty has already been activated.');
      setIsLoading(false);
      return;
    }

    if (warranty.status === 'voided') {
      setError('This warranty has been voided. Please contact support.');
      setIsLoading(false);
      return;
    }

    // Activate the warranty
    const settings = settingsStorage.get();
    const now = new Date().toISOString();
    
    const updatedWarranty: Warranty = {
      ...warranty,
      status: 'activated',
      activatedAt: now,
      expiresAt: calculateExpiryDate(now, settings.warrantyDurationYears),
      nextInspectionDue: calculateNextInspectionDate(now, settings.inspectionIntervalMonths),
    };

    warrantyStorage.update(updatedWarranty);
    
    // Send activation confirmation email
    const activationEmail = emailService.createActivationEmail(updatedWarranty);
    if (activationEmail) {
      // In a real app, this would send immediately
      console.log('Activation email would be sent:', activationEmail);
    }

    // Schedule first inspection reminder
    emailService.createInspectionReminder(updatedWarranty);

    setActivatedWarranty(updatedWarranty);
    setIsLoading(false);
  };

  // Success State
  if (activatedWarranty) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 animate-fade-in">
        <div className="w-full max-w-2xl">
          <Card className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            
            <h1 className="text-3xl font-display font-bold text-surface-900 mb-2">
              Warranty Activated!
            </h1>
            <p className="text-surface-600 mb-8">
              Your warranty has been successfully activated. Here are your warranty details.
            </p>

            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-6 mb-8 text-left">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-primary-600 font-medium">Customer</p>
                  <p className="text-lg font-semibold text-surface-900">
                    {activatedWarranty.customer.firstName} {activatedWarranty.customer.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-primary-600 font-medium">Activation Code</p>
                  <p className="text-lg font-mono font-bold text-primary-700">
                    {activatedWarranty.activationCode}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-primary-600 font-medium">Vehicle</p>
                  <p className="text-lg font-semibold text-surface-900">
                    {activatedWarranty.vehicle.year} {activatedWarranty.vehicle.make} {activatedWarranty.vehicle.model}
                  </p>
                  <p className="text-sm text-surface-600">Rego: {activatedWarranty.vehicle.registrationNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-primary-600 font-medium">Warranty Valid Until</p>
                  <p className="text-lg font-semibold text-surface-900">
                    {formatDate(activatedWarranty.expiresAt || '')}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-surface-50 rounded-xl p-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-surface-900">Annual Inspection Required</p>
                  <p className="text-sm text-surface-600">
                    To maintain your warranty coverage, please complete an annual inspection. 
                    Your first inspection is due by <strong>{formatDate(activatedWarranty.nextInspectionDue || '')}</strong>.
                    You will receive an email reminder before it's due.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline" 
                onClick={() => {
                  setActivatedWarranty(null);
                  setActivationCode('');
                }}
              >
                Activate Another
              </Button>
              <Button onClick={() => window.print()}>
                Print Certificate
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center shadow-lg">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold text-surface-900">
            Activate Your Warranty
          </h1>
          <p className="text-surface-500 mt-2">
            Enter the activation code provided by your installer
          </p>
        </div>

        <Card>
          <div className="space-y-6">
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Activation Code
              </label>
              <Input
                value={activationCode}
                onChange={(e) => setActivationCode(e.target.value.toUpperCase())}
                placeholder="Enter 8-character code"
                leftIcon={<Key className="w-4 h-4" />}
                className="text-center text-xl tracking-widest font-mono uppercase"
                maxLength={8}
              />
              <p className="mt-2 text-sm text-surface-500 text-center">
                Example: ABC12DEF
              </p>
            </div>

            <Button
              onClick={handleActivate}
              className="w-full"
              size="lg"
              disabled={isLoading || activationCode.length < 8}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Activating...
                </>
              ) : (
                'Activate Warranty'
              )}
            </Button>
          </div>

          <div className="mt-8 pt-6 border-t border-surface-200">
            <h3 className="font-medium text-surface-900 mb-4">How it works</h3>
            <ol className="space-y-4">
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-medium flex-shrink-0">1</span>
                <span className="text-sm text-surface-600">Get your activation code from your installer after installation</span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-medium flex-shrink-0">2</span>
                <span className="text-sm text-surface-600">Enter the code above to activate your warranty</span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-medium flex-shrink-0">3</span>
                <span className="text-sm text-surface-600">Receive confirmation and inspection reminder emails</span>
              </li>
            </ol>
          </div>
        </Card>

        <p className="text-center text-sm text-surface-500 mt-6">
          Need help? Contact your installer or our support team.
        </p>
      </div>
    </div>
  );
}

