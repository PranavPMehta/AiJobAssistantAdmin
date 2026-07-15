export enum UserStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved', // Active
  REJECTED = 'Rejected',
  DEACTIVATED = 'Deactivated',
}

export interface User {
  id: string;
  userId?: string;
  user_id?: string;
  name: string;
  email: string;
  mobile: string;
  contactNumber?: string;
  contact_number?: string;
  jobPosition: string;
  jobTitle?: string;
  job_title?: string;
  jobLocation?: string;
  job_location?: string;
  jobType?: string;
  job_type?: string;
  salary?: string;
  experience?: string;
  skills?: string[];
  signupDate: string; // ISO Date string
  createdAt?: string | null;
  created_at?: string | null;
  status: UserStatus;
  password?: string; // Storing for demo purposes
  rejectionReason?: string;
  isPremium: boolean;
  is_premium?: boolean;
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
  job_id?: string;
  job_title?: string;
  title: string;
  company: string;
  location: string;
  jobType: string;
  job_type?: string;
  salary: string;
  experience: string;
  skills: string[];
  key_skills?: string[];
  website: string;
  application_url?: string;
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

export interface DiscoveryCallEnquiry {
  enquiry_id: string;
  full_name: string;
  email: string;
  whatsapp_number: string;
  current_role: string;
  target_role: string;
  created_at?: string | number[] | null;
  updated_at?: string | number[] | null;
}

export interface AiEngineerAcceleratorEnquiry {
  enquiry_id: string;
  first_name: string;
  last_name: string;
  work_email: string;
  phone_number: string;
  current_role: string;
  experience: string;
  python_level: string;
  program_name: string;
  created_at?: string | number[] | null;
  updated_at?: string | number[] | null;
}

export type ViewState =
  | 'dashboard'
  | 'requests'
  | 'users'
  | 'jobs'
  | 'discovery-call-enquiries'
  | 'ai-engineer-accelerator-enquiries';
