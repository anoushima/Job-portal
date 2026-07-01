import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

function authHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem("access")}` };
}

export const getAdminUsers = async () => {
  const { data } = await axios.get(`${API_URL}/admin/users/`, { headers: authHeaders() });
  return data;
};

export const getAdminEmployers = async () => {
  const { data } = await axios.get(`${API_URL}/admin/employers/`, { headers: authHeaders() });
  return data;
};

export const getAdminJobs = async () => {
  const { data } = await axios.get(`${API_URL}/admin/jobs/`, { headers: authHeaders() });
  return data;
};

export const getAdminApplications = async () => {
  const { data } = await axios.get(`${API_URL}/admin/applications/`, { headers: authHeaders() });
  return data;
};

export const getAdminReports = async (status?: string) => {
  const url = status && status !== "all"
    ? `${API_URL}/admin/reports/?status=${status}`
    : `${API_URL}/admin/reports/`;
  const { data } = await axios.get(url, { headers: authHeaders() });
  return data;
};

export const updateReportStatus = async (id: number, status: string) => {
  const { data } = await axios.patch(
    `${API_URL}/admin/reports/${id}/`,
    { status },
    { headers: authHeaders() }
  );
  return data;
};

export const toggleUserActive = async (id: number) => {
  const { data } = await axios.patch(
    `${API_URL}/admin/users/${id}/toggle-active/`,
    {},
    { headers: authHeaders() }
  );
  return data;
};

export const toggleJobActive = async (id: number) => {
  const { data } = await axios.patch(
    `${API_URL}/admin/jobs/${id}/toggle-active/`,
    {},
    { headers: authHeaders() }
  );
  return data;
};
