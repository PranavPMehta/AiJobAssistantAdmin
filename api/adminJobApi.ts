import axiosClient from "./axiosClient";

/**
 * =========================
 * HELPER: FRONTEND → BACKEND MAPPER
 * =========================
 */

const mapJobToApi = (data: any) => {

  const payload = {
    job_title: data.jobTitle,
    company: data.company,
    location: data.location,
    job_type: data.jobType,
    salary: data.salary || null,
    experience: data.experience || null,
    key_skills: data.keySkills || [],
    application_url: data.applicationUrl || null,
    insights: data.description || null,
    remarks: data.remarks || null,
    connections: data.connections || [],
    createdAt: data.created_at || null
  };

  console.log("📡 FINAL PAYLOAD SENT TO BACKEND:", payload);

  return payload;
};


/**
 * =========================
 * ADMIN JOB APIs
 * =========================
 */

// ✅ Get All Jobs
export const getAllJobs = async () => {

  console.log("📡 FETCHING ALL JOBS");

  const res = await axiosClient.get("/admin/jobs");

  console.log("📥 JOBS RESPONSE:", res);

  return res;
};


// ✅ Create Job
export const createJob = async (data: any) => {

  console.log("📦 RAW CREATE DATA FROM UI:", data);

  const payload = mapJobToApi(data);

  const res = await axiosClient.post("/admin/jobs", payload);

  console.log("✅ CREATE JOB RESPONSE:", res);

  return res;
};


// ✅ Update Job
export const updateJob = async (jobId: string, data: any) => {

  console.log("📦 RAW UPDATE DATA FROM UI:", data);

  const payload = mapJobToApi(data);

  console.log("📤 SENDING UPDATE REQUEST:", jobId, payload);

  const res = await axiosClient.patch(`/admin/jobs/${jobId}`, payload);

  console.log("📥 UPDATE API RESPONSE:", res);

  return res;
};


// ✅ Delete Job
export const deleteJob = async (jobId: string) => {

  console.log("🗑 DELETE JOB:", jobId);

  const res = await axiosClient.delete(`/admin/jobs/${jobId}`);

  console.log("✅ DELETE RESPONSE:", res);

  return res;
};