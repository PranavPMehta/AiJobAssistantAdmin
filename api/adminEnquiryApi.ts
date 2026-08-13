import axiosClient from "./axiosClient";
import {
  AiEngineerAcceleratorEnquiry,
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

export const getDiscoveryCallEnquiries = async (): Promise<DiscoveryCallEnquiry[]> => {
  const res = await axiosClient.get("/admin/enquiries/discovery-call");
  console.log("Discovery call enquiries response:", res);
  const enquiries = getEnquiriesFromResponse<DiscoveryCallEnquiry>(res);
  console.log("Discovery call enquiries normalized:", enquiries);
  return enquiries;
};

export const getAiEngineerAcceleratorEnquiries =
  async (): Promise<AiEngineerAcceleratorEnquiry[]> => {
    const res = await axiosClient.get("/admin/enquiries/ai-engineer-accelerator");
    console.log("AI Engineer Accelerator enquiries response:", res);
    const enquiries = getEnquiriesFromResponse<AiEngineerAcceleratorEnquiry>(res);
    console.log("AI Engineer Accelerator enquiries normalized:", enquiries);
    return enquiries;
  };
