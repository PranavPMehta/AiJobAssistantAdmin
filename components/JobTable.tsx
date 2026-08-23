import React, { useEffect, useState } from "react";
import {
  Edit,
  ExternalLink,
  Paperclip,
  FileText,
  Users,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

import { AdminJobRow, JobStatus } from "../api/types";
import { mapJobsFromApi } from "../api/mappers/jobMapper";
import { getAllJobs, getJobSavedUsers, getJobsFromResponse, updateJob } from "../api/adminJobApi";

import { JobFormModal } from "./Modals";

interface JobTableProps {
  jobs?: any[];
  pageSize?: number;
  onEdit?: (job: AdminJobRow) => void;
  onStatusChange?: (job: AdminJobRow, newStatus: JobStatus) => void;
}

type SavedUser = NonNullable<AdminJobRow["savedBy"]>[number];

export const JobTable: React.FC<JobTableProps> = ({
  jobs: jobsProp,
  pageSize = 20,
  onEdit,
  onStatusChange,
}) => {

  /* ================= STATE ================= */

  const [jobs, setJobs] = useState<AdminJobRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedJob, setSelectedJob] = useState<AdminJobRow | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [savedUsersJob, setSavedUsersJob] = useState<AdminJobRow | null>(null);

  const [currentPage, setCurrentPage] = useState(1);

  const [titleFilter, setTitleFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const jobsPerPage = pageSize;
  const visiblePages = 7;

  const formatCreatedAt = (createdAt: any) => {
    if (!createdAt) return "-";

    const date = Array.isArray(createdAt)
      ? new Date(
          createdAt[0],
          createdAt[1] - 1,
          createdAt[2],
          createdAt[3] || 0,
          createdAt[4] || 0,
          createdAt[5] || 0
        )
      : new Date(createdAt);

    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const attachSavedUsers = (rows: AdminJobRow[], savedUsersByJob: Record<string, any[]> = {}) =>
    rows.map((job) => ({
      ...job,
      savedBy: savedUsersByJob[job.id] || [],
    }));

  /* ================= FILTER ================= */

  const filteredJobs = jobs.filter((job) => {

  const titleMatch = titleFilter
    ? job.jobTitle?.toLowerCase().includes(titleFilter.toLowerCase())
    : true;

  let dateMatch = true;

  if (dateFilter) {

  const createdAt = job.createdAt;
  const jobDate = Array.isArray(createdAt)
    ? new Date(createdAt[0], createdAt[1] - 1, createdAt[2])
    : new Date(createdAt || "");

  if (Number.isNaN(jobDate.getTime())) {
    dateMatch = false;
  } else {
    const formatted =
      jobDate.getFullYear() +
      "-" +
      String(jobDate.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(jobDate.getDate()).padStart(2, "0");

    dateMatch = formatted === dateFilter;
  }

}

  return titleMatch && dateMatch;

});

  /* ================= PAGINATION ================= */

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;

  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const pageWindowStart = Math.max(
    1,
    Math.min(
      currentPage - Math.floor(visiblePages / 2),
      Math.max(1, totalPages - visiblePages + 1)
    )
  );
  const pageWindowEnd = Math.min(totalPages, pageWindowStart + visiblePages - 1);
  const pageNumbers = Array.from(
    { length: pageWindowEnd - pageWindowStart + 1 },
    (_, i) => pageWindowStart + i
  );

  /* ================= FETCH JOBS ================= */

  const fetchJobs = async () => {
    try {
      setLoading(true);

      const [res, savedUsersByJob]: any = await Promise.all([
        getAllJobs(),
        getJobSavedUsers().catch(() => ({})),
      ]);
      const mappedJobs = attachSavedUsers(
        mapJobsFromApi(getJobsFromResponse(res)),
        savedUsersByJob
      );

      setJobs(mappedJobs);

    } catch (err) {

      console.error("Failed to load jobs:", err);
      setJobs([]);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    if (jobsProp) {
      let cancelled = false;
      const hydrateJobs = async () => {
        const savedUsersByJob = await getJobSavedUsers().catch(() => ({}));
        if (!cancelled) {
          setJobs(attachSavedUsers(mapJobsFromApi(jobsProp), savedUsersByJob));
          setLoading(false);
        }
      };

      hydrateJobs();
      return () => {
        cancelled = true;
      };
    }

    fetchJobs();
  }, [jobsProp]);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  /* ================= EDIT ================= */

  const handleEdit = (job: AdminJobRow) => {

    setSelectedJob(job);
    setModalOpen(true);

    if (onEdit) {
      onEdit(job);
    }

  };

  const handleStatusChange = async (job: AdminJobRow, newStatus: JobStatus) => {
    setJobs((prev) =>
      prev.map((item) =>
        item.id === job.id ? { ...item, status: newStatus } : item
      )
    );

    try {
      await updateJob(job.id, { ...job, status: newStatus });
      onStatusChange?.(job, newStatus);
    } catch (err) {
      console.error("Status update failed", err);
      setJobs((prev) =>
        prev.map((item) =>
          item.id === job.id ? { ...item, status: job.status } : item
        )
      );
    }
  };

  /* ================= STATUS COLOR ================= */

  const getStatusColor = (status: JobStatus) => {

    switch (status) {

      case JobStatus.SAVED:
        return "text-slate-400 bg-slate-400/10 border-slate-400/20";

      case JobStatus.APPLIED:
        return "text-blue-400 bg-blue-400/10 border-blue-400/20";

      case JobStatus.INTERVIEW:
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";

      case JobStatus.OFFER:
        return "text-neon-green bg-neon-green/10 border-neon-green/20";

      case JobStatus.REJECTED:
        return "text-red-400 bg-red-400/10 border-red-400/20";

      default:
        return "text-slate-400 bg-slate-400/10 border-slate-400/20";

    }
  };

  const SavedByCell = ({ job }: { job: AdminJobRow }) => {
    const savedBy = job.savedBy || [];
    const firstUser = savedBy[0];

    if (!savedBy.length) {
      return <span className="text-xs text-slate-600">Not saved yet</span>;
    }

    return (
      <button
        type="button"
        onClick={() => setSavedUsersJob(job)}
        className="w-full rounded-md border border-neon-green/20 bg-neon-green/10 p-2 text-left transition hover:border-neon-green/50 hover:bg-neon-green/15"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="line-clamp-1 text-xs font-semibold text-white">
            {firstUser?.name || firstUser?.email || "User"}
          </span>
          <span className="shrink-0 rounded border border-neon-green/20 bg-neon-green/10 px-1.5 py-0.5 text-[9px] uppercase text-neon-green">
            {savedBy.length} saved
          </span>
        </div>
        {firstUser?.email && (
          <div className="line-clamp-1 text-[10px] text-slate-500">{firstUser.email}</div>
        )}
        <div className="mt-1 text-[10px] text-slate-400">
          {savedBy.length > 1 ? `+${savedBy.length - 1} more users` : `Saved ${formatCreatedAt(firstUser?.savedAt)}`}
        </div>
      </button>
    );
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="text-center py-20 text-slate-400">
        Loading jobs...
      </div>
    );
  }

  /* ================= EMPTY ================= */

  if (!jobs || jobs.length === 0) {

    return (
      <div className="text-center py-20 bg-surface-card rounded-xl border border-slate-800 border-dashed">

        <div className="flex justify-center mb-4">
          <Briefcase size={48} className="text-slate-700" />
        </div>

        <div className="text-slate-400 font-medium mb-1">
          No jobs found
        </div>

        <div className="text-sm text-slate-600">
          No job applications available.
        </div>

      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <>

      {/* ================= FILTER BAR ================= */}

      <div className="flex flex-col gap-3 mb-4 rounded-lg border border-slate-800 bg-surface-card p-3 md:flex-row md:items-center md:justify-between">

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="text"
            placeholder="Filter by job title"
            value={titleFilter}
            onChange={(e) => {
              setTitleFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="h-10 w-full min-w-[220px] rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-slate-200 outline-none focus:border-neon-green sm:w-72"
          />

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="h-10 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-slate-200 outline-none focus:border-neon-green"
          />

          <button
            onClick={() => {
              setTitleFilter("");
              setDateFilter("");
              setCurrentPage(1);
            }}
            className="h-10 rounded-lg border border-slate-700 bg-slate-800 px-4 text-sm text-slate-200 hover:bg-slate-700"
          >
            Clear
          </button>
        </div>

        <div className="text-sm text-slate-400">
          Showing {filteredJobs.length === 0 ? 0 : indexOfFirstJob + 1}-
          {Math.min(indexOfLastJob, filteredJobs.length)} of {filteredJobs.length}
        </div>

      </div>


      {/* ================= TABLE ================= */}

      <div className="bg-surface-card border border-slate-800 rounded-xl shadow-sm overflow-hidden">

        <div className="overflow-x-auto">

          <table className="min-w-[1380px] w-full divide-y divide-slate-800 table-fixed">

            <thead className="bg-slate-900/50">

              <tr>

                <th className="w-12 px-4 py-3 text-left text-xs text-slate-500 uppercase">SR</th>
                <th className="w-48 px-4 py-3 text-left text-xs text-slate-500 uppercase">Job Title</th>
                <th className="w-40 px-4 py-3 text-left text-xs text-slate-500 uppercase">Company</th>
                <th className="w-32 px-4 py-3 text-left text-xs text-slate-500 uppercase">Location</th>
                <th className="w-28 px-4 py-3 text-left text-xs text-slate-500 uppercase">Created</th>
                <th className="w-56 px-4 py-3 text-left text-xs text-slate-500 uppercase">Saved By</th>
                <th className="w-36 px-4 py-3 text-left text-xs text-slate-500 uppercase">Skills</th>
                <th className="w-20 px-4 py-3 text-left text-xs text-slate-500 uppercase">Website</th>
                <th className="w-36 px-4 py-3 text-left text-xs text-slate-500 uppercase">Status</th>
                <th className="w-28 px-4 py-3 text-center text-xs text-slate-500 uppercase">Links</th>
                <th className="w-20 px-4 py-3 text-center text-xs text-slate-500 uppercase">Proof</th>
                <th className="w-20 px-4 py-3 text-center text-xs text-slate-500 uppercase">Resume</th>
                <th className="w-52 px-4 py-3 text-left text-xs text-slate-500 uppercase">Remarks</th>
                <th className="w-16 px-4 py-3 text-right text-xs text-slate-500 uppercase">Edit</th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-800">

              {currentJobs.map((job, index) => (
                
                <tr key={job.id} className="hover:bg-slate-800/30">

                  <td className="px-4 py-4 text-xs text-slate-500">
                    {(indexOfFirstJob + index + 1).toString().padStart(2, "0")}
                  </td>

                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-white">
                      <span className="line-clamp-2">{job.jobTitle}</span>
                    </div>
                    <div className="text-xs text-slate-500">
                      {job.jobType}
                    </div>
                  </td>

                  <td className="px-4 py-4 text-sm text-slate-300">
                    <span className="line-clamp-2">{job.company}</span>
                  </td>

                  <td className="px-4 py-4 text-sm text-slate-400">
                    <span className="line-clamp-2">{job.location}</span>
                  </td>

                  <td className="px-4 py-4 text-sm text-slate-400">
                    {formatCreatedAt(job.createdAt)}
                  </td>

                  <td className="px-4 py-4 align-top">
                    <SavedByCell job={job} />
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1">
                      {(job.keySkills || []).slice(0, 2).map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded text-[10px] border border-slate-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    {job.applicationUrl ? (
                      <a
                        href={job.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neon-cyan"
                      >
                        <ExternalLink size={14} />
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>

                  <td className="px-4 py-4">
                    <select
                      value={job.status}
                      onChange={(e) =>
                        handleStatusChange(job, e.target.value as JobStatus)
                      }
                      className={`w-full text-xs px-2 py-1 rounded-lg border bg-slate-950 ${getStatusColor(
                        job.status
                      )}`}
                    >
                      {Object.values(JobStatus).map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </td>

                  <td className="px-4 py-4 text-center">
                    <Users size={16} />
                    {job.connections?.length > 0 && (
                      <span className="ml-1 text-[10px] text-neon-green">
                        {job.connections.length}
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-4 text-center">
                    <Paperclip size={16} />
                  </td>

                  <td className="px-4 py-4 text-center">
                    <FileText
                      size={16}
                      className={
                        job.resume
                          ? "text-neon-emerald"
                          : "text-slate-600"
                      }
                    />
                  </td>

                  <td className="px-4 py-4 text-xs text-slate-400">
                    <span className="line-clamp-2">{job.remarks || "No remarks"}</span>
                  </td>

                  <td className="px-4 py-4 text-right">
                    <button
                      onClick={() => handleEdit(job)}
                      className="hover:text-neon-cyan transition"
                    >
                      <Edit size={16} />
                    </button>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* ================= PAGINATION ================= */}

      <div className="flex justify-center items-center gap-2 mt-6">

        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-300 disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {pageWindowStart > 1 && (
          <>
            <button
              onClick={() => setCurrentPage(1)}
              className="h-9 min-w-9 rounded-lg border border-slate-700 bg-slate-800 px-3 text-sm text-slate-300"
            >
              1
            </button>
            <span className="px-1 text-slate-500">...</span>
          </>
        )}

        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`h-9 min-w-9 rounded-lg border px-3 text-sm ${
              currentPage === page
                ? "border-neon-cyan bg-neon-cyan text-black"
                : "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {page}
          </button>
        ))}

        {pageWindowEnd < totalPages && (
          <>
            <span className="px-1 text-slate-500">...</span>
            <button
              onClick={() => setCurrentPage(totalPages)}
              className="h-9 min-w-9 rounded-lg border border-slate-700 bg-slate-800 px-3 text-sm text-slate-300"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-300 disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>

      </div>

      {/* ================= MODAL ================= */}

      <JobFormModal
        open={modalOpen}
        job={selectedJob}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchJobs}
      />

      <SavedUsersModal
        job={savedUsersJob}
        onClose={() => setSavedUsersJob(null)}
        formatCreatedAt={formatCreatedAt}
      />

    </>
  );
};

const SavedUsersModal = ({
  job,
  onClose,
  formatCreatedAt,
}: {
  job: AdminJobRow | null;
  onClose: () => void;
  formatCreatedAt: (createdAt: any) => string;
}) => {
  if (!job) return null;

  const savedUsers = job.savedBy || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-slate-700 bg-surface-card shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-800 p-5">
          <div>
            <h2 className="text-lg font-semibold text-white">Saved By Users</h2>
            <p className="mt-1 text-sm text-slate-400">
              {job.jobTitle} · {job.company}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
            aria-label="Close saved users popup"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[65vh] overflow-y-auto p-5">
          {savedUsers.length > 0 ? (
            <div className="space-y-3">
              {savedUsers.map((savedUser: SavedUser, savedIndex: number) => (
                <div
                  key={`${savedUser.userJobId || savedUser.userId || savedIndex}`}
                  className="rounded-lg border border-slate-800 bg-slate-950/70 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="line-clamp-1 text-sm font-semibold text-white">
                        {savedUser.name || savedUser.email || "User"}
                      </p>
                      <p className="mt-1 break-all text-xs text-slate-400">
                        {savedUser.email || "No email available"}
                      </p>
                    </div>
                    {savedUser.status && (
                      <span className="shrink-0 rounded border border-neon-green/20 bg-neon-green/10 px-2 py-1 text-[10px] uppercase text-neon-green">
                        {savedUser.status}
                      </span>
                    )}
                  </div>
                  <div className="mt-3 text-xs text-slate-500">
                    Saved {formatCreatedAt(savedUser.savedAt)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-6 text-center text-sm text-slate-500">
              No users have saved this job yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
