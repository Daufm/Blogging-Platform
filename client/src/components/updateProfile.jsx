import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Upload from "../components/Upload";


const UpdateProfile = () => {
  const loggedInUser = JSON.parse(localStorage.getItem("user")); // Retrieve logged-in user
  const [bio, setBio] = useState(loggedInUser?.bio || "");
  const [img, setImg] = useState(null);
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);


  const handleSaveProfile = async (e) => {
    e.preventDefault();

    if (!bio.trim()) {
      alert("Bio cannot be empty.");
      return;
    }

    if (img && !["image/jpeg", "image/png"].includes(img.type)) {
      alert("Only JPG and PNG images are allowed.");
      return;
    }

    const formData = new FormData();
    formData.append("bio", bio);
    if (img) {
      formData.append("img", img.filePath || "",);
    }

    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/users/profile/update`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token for authentication
        },
      });

      toast("Profile updated successfully!");
      navigate(`/profile/${loggedInUser.username}`); // Redirect to the profile page
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update profile.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Update Profile</h1>
      <form onSubmit={handleSaveProfile} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            rows="4"
            placeholder="Write something about yourself..."
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Profile Image</label>
          <Upload type="image" setProgress={setProgress} setData={setImg}>
            <button className="w-max p-2 shadow-md rounded-xl text-sm text-gray-500 bg-white">
                Add a Profile  image
            </button>
         </Upload>
        </div>
        <div className="flex gap-4">
          <button
            disabled={(0 < progress && progress < 100)}
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Save
          </button>
          <button
            type="button"
            disabled={(0 < progress && progress < 100)}
            onClick={() => navigate(`/profile/${loggedInUser.username}`)}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
          >
            Cancel
          </button>
        </div>
        {"Progress:" + progress}
      </form>
    </div>
  );
};

export default UpdateProfile;