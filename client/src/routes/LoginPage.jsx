import axios from "axios";
import { useState , useContext } from "react";
import { Link ,useNavigate} from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { AuthContext } from "../utils/AuthContext";
import { toast } from "react-toastify";
import {
  validateEmail,
  validatePassword,

  sanitizeEmail,
  sanitizePassword
} from "../utils/Validator"

const LoginPage = () => {
  // useContext to get the login function from AuthContext
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [email2, setEmail2] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [showChangePassword, setShowChangePassword] = useState(false);
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validate email and password

    // if (!validaeEmail(email)) {
    //   setError("Please enter a valid email address.");
    //   setIsLoading(false);
    //   return;
    // }
    // if (!validatePassword(password)) {
    //   setError("Password must be at least 8 characters long and contain a mix of letters, numbers, and special characters.");
    //   setIsLoading(false);
    //   return;
    // }
  

    
    try {
     
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/login`, {email, password})
      if (response.status === 200) {
        //  the API returns a token 
        const {token, user} = response.data;
        login(user, token);
        console.log("user", user);

        //check if the user is an admin
        if (user.role === "admin") {
          //redirect to admin dashboard
          navigate("/admin_dashboard");
          return;
        }
         
       
        //otherwise redirect to home page
        navigate("/");
        
      }
      else{
        setError("Login failed. Please try again.");
      }


    } catch (err) {
       if (err.response?.status === 423) {
            // Account locked
            setError(err.response.data.message);
            toast.error(err.response.data.message);
          } else if (err.response?.data?.message) {
            setError(err.response.data.message);
          } else {
            setError("Login failed. Please try again.");
          }
    } finally {
      setIsLoading(false);
    }
  };


const handleSendCode = async (e)=>{
  e.preventDefault();
  setIsLoading(true);
  setError("");
  try {
    // Validate email
    if (!validateEmail(email2)) {
      toast.error("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    const email =  email2;
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    // Send the email to the server
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/send-link`, { email });

    if (response.status === 200) {
     
      toast.success("We've sent you a reset link. If you don't receive it within a few minutes, check your spam folder.");
      setShowChangePassword(false)
    } else {
      toast.error("Something went wrong. Please try again.");

    }
  } catch (err) {
   
    setError(err.response?.data?.message || "Something went wrong. Please try again.");
    setShowChangePassword(false)
  } finally {
    setIsLoading(false);
    setShowChangePassword(false)
  }
}


  return (
    
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 relative overflow-hidden">
      {/* Floating background shapes */}
      <div className="fixed -z-10 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-200 dark:bg-blue-800 opacity-30 blur-[100px] animate-float1"></div>
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-indigo-200 dark:bg-indigo-800 opacity-30 blur-[100px] animate-float2"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 rounded-full bg-purple-200 dark:bg-purple-800 opacity-30 blur-[100px] animate-blob"></div>
      </div>

      <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl rounded-2xl p-8 relative z-10">
        <div className="mb-8 text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">Sign in to your account to continue</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:outline-none transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:outline-none transition-all duration-200 pr-12 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                aria-label="Toggle password visibility"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Forgot password */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowChangePassword(true)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Signing in...
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Forgot Password Modal */}
        {showChangePassword && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Reset Password</h2>
              <form onSubmit={handleSendCode} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Email</label>
                  <input
                    type="email"
                    value={email2}
                    onChange={(e) => setEmail2(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:outline-none transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-200"
                  >
                    Send Reset Link
                  </button>
                  <button
                    onClick={() => setShowChangePassword(false)}
                    type="button"
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="my-8 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
          <span className="border-t border-gray-200 dark:border-gray-700 flex-1 mr-4"></span>
          or continue with
          <span className="border-t border-gray-200 dark:border-gray-700 flex-1 ml-4"></span>
        </div>

        {/* Social Login */}
        <div className="space-y-3">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              const token = credentialResponse.credential;
              try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/users/google-login`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ token }),
                });

                const data = await res.json();

                if (res.ok) {
                  localStorage.setItem("token", data.jwtToken);
                  localStorage.setItem("user", JSON.stringify(data.user));
                  navigate("/");
                } else {
                  setError("Google login failed.");
                }
              } catch (err) {
                setError("Something went wrong.");
              }
            }}
            onError={() => {
              setError("Google login failed.");
            }}
          />
        </div>

        {/* Bottom link */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-8">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;