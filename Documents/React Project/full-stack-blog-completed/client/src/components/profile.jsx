import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import PostListItem from "../components/PostListItem";
import Image from "./Image";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Upload from "../components/Upload.jsx";
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
  const queryClient = useQueryClient();
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const isOwner = loggedInUser?.username === username;

  const Id = loggedInUser.id;
  


  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const { isLoading, error, data } = useQuery({
    queryKey: ["user", username],
    queryFn: () => fetchUserData(username),
  });

  const mutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries(["user", username]);
      setIsEditing(false);
      toast("Profile updated successfully!");
    },
    onError: (error) => {
      toast(error.response?.data?.message || "Failed to update profile.");
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState("");
  const [img, setImg] = useState(null);
  const [username1, setUsername] = useState("");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [progress, setProgress] = useState(0);

  const handleEditProfile = () => {
    setIsEditing(true);
    setBio(data.user.bio || "");
  };

  

  const handleSaveProfile = async (e) => {

    e.preventDefault();
    if (!bio.trim()) {
      toast("Bio cannot be empty.");
      return;
    }
    if (!username1.trim()) {
      toast("Username cannot be empty.");
      return;
    }
    
    const updatedData = {
      bio,
      username: username1,
      img: img?.filePath || data.user.img,
    };
    mutation.mutate(updatedData);
  };

  const handleDashboard = () => {
    navigate("/admin_dashboard");
    toast("Welcome to Admin Dashboard!");
  };

  const handleAuthorRequest = async ()=>{
    try{
      console.log("User ID from localStorage:", Id);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/request/request-author`, {
        method : 'POST',
        headers : {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ userId: Id }),
      })

      const data = await res.json();
      if(res.status === 400){
        toast.error(data.message);
      }
      if(res.ok){
        toast('Request sent to admin!')
      }
      else {
        console.log(data.message);
      }

    }
    catch(error) {
          console.log('Error  when asking approval', error)
    }

  }

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


  if (isLoading) return <div className="text-center py-12 text-gray-600">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-12">Error: {error.message}</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Profile Card */}
      <div className="relative bg-white rounded-2xl shadow-md p-6 flex flex-col md:flex-row items-center gap-6 md:gap-8">
        <Image
          src={data.user.img || "/default-avatar.png"}
          alt={data.user.username}
          className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-blue-100 shadow-lg"
        />
        <div className="text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{data.user.username}</h1>
          <p className="text-gray-600 mt-2 italic">{data.user.bio || "No bio yet."}</p>
          <span className="mt-1 inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
            {data.user.role || "User"}
          </span>
        </div>
        {isOwner && (
          <> 
            <div className="mt-4 w-full flex flex-col sm:flex-row sm:flex-wrap gap-2 justify-center sm:justify-start">
              <button
                onClick={handleEditProfile}
                className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto px-4 py-2 text-sm rounded-full shadow-sm text-center"
              >
                Edit
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto px-4 py-2 text-sm rounded-full shadow-sm text-center"
              >
                Logout
              </button>
              {data.user.role === "admin" && (
                <button
                  onClick={handleDashboard}
                  className="bg-stone-800 hover:bg-stone-700 text-white  w-full sm:w-auto px-4 py-2 text-sm rounded-full shadow-sm text-center"
                >
                  Admin Dashboard
                </button>
              )}
              {data.user.role !=="admin" && data.user.role !=="author" &&(
                  <button
                    onClick={handleAuthorRequest}
                    className="bg-amber-800 hover:bg-amber-700 text-white hover:text-black w-full sm:w-auto px-4 py-2 text-sm rounded-full shadow-sm text-center"
                >
                    Request Author Role
                  </button>
                )}

            </div>
       <div>
              <button
                onClick={() => setShowChangePassword(true)}
                className="text-blue-600 hover:text-blue-800 underline text-sm"
              >
                Change Password
              </button>

              {showChangePassword && (
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

                    <div className="mt-4 flex justify-between">
                      <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowChangePassword(false)}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
           </div>
            </>
            
          )}

      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <form onSubmit={handleSaveProfile} className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
            <label className="block text-sm mb-1">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows="4"
              className="w-full border px-4 py-2 rounded mb-4"
              placeholder="Write something about yourself..."
            ></textarea>
            
                  {/* Change Username */}
                  <label className="block text-sm mb-1">Username</label>
                  <input
                    type="text"
                    value={username1}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full border px-4 py-2 rounded mb-4"
                    placeholder="Enter new username"
                  />
    
            
            <label className="block text-sm mb-1">Profile Image</label>
            <Upload type="image" setProgress={setProgress} setData={setImg}>
              <button type="button" className="mt-2 w-full bg-gray-100 p-2 rounded-lg text-sm">
                Upload Image
              </button>
            </Upload>
            <div className="mt-4 flex justify-between">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">Upload Progress: {progress}%</p>
          </form>
        </div>
      )}

      {/* Posts Section */}
      <div className="mt-10">
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-800">📝 Posts by {data.user.username}</h2>
        {data.posts.length === 0 ? (
          <p className="text-gray-500 italic">No posts yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {data.posts.map((post) => (
              <PostListItem key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;