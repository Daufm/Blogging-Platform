import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyOtpPage = () => {
  const [otp, setOtp] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email; // Get email from state

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      // Send OTP and email to the backend for verification
      await axios.post("/users/verify-otp", { email, otp });

      alert("Email verified successfully!");
      navigate("/login"); // Redirect to login page after verification
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Verify OTP</h2>
        <p className="text-sm text-gray-600 text-center mb-4">
          OTP has been sent to your email: <span className="font-medium">{email}</span>
        </p>
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
              Enter OTP
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Verify
          </button>
        </form>
        <p className="text-sm text-center text-gray-600 mt-4">
          Didn't receive the OTP?{" "}
          <a href="/resend-otp" className="text-blue-600 hover:underline">
            Resend OTP
          </a>
        </p>
      </div>
    </div>
  );
};

export default VerifyOtpPage;