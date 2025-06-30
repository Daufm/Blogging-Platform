import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaGoogle, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import Image from "../components/Image";
import {
  sanitizeEmail,
  sanitizeUsername,
  sanitizePassword,
  validateEmail,
  validateUsername,
  validatePassword,
} from "../utils/Validator";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    // Validate email format
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Validate username format
    if (!validateUsername(username)) {
      setError("Username must be 3-20 characters long and can only contain letters, numbers, and underscores.");
      return;
    }

    // Validate password strength
    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters long and include upper & lower case letters and a number.");
      return;
    }
    // Sanitize inputs
    const sanitizedEmail = sanitizeEmail(email);
    const sanitizedUsername = sanitizeUsername(username);
    const sanitizedPassword = sanitizePassword(password);
    setEmail(sanitizedEmail);
    setUsername(sanitizedUsername);
    setPassword(sanitizedPassword);




    setIsSubmitting(true);
    setError("");

    try {
      // Request OTP without creating user
      await axios.post(`${import.meta.env.VITE_API_URL}/users/sendOtp`, { email });
      setIsOtpSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Verify OTP and create user if valid
      await axios.post(`${import.meta.env.VITE_API_URL}/users/verify-otp`, {
        email,
        password,
        username,
        sex, // Include sex in the request
        otp,
      });

      // Redirect to login or dashboard
      navigate("/login", {
        state: {
          message: "Registration successful! Please login to continue.",
        },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  // Add this helper function above your component or inside it
  const getPasswordStrength = (password) => {
    if (password.length === 0) return "";
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasLength = password.length >= 8;

    if (!hasLength) return "weak";
    if (hasLower && hasUpper && hasNumber) return "strong";
    if ((hasLower || hasUpper) && hasNumber) return "medium";
    return "weak";
  };

  return (
    <div className="min-h-screen flex">
      {/* Left column: Company info */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-b from-indigo-600 to-blue-600 text-white p-12">
        <h1 className="text-4xl font-bold mb-4">BlogSphere</h1>
        <p className="text-lg mb-8 text-center max-w-md">
          Welcome to BlogSphere! <br />
          Create an account to access exclusive features, connect with others, and enjoy our platform.
        </p>
        {/* Add logo or illustration here if desired */}
      {/* Logo */}
      <div className="mb-8 flex flex-col items-center">
        <Image
          src="logo.png"
          alt="BlogSphere Logo"
          className="w-20 h-s20 rounded-full shadow-lg mb-4"
          style={{ objectFit: "cover" }}
        />
        <span className="text-3xl font-extrabold tracking-tight">BlogSphere</span>
      </div>
      {/* Guest Mode Button */}
      <button
        onClick={() => navigate("/")}
        className="mt-4 px-6 py-3 bg-white/80 hover:bg-white text-blue-700 font-semibold rounded-xl shadow border border-blue-200 hover:border-blue-400 transition-all duration-200"
      >
        Visit as Guest
      </button>
      </div>

      {/* Right column: Register/Login form */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-white dark:bg-gray-900 p-8">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center gap-2 mb-6">
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100">
              {isOtpSent ? "Verify Your Email" : "Create Account"}
            </h2>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          {!isOtpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-base"
                  placeholder="Enter your username"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-base"
                  placeholder="Enter your email"
                />
              </div>
              <div>
  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
    Password
  </label>
  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      id="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
      className={`w-full px-4 py-2 border ${
        password.length > 0 && password.length < 8 ? "border-red-500" : "border-gray-300"
      } rounded-md focus:ring-2 ${
        password.length >= 8 ? "focus:ring-green-500" : "focus:ring-red-400"
      } focus:outline-none transition-all pr-10 bg-white dark:bg-gray-700 dark:border-gray-600`}
      placeholder="At least 8 characters"
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
      aria-label="Toggle password visibility"
    >
      {showPassword ? "🙈" : "👁️"}
    </button>
  </div>

  {/* Password Strength Indicator */}
  <div className="mt-2 text-sm transition-all duration-300">
    {password.length > 0 && (() => {
      const strength = getPasswordStrength(password);
      if (strength === "weak") {
        return (
          <p className="text-red-500 animate-pulse">
            Password must be at least 8 characters, include upper & lower case and a number
          </p>
        );
      }
      if (strength === "medium") {
        return (
          <p className="text-yellow-600 animate-pulse">
            Medium password (add uppercase, lowercase, and numbers for a strong password)
          </p>
        );
      }
      if (strength === "strong") {
        return (
          <p className="text-green-600 animate-fade-in">
            Strong password ✅
          </p>
        );
      }
      return null;
    })()}
  </div>
</div>

            
               
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-indigo-700 hover:to-blue-700 transition duration-300 flex items-center justify-center disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  "Continue"
                )}
              </button>
              <p className="text-center text-sm text-gray-600 mt-6">
               have an account?{" "}
              <Link to="/login" className="text-blue-600 font-medium hover:underline">
                Sign in
              </Link>
               </p>
            </form>
          ) : (
            <div className="space-y-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                We've sent a verification code to <span className="font-medium">{email}</span>
              </p>
              <form onSubmit={handleVerifyAndRegister} className="space-y-4">
                <div>
                  <label
                    htmlFor="otp"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Verification Code
                  </label>
                  <input
                    type="text"
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    maxLength={6}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-base text-center tracking-widest font-mono"
                    placeholder="000000"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-indigo-700 hover:to-blue-700 transition duration-300 flex items-center justify-center disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962  0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Verifying...
                    </>
                  ) : (
                    "Complete Registration"
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;