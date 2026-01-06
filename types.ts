// Backend Enums/Types
export enum UserStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  DEACTIVATED = 'Deactivated',
}

export interface User {
  user_id: string; // UUID
  name: string;
  email: string;
  password?: string;
  contact_number: string;
  auth_provider?: string;
  job_title: string;
  job_location?: string;
  job_type?: string;
  salary?: string;
  skills?: string[];
  experience?: string;
  is_premium: boolean;
  status: string; // "Pending", "Approved", etc.
  rejection_reason?: string; // Not explicitly in backend model snippet but commonly needed
}

export interface AdminUser {
  admin_id: string;
  full_name: string;
  username: string;
  role: string;
  is_active: boolean;
  message?: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export type ViewState = 'dashboard' | 'requests' | 'users';