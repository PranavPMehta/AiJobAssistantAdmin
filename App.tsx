import React, { useState, useMemo } from 'react';
import { Layout } from './components/Layout';
import { UserTable } from './components/UserTable';
import { Card, Button, Input } from './components/UI';
import { UserFormModal, RejectModal, ApproveUserModal, ConfirmationModal } from './components/Modals';
import { User, UserStatus, ViewState, ToastMessage } from './types';
import { INITIAL_USERS } from './services/mockData';
import { Users, UserPlus, FileCheck, CheckCircle2, ShieldAlert } from 'lucide-react';

const LoginScreen = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin' && password === 'admin') {
      onLogin();
    } else {
      alert('Invalid credentials. Try admin / admin');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-main p-4">
      <div className="absolute inset-0 overflow-hidden">
         <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-neon-green/5 blur-[120px] rounded-full"></div>
         <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-neon-purple/5 blur-[120px] rounded-full"></div>
      </div>
      
      <div className="relative w-full max-w-md bg-surface-card border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
           <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
           <p className="text-slate-400">Manage your job seeker ecosystem</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input 
            label="Username" 
            placeholder="admin" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
          />
          <Input 
            label="Password" 
            type="password" 
            placeholder="admin" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
          />
          <Button className="w-full h-11" type="submit">Access Dashboard</Button>
        </form>
      </div>
    </div>
  );
};

const DashboardStats = ({ users }: { users: User[] }) => {
  const stats = [
    { label: 'Total Seekers', value: users.length, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { label: 'Pending Requests', value: users.filter(u => u.status === UserStatus.PENDING).length, icon: UserPlus, color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
    { label: 'Active Users', value: users.filter(u => u.status === UserStatus.APPROVED).length, icon: CheckCircle2, color: 'text-neon-green', bg: 'bg-neon-green/10', border: 'border-neon-green/20' },
    { label: 'Rejected', value: users.filter(u => u.status === UserStatus.REJECTED).length, icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, idx) => (
        <div key={idx} className={`bg-surface-card border ${stat.border} rounded-xl p-6 flex items-center justify-between shadow-sm`}>
          <div>
            <p className="text-slate-400 text-sm font-medium mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </div>
          <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
            <stat.icon size={24} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [view, setView] = useState<ViewState>('dashboard');
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  
  // Modal States
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isReactivateModalOpen, setIsReactivateModalOpen] = useState(false);

  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [premiumTarget, setPremiumTarget] = useState<{user: User, newValue: boolean} | null>(null);
  const [reactivateTarget, setReactivateTarget] = useState<User | null>(null);

  // Derived State
  const pendingUsers = useMemo(() => users.filter(u => u.status === UserStatus.PENDING), [users]);
  const activeUsers = useMemo(() => users.filter(u => u.status !== UserStatus.PENDING), [users]);

  // Actions
  
  // -- Approve Flow --
  const handleApproveInit = (user: User) => {
    setSelectedUser(user);
    setIsApproveModalOpen(true);
  };

  const handleApproveConfirm = (password: string, isPremium: boolean) => {
    if (!selectedUser) return;
    setUsers(prev => prev.map(u => 
      u.id === selectedUser.id ? { ...u, status: UserStatus.APPROVED, password, isPremium } : u
    ));
    alert(`[SYSTEM MOCK EMAIL]\nTo: ${selectedUser.email}\nSubject: DRC Account Approved\n\nYour account has been approved. You are ${isPremium ? 'a PREMIUM' : 'a Standard'} user. Login with your new password.`);
    setSelectedUser(null);
    setView('users'); // Redirect to All Users
  };

  // -- Reject Flow --
  const handleRejectInit = (user: User) => {
    setSelectedUser(user);
    setIsRejectModalOpen(true);
  };

  const handleRejectConfirm = (reason: string) => {
    if (!selectedUser) return;
    setUsers(prev => prev.map(u => 
      u.id === selectedUser.id ? { ...u, status: UserStatus.REJECTED, rejectionReason: reason } : u
    ));
    alert(`[SYSTEM MOCK EMAIL]\nTo: ${selectedUser.email}\nSubject: Application Update\n\nYour application was rejected. Reason: ${reason}`);
    setSelectedUser(null);
  };

  // -- Create/Edit Flow --
  const handleCreateInit = () => {
    setSelectedUser(null);
    setModalMode('create');
    setIsUserModalOpen(true);
  };

  const handleEditInit = (user: User) => {
    setSelectedUser(user);
    setModalMode('edit');
    setIsUserModalOpen(true);
  };

  const handleUserFormSubmit = (formData: Partial<User>) => {
    if (modalMode === 'create') {
      const newUser: User = {
        id: `u_${Date.now()}`,
        name: formData.name!,
        email: formData.email!,
        mobile: formData.mobile!,
        jobPosition: formData.jobPosition!,
        signupDate: new Date().toISOString(),
        status: UserStatus.APPROVED, // Direct create is auto-approved
        password: formData.password,
        isPremium: !!formData.isPremium
      };
      setUsers(prev => [newUser, ...prev]);
      alert('User created successfully.');
    } else {
      if (!selectedUser) return;
      
      const updates = { ...formData };
      // If password is empty string, remove it from updates to preserve original password
      if (!updates.password) {
        delete updates.password;
      }
      
      setUsers(prev => prev.map(u => 
        u.id === selectedUser.id ? { ...u, ...updates } : u
      ));
      alert('User updated successfully.');
    }
  };

  // -- Deactivate Flow --
  const handleDeactivate = (user: User) => {
    if (confirm(`Are you sure you want to deactivate ${user.name}?`)) {
      setUsers(prev => prev.map(u => 
        u.id === user.id ? { ...u, status: UserStatus.DEACTIVATED } : u
      ));
    }
  };

  // -- Reactivate Flow --
  const handleReactivateInit = (user: User) => {
    setReactivateTarget(user);
    setIsReactivateModalOpen(true);
  };

  const handleReactivateConfirm = () => {
    if (!reactivateTarget) return;
    setUsers(prev => prev.map(u => 
      u.id === reactivateTarget.id ? { ...u, status: UserStatus.APPROVED } : u
    ));
    setReactivateTarget(null);
  };

  // -- Premium Toggle Flow --
  const handlePremiumToggleInit = (user: User, newValue: boolean) => {
    setPremiumTarget({ user, newValue });
    setIsConfirmModalOpen(true);
  };

  const handlePremiumToggleConfirm = () => {
    if (!premiumTarget) return;
    setUsers(prev => prev.map(u => 
      u.id === premiumTarget.user.id ? { ...u, isPremium: premiumTarget.newValue } : u
    ));
    setPremiumTarget(null);
  };

  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <Layout currentView={view} onChangeView={setView} onLogout={() => setIsAuthenticated(false)}>
      
      {view === 'dashboard' && (
        <div className="animate-fadeIn">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
            <Button onClick={handleCreateInit} size="sm" icon={<UserPlus size={16} />}>
               + New User
            </Button>
          </div>
          <DashboardStats users={users} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <Card title="Recent Pending Requests">
                {pendingUsers.length > 0 ? (
                  <UserTable 
                    users={pendingUsers.slice(0, 5)} 
                    isPendingView={true}
                    onApprove={handleApproveInit}
                    onReject={handleRejectInit}
                    onEdit={handleEditInit}
                    onDeactivate={handleDeactivate}
                    onReactivate={handleReactivateInit}
                    onTogglePremium={handlePremiumToggleInit}
                  />
                ) : (
                  <div className="text-slate-500 text-sm py-4">No pending requests right now.</div>
                )}
                {pendingUsers.length > 5 && <Button variant="ghost" size="sm" className="mt-4 w-full" onClick={() => setView('requests')}>View All Requests</Button>}
             </Card>

             <Card title="Recent Active Users">
                <UserTable 
                  users={activeUsers.filter(u => u.status === UserStatus.APPROVED).slice(0, 5)} 
                  isPendingView={false}
                  onApprove={handleApproveInit}
                  onReject={handleRejectInit}
                  onEdit={handleEditInit}
                  onDeactivate={handleDeactivate}
                  onReactivate={handleReactivateInit}
                  onTogglePremium={handlePremiumToggleInit}
                />
                 {activeUsers.length > 5 && <Button variant="ghost" size="sm" className="mt-4 w-full" onClick={() => setView('users')}>View All Users</Button>}
             </Card>
          </div>
        </div>
      )}

      {view === 'requests' && (
        <div className="animate-fadeIn">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">Signup Requests</h1>
          </div>
          <UserTable 
            users={pendingUsers} 
            isPendingView={true}
            onApprove={handleApproveInit}
            onReject={handleRejectInit}
            onEdit={handleEditInit}
            onDeactivate={handleDeactivate}
            onReactivate={handleReactivateInit}
            onTogglePremium={handlePremiumToggleInit}
          />
        </div>
      )}

      {view === 'users' && (
        <div className="animate-fadeIn">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">All Users</h1>
            <Button onClick={handleCreateInit}>
               Create User Manually
            </Button>
          </div>
          <UserTable 
            users={activeUsers} 
            isPendingView={false}
            onApprove={handleApproveInit}
            onReject={handleRejectInit}
            onEdit={handleEditInit}
            onDeactivate={handleDeactivate}
            onReactivate={handleReactivateInit}
            onTogglePremium={handlePremiumToggleInit}
          />
        </div>
      )}

      {/* Modals */}
      <UserFormModal 
        isOpen={isUserModalOpen} 
        onClose={() => setIsUserModalOpen(false)}
        onSubmit={handleUserFormSubmit}
        initialData={selectedUser}
        mode={modalMode}
      />

      <RejectModal 
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={handleRejectConfirm}
      />
      
      <ApproveUserModal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        onConfirm={handleApproveConfirm}
        user={selectedUser}
      />

      <ConfirmationModal 
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handlePremiumToggleConfirm}
        title="Confirm Premium Status Change"
        message={premiumTarget ? `Are you sure you want to ${premiumTarget.newValue ? 'enable' : 'disable'} Premium status for ${premiumTarget.user.name}?` : ''}
      />

      <ConfirmationModal 
        isOpen={isReactivateModalOpen}
        onClose={() => setIsReactivateModalOpen(false)}
        onConfirm={handleReactivateConfirm}
        title="Confirm Reactivation"
        message={reactivateTarget ? `Are you sure you want to reactivate ${reactivateTarget.name}? They will regain access to the system.` : ''}
      />

    </Layout>
  );
}