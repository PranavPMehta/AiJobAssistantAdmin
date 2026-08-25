import axiosClient from "./axiosClient";

type JobQuery = {
  page?: number;
  size?: number;
  title?: string;
  date?: string;
};

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

  return {
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
    createdAt: data.created_at || null,
  };
};

export const getAllJobs = async (query: JobQuery = {}) => {
  const params = new URLSearchParams();
  params.set("page", String(query.page ?? 0));
  params.set("size", String(query.size ?? 50));
  if (query.title?.trim()) params.set("title", query.title.trim());
  if (query.date) params.set("date", query.date);

  return axiosClient.get(`/admin/jobs?${params.toString()}`);
};

export const getJobStats = async () => {
  return axiosClient.get("/admin/jobs/stats");
};

export const getJobSavedUsers = async (jobIds: string[] = []) => {
  const params = new URLSearchParams();
  if (jobIds.length) params.set("jobIds", jobIds.join(","));
  const query = params.toString();
  const res = await axiosClient.get(`/admin/jobs/saved-users${query ? `?${query}` : ""}`);
  return res?.savedUsersByJob || res?.data?.savedUsersByJob || {};
};

export const getJobsFromResponse = (res: any) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.jobs)) return res.jobs;
  if (Array.isArray(res?.data?.jobs)) return res.data.jobs;
  if (Array.isArray(res?.data)) return res.data;
  return [];
};

export const createJob = async (data: any) => {
  const payload = mapJobToApi(data);
  return axiosClient.post("/admin/jobs", payload);
};

export const updateJob = async (jobId: string, data: any) => {
  const payload = mapJobToApi(data);
  return axiosClient.patch(`/admin/jobs/${jobId}`, payload);
};

export const deleteJob = async (jobId: string) => {
  return axiosClient.delete(`/admin/jobs/${jobId}`);
};
