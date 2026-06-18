import axios from "axios";
import type { CreateJobType, Job } from "../types/jobType";

const API_URL = "http://127.0.0.1:8000/api/jobs/";

// Create job
export const createJob = async (jobData: CreateJobType) => {
  const token = localStorage.getItem("access");

  const response = await axios.post(API_URL, jobData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Get all jobs
export const getJobs = async (search = "") => {
  const token = localStorage.getItem("access");

  let url = "http://127.0.0.1:8000/api/jobs/list/";

  //  add search query param
  if (search && search.length >= 3) {
    url += `?search=${search}`;
  }

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Get single job
export const getJobById = async (id: number): Promise<Job> => {
  const token = localStorage.getItem("access");

  const response = await axios.get(`${API_URL}${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Apply for job
export const applyJob = async (jobId: number) => {
  const token = localStorage.getItem("access");

  const response = await axios.post(
    `${API_URL}${jobId}/apply/`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Employer - get applications
export const getEmployerApplications = async (status?: string) => {
  const token = localStorage.getItem("access");

  const url = status
    ? `http://127.0.0.1:8000/api/employer/applications/?status=${status}`
    : "http://127.0.0.1:8000/api/employer/applications/";

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Jobseeker - track applications
export const trackApplications = async () => {
  const token = localStorage.getItem("access");

  const response = await axios.get(
    "http://127.0.0.1:8000/api/applications/track/",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Update application status
export const updateApplicationStatus = async (id: number, status: string) => {
  const token = localStorage.getItem("access");

  await axios.patch(
    `http://127.0.0.1:8000/api/applications/${id}/`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// getting employer job counts

export const getEmployerJobs = async () => {
  const token = localStorage.getItem("access");

  const response = await axios.get(
    "http://127.0.0.1:8000/api/employer/jobs/",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// getting total application counts

export const getApplicationCount=async()=>{
  const token=localStorage.getItem("access");

  const response=await axios.get(
    "http://127.0.0.1:8000/api/employer/applications/count/",
    {
      headers:{
        Authorization:`Bearer ${token}`,
      },
    }
  );
  return response.data;
}

// getting shortlisted peeps count

export const getShortlistedCount=async()=>{
  const token=localStorage.getItem("access");

  const response=await axios.get(
    "http://127.0.0.1:8000/api/employer/applications/shortlisted-count/",
    {
      headers:{
        Authorization:`Bearer ${token}`,
      },
    }
  );
  return response.data
}
