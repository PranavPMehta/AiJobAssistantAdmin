import axiosClient from "./axiosClient";

export const adminLogin = async (data: {
  username: string;
  password: string;
}) => {
  return axiosClient.post("/admin/login", data);
};