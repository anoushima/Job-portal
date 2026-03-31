import React, { useState } from "react";
import { useNavigate,Link } from "react-router-dom"
import type { RegisterFormData } from "../types/authTypes";
import { registerUser } from "../services/authService";


const Register=()=>{
  const navigate=useNavigate();
  const [formData,setFormData]=useState<RegisterFormData>({
    first_name:"",
    last_name:"",
    username:"",
    email:"",
    password:"",
    role:"jobseeker",
  });
  const[error,setError]=useState("");

  const handleChange=(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  )=>{
    setFormData({
      ...formData,
      [e.target.name]:e.target.value,
    });
  };

  const handleSubmit=async(e: React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();

    try{
      await registerUser(formData);
      alert("Registration is successful! please Login");
      navigate("/");
    }catch(err:any){
      if(err.response?.data?.username){
        setError("Username already exists");
      }else{
        setError("Registration failed");
      }
    }
  };

  return(
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-xl p-8 w-96">

        <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">
          Create Account
        </h2>

        {error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2"
          />

          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2"
          />

          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          >
            <option value="employer">Employer</option>
            <option value="jobseeker">Job Seeker</option>
          </select>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg"
          >
            Register
          </button>

        </form>

        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Login here
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;