import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerEmployer } from "../services/authService";

export default function EmployerRegister() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const [company, setCompany] = useState({
    company_name: "",
    industry: "",
    company_size: "",
    location: "",
    website: "",
    description: "",
  });

  const [credentials, setCredentials] = useState({
    full_name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<any>({});

  const handleCompanyChange = (e: any) => {
    setCompany({ ...company, [e.target.name]: e.target.value });
    setErrors((prev: any) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleCredentialsChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setCredentials({ ...credentials, [name]: type === "checkbox" ? checked : value });
    setErrors((prev: any) => ({ ...prev, [name]: "" }));
  };

  const validateStep1 = () => {
    const newErrors: any = {};
    if (!company.company_name.trim()) newErrors.company_name = "Company name is required.";
    if (!company.location.trim()) newErrors.location = "Location is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: any = {};
    if (!credentials.full_name.trim()) newErrors.full_name = "Full name is required.";
    if (!credentials.email.includes("@")) newErrors.email = "Enter valid email.";
    if (credentials.password.length < 8) newErrors.password = "Min 8 characters.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(2);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setLoading(true);
    try {
      await registerEmployer({
        full_name: credentials.full_name,
        email: credentials.email,
        password: credentials.password,
        confirm_password: credentials.password,
        company_name: company.company_name,
        industry: company.industry || "",
        company_size: company.company_size || "",
        location: company.location,
        website: company.website || "",
        description: company.description || "",
      });
      navigate("/login");
    } catch (err: any) {
      setApiError(
        err.response?.data?.detail ||
        JSON.stringify(err.response?.data) ||
        "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-2.5 rounded-xl border text-sm bg-white focus:outline-none focus:ring-2 transition
    ${
      errors[field]
        ? "border-red-500 focus:ring-red-200"
        : "border-gray-300 focus:ring-red-100 focus:border-red-500"
    }`;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div
            className="cursor-pointer text-2xl font-extrabold tracking-wide"
            onClick={() => navigate("/")}
          >
            <span className="text-black">Next</span>
            <span className="text-red-600">Rol</span>
            <span className="text-black">E</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-200 px-8 py-8">

          {/* STEP 1 */}
          {step === 1 && (
            <>
              <h2 className="text-xl font-semibold text-black">Company details</h2>
              <p className="text-sm text-gray-500 mt-1 mb-6">Tell candidates who you are</p>

              <div className="space-y-4">
                <input name="company_name" placeholder="Company name"
                  value={company.company_name} onChange={handleCompanyChange}
                  className={inputClass("company_name")} />

                <input name="location" placeholder="Location"
                  value={company.location} onChange={handleCompanyChange}
                  className={inputClass("location")} />

                <input name="website" placeholder="Website"
                  value={company.website} onChange={handleCompanyChange}
                  className={inputClass("website")} />

                <textarea name="description" placeholder="Description"
                  value={company.description} onChange={handleCompanyChange}
                  className={`${inputClass("description")} resize-none`} />
              </div>

              <button
                onClick={handleNext}
                className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl text-sm font-medium transition"
              >
                Continue →
              </button>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <form onSubmit={handleSubmit}>
              <h2 className="text-xl font-semibold text-black">Credentials</h2>

              <div className="space-y-4 mt-4">
                <input name="full_name" placeholder="Full name"
                  value={credentials.full_name} onChange={handleCredentialsChange}
                  className={inputClass("full_name")} />

                <input name="email" placeholder="Email"
                  value={credentials.email} onChange={handleCredentialsChange}
                  className={inputClass("email")} />

                <input name="password" type="password" placeholder="Password"
                  value={credentials.password} onChange={handleCredentialsChange}
                  className={inputClass("password")} />
              </div>

              {apiError && (
                <p className="text-red-500 text-sm mt-3">{apiError}</p>
              )}

              <button
                type="submit"
                className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl"
              >
                {loading ? "Creating..." : "Create account"}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="mt-2 w-full py-2 text-gray-500 hover:text-black"
              >
                ← Back
              </button>
            </form>
          )}

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-red-600 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}