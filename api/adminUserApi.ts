import axiosClient from "./axiosClient";
import { mapUserFromBackend, mapUserToBackend } from "./mappers/userMapper";

/* ================= GET USERS ================= */

export const getAllUsers = async () => {

  const res = await axiosClient.get("/admin/users");

  console.log("API RESPONSE:", res);

  const rawUsers =
    (res as any)?.users ??
    (res as any)?.data?.users ??
    (Array.isArray(res) ? res : (res as any)?.data) ??
    [];

  console.log("RAW USERS:", rawUsers);

  const mappedUsers = rawUsers.map((u: any) =>
    mapUserFromBackend(u)
  );

  console.log("MAPPED USERS:", mappedUsers);

  return mappedUsers;
};


/* ================= CREATE USER ================= */

export const createUser = async (data: any) => {

  const payload: any = {
    name: data.name,
    email: data.email,
    password: data.password,
    auth_provider: "LOCAL",
    status: data.status,
    is_premium: data.isPremium
  };

  if (data.contactNumber) payload.contact_number = data.contactNumber;
  if (data.jobTitle) payload.job_title = data.jobTitle;
  if (data.jobLocation) payload.job_location = data.jobLocation;
  if (data.jobType) payload.job_type = data.jobType;
  if (data.salary) payload.salary = data.salary;
  if (data.experience) payload.experience = data.experience;
  if (data.skills?.length) payload.skills = data.skills;

  console.log("CREATE PAYLOAD:", payload);

  const res = await axiosClient.post("/admin/user", payload);

  console.log("CREATE RESPONSE:", res);

  const createdUser = (res as any)?.user ?? (res as any)?.data ?? res;

  if (!createdUser) return null;

  return mapUserFromBackend(createdUser);

};

/* ================= UPDATE USER ================= */


export const updateUser = async (userId: string, data: any) => {

  if (!userId) {
    console.error("❌ updateUser called without userId");
    return;
  }

  const payload: any = {
    name: data.name,
    email: data.email,
    auth_provider: "LOCAL",
    status: data.status,
    is_premium: data.isPremium
  };

  if (data.contactNumber) payload.contact_number = data.contactNumber;
  if (data.jobTitle) payload.job_title = data.jobTitle;
  if (data.jobLocation) payload.job_location = data.jobLocation;
  if (data.jobType) payload.job_type = data.jobType;
  if (data.salary) payload.salary = data.salary;
  if (data.experience) payload.experience = data.experience;
  if (data.skills?.length) payload.skills = data.skills;
  if (data.password) payload.password = data.password;

  console.log("UPDATE USER ID:", userId);
  console.log("UPDATE PAYLOAD:", payload);

  const res = await axiosClient.patch(`/admin/user/${userId}`, payload);

  console.log("UPDATE RESPONSE:", res);

  const updatedUser = (res as any)?.user ?? (res as any)?.data ?? res;

  if (!updatedUser) return null;

  return mapUserFromBackend(updatedUser);
};

export const updateUserStatus = async (
  userId: string,
  status: "Approved" | "Rejected" |"Deactivated" | "Reactivated",
  password?: string,
  isPremium?: boolean,
  reason?: string
) => {

  if (!userId) {
    console.error("updateUserStatus called without userId");
    return;
  }

  const payload: any = { status };

  if (password) payload.password = password;
  if (typeof isPremium === "boolean") payload.isPremium = isPremium;
  if (reason) payload.reason = reason;

  const res = await axiosClient.patch(`/admin/user/${userId}`, payload);

  return (res as any)?.data ?? res;
};
