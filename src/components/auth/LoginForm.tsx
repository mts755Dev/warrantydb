import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button, Input, Card, CardTitle } from '../ui';
import { Mail, Lock, AlertCircle } from 'lucide-react';

interface LoginFormProps {
  portalType: 'admin' | 'installer' | 'customer';
  redirectPath: string;
}

export function LoginForm({ portalType, redirectPath }: LoginFormProps) {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      navigate(redirectPath);
    } else {
      setError(result.error || 'Login failed');
    }
    
    setIsLoading(false);
  };

  const getPortalInfo = () => {
    switch (portalType) {
      case 'admin':
        return {
          title: 'Admin Portal',
          subtitle: 'Access the administrative dashboard',
          color: 'from-primary-600 to-primary-800',
          demoCredentials: { email: 'admin@warrantydb.com.au', password: 'admin123' },
        };
      case 'installer':
        return {
          title: 'Installer Portal',
          subtitle: 'Register warranties and log inspections',
          color: 'from-accent-500 to-accent-700',
          demoCredentials: { email: 'installer@demo.com', password: 'demo123' },
        };
      case 'customer':
        return {
          title: 'Customer Portal',
          subtitle: 'View and manage your warranty',
          color: 'from-green-500 to-green-700',
          demoCredentials: null,
        };
      default:
        return {
          title: 'Login',
          subtitle: '',
          color: 'from-primary-600 to-primary-800',
          demoCredentials: null,
        };
    }
  };

  const info = getPortalInfo();

  const handleDemoClick = () => {
    if (info.demoCredentials) {
      setEmail(info.demoCredentials.email);
      setPassword(info.demoCredentials.password);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${info.color} rounded-2xl flex items-center justify-center shadow-lg`}>
            <Lock className="w-8 h-8 text-white" />
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

            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              leftIcon={<Mail className="w-4 h-4" />}
              autoComplete="email"
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              leftIcon={<Lock className="w-4 h-4" />}
              autoComplete="current-password"
            />

            <Button 
              type="submit" 
              className="w-full" 
              size="lg" 
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>

          {info.demoCredentials && (
            <button
              type="button"
              onClick={handleDemoClick}
              className="mt-6 w-full p-3 bg-surface-50 hover:bg-surface-100 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-surface-200"
            >
              <p className="text-xs text-surface-500 text-center">
                🎯 <span className="font-medium text-surface-600">Click to try demo</span> — {info.demoCredentials.email}
              </p>
            </button>
          )}

          {portalType === 'installer' && (
            <div className="mt-6 text-center">
              <p className="text-sm text-surface-500">
                Don't have an account?{' '}
                <Link 
                  to={`/${portalType}/signup`} 
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Sign up
                </Link>
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

