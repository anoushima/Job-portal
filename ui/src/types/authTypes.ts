export type RegisterFormData = {
  first_name: string;
  last_name: string;
  
  email: string;
  password: string;
  role: string;

  // NEW PROFESSIONAL FIELDS
  phone?: string;
  skills?: string;
  experience?: string;
  education?: string;
};

// ── Employer Register Payload ─────────────────────────────────────────────

// export type EmployerRegisterPayload {
//   // User
//   full_name: string;
//   email: string;
//   password: string;
//   confirm_password: string;
//   role: "employer";

//   // Company
//   company_name: string;
//   industry: string;
//   company_size: string;
//   location: string;
//   website: string;
//   description: string;
// }

export type EmployerRegisterPayload = {
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
  company_name: string;
  industry?: string;
  company_size?: string;
  location: string;
  website?: string;
  description?: string;
};
// ── API Response 

export interface RegisterResponse {
  detail: string;
}

// ── API Errors

export interface ApiFieldErrors {
  full_name?: string[];
  first_name?: string[];
  last_name?: string[];

  email?: string[];
  password?: string[];
  confirm_password?: string[];

  phone?: string[];
  skills?: string[];
  experience?: string[];
  education?: string[];

  company_name?: string[];
  industry?: string[];
  company_size?: string[];
  location?: string[];
  website?: string[];
  description?: string[];

  detail?: string;
}

export type LoginResponse = {
  access: string;
  refresh: string;
  role: string;
  email: string;   
};

//  Resume Parser Response
export type ResumeData = {
  first_name?: string;
  last_name?: string;
  email?: string;
  
  phone?: string;
  skills?: string;
  experience?: string;
  education?: string;
};