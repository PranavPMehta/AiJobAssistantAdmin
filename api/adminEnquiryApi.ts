import axiosClient from "./axiosClient";
import {
  AiEngineerAcceleratorEnquiry,
  CareerAuditBooking,
  DiscoveryCallEnquiry,
} from "../types";

const getEnquiriesFromResponse = <T>(res: unknown): T[] => {
  if (Array.isArray(res)) return res as T[];
  if (Array.isArray((res as any)?.enquiries)) return (res as any).enquiries;
  if (Array.isArray((res as any)?.data?.enquiries)) {
    return (res as any).data.enquiries;
  }

  if (typeof res === "string" && res.trim().startsWith("<!DOCTYPE html")) {
    console.error(
      "Admin enquiry API returned the admin HTML page instead of JSON. " +
        "The server is routing /admin/enquiries/* to the React app, not the backend."
    );
    return [];
  }

  console.warn("Admin enquiry response did not contain an enquiries array:", res);
  return [];
};

const getBookingsFromResponse = <T>(res: unknown): T[] => {
  if (Array.isArray(res)) return res as T[];
  if (Array.isArray((res as any)?.bookings)) return (res as any).bookings;
  if (Array.isArray((res as any)?.data?.bookings)) {
    return (res as any).data.bookings;
  }

  if (typeof res === "string" && res.trim().startsWith("<!DOCTYPE html")) {
    console.error(
      "Admin booking API returned the admin HTML page instead of JSON. " +
        "The server is routing /admin/bookings/* to the React app, not the backend."
    );
    return [];
  }

  console.warn("Admin booking response did not contain a bookings array:", res);
  return [];
};

export const getDiscoveryCallEnquiries = async (): Promise<DiscoveryCallEnquiry[]> => {
  const res = await axiosClient.get("/api/admin/enquiries/discovery-call");
  console.log("Discovery call enquiries response:", res);
  const enquiries = getEnquiriesFromResponse<DiscoveryCallEnquiry>(res);
  console.log("Discovery call enquiries normalized:", enquiries);
  return enquiries;
};

export const deleteDiscoveryCallEnquiry = async (enquiryId: string): Promise<void> => {
  await axiosClient.delete(`/api/admin/enquiries/discovery-call/${enquiryId}`);
};

export const getAiEngineerAcceleratorEnquiries =
  async (): Promise<AiEngineerAcceleratorEnquiry[]> => {
    const res = await axiosClient.get("/api/admin/enquiries/ai-engineer-accelerator");
    console.log("AI Engineer Accelerator enquiries response:", res);
    const enquiries = getEnquiriesFromResponse<AiEngineerAcceleratorEnquiry>(res);
    console.log("AI Engineer Accelerator enquiries normalized:", enquiries);
    return enquiries;
  };

export const deleteAiEngineerAcceleratorEnquiry = async (
  enquiryId: string
): Promise<void> => {
  await axiosClient.delete(`/api/admin/enquiries/ai-engineer-accelerator/${enquiryId}`);
};

export const getCareerAuditBookings = async (): Promise<CareerAuditBooking[]> => {
  const res = await axiosClient.get("/api/admin/bookings/career-audit");
  console.log("Career audit bookings response:", res);
  const bookings = getBookingsFromResponse<CareerAuditBooking>(res);
  console.log("Career audit bookings normalized:", bookings);
  return bookings;
};

export const deleteCareerAuditBooking = async (bookingId: string): Promise<void> => {
  await axiosClient.delete(`/api/admin/bookings/career-audit/${bookingId}`);
};

export const getCareerAuditResumeUrl = (
  bookingId: string,
  options: { inline?: boolean } = {}
): string => {
  const baseUrl = axiosClient.defaults.baseURL || window.location.origin;
  const query = options.inline ? "?inline=true" : "";

  return `${baseUrl.replace(/\/$/, "")}/api/bookings/career-audit/${bookingId}/resume${query}`;
};
