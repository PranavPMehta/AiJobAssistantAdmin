/* ================= JOB ================= */

export interface Connection {
  name: string;
  title?: string;
  emailOrLinkedIn?: string | null;
}

export interface Job {
  jobId: string;
  jobTitle: string;
  company: string;
  location?: string;
  jobType?: string;

  applicationUrl?: string;
  appliedAt?: string;

  experience?: string;
  insights?: string;
  remarks?: string;

  salary?: number;

  keySkills?: string[];

  connections?: Connection[];

  createdAt?: string;
  updatedAt?: string;

  isDelete?: boolean;
}

/* ================= USER ================= */

/* ================= USER ================= */

export interface User {

  userId: string;

  email: string;
  name?: string;

  contactNumber?: string;

  jobTitle?: string;
  jobLocation?: string;
  jobType?: string;

  salary?: string;
  skills?: string[];

  experience?: string;

  isPremium: boolean;
  status: string;

  createdAt?: string;
  updatedAt?: string;

}
/* ================= ADMIN ================= */

export interface AdminUser {
  id: string;
  username: string;
  fullName: string;
  role: string;
  mobileNo?: string;
  isActive: boolean;
}


export enum JobStatus {
  SAVED = "Saved",
  APPLIED = "Applied",
  INTERVIEW = "Interview",
  OFFER = "Offer",
  REJECTED = "Rejected",
}

export interface AdminUserInfo {
  userId: string;
  name?: string;
  email: string;
}

export interface AdminJobRow {
  id: string;

  jobTitle: string;
  company: string;
  location: string;
  jobType: string;

  keySkills: string[];

  applicationUrl: string;   // ✅ ADD THIS

  status: JobStatus;

  connections: any[];

  proofs: string[];

  resume: string;

  remarks: string;
}