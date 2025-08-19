# Voice Assistant Project Index

## Project Overview

A React-based voice assistant management system built with TypeScript, Vite, and Tailwind CSS. The application provides a comprehensive dashboard for managing call center operations, including call tracking, manager performance, user management, and AI-powered analytics.

## Technology Stack

- **Frontend Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 6.0.5
- **Styling**: Tailwind CSS 4.0.0 with PostCSS
- **Routing**: React Router DOM 7.8.1
- **State Management**: Zustand 5.0.3
- **UI Components**: Custom components with Framer Motion animations
- **Charts**: Recharts 3.1.2
- **Icons**: React Icons 5.5.0
- **Development**: ESLint, TypeScript ESLint

## Project Structure

### Core Application Files

```
src/
├── main.tsx                 # Application entry point
├── index.css               # Global styles
├── vite-env.d.ts           # Vite type definitions
└── router/
    └── index.tsx           # Application routing configuration
```

### Layout & Navigation

```
src/components/layout/
├── index.tsx               # Main layout wrapper with Outlet
└── header.tsx              # Navigation header with mobile menu
```

### UI Components

```
src/components/ui/
├── button.tsx              # Reusable button component with variants
├── input.tsx               # Input component with password toggle
├── dropdown.tsx            # Dropdown/select component
├── datepicker.tsx          # Date picker component
└── modal.tsx               # Modal dialog component
```

### Pages & Features

#### Authentication

```
src/pages/auth/
├── index.tsx               # Login page with email/password
└── components/             # Auth-specific components
```

#### Dashboard

```
src/pages/dashboard/
├── index.tsx               # Main dashboard with analytics
└── components/
    ├── StatusBar.tsx       # Key metrics display
    ├── CallDynamics.tsx    # Call trends chart
    ├── CallDynamicsChart.tsx # Chart implementation
    ├── RejectionReasons.tsx # Rejection analysis
    ├── RejectionReasonsChart.tsx # Chart implementation
    ├── ManagerPerformance.tsx # Manager rankings
    ├── ManagerPerformanceBars.tsx # Performance bars
    └── StatusBar.tsx       # Status indicators
```

#### Call Management

```
src/pages/calls/
└── index.tsx               # Call records with filtering and pagination
```

#### Manager Management

```
src/pages/managers/
├── index.tsx               # Manager list with performance metrics
├── [id].tsx                # Individual manager details page
└── components/
    ├── AddManagerModal.tsx # Add new manager modal
    └── dynamic-page/
        ├── LastCalls.tsx   # Recent calls for manager
        └── UserInfo.tsx    # Manager profile information
```

#### Process Management

```
src/pages/processes/
├── index.tsx               # Process monitoring and task management
└── icons.tsx               # Process-specific icons
```

#### User Management

```
src/pages/users/
├── index.tsx               # User list with CRUD operations
└── components/
    ├── UsersTable.tsx      # User data table
    ├── Pagination.tsx      # Reusable pagination component
    ├── AddUserModal.tsx    # Add user modal
    ├── EditUserModal.tsx   # Edit user modal
    └── DeleteUserModal.tsx # Delete confirmation modal
```

#### Settings

```
src/pages/settings/
├── index.tsx               # System settings and AI prompts
└── components/
    ├── AddSettingModal.tsx # Add setting modal
    └── EditSettingModal.tsx # Edit setting modal
```

### Assets

```
src/assets/
├── bg.webp                 # Background image for auth page
├── logo.svg                # Main application logo
└── logo_vector.svg         # Vector version of logo
```

## Key Features

### 1. Authentication System

- Email/password login
- Local storage-based session management
- Protected routes with authentication checks
- Automatic redirect to login for unauthenticated users

### 2. Dashboard Analytics

- **Call Statistics**: Total calls, rejections, average duration, AI ratings
- **Call Dynamics**: Weekly call volume trends
- **Rejection Analysis**: Breakdown of rejection reasons
- **Manager Performance**: Top and bottom performing managers
- **Real-time Updates**: Last update timestamps

### 3. Call Management

- **Call Records**: Detailed call information with filtering
- **Search & Filter**: By ID, phone number, manager, verification status
- **AI Rating System**: 1-10 scale with color coding
- **Status Tracking**: Active, Success, Rejection, No Response
- **Responsive Design**: Desktop table and mobile card views

### 4. Manager Management

- **Performance Metrics**: Call volume, average duration, AI ratings
- **Individual Profiles**: Detailed manager pages with call history
- **Top Reasons**: Most common rejection reasons per manager
- **CRM Integration**: CRM ID tracking

### 5. Process Monitoring

- **Task Pipeline**: Voice-to-text, AI analysis, Telegram notifications
- **Status Tracking**: In Progress, Success, Error states
- **Progress Statistics**: Completion percentages for each stage
- **Date Filtering**: Date range selection for process history

### 6. User Management

- **CRUD Operations**: Create, read, update, delete users
- **Online Status**: Real-time online/offline indicators
- **Last Login Tracking**: User activity monitoring
- **Search & Pagination**: Efficient data browsing

### 7. System Settings

- **AI Prompt Management**: Customizable AI prompts for call analysis
- **Status Configuration**: Call status definitions
- **Active/Inactive Toggles**: Enable/disable settings
- **Field Mapping**: CRM field ID associations

## Design System

### Color Palette

- **Primary**: #739C9C (Teal)
- **Success**: #62B245 (Green)
- **Warning**: #B2A945 (Yellow)
- **Error**: #B24545 (Red)
- **Neutral**: #9A9A9A (Gray)
- **Background**: #EBF0F0 (Light Gray)

### Typography

- **Headings**: Font-semibold with responsive sizing
- **Body Text**: Regular weight with consistent line heights
- **Labels**: Smaller text with muted colors

### Component Patterns

- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Consistent padding and hover states
- **Forms**: Unified input styling with validation states
- **Tables**: Clean borders with hover effects

## Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: sm, md, lg, xl, 2xl
- **Flexible Layouts**: Grid and flexbox for adaptive layouts
- **Touch Friendly**: Appropriate touch targets and spacing

## State Management

- **Local State**: React useState for component-level state
- **URL State**: React Router for navigation state
- **Persistent State**: localStorage for authentication
- **Future**: Zustand ready for global state management

## Performance Optimizations

- **Code Splitting**: Route-based lazy loading
- **Memoization**: useMemo for expensive calculations
- **Virtual Scrolling**: Efficient list rendering for large datasets
- **Image Optimization**: Responsive images with proper sizing

## Development Workflow

- **TypeScript**: Strict type checking
- **ESLint**: Code quality and consistency
- **Hot Reload**: Vite development server
- **Build Optimization**: Production-ready builds

## Future Enhancements

- **Real-time Updates**: WebSocket integration
- **Advanced Analytics**: More detailed reporting
- **API Integration**: Backend service connections
- **Mobile App**: React Native version
- **Multi-language**: Internationalization support

## Getting Started

1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Build for production: `npm run build`
4. Preview production build: `npm run preview`

## File Naming Conventions

- **Components**: PascalCase (e.g., `StatusBar.tsx`)
- **Pages**: kebab-case directories with index.tsx
- **Utilities**: camelCase (e.g., `dateUtils.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.ts`)

## Component Architecture

- **Atomic Design**: Atoms → Molecules → Organisms → Templates → Pages
- **Composition**: Favor composition over inheritance
- **Props Interface**: Explicit TypeScript interfaces for all props
- **Default Props**: Sensible defaults with prop validation
