import { User } from "../types";

export const mapUserFromBackend = (u: any): User => {

  if (!u) {
    console.error("Invalid backend user object:", u);
    return {} as User;
  }

  return {
    userId: u.user_id,
    user_id: u.user_id,
    id: u.user_id,
    name: u.name ?? "",
    email: u.email ?? "",
    contactNumber: u.contact_number ?? "",
    contact_number: u.contact_number ?? "",
    jobTitle: u.job_title ?? "",
    job_title: u.job_title ?? "",
    jobLocation: u.job_location ?? "",
    job_location: u.job_location ?? "",
    jobType: u.job_type ?? "",
    job_type: u.job_type ?? "",
    salary: u.salary ?? "",
    experience: u.experience ?? "",
    skills: u.skills ?? [],
    createdAt: u.created_at ?? "",
    created_at: u.created_at ?? "",
    status: u.status ?? "Approved",
    isPremium: u.is_premium,
    is_premium: u.is_premium
  };

};
export const mapUserToBackend = (data: any) => {

  const payload: any = {
    name: data.name,
    email: data.email,
    status: data.status,
    is_premium: data.isPremium,
    auth_provider: "LOCAL"
  };

  if (data.contactNumber) payload.contact_number = data.contactNumber;
  if (data.jobTitle) payload.job_title = data.jobTitle;
  if (data.jobLocation) payload.job_location = data.jobLocation;
  if (data.jobType) payload.job_type = data.jobType;
  if (data.salary) payload.salary = data.salary;
  if (data.experience) payload.experience = data.experience;

  if (Array.isArray(data.skills) && data.skills.length > 0) {
    payload.skills = data.skills;
  }

  if (data.password) {
    payload.password = data.password;
  }

  return payload;
};
