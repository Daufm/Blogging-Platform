import axios from "axios";
import { useState , useContext } from "react";
import { Link ,useNavigate} from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { AuthContext } from "../utils/AuthContext";
import { toast } from "react-toastify";

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
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


const handleSendCode = async (e)=>{
  e.preventDefault();
  setIsLoading(true);
  setError("");
  try {

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
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
  <div className="w-full max-w-md bg-white border border-gray-200 shadow-xl rounded-xl p-8">
    <div className="mb-6 text-center">
      <h2 className="text-3xl font-semibold text-gray-800">Sign In</h2>
      <p className="text-gray-500 text-sm mt-1">Welcome back. Please enter your details.</p>
    </div>

    {/* Error Message */}
    {error && (
      <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-md text-sm text-red-600 text-center">
        {error}
      </div>
    )}

    <form onSubmit={handleLogin} className="space-y-5">
      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email address
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          placeholder="you@example.com"
        />
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition pr-10"
            placeholder="••••••••"
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
      </div>

      {/* Remember me */}
      <div className="flex items-center justify-between">
        
        <a href="#"
          onClick={() => setShowChangePassword(true)}
          className="text-sm text-blue-600 hover:underline">
          Forgot password?
        </a>

        
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-md transition font-medium shadow"
      >
        {isLoading ? "Signing in..." : "Sign In"}
      </button>
    </form>
    {showChangePassword && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <form onSubmit={handleSendCode} className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Send Magic Link</h2>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                value={email2}
                onChange={(e) => setEmail2(e.target.value)}
                className="w-full border px-4 py-2 rounded mb-4"
                placeholder="Enter Email"
              />
             <div className="flex justify-between"> 
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
              >
                Send Code
              </button>
              <button
                onClick={() => setShowChangePassword(false)}
                type="button"
                className="bg-blue-500  text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
              >
                Close
              </button>
              </div>
            </form>
          </div>
        )}

    {/* Divider */}
    <div className="my-6 flex items-center justify-center text-gray-400 text-sm">
      <span className="border-t border-gray-200 flex-1 mr-2"></span>
      or
      <span className="border-t border-gray-200 flex-1 ml-2"></span>
    </div>

    {/* Social */}
    <div className="grid grid-cols-1 gap-3">
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
    <p className="text-center text-sm text-gray-600 mt-6">
      Don’t have an account?{" "}
      <Link to="/register" className="text-blue-600 font-medium hover:underline">
        Sign up
      </Link>
    </p>
  </div>
</div>

  );
};

export default LoginPage;