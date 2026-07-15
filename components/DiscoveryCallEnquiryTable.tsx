import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Phone } from "lucide-react";

import { getDiscoveryCallEnquiries } from "../api/adminEnquiryApi";
import { formatCreatedAt, matchesDateFilter } from "../lib/formatDate";
import { DiscoveryCallEnquiry } from "../types";

interface DiscoveryCallEnquiryTableProps {
  enquiries?: DiscoveryCallEnquiry[];
  pageSize?: number;
}

export const DiscoveryCallEnquiryTable: React.FC<DiscoveryCallEnquiryTableProps> = ({
  enquiries: enquiriesProp,
  pageSize = 20,
}) => {
  const [enquiries, setEnquiries] = useState<DiscoveryCallEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchFilter, setSearchFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const enquiriesPerPage = pageSize;
  const visiblePages = 7;

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const data = await getDiscoveryCallEnquiries();
      setEnquiries(data);
    } catch (err) {
      console.error("Failed to load discovery call enquiries:", err);
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
    const searchMatch = search
      ? [
          enquiry.full_name,
          enquiry.email,
          enquiry.whatsapp_number,
          enquiry.current_role,
          enquiry.target_role,
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
        Loading discovery call enquiries...
      </div>
    );
  }

  if (!enquiries.length) {
    return (
      <div className="text-center py-20 bg-surface-card rounded-xl border border-slate-800 border-dashed">
        <div className="flex justify-center mb-4">
          <Phone size={48} className="text-slate-700" />
        </div>
        <div className="text-slate-400 font-medium mb-1">No enquiries found</div>
        <div className="text-sm text-slate-600">
          Discovery call form submissions will appear here.
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-3 mb-4 rounded-lg border border-slate-800 bg-surface-card p-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="text"
            placeholder="Search by name, email, role..."
            value={searchFilter}
            onChange={(e) => {
              setSearchFilter(e.target.value);
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
              setSearchFilter("");
              setDateFilter("");
              setCurrentPage(1);
            }}
            className="h-10 rounded-lg border border-slate-700 bg-slate-800 px-4 text-sm text-slate-200 hover:bg-slate-700"
          >
            Clear
          </button>
        </div>

        <div className="text-sm text-slate-400">
          Showing {filteredEnquiries.length === 0 ? 0 : indexOfFirst + 1}-
          {Math.min(indexOfLast, filteredEnquiries.length)} of {filteredEnquiries.length}
        </div>
      </div>

      <div className="bg-surface-card border border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[960px] w-full divide-y divide-slate-800">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs text-slate-500 uppercase">SR</th>
                <th className="px-4 py-3 text-left text-xs text-slate-500 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs text-slate-500 uppercase">Email</th>
                <th className="px-4 py-3 text-left text-xs text-slate-500 uppercase">WhatsApp</th>
                <th className="px-4 py-3 text-left text-xs text-slate-500 uppercase">Current Role</th>
                <th className="px-4 py-3 text-left text-xs text-slate-500 uppercase">Target Role</th>
                <th className="px-4 py-3 text-left text-xs text-slate-500 uppercase">Submitted</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800">
              {currentEnquiries.map((enquiry, index) => (
                <tr key={enquiry.enquiry_id} className="hover:bg-slate-800/30">
                  <td className="px-4 py-4 text-xs text-slate-500">
                    {(indexOfFirst + index + 1).toString().padStart(2, "0")}
                  </td>

                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-white">{enquiry.full_name}</div>
                    <div className="text-xs text-slate-500 truncate max-w-[180px]">
                      {enquiry.enquiry_id}
                    </div>
                  </td>

                  <td className="px-4 py-4 text-sm text-slate-300">{enquiry.email}</td>
                  <td className="px-4 py-4 text-sm text-slate-300">{enquiry.whatsapp_number}</td>
                  <td className="px-4 py-4 text-sm text-slate-300">{enquiry.current_role}</td>
                  <td className="px-4 py-4 text-sm text-slate-300">{enquiry.target_role}</td>
                  <td className="px-4 py-4 text-sm text-slate-400">
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
