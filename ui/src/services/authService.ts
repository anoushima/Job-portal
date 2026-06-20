// ui/src/services/authService.ts

import axios from "axios";
import type {
  EmployerRegisterPayload,
  RegisterResponse,
  LoginResponse,
  ResumeData,
  ApiFieldErrors,
} from "../types/authTypes";

const API_URL = "http://127.0.0.1:8000/api";

// ── Axios instance ────────────────────────────────────────────────────────
const API = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// ── Jobseeker Register ────────────────────────────────────────────────────
export const registerJobseeker = async (data: any) => {
  return axios.post(`${API_URL}/register/jobseeker/`, data);
};

// ── Employer Register ─────────────────────────────────────────────────────
export const registerEmployer = async (data: EmployerRegisterPayload) => {
  console.log("🔥 registerEmployer CALLED", data);
  try {
    const response = await API.post("/employer/register/", data);
    console.log("🔥 SUCCESS RESPONSE:", response.data);
    return response.data;
  } catch (err: any) {
    console.log("🔥 ERROR FULL:", err);
    console.log("🔥 ERROR RESPONSE:", err.response?.data);
    throw err;
  }
};

// ── Error parser ──────────────────────────────────────────────────────────
export const parseApiErrors = (err: unknown): ApiFieldErrors | null => {
  if (axios.isAxiosError(err) && err.response?.data) {
    return err.response.data as ApiFieldErrors;
  }
  return null;
};

// ── Email / Password Login ────────────────────────────────────────────────
export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(`${API_URL}/token/`, {
    email,
    password,
  });
  const { access, refresh, role, email: userEmail } = response.data;
  localStorage.setItem("access", access);
  localStorage.setItem("refresh", refresh);
  localStorage.setItem("role", role);
  localStorage.setItem("email", userEmail);
  return response.data;
};

// ── Google Sign-In ────────────────────────────────────────────────────────
/**
 * Send the Google ID token (credential) to the backend.
 * The backend verifies it with Google's public keys and returns our JWT.
 *
 * @param credential  The `credential` string from the GSI callback response
 * @param role        "jobseeker" (default) or "employer" — only for NEW accounts
 */
export const googleSignIn = async (
  credential: string,
  role: "jobseeker" | "employer" = "jobseeker"
): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(
    `${API_URL}/auth/google/`,
    { credential, role }
  );
  const { access, refresh, role: userRole, email } = response.data;
  localStorage.setItem("access", access);
  localStorage.setItem("refresh", refresh);
  localStorage.setItem("role", userRole);
  localStorage.setItem("email", email);
  return response.data;
};

// ── Resume Upload (AI Autofill) ───────────────────────────────────────────
export const parseResume = async (file: File): Promise<ResumeData> => {
  const formData = new FormData();
  formData.append("resume", file);
  const response = await axios.post(`${API_URL}/parse-resume/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// ── Company Register ──────────────────────────────────────────────────────
export const registerCompany = async (data: any) => {
  const token = localStorage.getItem("access"); // ← was "token", key is "access"
  const response = await axios.post(
    `${API_URL}/company/register/`,
    data,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};