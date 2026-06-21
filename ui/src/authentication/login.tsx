import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, googleSignIn } from "../services/authService";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (cfg: object) => void;
          renderButton: (el: HTMLElement, cfg: object) => void;
        };
      };
    };
  }
}

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const googleBtnRef = useRef<HTMLDivElement>(null);

  const redirectByRole = useCallback(
    (role: string) => {
      if (role === "jobseeker") navigate("/jobseeker-dashboard");
      else if (role === "employer") navigate("/employer-dashboard");
      else navigate("/admin-dashboard");
    },
    [navigate]
  );

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await loginUser(email, password);
      redirectByRole(data.role);
    } catch (err: any) {
      console.error("login failed:", err.response?.data);
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleCredential = useCallback(
    async (response: { credential: string }) => {
      setError("");
      setLoading(true);
      try {
        const data = await googleSignIn(response.credential);
        redirectByRole(data.role);
      } catch (err: any) {
        console.error("Google sign-in failed:", err.response?.data);
        setError(
          err.response?.data?.detail || "Google sign-in failed. Please try again."
        );
      } finally {
        setLoading(false);
      }
    },
    [redirectByRole]
  );

  // ── FIX: use a ref + a stable initGSI so the button always renders
  // even if the GSI script fires before or after the component mounts.
  const initGSI = useCallback(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!window.google || !clientId || !googleBtnRef.current) return;

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleGoogleCredential,
    });

    window.google.accounts.id.renderButton(googleBtnRef.current, {
      theme: "outline",
      size: "large",
      width: 400,
      text: "continue_with",
      shape: "rectangular",
    });
  }, [handleGoogleCredential]);

  useEffect(() => {
    if (window.google) {
      // Script already loaded (e.g. navigated back to this page)
      initGSI();
    } else {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initGSI;
      document.body.appendChild(script);
      return () => {
        // Clean up only if the script is still there (avoid error on fast nav)
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, [initGSI]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Navbar */}
      <div className="flex justify-between items-center p-6">
        <div onClick={() => navigate("/")} className="cursor-pointer">
          <h1 className="text-2xl font-extrabold tracking-wide">
            <span className="text-black">Next</span>
            <span className="text-red-600">Rol</span>
            <span className="text-black">E</span>
          </h1>
        </div>
        <button
          onClick={() => navigate("/register-jobseeker")}
          className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition text-sm font-medium"
        >
          Register
        </button>
      </div>

      {/* Login Card */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-gray-500 text-sm mt-1">Sign in to your NextRole account</p>
          </div>

          {/* ── FIX: use ref instead of getElementById so it's always attached ── */}
          <div ref={googleBtnRef} className="flex justify-center mb-6 min-h-[44px]" />

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-400 text-xs">or sign in with email</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
            />

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-3 rounded-xl font-medium text-sm hover:bg-red-700 transition disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{" "}
            <Link to="/register-jobseeker" className="text-red-600 font-semibold hover:underline">
              Register here
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;