import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const ForgetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");  // get token from URL
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/users/reset-password", {
        token,
        newPassword,
      });

      if (response.status === 200) {
        toast.success("Password reset successful! Please login.");
        // Redirect to login page maybe
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Reset failed.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleResetPassword} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Reset Password</h1>

        <input
          type="password"
          placeholder="Enter your new password"
          className="w-full p-3 border mb-4 rounded"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ForgetPasswordPage;
