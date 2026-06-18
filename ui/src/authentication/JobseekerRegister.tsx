import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerJobseeker, parseResume } from "../services/authService";

export default function JobSeekerRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: "",
    skills: "",
    experience: "",
    education: "",
  });

  const [uploading, setUploading] = useState(false);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleResumeUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const data = await parseResume(file);

      setFormData((prev) => ({
        ...prev,
        ...data,
        skills: Array.isArray(data.skills)
          ? data.skills.join(", ")
          : data.skills || prev.skills,
      }));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: any) => {
  e.preventDefault();

  try {
    console.log("Sending data:", formData); //  see what you're sending

    await registerJobseeker(formData);

    navigate("/login");

  } catch (error: any) {
    console.error("Full error:", error);

    //  THIS IS THE MOST IMPORTANT LINE
    console.log("Backend error:", error.response?.data);

    alert(
      JSON.stringify(error.response?.data) || "Registration failed"
    );
  }
};

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg px-8 py-10">

        {/*  Title */}
        <h2 className="text-2xl font-semibold text-gray-900">
          Create your account
        </h2>
        <p className="text-gray-500 text-sm mt-1 mb-8">
          Start your journey with NextRole
        </p>

        {/* 🔹 Resume Upload */}
        <div className="mb-8">
          <input
            type="file"
            id="resume"
            className="hidden"
            onChange={handleResumeUpload}
          />

          <label
            htmlFor="resume"
            className="block w-full text-center py-3 rounded-xl border border-dashed border-gray-300 cursor-pointer hover:border-red-500 transition"
          >
            <span className="text-sm text-gray-600">
              {uploading ? "Uploading..." : "Upload Resume"}
            </span>
          </label>
        </div>

        {/* 🔹 Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="First Name"
            className="input-stack"
          />

          <input
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            placeholder="Last Name"
            className="input-stack"
          />

          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="input-stack"
          />

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="input-stack"
          />

          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="input-stack"
          />

          <input
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="Skills (React, Python...)"
            className="input-stack"
          />

          <input
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            placeholder="Experience"
            className="input-stack"
          />

          <input
            name="education"
            value={formData.education}
            onChange={handleChange}
            placeholder="Education"
            className="input-stack"
          />

          {/*  Button */}
          <button className="w-full bg-red-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-red-700 transition">
            Create Account
          </button>
        </form>

        {/* 🔹 Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-red-600 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}