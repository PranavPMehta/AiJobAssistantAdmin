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

const decodeHtmlEntities = (value: string) => {
  if (typeof document === "undefined") return value;
  const textarea = document.createElement("textarea");
  textarea.innerHTML = value;
  return textarea.value;
};

const htmlToText = (value: any) =>
  decodeHtmlEntities(value ? String(value) : "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h[1-6])>/gi, "\n")
    .replace(/<li[^>]*>/gi, "- ")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();

const normalizeConnections = (value: any) => {
  const connections = safeParse(value);
  if (!Array.isArray(connections)) return [];

  return connections
    .map((conn: any) => ({
      name: conn?.name ?? "",
      title: conn?.title ?? conn?.position ?? "",
      emailOrLinkedIn: conn?.emailOrLinkedIn ?? conn?.contact ?? conn?.linkedin ?? conn?.linkedIn ?? conn?.url ?? "",
      email: conn?.email ?? conn?.email_address ?? conn?.email_id ?? "",
      mobileNumber: conn?.mobileNumber ?? conn?.mobile ?? conn?.mobile_number ?? conn?.mobilenumber ?? conn?.phone ?? "",
    }))
    .filter((conn: any) =>
      conn.name || conn.title || conn.emailOrLinkedIn || conn.email || conn.mobileNumber
    );
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
    description: htmlToText(j.insights ?? j.description ?? ""),

    status: (j.status || "SAVED") as JobStatus,

    connections: normalizeConnections(j.connections),

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
