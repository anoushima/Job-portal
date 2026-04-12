import axios from "axios";
import type { EmployerRegisterPayload,RegisterResponse, LoginResponse, ResumeData,ApiFieldErrors } from "../types/authTypes";

const API_URL = "http://127.0.0.1:8000/api";

// 🔹 Register
// export const registerUser = async (data: RegisterFormData) => {
//   const response = await axios.post(`${API_URL}/register/`, data);
//   return response.data;
// };

export const registerJobseeker = async (data: any) => {
  return axios.post(`${API_URL}/register/jobseeker/`, data);
};

// Axios instance
const API = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Employer Register
export const registerEmployer = async (data: EmployerRegisterPayload) => {
  console.log("🔥 registerEmployer CALLED");
  console.log("DATA:", data);

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

// Error parser
export const parseApiErrors = (err: unknown): ApiFieldErrors | null => {
  if (axios.isAxiosError(err) && err.response?.data) {
    return err.response.data as ApiFieldErrors;
  }
  return null;
};



// 🔹 Login
export const loginUser = async (email: string, password: string) => {
  const response = await axios.post<LoginResponse>(`${API_URL}/token/`, {
    email,
    password,
  });

  localStorage.setItem("access", response.data.access);
  localStorage.setItem("refresh", response.data.refresh);
  localStorage.setItem("role", response.data.role);
  localStorage.setItem("email", response.data.email);

  return response.data;
};

// Resume Upload (AI Autofill)

export const parseResume = async (file: File): Promise<ResumeData> => {
  const formData = new FormData();
  formData.append("resume", file);

  const response = await axios.post(`${API_URL}/parse-resume/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// company reg
export const registerCompany = async (data: any) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    "http://127.0.0.1:8000/api/company/register/",
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};