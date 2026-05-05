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
} from "lucide-react";

import { AdminJobRow, JobStatus } from "../api/types";
import { mapJobsFromApi } from "../api/mappers/jobMapper";
import { getAllJobs, getJobsFromResponse, updateJob } from "../api/adminJobApi";

import { JobFormModal } from "./Modals";

interface JobTableProps {
  jobs?: any[];
  pageSize?: number;
  onEdit?: (job: AdminJobRow) => void;
  onStatusChange?: (job: AdminJobRow, newStatus: JobStatus) => void;
}

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

      const res: any = await getAllJobs();
      const mappedJobs = mapJobsFromApi(getJobsFromResponse(res));

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
      setJobs(mapJobsFromApi(jobsProp));
      setLoading(false);
      return;
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

  const handleUpdate = async (data: Partial<AdminJobRow>) => {

    if (!selectedJob) return;

    try {

      await updateJob(selectedJob.id, data);

      setModalOpen(false);
      fetchJobs();

    } catch (err) {

      console.error("Update failed", err);

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

          <table className="min-w-[1180px] w-full divide-y divide-slate-800 table-fixed">

            <thead className="bg-slate-900/50">

              <tr>

                <th className="w-12 px-4 py-3 text-left text-xs text-slate-500 uppercase">SR</th>
                <th className="w-48 px-4 py-3 text-left text-xs text-slate-500 uppercase">Job Title</th>
                <th className="w-40 px-4 py-3 text-left text-xs text-slate-500 uppercase">Company</th>
                <th className="w-32 px-4 py-3 text-left text-xs text-slate-500 uppercase">Location</th>
                <th className="w-28 px-4 py-3 text-left text-xs text-slate-500 uppercase">Created</th>
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

    </>
  );
};
