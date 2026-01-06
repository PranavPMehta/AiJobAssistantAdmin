import React from 'react';
import { Check, X, Edit, Power, RotateCcw } from 'lucide-react';
import { User, UserStatus } from '../types';
import { StatusBadge, Toggle } from './UI';

interface UserTableProps {
  users: User[];
  onApprove: (user: User) => void;
  onReject: (user: User) => void;
  onEdit: (user: User) => void;
  onDeactivate: (user: User) => void;
  onReactivate: (user: User) => void;
  onTogglePremium: (user: User, newValue: boolean) => void;
  isPendingView: boolean;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  onApprove,
  onReject,
  onEdit,
  onDeactivate,
  onReactivate,
  onTogglePremium,
  isPendingView
}) => {
  if (users.length === 0) {
    return (
      <div className="text-center py-20 bg-surface-card rounded-xl border border-slate-800 border-dashed">
        <div className="text-slate-500 mb-2">No users found</div>
        <div className="text-sm text-slate-600">Try changing filters or adding a new user.</div>
      </div>
    );
  }

  return (
    <div className="bg-surface-card border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-800">
          <thead className="bg-slate-900/50">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">User</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider hidden md:table-cell">Contact</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider hidden lg:table-cell">Position</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider hidden lg:table-cell">Experience</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Premium</th>
              <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {users.map((user) => (
              <tr key={user.user_id} className="hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-neon-green font-bold border border-slate-700">
                      {user.name?.charAt(0) || '?'}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-white">{user.name}</div>
                      <div className="text-xs text-slate-500 md:hidden">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                  <div className="text-sm text-slate-300">{user.email}</div>
                  <div className="text-xs text-slate-500">{user.contact_number}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                  <div className="text-sm text-slate-300">{user.job_title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                  <div className="text-sm text-slate-400">
                    {user.experience || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={user.status as any} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {!isPendingView && user.status !== UserStatus.REJECTED ? (
                    <Toggle
                      checked={user.is_premium}
                      onChange={(val) => onTogglePremium(user, val)}
                      disabled={user.status === UserStatus.DEACTIVATED}
                    />
                  ) : (
                    <span className="text-slate-600 text-xs">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    {isPendingView ? (
                      <>
                        <button
                          onClick={() => onApprove(user)}
                          className="p-1.5 text-neon-green hover:bg-neon-green/10 rounded-lg transition-colors"
                          title="Approve"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={() => onReject(user)}
                          className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Reject"
                        >
                          <X size={18} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => onEdit(user)}
                          className="p-1.5 text-neon-cyan hover:bg-neon-cyan/10 rounded-lg transition-colors"
                          title="Edit Details"
                        >
                          <Edit size={18} />
                        </button>
                        {user.status === UserStatus.DEACTIVATED ? (
                          <button
                            onClick={() => onReactivate(user)}
                            className="p-1.5 text-slate-400 hover:bg-neon-green/10 hover:text-neon-green rounded-lg transition-colors"
                            title="Reactivate"
                          >
                            <RotateCcw size={18} />
                          </button>
                        ) : (
                          <button
                            onClick={() => onDeactivate(user)}
                            className="p-1.5 text-slate-400 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors"
                            title="Deactivate"
                          >
                            <Power size={18} />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};