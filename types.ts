export enum UserStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved', // Active
  REJECTED = 'Rejected',
  DEACTIVATED = 'Deactivated',
}

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  jobPosition: string;
  signupDate: string; // ISO Date string
  status: UserStatus;
  password?: string; // Storing for demo purposes
  rejectionReason?: string;
  isPremium: boolean;
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export type ViewState = 'dashboard' | 'requests' | 'users';