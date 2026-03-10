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

export interface JobConnection {
  name: string;
  title: string;
  contact: string;
}

export enum JobStatus {
  SAVED = 'Saved',
  APPLIED = 'Applied',
  INTERVIEW = 'Interview',
  OFFER = 'Offer',
  REJECTED = 'Rejected',
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  jobType: string;
  salary: string;
  experience: string;
  skills: string[];
  website: string;
  status: JobStatus;
  insights: string;
  proofs: string[]; // Mock file paths/names
  resume: string;   // Mock file path/name
  connections: JobConnection[];
  remarks: string;
  createdAt: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export type ViewState = 'dashboard' | 'requests' | 'users' | 'jobs';