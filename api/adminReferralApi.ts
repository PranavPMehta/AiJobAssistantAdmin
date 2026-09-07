import axiosClient from "./axiosClient";

export const getReferralOverview = () => axiosClient.get("/admin/referrals");
export const createReferralContact = (payload: Record<string, unknown>) =>
  axiosClient.post("/admin/referrals/contacts", payload);
export const createReferralOpening = (payload: Record<string, unknown>) =>
  axiosClient.post("/admin/referrals/openings", payload);
export const updateReferralOpening = (id: string,payload: Record<string, unknown>) =>
  axiosClient.patch(`/admin/referrals/openings/${id}`, payload);
export const updateReferralOpeningStatus = (id: string, status: string) => 
  axiosClient.patch(`/admin/referrals/openings/${id}/status`, { status });
  export const updateReferralRequest = (id: string, payload: Record<string, unknown>) => 
    axiosClient.patch(`/admin/referrals/requests/${id}`, payload);
export const sendReferralFollowUp = (id: string) =>
  axiosClient.post(`/admin/referrals/requests/${id}/follow-up`);
export const updateReferralCompanyVisibility = (id: string, payload: Record<string, unknown>) =>
  axiosClient.patch(`/admin/referrals/companies/${id}/visibility`, payload);
export const updateReferralContactStatus = (
  contactId: string,active: boolean) =>axiosClient.patch(`/admin/referrals/contacts/${contactId}/status`,{ active });