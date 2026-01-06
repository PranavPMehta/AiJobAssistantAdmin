import React, { useState, useMemo, useEffect } from 'react';
import { Layout } from './components/Layout';
import { UserTable } from './components/UserTable';
import { Card, Button, Input } from './components/UI';
import { UserFormModal, RejectModal, ApproveUserModal, ConfirmationModal } from './components/Modals';
import { User, UserStatus, ViewState } from './types';
import { useStore } from './store/useStore';
import { Users, UserPlus, FileCheck, CheckCircle2, ShieldAlert } from 'lucide-react';

const LoginScreen = ({ onLogin }: { onLogin: () => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useStore();
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await login({ username, password });
      onLogin();
    } catch (err) {
      setError('Invalid credentials');
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
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <Input
            label="Password"
            type="password"
            placeholder="admin"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
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
  const { isAuthenticated, logout, users, fetchUsers, updateUser, createUser } = useStore();
  const [view, setView] = useState<ViewState>('dashboard');

  // Modal States
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isReactivateModalOpen, setIsReactivateModalOpen] = useState(false);

  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [premiumTarget, setPremiumTarget] = useState<{ user: User, newValue: boolean } | null>(null);
  const [reactivateTarget, setReactivateTarget] = useState<User | null>(null);

  // Initial Fetch
  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers();
    }
  }, [isAuthenticated, fetchUsers]);

  // Derived State
  const pendingUsers = useMemo(() => users.filter(u => u.status === UserStatus.PENDING), [users]);
  const activeUsers = useMemo(() => users.filter(u => u.status !== UserStatus.PENDING), [users]);

  // Actions

  // -- Approve Flow --
  const handleApproveInit = (user: User) => {
    setSelectedUser(user);
    setIsApproveModalOpen(true);
  };

  const handleApproveConfirm = async (password: string, isPremium: boolean) => {
    if (!selectedUser) return;
    await updateUser(selectedUser.user_id, {
      status: UserStatus.APPROVED,
      password,
      is_premium: isPremium
    });
    alert('User approved successfully');
    setSelectedUser(null);
    setView('users');
  };

  // -- Reject Flow --
  const handleRejectInit = (user: User) => {
    setSelectedUser(user);
    setIsRejectModalOpen(true);
  };

  const handleRejectConfirm = async (reason: string) => {
    if (!selectedUser) return;
    await updateUser(selectedUser.user_id, {
      status: UserStatus.REJECTED,
      rejection_reason: reason
    });
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

  const handleUserFormSubmit = async (formData: Partial<User>) => {
    if (modalMode === 'create') {
      await createUser(formData);
      alert('User created successfully.');
    } else {
      if (!selectedUser) return;
      const updates = { ...formData };
      if (!updates.password) delete updates.password;

      await updateUser(selectedUser.user_id, updates);
      alert('User updated successfully.');
    }
  };

  // -- Deactivate Flow --
  const handleDeactivate = async (user: User) => {
    if (confirm(`Are you sure you want to deactivate ${user.name}?`)) {
      await updateUser(user.user_id, { status: UserStatus.DEACTIVATED });
    }
  };

  // -- Reactivate Flow --
  const handleReactivateInit = (user: User) => {
    setReactivateTarget(user);
    setIsReactivateModalOpen(true);
  };

  const handleReactivateConfirm = async () => {
    if (!reactivateTarget) return;
    await updateUser(reactivateTarget.user_id, { status: UserStatus.APPROVED });
    setReactivateTarget(null);
  };

  // -- Premium Toggle Flow --
  const handlePremiumToggleInit = (user: User, newValue: boolean) => {
    setPremiumTarget({ user, newValue });
    setIsConfirmModalOpen(true);
  };

  const handlePremiumToggleConfirm = async () => {
    if (!premiumTarget) return;
    await updateUser(premiumTarget.user.user_id, { is_premium: premiumTarget.newValue });
    setPremiumTarget(null);
  };

  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => { }} />;
  }

  return (
    <Layout currentView={view} onChangeView={setView} onLogout={logout}>

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