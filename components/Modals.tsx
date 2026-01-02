import React, { useState, useEffect } from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { User, UserStatus } from '../types';
import { Button, Input, Select, Toggle } from './UI';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-surface-card border border-slate-700 w-full max-w-md rounded-xl shadow-2xl transform transition-all animate-fadeIn">
        <div className="flex justify-between items-center p-4 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- Create / Edit User Modal ---
interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: Partial<User>) => void;
  initialData?: User | null;
  mode: 'create' | 'edit';
}

export const UserFormModal: React.FC<UserFormModalProps> = ({ isOpen, onClose, onSubmit, initialData, mode }) => {
  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    email: '',
    mobile: '',
    jobPosition: '',
    password: '',
    status: UserStatus.APPROVED, // Default to active when manually creating
    isPremium: false
  });

  useEffect(() => {
    if (initialData) {
      // In edit mode, we don't populate the password field for security. 
      // User must enter a new one to change it.
      const { password, ...rest } = initialData;
      setFormData({ ...rest, password: '' });
    } else {
      setFormData({
        name: '',
        email: '',
        mobile: '',
        jobPosition: '',
        password: '',
        status: UserStatus.APPROVED,
        isPremium: false
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'create' ? 'Create New User' : 'Edit User'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input 
          label="Full Name" 
          value={formData.name} 
          onChange={e => setFormData({...formData, name: e.target.value})}
          required 
        />
        <Input 
          label="Email Address" 
          type="email" 
          value={formData.email} 
          onChange={e => setFormData({...formData, email: e.target.value})}
          required 
          disabled={mode === 'edit'} // Usually email is immutable or ID
        />
        <Input 
          label="Mobile Number" 
          value={formData.mobile} 
          onChange={e => setFormData({...formData, mobile: e.target.value})}
          required 
        />
        <Input 
          label="Job Position" 
          value={formData.jobPosition} 
          onChange={e => setFormData({...formData, jobPosition: e.target.value})}
          required 
        />
        
        <Input 
          label={mode === 'create' ? "Password" : "Reset Password"}
          type="password"
          value={formData.password} 
          onChange={e => setFormData({...formData, password: e.target.value})}
          required={mode === 'create'} 
          placeholder={mode === 'create' ? "Set initial password" : "Leave blank to keep current password"}
        />

        <div className="pt-2">
           <Toggle 
             label="Premium User Account" 
             checked={!!formData.isPremium} 
             onChange={(checked) => setFormData({...formData, isPremium: checked})} 
           />
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit">{mode === 'create' ? 'Create User' : 'Save Changes'}</Button>
        </div>
      </form>
    </Modal>
  );
};

// --- Approve User Modal ---
interface ApproveUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string, isPremium: boolean) => void;
  user: User | null;
}

export const ApproveUserModal: React.FC<ApproveUserModalProps> = ({ isOpen, onClose, onConfirm, user }) => {
  const [password, setPassword] = useState('');
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setIsPremium(false);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(password, isPremium);
    onClose();
  };

  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Approve Registration">
      <div className="mb-6 bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
        <h3 className="text-sm font-semibold text-slate-300 mb-2">Applicant Details</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div><span className="text-slate-500">Name:</span> <span className="text-white">{user.name}</span></div>
          <div><span className="text-slate-500">Email:</span> <span className="text-white">{user.email}</span></div>
          <div className="col-span-2"><span className="text-slate-500">Job:</span> <span className="text-white">{user.jobPosition}</span></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input 
          label="Set Account Password" 
          type="password"
          value={password} 
          onChange={e => setPassword(e.target.value)}
          required 
          placeholder="Create a secure password"
        />

        <div className="bg-surface-main p-3 rounded-lg border border-slate-800">
           <Toggle 
             label="Enable Premium Status" 
             checked={isPremium} 
             onChange={setIsPremium} 
           />
           <p className="text-xs text-slate-500 mt-2 ml-1">Grant this user access to premium features immediately upon approval.</p>
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary">Approve & Activate</Button>
        </div>
      </form>
    </Modal>
  );
};

// --- Confirmation Modal ---
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        <p className="text-slate-300">{message}</p>
        <div className="pt-4 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={() => { onConfirm(); onClose(); }} variant="primary">Confirm Change</Button>
        </div>
      </div>
    </Modal>
  );
};

// --- Reject Reason Modal ---
interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export const RejectModal: React.FC<RejectModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(reason);
    setReason('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reject Application">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-400 mb-2">Reason for Rejection</label>
          <textarea 
            className="w-full bg-surface-main border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 h-32 resize-none"
            placeholder="e.g., Incomplete documentation..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="danger">Reject User</Button>
        </div>
      </form>
    </Modal>
  );
};