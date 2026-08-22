import axiosClient from "./axiosClient";

/**
 * =========================
 * HELPER: FRONTEND → BACKEND MAPPER
 * =========================
 */

const mapJobToApi = (data: any) => {
  const connections = Array.isArray(data.connections)
    ? data.connections
        .map((conn: any) => ({
          name: conn?.name || "",
          title: conn?.title || "",
          emailOrLinkedIn: conn?.emailOrLinkedIn || conn?.contact || conn?.linkedin || "",
          email: conn?.email || "",
          mobileNumber: conn?.mobileNumber || conn?.mobile || conn?.mobilenumber || "",
        }))
        .filter((conn: any) =>
          conn.name || conn.title || conn.emailOrLinkedIn || conn.email || conn.mobileNumber
        )
    : [];

  const payload = {
    job_title: data.jobTitle,
    company: data.company,
    location: data.location,
    job_type: data.jobType,
    salary: data.salary || null,
    experience: data.experience || null,
    key_skills: data.keySkills || [],
    application_url: data.applicationUrl || null,
    status: data.status || "Saved",
    insights: data.description || null,
    remarks: data.remarks || null,
    connections,
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

export const getJobSavedUsers = async () => {
  const res = await axiosClient.get("/admin/jobs/saved-users");
  return res?.savedUsersByJob || res?.data?.savedUsersByJob || {};
};

export const getJobsFromResponse = (res: any) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.jobs)) return res.jobs;
  if (Array.isArray(res?.data?.jobs)) return res.data.jobs;
  if (Array.isArray(res?.data)) return res.data;
  return [];
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
