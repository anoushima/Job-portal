import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");   
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      // ✅ send email instead of username
      const data = await loginUser(email, password);

      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      localStorage.setItem("email", data.email);
      localStorage.setItem("role", data.role);

      // 🔥 role-based redirect
      if (data.role === "jobseeker") {
        navigate("/jobseeker-dashboard");
      } else if (data.role === "employer") {
        navigate("/employer-dashboard");
      } else {
        navigate("/admin-dashboard");
      }

    } catch (err: any) {
      console.error("login failed:", err.response?.data);
      setError("Invalid Email or Password");  
    }
  };

  return (
    <div className="min-h-screen bg-grey-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-xl p-8 w-96">
        <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">
          Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">

          {/* ✅ EMAIL INPUT */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border rounded-lg px-4 py-2"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border rounded-lg px-4 py-2"
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-grey-600 mt-4">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Register here
          </Link>
        </p>

        {error && (
          <p className="text-red-500 text-center mt-3">{error}</p>
        )}
      </div>
    </div>
  );
};

export default Login;