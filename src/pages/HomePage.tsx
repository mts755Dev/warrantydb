import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui';
import { 
  Shield, 
  Wrench, 
  Users, 
  CheckCircle, 
  ArrowRight,
  Clock,
  Search,
  FileCheck,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  Star,
  Zap,
  Lock,
  BarChart3,
  Car,
  Camera,
  Bell,
} from 'lucide-react';

export function HomePage() {
  return (
    <div className="animate-fade-in -mx-6 -mt-6">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-surface-950">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-900/40 via-surface-950 to-surface-950" />
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface-950 to-transparent" />
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 right-[10%] w-64 h-64 bg-primary-500/10 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-20 left-[5%] w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-pulse-soft animation-delay-500" />
        
        <div className="relative max-w-7xl mx-auto px-6 py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-primary-300 text-sm font-medium mb-8">
                <Shield className="w-4 h-4" />
                Trusted by Installers Across Australia
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-[1.1]">
                Professional Warranty
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-primary-300 to-accent-400">
                  Management System
                </span>
              </h1>
              
              <p className="text-lg text-surface-300 mb-10 max-w-xl leading-relaxed">
                Streamline your warranty registrations, automate inspection reminders, 
                and maintain compliance with Australia's most comprehensive warranty platform.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/installer">
                  <Button size="lg" className="w-full sm:w-auto shadow-lg shadow-primary-500/25" rightIcon={<ArrowRight className="w-5 h-5" />}>
                    Installer Portal
                  </Button>
                </Link>
                <Link to="/customer">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10">
                    Activate Warranty
                  </Button>
                </Link>
              </div>

              {/* Trust Stats */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-8 mt-12 pt-12 border-t border-white/10">
                <div>
                  <div className="text-3xl font-bold text-white">5,000+</div>
                  <div className="text-sm text-surface-400">Warranties Registered</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">500+</div>
                  <div className="text-sm text-surface-400">Licensed Installers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">99.9%</div>
                  <div className="text-sm text-surface-400">Uptime Reliability</div>
                </div>
              </div>
            </div>

            {/* Right Side - Feature Preview */}
            <div className="hidden lg:block relative">
              <div className="relative">
                {/* Main Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">Warranty Dashboard</div>
                      <div className="text-surface-400 text-sm">Real-time overview</div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        </div>
                        <span className="text-white text-sm">Active Warranties</span>
                      </div>
                      <span className="text-green-400 font-semibold">2,847</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                          <Clock className="w-4 h-4 text-yellow-400" />
                        </div>
                        <span className="text-white text-sm">Pending Activation</span>
                      </div>
                      <span className="text-yellow-400 font-semibold">156</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                          <Bell className="w-4 h-4 text-orange-400" />
                        </div>
                        <span className="text-white text-sm">Inspections Due</span>
                      </div>
                      <span className="text-orange-400 font-semibold">89</span>
                    </div>
                  </div>
                </div>

                {/* Floating Badge */}
                <div className="absolute -top-4 -right-4 bg-gradient-to-br from-accent-500 to-accent-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Real-time Updates
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-16 bg-surface-50 border-b border-surface-200">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-surface-500 text-sm font-medium uppercase tracking-wider mb-8">
            Trusted by Leading Automotive Businesses Across Australia
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
            {['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS'].map((state) => (
              <div key={state} className="flex items-center gap-2 text-surface-400">
                <MapPin className="w-4 h-4" />
                <span className="font-semibold">{state}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full text-primary-600 text-sm font-medium mb-4">
              <Zap className="w-4 h-4" />
              Simple Process
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-surface-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-surface-600 max-w-2xl mx-auto">
              Get started in minutes with our streamlined warranty management process
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                icon: <Wrench className="w-6 h-6" />,
                title: 'Install & Register',
                description: 'Complete the installation and register the warranty with customer and vehicle details.',
              },
              {
                step: '02',
                icon: <FileCheck className="w-6 h-6" />,
                title: 'Generate Code',
                description: 'System generates a unique activation code for the customer.',
              },
              {
                step: '03',
                icon: <CheckCircle className="w-6 h-6" />,
                title: 'Customer Activates',
                description: 'Customer enters their code to activate the warranty coverage.',
              },
              {
                step: '04',
                icon: <Bell className="w-6 h-6" />,
                title: 'Auto Reminders',
                description: 'Automatic inspection reminders sent every 12 months.',
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                {index < 3 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] border-t-2 border-dashed border-surface-200" />
                )}
                <div className="relative bg-white">
                  <div className="text-6xl font-display font-bold text-surface-100 mb-4">{item.step}</div>
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-surface-900 mb-2">{item.title}</h3>
                  <p className="text-surface-600 text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-surface-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-50 rounded-full text-accent-600 text-sm font-medium mb-4">
              <Star className="w-4 h-4" />
              Comprehensive Features
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-surface-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-surface-600 max-w-2xl mx-auto">
              A complete solution designed for installers, customers, and administrators
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Car className="w-6 h-6" />}
              title="Vehicle Management"
              description="Track vehicles by VIN, registration, make, model, and complete service history."
              gradient="from-blue-500 to-blue-600"
            />
            <FeatureCard
              icon={<Camera className="w-6 h-6" />}
              title="Photo Documentation"
              description="Upload and store installation and inspection photos for complete records."
              gradient="from-purple-500 to-purple-600"
            />
            <FeatureCard
              icon={<Search className="w-6 h-6" />}
              title="Powerful Search"
              description="Find any warranty instantly by customer name, VIN, rego, or activation code."
              gradient="from-green-500 to-green-600"
            />
            <FeatureCard
              icon={<Mail className="w-6 h-6" />}
              title="Automated Emails"
              description="Customizable email templates for activation confirmations and inspection reminders."
              gradient="from-pink-500 to-pink-600"
            />
            <FeatureCard
              icon={<BarChart3 className="w-6 h-6" />}
              title="Reports & Analytics"
              description="Comprehensive dashboards and exportable reports for business insights."
              gradient="from-amber-500 to-amber-600"
            />
            <FeatureCard
              icon={<Lock className="w-6 h-6" />}
              title="Secure & Compliant"
              description="Role-based access control with admin, installer, and viewer permissions."
              gradient="from-teal-500 to-teal-600"
            />
          </div>
        </div>
      </section>

      {/* Portal Access Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-surface-900 mb-4">
              Access Your Portal
            </h2>
            <p className="text-lg text-surface-600 max-w-2xl mx-auto">
              Choose the appropriate portal based on your role
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <PortalCard
              icon={<Wrench className="w-8 h-8" />}
              title="Installer Portal"
              description="Register warranties, log inspections, search records, and manage your installation business."
              link="/installer"
              features={['Warranty Registration', 'Inspection Logging', 'Photo Uploads', 'Search System']}
              color="accent"
            />
            <PortalCard
              icon={<Shield className="w-8 h-8" />}
              title="Customer Portal"
              description="Activate your warranty using the code provided by your installer."
              link="/customer"
              features={['Easy Activation', 'Warranty Details', 'Inspection History', 'Email Reminders']}
              color="green"
              featured
            />
            <PortalCard
              icon={<Users className="w-8 h-8" />}
              title="Admin Portal"
              description="Full system administration, user management, and comprehensive reporting."
              link="/admin"
              features={['User Management', 'System Settings', 'Email Templates', 'Data Export']}
              color="primary"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-surface-900 via-surface-900 to-primary-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-500/20 rounded-full blur-3xl" />
        
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-primary-300 text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Get Started Today
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
            Ready to Streamline Your<br />Warranty Management?
          </h2>
          <p className="text-lg text-surface-300 mb-10 max-w-2xl mx-auto">
            Join hundreds of installers already using WarrantyDB to manage their warranty registrations and inspections efficiently.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/installer/signup">
              <Button size="lg" className="w-full sm:w-auto shadow-lg shadow-primary-500/25">
                Register as Installer
              </Button>
            </Link>
            <Link to="/admin">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10">
                Admin Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <span className="font-display font-bold text-2xl">WarrantyDB</span>
              </div>
              <p className="text-surface-400 leading-relaxed mb-6 max-w-sm">
                Australia's premier warranty registration and inspection management system 
                for licensed automotive installers.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                  <Mail className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                  <Phone className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/installer" className="text-surface-400 hover:text-white transition-colors flex items-center gap-2">
                    <ChevronRight className="w-4 h-4" /> Installer Portal
                  </Link>
                </li>
                <li>
                  <Link to="/customer" className="text-surface-400 hover:text-white transition-colors flex items-center gap-2">
                    <ChevronRight className="w-4 h-4" /> Activate Warranty
                  </Link>
                </li>
                <li>
                  <Link to="/admin" className="text-surface-400 hover:text-white transition-colors flex items-center gap-2">
                    <ChevronRight className="w-4 h-4" /> Admin Portal
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Contact</h4>
              <ul className="space-y-3 text-surface-400">
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-primary-400" />
                  support@warrantydb.com.au
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-primary-400" />
                  1300 WARRANTY
                </li>
                <li className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-primary-400" />
                  Australia-Wide Service
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-surface-500 text-sm">
              © {new Date().getFullYear()} WarrantyDB. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-surface-500">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}

function FeatureCard({ icon, title, description, gradient }: FeatureCardProps) {
  return (
    <div className="group bg-white rounded-2xl p-6 shadow-sm border border-surface-200 hover:shadow-xl hover:border-surface-300 transition-all duration-300">
      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform shadow-lg`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-surface-900 mb-2">{title}</h3>
      <p className="text-surface-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

interface PortalCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  features: string[];
  color: 'primary' | 'accent' | 'green';
  featured?: boolean;
}

function PortalCard({ icon, title, description, link, features, color, featured }: PortalCardProps) {
  const colorClasses = {
    primary: {
      bg: 'from-primary-500 to-primary-700',
      border: 'border-primary-200',
      text: 'text-primary-600',
      bullet: 'bg-primary-500',
    },
    accent: {
      bg: 'from-accent-500 to-accent-700',
      border: 'border-accent-200',
      text: 'text-accent-600',
      bullet: 'bg-accent-500',
    },
    green: {
      bg: 'from-green-500 to-green-700',
      border: 'border-green-200',
      text: 'text-green-600',
      bullet: 'bg-green-500',
    },
  };

  const colors = colorClasses[color];

  return (
    <Link to={link} className="block group">
      <div className={`relative h-full bg-white rounded-2xl p-8 border-2 ${featured ? colors.border : 'border-surface-200'} hover:border-surface-300 shadow-sm hover:shadow-xl transition-all duration-300 ${featured ? 'ring-2 ring-green-500/20' : ''}`}>
        {featured && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
            Most Popular
          </div>
        )}
        <div className={`w-16 h-16 bg-gradient-to-br ${colors.bg} rounded-2xl flex items-center justify-center text-white shadow-lg mb-6 group-hover:scale-105 transition-transform`}>
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-surface-900 mb-3">{title}</h3>
        <p className="text-surface-600 mb-6">{description}</p>
        
        <ul className="space-y-3 mb-8">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-3 text-sm text-surface-600">
              <div className={`w-1.5 h-1.5 rounded-full ${colors.bullet}`} />
              {feature}
            </li>
          ))}
        </ul>

        <div className={`flex items-center gap-2 ${colors.text} font-semibold group-hover:gap-3 transition-all`}>
          Enter Portal
          <ArrowRight className="w-5 h-5" />
        </div>
      </div>
    </Link>
  );
}
