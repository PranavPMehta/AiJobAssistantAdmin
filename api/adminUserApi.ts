import axiosClient from "./axiosClient";
import { mapUserFromBackend, mapUserToBackend } from "./mappers/userMapper";

/* ================= GET USERS ================= */

export const getAllUsers = async () => {

  const res = await axiosClient.get("/admin/users");

  console.log("API RESPONSE:", res.data);

  const rawUsers = res.data?.users ?? res.data ?? [];

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

  console.log("CREATE RESPONSE:", res.data);

  if (!res.data) return null;

  return mapUserFromBackend(res.data);

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

  console.log("UPDATE RESPONSE:", res.data);

  if (!res.data) return null;

  return mapUserFromBackend(res.data);
};

export const updateUserStatus = async (
  userId: string,
  status: "Approved" | "Rejected"
) => {

  if (!userId) {
    console.error("updateUserStatus called without userId");
    return;
  }

  const res = await axiosClient.patch(`/admin/user/${userId}`, {
    status
  });

  return res.data;
};