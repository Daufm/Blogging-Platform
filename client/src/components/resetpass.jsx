import React, { useState ,useEffect} from "react";
import axios from "axios";
import {toast} from "react-toastify";



 const ResetPassword = ({setShowChangePassword})=>{

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
   
    
    const handleChangePassword = async (e) => {
        e.preventDefault();
      
        try {
          const res = await axios.patch(
            `${import.meta.env.VITE_API_URL}/users/update-password`,
            { oldPassword, newPassword },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
      
          if (res.status === 200) {
            toast.success("Password updated successfully!");
            setShowChangePassword(false);
            setOldPassword("");
            setNewPassword("");
          }
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to update password.");
        }
      };
    
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    
        <h1 className="text-2xl font-bold mb-4">Change Password</h1>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <form
                onSubmit={handleChangePassword}
                className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg"
            >
                <h2 className="text-xl font-semibold mb-4">Change Password</h2>
    
                {/* Old Password */}
                <label className="block text-sm mb-1">Old Password</label>
                <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full border px-4 py-2 rounded mb-4"
                placeholder="Enter old password"
                required
                />
    
                {/* New Password */}
                <label className="block text-sm mb-1">New Password</label>
                <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border px-4 py-2 rounded mb-4"
                placeholder="Enter new password"
                required
                />
                 
                 <div className="flex justify-between mb-4"> 
                <button
                type= "submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
                
                >
                Change Password
                </button>
                <button
                type="button"
                onClick={() => setShowChangePassword(false)}
                className="bg-red-500 text-white px-4 py-2   rounded hover:bg-red-600 transition duration-200 ml-2"
                >
                Cancel
                </button>
                </div>
            </form>
            </div>
        </div>
    );
 }  


 export default ResetPassword;