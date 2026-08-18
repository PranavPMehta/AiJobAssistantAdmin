import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, GraduationCap } from "lucide-react";

import { getAiEngineerAcceleratorEnquiries } from "../api/adminEnquiryApi";
import { formatCreatedAt, matchesDateFilter } from "../lib/formatDate";
import { AiEngineerAcceleratorEnquiry } from "../types";

interface AiEngineerAcceleratorEnquiryTableProps {
  enquiries?: AiEngineerAcceleratorEnquiry[];
  pageSize?: number;
}

export const AiEngineerAcceleratorEnquiryTable: React.FC<
  AiEngineerAcceleratorEnquiryTableProps
> = ({ enquiries: enquiriesProp, pageSize = 20 }) => {
  const [enquiries, setEnquiries] = useState<AiEngineerAcceleratorEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchFilter, setSearchFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const enquiriesPerPage = pageSize;
  const visiblePages = 7;

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const data = await getAiEngineerAcceleratorEnquiries();
      setEnquiries(data);
    } catch (err) {
      console.error("Failed to load AI Engineer Accelerator enquiries:", err);
      setEnquiries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (enquiriesProp) {
      setEnquiries(enquiriesProp);
      setLoading(false);
      return;
    }

    fetchEnquiries();
  }, [enquiriesProp]);

  const filteredEnquiries = enquiries.filter((enquiry) => {
    const search = searchFilter.trim().toLowerCase();
    const fullName = `${enquiry.first_name} ${enquiry.last_name}`.trim();
    const searchMatch = search
      ? [
          fullName,
          enquiry.work_email,
          enquiry.phone_number,
          enquiry.current_role,
          enquiry.experience,
          enquiry.python_level,
          enquiry.program_name,
        ].some((value) => value?.toLowerCase().includes(search))
      : true;

    return searchMatch && matchesDateFilter(enquiry.created_at, dateFilter);
  });

  const indexOfLast = currentPage * enquiriesPerPage;
  const indexOfFirst = indexOfLast - enquiriesPerPage;
  const currentEnquiries = filteredEnquiries.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.max(1, Math.ceil(filteredEnquiries.length / enquiriesPerPage));

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

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  if (loading) {
    return (
      <div className="text-center py-20 text-slate-400">
        Loading AI Engineer Accelerator enquiries...
      </div>
    );
  }

  if (!enquiries.length) {
    return (
      <div className="text-center py-20 bg-surface-card rounded-xl border border-slate-800 border-dashed">
        <div className="flex justify-center mb-4">
          <GraduationCap size={48} className="text-slate-700" />
        </div>
        <div className="text-slate-400 font-medium mb-1">No enquiries found</div>
        <div className="text-sm text-slate-600">
          AI Engineer Accelerator form submissions will appear here.
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-3 mb-5 rounded-xl border border-slate-800/80 bg-slate-900/80 p-4 shadow-lg shadow-black/10 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="text"
            placeholder="Search by name, email, role..."
            value={searchFilter}
            onChange={(e) => {
              setSearchFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="h-10 w-full min-w-[240px] rounded-lg border border-slate-700/80 bg-slate-950/80 px-3 text-sm text-slate-200 outline-none transition focus:border-neon-green focus:ring-2 focus:ring-neon-green/10 sm:w-80"
          />

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="h-10 rounded-lg border border-slate-700/80 bg-slate-950/80 px-3 text-sm text-slate-200 outline-none transition focus:border-neon-green focus:ring-2 focus:ring-neon-green/10"
          />

          <button
            onClick={() => {
              setSearchFilter("");
              setDateFilter("");
              setCurrentPage(1);
            }}
            className="h-10 rounded-lg border border-slate-700 bg-slate-800/80 px-4 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-700"
          >
            Clear
          </button>
        </div>

        <div className="text-sm text-slate-400">
          Showing {filteredEnquiries.length === 0 ? 0 : indexOfFirst + 1}-
          {Math.min(indexOfLast, filteredEnquiries.length)} of {filteredEnquiries.length}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900/70 shadow-xl shadow-black/10">
        <div className="overflow-x-auto">
          <table className="min-w-[1180px] w-full divide-y divide-slate-800/80">
            <thead className="sticky top-0 z-10 bg-slate-950/95 backdrop-blur">
              <tr>
                <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">SR</th>
                <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Name</th>
                <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Work Email</th>
                <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Phone</th>
                <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Current Role</th>
                <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Experience</th>
                <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Python Level</th>
                <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Program</th>
                <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Submitted</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/70">
              {currentEnquiries.map((enquiry, index) => (
                <tr key={enquiry.enquiry_id} className="transition-colors hover:bg-slate-800/40">
                  <td className="px-5 py-4 text-xs font-medium text-slate-500">
                    {(indexOfFirst + index + 1).toString().padStart(2, "0")}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neon-cyan/20 bg-neon-cyan/10 text-sm font-semibold text-neon-cyan">
                        {(enquiry.first_name || "U").slice(0, 1).toUpperCase()}
                      </div>
                      <div className="text-sm font-semibold text-white">
                        {enquiry.first_name} {enquiry.last_name}
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-300">{enquiry.work_email}</td>
                  <td className="px-5 py-4 text-sm text-slate-300">{enquiry.phone_number}</td>
                  <td className="px-5 py-4 text-sm text-slate-300">{enquiry.current_role}</td>
                  <td className="px-5 py-4 text-sm text-slate-300">{enquiry.experience}</td>
                  <td className="px-5 py-4 text-sm text-slate-300">{enquiry.python_level}</td>
                  <td className="px-5 py-4 text-sm text-slate-300">{enquiry.program_name}</td>
                  <td className="px-5 py-4 text-sm text-slate-400">
                    {formatCreatedAt(enquiry.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredEnquiries.length > enquiriesPerPage && (
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
      )}
    </>
  );
};
