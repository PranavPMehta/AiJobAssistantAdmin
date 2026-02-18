<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# DRC Admin Panel

A modern, full-featured admin dashboard for managing job seekers and their application status. Built with React, TypeScript, and Vite for optimal performance and developer experience.

**View your app in AI Studio:** https://ai.studio/apps/drive/1ll5tggEPSqftKH80nFPRv3n6oSJJcF5I

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Component Guide](#component-guide)
- [Store & State Management](#store--state-management)
- [API Integration](#api-integration)
- [Styling](#styling)

---

## 🎯 Overview

The DRC Admin Panel is a comprehensive administration interface designed for managing a job seeker ecosystem. It provides administrators with tools to:

- **Monitor** job seekers and their profiles
- **Approve/Reject** pending user requests
- **Manage** user statuses (Pending, Approved, Rejected, Deactivated)
- **View analytics** through an interactive dashboard with statistics
- **Handle authentication** with secure admin login

The application uses a modern UI with Lucide React icons and a dark-themed Tailwind CSS design for a professional appearance.

---

## ✨ Key Features

### Authentication
- **Admin Login**: Secure credential-based authentication
- **Session Management**: Track logged-in admin details
- **Logout Functionality**: Clean session termination

### User Management
- **User Dashboard**: View all job seekers with detailed profiles
- **Status Tracking**: Monitor users across 4 status categories:
  - **Pending**: New requests awaiting approval
  - **Approved**: Active verified users
  - **Rejected**: Users who didn't meet requirements
  - **Deactivated**: Previously active users no longer in system
- **Bulk Actions**: Manage multiple users efficiently
- **Search & Filter**: Locate users by various criteria

### User Operations
- **Create New Users**: Add job seekers to the system manually
- **Approve Requests**: Activate pending user applications
- **Reject Applications**: Provide rejection reasons
- **Reactivate Users**: Restore deactivated user accounts
- **View Details**: Inspect comprehensive user profiles

### Dashboard Analytics
- **Real-time Stats**: 
  - Total Seekers count
  - Pending Requests count
  - Active Users count
  - Rejected Users count
- **Visual Cards**: Color-coded stat cards with icons for quick identification

---

## 🛠 Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend Framework** | React 19.2.3 |
| **Language** | TypeScript ~5.8.2 |
| **Build Tool** | Vite 6.2.0 |
| **HTTP Client** | Axios 1.13.2 |
| **State Management** | Zustand 5.0.9 |
| **UI Components** | Tailwind CSS, Lucide React 0.561.0 |
| **Runtime** | Node.js (any modern version) |

---

## 📁 Project Structure

```
drc-admin-panel/
├── components/              # Reusable React components
│   ├── Layout.tsx          # Main layout wrapper with sidebar & header
│   ├── UserTable.tsx       # User list table component
│   ├── UI.tsx              # Reusable UI components (Card, Button, Input, etc.)
│   └── Modals.tsx          # Modal components (UserFormModal, RejectModal, etc.)
├── lib/
│   └── axios.ts            # Configured Axios instance for API calls
├── services/
│   └── mockData.ts         # Mock data for development/testing
├── store/
│   └── useStore.ts         # Zustand store for state management
├── App.tsx                 # Main app component with routing logic
├── types.ts                # TypeScript type definitions & enums
├── index.tsx               # React DOM entry point
├── index.html              # HTML template
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies and scripts
├── nginx.conf              # Nginx configuration for deployment
└── metadata.json           # App metadata
```

### Key Directories Explained

**`components/`**: Contains all UI components
- Broken down by responsibility for better maintainability
- Each component is focused on a single concern

**`store/`**: Zustand state management
- Centralized state for authentication and user data
- Contains API integration logic

**`lib/`**: Utility modules
- `axios.ts`: API client configuration with interceptors/base URL

**`services/`**: Data and business logic
- `mockData.ts`: Sample data for testing without a backend

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 16+ (verify with `node --version`)
- **npm** or **yarn** package manager
- Git (for version control)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd drc-admin-panel
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   This installs all packages listed in `package.json`

3. **Configure environment (if needed)**
   - Create a `.env.local` file in the project root (if not already present)
   - Add any required environment variables:
   ```
   GEMINI_API_KEY=your_api_key_here
   VITE_API_BASE_URL=http://localhost:8000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   - Server runs at `http://localhost:3000`
   - Access admin panel at `http://localhost:3000/admin`

### First Steps as a Developer

1. **Explore the Login Screen**: Start at `/Users/pranmehta/Downloads/drc-admin-panel/App.tsx`
   - Try logging in with default credentials (username/password: `admin`)

2. **Understand the Component Hierarchy**:
   - `App.tsx` → `Layout.tsx` → Child components (`UserTable`, `Modals`, etc.)

3. **Review the Store**: Check `store/useStore.ts`
   - This is where all API calls and state management happen

4. **Check Component Props**: Look at component files in `components/`
   - Each component's props and purpose is well-documented

---

## 👨‍💻 Development

### Available Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server with hot-reload on `localhost:3000` |
| `npm run build` | Create optimized production build in `dist/` |
| `npm run preview` | Preview production build locally |

### Hot Module Replacement (HMR)

Changes to React components automatically reflect in the browser without full page reload. This applies to:
- Component JSX/TSX
- Styles (Tailwind classes)
- Store logic

### Debugging

1. **Browser DevTools**
   - Open with `F12` or `Cmd+Option+I` on macOS
   - Console tab shows React errors
   - Network tab shows API calls

2. **React Developer Tools Extension**
   - Install from Chrome/Firefox web store
   - Inspect component props and state

### Coding Standards

- **TypeScript**: All components use TypeScript for type safety
- **Naming**: Use camelCase for variables/functions, PascalCase for components
- **Components**: Prefer functional components with hooks
- **Styling**: Use Tailwind CSS utilities (no custom CSS except in special cases)

---

## 🏗 Building for Production

### Create Production Build

```bash
npm run build
```

This generates:
- Optimized bundle in `/dist` folder
- Minified and tree-shaken code
- ~50-70KB final bundle size

### Deploy

The project includes `nginx.conf` for Nginx deployment:

1. Build the app: `npm run build`
2. Copy `dist/` contents to your web server
3. Configure base path to `/admin/` (already set in `vite.config.ts`)
4. Use provided `nginx.conf` for routing configuration

---

## 🧩 Component Guide

### `Layout.tsx`
Main wrapper component providing consistent UI structure.
- **Props**: `children`, `view`, `onViewChange`
- **Provides**: Header, sidebar, main content area
- **Features**: Navigation between Dashboard, Requests, Users views

### `UserTable.tsx`
Displays users in a table format with sorting and filtering.
- **Props**: `users`, `onApprove`, `onReject`, `onReactivate`
- **Features**: Status badges, action buttons, loading states

### `UI.tsx`
Reusable UI building blocks:
- **`Card`**: Container with consistent styling
- **`Button`**: Multiple variants (primary, secondary, danger)
- **`Input`**: Labeled text input with validation
- **`Badge`**: Status indicators with color coding
- **`Modal`**: Dialog wrapper for forms and confirmations

### `Modals.tsx`
Modal dialogs for user actions:
- **`UserFormModal`**: Create/Edit user details
- **`RejectModal`**: Capture rejection reason
- **`ApproveUserModal`**: Confirm user approval
- **`ConfirmationModal`**: Generic confirmation dialog
- **`ReactivateModal`**: Reactivate deactivated users

---

## 📦 Store & State Management

### Zustand Store (`store/useStore.ts`)

The store is divided into two slices:

#### Auth Slice
```typescript
{
  admin: AdminUser | null,           // Current logged-in admin
  isAuthenticated: boolean,           // Auth status
  login(credentials): Promise<void>,  // Login with username/password
  logout(): void                      // Clear session
}
```

#### User Slice
```typescript
{
  users: User[],                      // Array of all users
  isLoading: boolean,                 // Loading state for API calls
  fetchUsers(): Promise<void>,        // Fetch all users from API
  updateUser(id, data): Promise<void>,// Update user status/details
  createUser(data): Promise<void>     // Create new user
}
```

### Usage in Components

```tsx
import { useStore } from './store/useStore';

function MyComponent() {
  const { users, fetchUsers, isLoading } = useStore();
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  return <div>{/* render users */}</div>;
}
```

---

## 🔌 API Integration

### Axios Configuration (`lib/axios.ts`)

The app uses a pre-configured Axios instance that handles:
- Base URL setup
- Request/response interceptors
- Authentication headers
- Error handling

### API Endpoints Used

| Endpoint | Method | Purpose | Data |
|----------|--------|---------|------|
| `/admin/login` | POST | Admin authentication | `{ username, password }` |
| `/admin/users` | GET | Fetch all users | - |
| `/admin/user` | POST | Create new user | User data |
| `/admin/user/:id` | PATCH | Update user status | `{ status, rejection_reason? }` |

### Types (`types.ts`)

**`User`**: Represents a job seeker
```typescript
{
  user_id: string,              // UUID
  name: string,
  email: string,
  contact_number: string,
  job_title: string,
  job_location?: string,
  job_type?: string,
  salary?: string,
  skills?: string[],
  experience?: string,
  is_premium: boolean,
  status: 'Pending' | 'Approved' | 'Rejected' | 'Deactivated',
  rejection_reason?: string
}
```

**`AdminUser`**: Represents logged-in admin
```typescript
{
  admin_id: string,
  full_name: string,
  username: string,
  role: string,
  is_active: boolean
}
```

---

## 🎨 Styling

### Tailwind CSS

The app uses **Tailwind CSS** for styling with a custom dark theme.

### Color Scheme

- **Primary**: Neon Green (`neon-green`)
- **Secondary**: Neon Purple (`neon-purple`)
- **Accent**: Blue, Yellow, Red
- **Background**: Dark surface (`surface-main`, `surface-card`)

### Custom Classes

Look in your Tailwind config for custom extensions:
- `surface-main`: Main background
- `surface-card`: Card backgrounds
- `neon-green/purple`: Accent colors

### Best Practices

- Use Tailwind utilities instead of custom CSS
- Maintain consistent spacing (4px grid)
- Use semantic color names (e.g., `text-red-500` for errors)

---

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Port 3000 already in use | Kill process or change port in `vite.config.ts` |
| CORS errors from API | Check `lib/axios.ts` base URL configuration |
| TypeScript errors | Run `npm install` to ensure all types are installed |
| Hot reload not working | Check Vite dev server logs for errors |
| Build fails | Clear `node_modules` and `dist/`, then `npm install && npm run build` |

---

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Lucide React Icons](https://lucide.dev)

---

## 📝 Contributing

When adding new features:

1. Create a new branch from `main`
2. Follow the existing folder structure
3. Add TypeScript types for new data structures
4. Update the store for new state management
5. Test thoroughly before submitting PR
6. Update this README if adding significant features

---

## 📄 License

This project is part of the AI Job Assistant ecosystem.
