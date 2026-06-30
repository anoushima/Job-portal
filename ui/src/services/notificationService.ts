import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

export interface NotificationItem {
  id: number;
  type: "application_update" | "job_match" | "new_applicant" | "company_registered";
  message: string;
  link: string;
  is_read: boolean;
  created_at: string;
}

function authHeaders() {
  const token = localStorage.getItem("access");
  return { Authorization: `Bearer ${token}` };
}

export const fetchNotifications = async (): Promise<NotificationItem[]> => {
  const response = await axios.get(`${API_URL}/notifications/`, {
    headers: authHeaders(),
  });
  return response.data;
};

export const markNotificationRead = async (id: number) => {
  await axios.patch(`${API_URL}/notifications/${id}/read/`, {}, {
    headers: authHeaders(),
  });
};

export const markAllNotificationsRead = async () => {
  await axios.patch(`${API_URL}/notifications/read-all/`, {}, {
    headers: authHeaders(),
  });
};
