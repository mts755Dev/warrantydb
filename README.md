# WarrantyDB - Australian Warranty Registration & Inspection System

A comprehensive warranty registration and inspection management system built for licensed installers across Australia. This system enables warranty registration, customer activation, annual inspection tracking, and full administrative control.

## Features

### 🔧 Installer Portal (`/installer`)
- **User Registration/Login** - Licensed installers can create accounts and securely log in
- **Warranty Registration** - Multi-step form to register new warranties with:
  - Customer details (name, email, phone, address)
  - Vehicle details (make, model, year, VIN, registration)
  - Installation details (date, serial numbers, coupler placements)
  - Corrosion checks
  - Photo uploads
- **Activation Code Generation** - Unique 8-character codes generated for customers
- **Warranty Management** - View and manage all registered warranties
- **Inspection Logging** - Record annual inspections with findings and photos
- **Search** - Find warranties by customer name, VIN, registration, or activation code

### 👤 Customer Portal (`/customer`)
- **Warranty Activation** - Customers enter their activation code to activate warranty
- **Confirmation** - Receive warranty details and next inspection due date
- **Email Reminders** - Automatic inspection reminders every 12 months

### 🛡️ Admin Portal (`/admin`)
- **Dashboard** - Overview of system stats, pending activations, inspections due
- **Warranty Management** - View, search, void, or delete warranties
- **Installer Management** - Activate/deactivate installer accounts
- **Inspection Tracking** - Monitor overdue and upcoming inspections
- **Email Templates** - Customize email content for automated reminders
- **System Settings** - Configure warranty duration, inspection intervals, reminders
- **Search System** - Powerful search across all warranty records
- **Data Export** - Export search results to CSV

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Routing**: React Router v6
- **State**: React Context API
- **Storage**: Local Storage (for demo; ready for backend integration)
- **Icons**: Lucide React
- **Dates**: date-fns
- **Build**: Vite

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Clone or navigate to the project
cd WarrantyDB

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Default Login Credentials

**Admin Portal:**
- Email: `admin@warrantydb.com.au`
- Password: `admin123`

**Installer Portal (Demo):**
- Email: `installer@demo.com`
- Password: `demo123`

## Project Structure

```
src/
├── components/
│   ├── auth/        # Authentication components
│   ├── layout/      # Layout components (Navbar, Sidebar)
│   └── ui/          # Reusable UI components
├── contexts/        # React contexts (Auth)
├── pages/
│   ├── admin/       # Admin portal pages
│   ├── customer/    # Customer portal pages
│   └── installer/   # Installer portal pages
├── types/           # TypeScript type definitions
└── utils/           # Utility functions & storage
```

## Key Workflows

### 1. Warranty Registration Flow
1. Installer logs into the Installer Portal
2. Navigates to "Register New Warranty"
3. Completes multi-step form (Customer → Vehicle → Installation → Review)
4. System generates unique activation code
5. Installer provides code to customer

### 2. Warranty Activation Flow
1. Customer visits Customer Portal (`/customer`)
2. Enters 8-character activation code
3. Warranty is activated with expiry date set
4. Next inspection due date calculated
5. Email reminders scheduled

### 3. Inspection Flow
1. Customer receives inspection reminder email
2. Returns to installer for inspection
3. Installer logs in and navigates to "Log Inspection"
4. Searches for warranty and records findings
5. Next inspection date automatically scheduled

### 4. Search System
- All stores can search warranties by:
  - Customer name
  - Vehicle VIN
  - Registration number
  - Activation code
- Results show full warranty record and inspection history

## Email Automation

The system includes a simulated email automation system that:
- Sends inspection reminders X days before due date (configurable)
- Sends warranty activation confirmations
- Templates are fully customizable in Admin Portal
- Supports variable substitution ({{customerName}}, {{vehicleMake}}, etc.)

**Note**: Email sending is simulated in this demo. For production, integrate with SendGrid, AWS SES, or similar email service.

## Data Storage

Currently uses browser Local Storage for data persistence. For production deployment:
- Replace storage utilities with API calls
- Implement proper backend with database (PostgreSQL, MongoDB, etc.)
- Add proper authentication (JWT, OAuth)
- Implement actual email service integration

## Customization

### Warranty Settings (Admin → Settings)
- Warranty duration (years)
- Inspection interval (months)
- Reminder days before due
- Enable/disable email/SMS reminders
- Auto-activate warranties option

### Email Templates (Admin → Email Templates)
- Inspection due reminder
- Warranty activation confirmation
- Custom variable support

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Proprietary - All rights reserved.

---

Built with ❤️ for Australian installers

