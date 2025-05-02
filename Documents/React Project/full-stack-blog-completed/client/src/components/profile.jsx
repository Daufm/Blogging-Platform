import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import PostListItem from "../components/PostListItem";
import Image from "./Image";
import { useState, useEffect } from "react";
import Upload from "../components/Upload.jsx";
import ResetPassword from "./resetpass.jsx";
import { toast } from "react-toastify";


const fetchUserData = async (username) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/profile/${username}`);
  return res.data;
};

const updateUserProfile = async (updatedData) => {
  const res = await axios.patch(`${import.meta.env.VITE_API_URL}/users/profile/update`, updatedData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return res.data;
};

const UserProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const isOwner = loggedInUser?.username === username;
  const Id = loggedInUser?.id;

  const { isLoading, error, data } = useQuery({
    queryKey: ["user", username],
    queryFn: () => fetchUserData(username),
  });

  const mutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries(["user", username]);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update profile.");
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState("");
  const [img, setImg] = useState(null);
  const [username1, setUsername] = useState("");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (data?.user) {
      setBio(data.user.bio || "");
      setUsername(data.user.username);
    }
  }, [data]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!bio.trim()) return toast.error("Bio cannot be empty.");
    if (!username1.trim()) return toast.error("Username cannot be empty.");

    const updatedData = {
      bio,
      username: username1,
      img: img?.filePath || data.user.img,
    };
    mutation.mutate(updatedData);
  };

  const handlePaymentMethod = ()=>{
    navigate("/payment-methods");
  }

  const handleAuthorRequest = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/request/request-author`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ userId: Id }),
      });
      const data = await res.json();
      if (res.status === 400) return toast.error(data.message);
      if (res.ok) toast.success("Request sent to admin!");
    } catch (error) {
      console.log("Error requesting author role", error);
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="text-center py-20">
      <div className="max-w-md mx-auto p-6 bg-red-50 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Error loading profile</h2>
        <p className="text-gray-600">{error.message}</p>
        <Link to="/" className="mt-4 inline-block text-blue-600 hover:underline">Return home</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              <Image
                src={data.user.img || "/default-avatar.png"}
                alt={data.user.username}
                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-xl"
              />
              {isOwner && isEditing && (
                <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Upload type="image" setProgress={setProgress} setData={setImg}>
                    <button 
                      type="button" 
                      className="bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      Change
                    </button>
                  </Upload>
                </div>
              )}
            </div>
            
            <div className="flex-1 text-center md:text-left text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{data.user.username}</h1>
              <p className="text-lg text-blue-100 mb-4 max-w-2xl">{data.user.bio || "No bio yet."}</p>
              
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  data.user.role === "admin" ? "bg-purple-100 text-purple-800" :
                  data.user.role === "author" ? "bg-green-100 text-green-800" :
                  "bg-blue-100 text-blue-800"
                }`}>
                  {data.user.role || "User"}
                </span>
                
                {data.user.website && (
                  <a 
                    href={data.user.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-xs font-medium hover:bg-opacity-30 transition"
                  >
                    🌐 Website
                  </a>
                )}
              </div>
            </div>
            
            {isOwner && (
              <div className="flex flex-col gap-3 w-full md:w-auto">
                <button
                  onClick={handleEditProfile}
                  className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-lg font-medium transition"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handlePaymentMethod}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-2 rounded-lg font-medium transition"
                >
                  Add Payment Method
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-2 rounded-lg font-medium transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Buttons for Owner */}
        {isOwner && (
          <div className="mb-8 flex flex-wrap gap-3">
            {data.user.role === "admin" && (
              <Link
                to="/admin_dashboard"
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                Admin Dashboard
              </Link>
            )}
            
            {data.user.role !== "admin" && data.user.role !== "author" && (
              <button
                onClick={handleAuthorRequest}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Request Author Role
              </button>
            )}
            
            <button
              onClick={() => setShowChangePassword(true)}
              className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Change Password
            </button>

           
            
            {showChangePassword && <ResetPassword setShowChangePassword={setShowChangePassword} />}
          </div>
        )}

        {/* Posts Section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
              Posts by {data.user.username}
            </h2>
          </div>
          
          {data.posts.length === 0 ? (
            <div className="p-12 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No posts yet</h3>
              <p className="mt-1 text-gray-500">When {data.user.username} creates posts, they&apos;ll appear here.</p>
              {isOwner && (
                <Link 
                  to="/write" 
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  Create your first post
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {data.posts.map((post) => (
                <PostListItem key={post._id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md transform transition-all">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Edit Profile</h2>
            </div>
            
            <form onSubmit={handleSaveProfile} className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  value={username1}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your username"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tell people about yourself..."
                ></textarea>
              </div>

          

              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
                <Upload type="image" setProgress={setProgress} setData={setImg}>
                  <div className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition">
                    <div className="text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="mt-2 text-sm text-gray-600">
                        <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (max. 5MB)</p>
                    </div>
                  </div>
                </Upload>
                {progress > 0 && progress < 100 && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Uploading: {progress}%</p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                  disabled={mutation.isLoading}
                >
                  {mutation.isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;