import React, { useEffect, useState } from "react";
import {
  Edit,
  ExternalLink,
  Paperclip,
  FileText,
  Users,
  Briefcase,
} from "lucide-react";

import { AdminJobRow, JobStatus } from "../api/types";
import { mapJobsFromApi } from "../api/mappers/jobMapper";
import { getAllJobs, updateJob } from "../api/adminJobApi";

import { JobFormModal } from "./Modals";

interface JobTableProps {
  onEdit?: (job: AdminJobRow) => void;
  onStatusChange?: (job: AdminJobRow, newStatus: JobStatus) => void;
}

export const JobTable: React.FC<JobTableProps> = ({
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

  const jobsPerPage = 20;

  /* ================= FILTER ================= */

  const filteredJobs = jobs.filter((job) => {

  const titleMatch = titleFilter
    ? job.jobTitle?.toLowerCase().includes(titleFilter.toLowerCase())
    : true;

  let dateMatch = true;

  if (dateFilter) {

  if (Array.isArray(job.createdAt)) {

    const jobDate = new Date(
      job.createdAt[0],
      job.createdAt[1] - 1,
      job.createdAt[2]
    );

    const formatted =
      jobDate.getFullYear() +
      "-" +
      String(jobDate.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(jobDate.getDate()).padStart(2, "0");

    dateMatch = formatted === dateFilter;

  } else {

    dateMatch = false;

  }

}

  return titleMatch && dateMatch;

});

  /* ================= PAGINATION ================= */

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;

  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  /* ================= FETCH JOBS ================= */

  const fetchJobs = async () => {
    try {
      setLoading(true);

      const res: any = await getAllJobs();
      const mappedJobs = mapJobsFromApi(res.jobs);

      setJobs(mappedJobs);

    } catch (err) {

      console.error("Failed to load jobs:", err);
      setJobs([]);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

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

      <div className="flex flex-wrap items-center gap-3 mb-4">

        <input
          type="text"
          placeholder="Filter by Job Title"
          value={titleFilter}
          onChange={(e) => {
            setTitleFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-2 bg-slate-900 border border-slate-700 rounded text-sm"
        />

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => {
            setDateFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-2 bg-slate-900 border border-slate-700 rounded text-sm"
        />

        <button
          onClick={() => {
            setTitleFilter("");
            setDateFilter("");
            setCurrentPage(1);
          }}
          className="px-3 py-2 text-sm bg-slate-800 border border-slate-700 rounded"
        >
          Clear
        </button>

      </div>


      {/* ================= TABLE ================= */}

      <div className="bg-surface-card border border-slate-800 rounded-xl shadow-sm overflow-hidden">

        <div className="overflow-x-auto">

          <table className="min-w-full divide-y divide-slate-800">

            <thead className="bg-slate-900/50">

              <tr>

                <th className="px-4 py-3 text-xs text-slate-500 uppercase">SR</th>
                <th className="px-4 py-3 text-xs text-slate-500 uppercase">Job Title</th>
                <th className="px-4 py-3 text-xs text-slate-500 uppercase">Company</th>
                <th className="px-4 py-3 text-xs text-slate-500 uppercase">Location</th>
                <th className="px-4 py-3 text-xs text-slate-500 uppercase">Created At</th>
                <th className="px-4 py-3 text-xs text-slate-500 uppercase">Skills</th>
                <th className="px-4 py-3 text-xs text-slate-500 uppercase">Website</th>
                <th className="px-4 py-3 text-xs text-slate-500 uppercase">Status</th>
                <th className="px-4 py-3 text-xs text-slate-500 uppercase text-center">Connections</th>
                <th className="px-4 py-3 text-xs text-slate-500 uppercase text-center">Proof</th>
                <th className="px-4 py-3 text-xs text-slate-500 uppercase text-center">Resume</th>
                <th className="px-4 py-3 text-xs text-slate-500 uppercase">Remarks</th>
                <th className="px-4 py-3 text-xs text-slate-500 uppercase text-right">Edit</th>

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
                      {job.jobTitle}
                    </div>
                    <div className="text-xs text-slate-500">
                      {job.jobType}
                    </div>
                  </td>

                  <td className="px-4 py-4 text-sm text-slate-300">
                    {job.company}
                  </td>

                  <td className="px-4 py-4 text-sm text-slate-400">
                    {job.location}
                  </td>

                <td className="px-4 py-4 text-sm text-slate-400">
  {Array.isArray(job.createdAt)
    ? new Date(
        job.createdAt[0],
        job.createdAt[1] - 1,
        job.createdAt[2],
        job.createdAt[3],
        job.createdAt[4],
        job.createdAt[5]
      ).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-"}
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
                        onStatusChange?.(
                          job,
                          e.target.value as JobStatus
                        )
                      }
                      className={`text-xs px-2 py-1 rounded-full border bg-transparent ${getStatusColor(
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

                  <td className="px-4 py-4 text-xs text-slate-400 truncate">
                    {job.remarks || "No remarks"}
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
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-3 py-1 text-sm bg-slate-800 border border-slate-700 rounded disabled:opacity-40"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => (

          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 text-sm border rounded ${
              currentPage === i + 1
                ? "bg-neon-cyan text-black"
                : "bg-slate-800 border-slate-700"
            }`}
          >
            {i + 1}
          </button>

        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-3 py-1 text-sm bg-slate-800 border border-slate-700 rounded disabled:opacity-40"
        >
          Next
        </button>

      </div>

      {/* ================= MODAL ================= */}

      <JobFormModal
        open={modalOpen}
        job={selectedJob}
        onClose={() => setModalOpen(false)}
        onUpdate={handleUpdate}
      />

    </>
  );
};