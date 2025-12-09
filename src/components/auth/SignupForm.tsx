import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button, Input, Select, Card } from '../ui';
import { Mail, Lock, User, Building2, Phone, MapPin, AlertCircle, FileText } from 'lucide-react';
import { australianStates, isValidEmail } from '../../utils/helpers';
import type { UserRole, AustralianState } from '../../types';

interface SignupFormProps {
  portalType: 'admin' | 'installer';
  redirectPath: string;
}

export function SignupForm({ portalType, redirectPath }: SignupFormProps) {
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    companyName: '',
    licenseNumber: '',
    address: '',
    state: '' as AustralianState | '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!isValidEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (portalType === 'installer' && !formData.licenseNumber) {
      setError('License number is required for installers');
      return;
    }

    setIsLoading(true);

    const role: UserRole = portalType === 'admin' ? 'admin' : 'installer';
    
    const result = await register({
      email: formData.email,
      password: formData.password,
      name: formData.name,
      role,
      phone: formData.phone || undefined,
      companyName: formData.companyName || undefined,
      licenseNumber: formData.licenseNumber || undefined,
      address: formData.address || undefined,
      state: formData.state || undefined,
    });
    
    if (result.success) {
      navigate(redirectPath);
    } else {
      setError(result.error || 'Registration failed');
    }
    
    setIsLoading(false);
  };

  const getPortalInfo = () => {
    switch (portalType) {
      case 'admin':
        return {
          title: 'Create Admin Account',
          subtitle: 'Set up your administrator account',
          color: 'from-primary-600 to-primary-800',
        };
      case 'installer':
        return {
          title: 'Installer Registration',
          subtitle: 'Create your licensed installer account',
          color: 'from-accent-500 to-accent-700',
        };
      default:
        return {
          title: 'Sign Up',
          subtitle: '',
          color: 'from-primary-600 to-primary-800',
        };
    }
  };

  const info = getPortalInfo();

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${info.color} rounded-2xl flex items-center justify-center shadow-lg`}>
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold text-surface-900">{info.title}</h1>
          <p className="text-surface-500 mt-2">{info.subtitle}</p>
        </div>

        <Card className="animate-fade-in">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="John Smith"
                required
                leftIcon={<User className="w-4 h-4" />}
              />

              <Input
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="you@example.com"
                required
                leftIcon={<Mail className="w-4 h-4" />}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="••••••••"
                required
                leftIcon={<Lock className="w-4 h-4" />}
                hint="At least 6 characters"
              />

              <Input
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                placeholder="••••••••"
                required
                leftIcon={<Lock className="w-4 h-4" />}
              />
            </div>

            <Input
              label="Phone Number"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="0400 000 000"
              leftIcon={<Phone className="w-4 h-4" />}
            />

            {portalType === 'installer' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Company Name"
                    value={formData.companyName}
                    onChange={(e) => handleChange('companyName', e.target.value)}
                    placeholder="Your Auto Electrical"
                    required
                    leftIcon={<Building2 className="w-4 h-4" />}
                  />

                  <Input
                    label="License Number"
                    value={formData.licenseNumber}
                    onChange={(e) => handleChange('licenseNumber', e.target.value)}
                    placeholder="LIC-XXXXX"
                    required
                    leftIcon={<FileText className="w-4 h-4" />}
                  />
                </div>

                <Input
                  label="Business Address"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="123 Main Street, Sydney"
                  leftIcon={<MapPin className="w-4 h-4" />}
                />

                <Select
                  label="State"
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  options={australianStates}
                  placeholder="Select your state"
                />
              </>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              size="lg" 
              isLoading={isLoading}
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-surface-500">
              Already have an account?{' '}
              <Link 
                to={`/${portalType}`} 
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

