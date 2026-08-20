import React, { useEffect, useState } from "react";
import {
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Trash2,
} from "lucide-react";

import {
  deleteCareerAuditBooking,
  getCareerAuditBookings,
  getCareerAuditResumeUrl,
} from "../api/adminEnquiryApi";
import { formatCreatedAt, matchesDateFilter } from "../lib/formatDate";
import { CareerAuditBooking } from "../types";

interface CareerAuditBookingTableProps {
  bookings?: CareerAuditBooking[];
  pageSize?: number;
}

const getResumeFileName = (resumePath?: string | null) => {
  if (!resumePath) return "";

  const normalizedPath = resumePath.replace(/\\/g, "/");
  return normalizedPath.slice(normalizedPath.lastIndexOf("/") + 1);
};

export const CareerAuditBookingTable: React.FC<CareerAuditBookingTableProps> = ({
  bookings: bookingsProp,
  pageSize = 20,
}) => {
  const [bookings, setBookings] = useState<CareerAuditBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchFilter, setSearchFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const bookingsPerPage = pageSize;
  const visiblePages = 7;

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await getCareerAuditBookings();
      setBookings(data);
    } catch (err) {
      console.error("Failed to load career audit bookings:", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bookingsProp) {
      setBookings(bookingsProp);
      setLoading(false);
      return;
    }

    fetchBookings();
  }, [bookingsProp]);

  const filteredBookings = bookings.filter((booking) => {
    const search = searchFilter.trim().toLowerCase();
    const resumeFileName = getResumeFileName(booking.resume_path);
    const searchMatch = search
      ? [
          booking.booking_id,
          booking.full_name,
          booking.email,
          booking.whatsapp_number,
          booking.slot_date,
          booking.slot_time,
          booking.time_zone,
          resumeFileName,
        ].some((value) => value?.toLowerCase().includes(search))
      : true;

    return searchMatch && matchesDateFilter(booking.created_at, dateFilter);
  });

  const indexOfLast = currentPage * bookingsPerPage;
  const indexOfFirst = indexOfLast - bookingsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / bookingsPerPage));

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

  const handleDelete = async (booking: CareerAuditBooking) => {
    const confirmed = window.confirm(
      `Hard delete career audit booking for ${booking.full_name}? This cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeletingId(booking.booking_id);
      await deleteCareerAuditBooking(booking.booking_id);
      setBookings((prev) =>
        prev.filter((item) => item.booking_id !== booking.booking_id)
      );
    } catch (err) {
      console.error("Failed to delete career audit booking:", err);
      alert("Failed to delete career audit booking. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-slate-400">
        Loading career audit bookings...
      </div>
    );
  }

  if (!bookings.length) {
    return (
      <div className="text-center py-20 bg-surface-card rounded-xl border border-slate-800 border-dashed">
        <div className="flex justify-center mb-4">
          <CalendarCheck size={48} className="text-slate-700" />
        </div>
        <div className="text-slate-400 font-medium mb-1">No bookings found</div>
        <div className="text-sm text-slate-600">
          Career audit bookings will appear here.
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
            placeholder="Search by name, email, date..."
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
          Showing {filteredBookings.length === 0 ? 0 : indexOfFirst + 1}-
          {Math.min(indexOfLast, filteredBookings.length)} of {filteredBookings.length}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900/70 shadow-xl shadow-black/10">
        <div className="overflow-x-auto">
          <table className="min-w-[1360px] w-full divide-y divide-slate-800/80">
            <thead className="sticky top-0 z-10 bg-slate-950/95 backdrop-blur">
              <tr>
                <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">SR</th>
                <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Name</th>
                <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Email</th>
                <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">WhatsApp</th>
                <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Slot Date</th>
                <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Slot Time</th>
                <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Timezone</th>
                <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Resume</th>
                <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Booked At</th>
                <th className="px-5 py-4 text-right text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/70">
              {currentBookings.map((booking, index) => {
                const resumeFileName = getResumeFileName(booking.resume_path);
                const hasResume = Boolean(booking.resume_path);

                return (
                  <tr key={booking.booking_id} className="transition-colors hover:bg-slate-800/40">
                    <td className="px-5 py-4 text-xs font-medium text-slate-500">
                      {(indexOfFirst + index + 1).toString().padStart(2, "0")}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neon-green/20 bg-neon-green/10 text-sm font-semibold text-neon-green">
                          {(booking.full_name || "U").slice(0, 1).toUpperCase()}
                        </div>
                        <div className="text-sm font-semibold text-white">{booking.full_name}</div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-300">{booking.email}</td>
                    <td className="px-5 py-4 text-sm text-slate-300">
                      {booking.whatsapp_number}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-300">{booking.slot_date}</td>
                    <td className="px-5 py-4 text-sm text-slate-300">{booking.slot_time}</td>
                    <td className="px-5 py-4 text-sm text-slate-300">
                      <span className="line-clamp-2 max-w-[260px]">{booking.time_zone}</span>
                    </td>
                    <td className="px-5 py-4">
                      {hasResume ? (
                        <div className="flex items-center gap-2">
                          <span
                            className="max-w-[170px] truncate text-sm text-slate-300"
                            title={resumeFileName}
                          >
                            {resumeFileName || "Resume"}
                          </span>
                          <a
                            href={getCareerAuditResumeUrl(booking.booking_id, { inline: true })}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-300 transition hover:border-neon-cyan hover:bg-neon-cyan/10 hover:text-neon-cyan"
                            title="View resume"
                            aria-label={`View resume for ${booking.full_name}`}
                          >
                            <Eye size={15} />
                          </a>
                          <a
                            href={getCareerAuditResumeUrl(booking.booking_id)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-300 transition hover:border-neon-green hover:bg-neon-green/10 hover:text-neon-green"
                            title="Download resume"
                            aria-label={`Download resume for ${booking.full_name}`}
                          >
                            <Download size={15} />
                          </a>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-500">Not uploaded</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-400">
                      {formatCreatedAt(booking.created_at)}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(booking)}
                        disabled={deletingId === booking.booking_id}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-300 transition hover:border-red-400 hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                        title="Hard delete"
                        aria-label={`Delete career audit booking for ${booking.full_name}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredBookings.length > bookingsPerPage && (
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
