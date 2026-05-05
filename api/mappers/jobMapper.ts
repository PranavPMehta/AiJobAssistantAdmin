import { AdminJobRow, JobStatus } from "../types";

/**
 * Safe JSON parser
 * prevents crash when backend sends:
 * null | "" | [] | already-object
 */
const safeParse = (value: any) => {
  try {
    if (!value) return [];

    // already parsed (Spring may return object)
    if (typeof value === "object") return value;

    return JSON.parse(value);
  } catch {
    return [];
  }
};

/**
 * Backend Job → Frontend AdminJobRow
 */
export const mapJobFromApi = (j: any): AdminJobRow => {
  return {
    id: j.job_id ?? j.id,

    jobTitle: j.job_title ?? j.jobTitle ?? j.title ?? "",
    company: j.company ?? "",
    location: j.location ?? "",
    jobType: j.job_type ?? j.jobType ?? "",
    salary: j.salary ?? "",
    experience: j.experience ?? "",

    keySkills: Array.isArray(j.key_skills)
      ? j.key_skills
      : Array.isArray(j.keySkills)
        ? j.keySkills
        : safeParse(j.key_skills),

    applicationUrl: j.application_url ?? j.applicationUrl ?? j.website ?? "",
    description: j.insights ?? j.description ?? "",

    status: (j.status || "SAVED") as JobStatus,

    connections: safeParse(j.connections),

    proofs: j.proof_path ? [j.proof_path] : [],

    resume: j.resume_path ?? "",

    remarks: j.remarks ?? "",

    createdAt: j.created_at ?? j.createdAt ?? null
  };
}; 

/**
 * Map List
 */
export const mapJobsFromApi = (jobs: any[]): AdminJobRow[] => {
  if (!Array.isArray(jobs)) return [];

  return jobs.map(mapJobFromApi);
};
