import axios from "axios";
import type { RegisterFormData,LoginResponse } from "../types/authTypes";

const API_URL = "http://127.0.0.1:8000/api";

export const registerUser = async (data: RegisterFormData) => {
  const response = await axios.post(`${API_URL}/register/`, data);
  return response.data;
};

export const loginUser=async(username:string,password:string)=>{
    const response=await axios.post<LoginResponse>(`${API_URL}/token/`,{
        username,
        password,
    });


    localStorage.setItem("access", response.data.access);
    localStorage.setItem("refresh", response.data.refresh);

    return response.data;
}