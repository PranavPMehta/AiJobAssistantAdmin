import axiosClient from "./axiosClient";

const ADMIN_REFERRALS_API = "/api/admin/referrals";

export type ReferralOverview = {
  stats?: Record<string, number>;
  contacts?: unknown[];
  openings?: unknown[];
  requests?: unknown[];
  companies?: unknown[];
};

export const getReferralOverview = async (): Promise<ReferralOverview> => {
  const overview = await axiosClient.get<ReferralOverview>(ADMIN_REFERRALS_API);

  // axiosClient's response interceptor returns the payload rather than AxiosResponse.
  return overview as unknown as ReferralOverview;
};
export const createReferralContact = (payload: Record<string, unknown>) =>
  axiosClient.post(`${ADMIN_REFERRALS_API}/contacts`, payload);
export const createReferralOpening = (payload: Record<string, unknown>) =>
  axiosClient.post(`${ADMIN_REFERRALS_API}/openings`, payload);
export const updateReferralOpening = (id: string,payload: Record<string, unknown>) =>
  axiosClient.patch(`${ADMIN_REFERRALS_API}/openings/${id}`, payload);
export const updateReferralOpeningStatus = (id: string, status: string) => 
  axiosClient.patch(`${ADMIN_REFERRALS_API}/openings/${id}/status`, { status });
export const deleteReferralOpening = (id: string) =>
  axiosClient.delete(`${ADMIN_REFERRALS_API}/openings/${id}`);
  export const updateReferralRequest = (id: string, payload: Record<string, unknown>) => 
    axiosClient.patch(`${ADMIN_REFERRALS_API}/requests/${id}`, payload);
export const sendReferralFollowUp = (id: string, payload?: { recipientEmail: string; message: string }) =>
  axiosClient.post(`${ADMIN_REFERRALS_API}/requests/${id}/follow-up`, payload || {});
export const sendReferralEmail = (id: string, payload: { recipientEmail: string; message: string }) =>
  axiosClient.post(`${ADMIN_REFERRALS_API}/requests/${id}/send`, payload);
export const updateReferralCompanyVisibility = (id: string, payload: Record<string, unknown>) =>
  axiosClient.patch(`${ADMIN_REFERRALS_API}/companies/${id}/visibility`, payload);
export const updateReferralContactStatus = (
  contactId: string,active: boolean) =>axiosClient.patch(`${ADMIN_REFERRALS_API}/contacts/${contactId}/status`,{ active });
export const deleteReferralContact = (contactId: string) =>
  axiosClient.delete(`${ADMIN_REFERRALS_API}/contacts/${contactId}`);
