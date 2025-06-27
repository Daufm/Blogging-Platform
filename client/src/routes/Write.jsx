import "react-quill-new/dist/quill.snow.css";
import ReactQuill from "react-quill-new";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Upload from "../components/Upload";

const Write = () => {
  const [value, setValue] = useState("");
  const [cover, setCover] = useState("");
  const [img, setImg] = useState("");
  const [video, setVideo] = useState("");
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    if (!token) return false;
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    return decodedToken.exp * 1000 > Date.now();
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      toast.error("You need to log in to create a post.");
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (img) {
      setValue((prev) =>
        prev + `<p><img src="${img.url}" width="500" height="300" style="max-width: 100%; height: auto;"/></p>`
      );
    }
  }, [img]);

  useEffect(() => {
    if (video) {
      setValue((prev) =>
        prev + `<p><iframe class="ql-video" src="${video.url}" width="800" height="450" style="max-width: 100%; height: auto;" frameborder="0" allowfullscreen></iframe></p>`
      );
    }
  }, [video]);

  const mutation = useMutation({
    mutationFn: async (newPost) => {
      const token = localStorage.getItem("token");
      return axios.post(`${import.meta.env.VITE_API_URL}/posts/create`, newPost, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: (res) => {
      toast.success("Post created successfully!");
      navigate(`/${res.data.slug}`);
    },
    onError: (error) => {
      toast.error(error?.response?.data || "Failed to create post.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      img: cover.filePath || "",
      title: formData.get("title"),
      category: formData.get("category"),
      desc: formData.get("desc"),
      content: value,
    };
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen py-8 px-4 md:px-12 lg:px-32 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700 dark:text-blue-400">
          ✍️ Create a New Blog Post
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Cover Upload */}
          <Upload type="image" setProgress={setProgress} setData={setCover}>
            <button type="button" className="w-fit px-4 py-2 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-white rounded-xl shadow">
              Upload Cover Image
            </button>
          </Upload>

          {/* Title */}
          <input
            name="title"
            type="text"
            required
            placeholder="Enter post title..."
            className="text-2xl font-semibold p-3 rounded-xl bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 ring-blue-400"
          />

          {/* Category Select */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
            <label className="text-sm font-medium">Category:</label>
            <select
              name="category"
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-sm"
              required
            >
              <option value="general">General</option>
              <option value="web-design">Web Design</option>
              <option value="development">Development</option>
              <option value="databases">Databases</option>
              <option value="seo">Search Engines</option>
              <option value="marketing">Marketing</option>
            </select>
          </div>

          {/* Description */}
          <textarea
            name="desc"
            required
            rows={4}
            placeholder="Write a short description..."
            className="p-4 rounded-xl bg-gray-100 dark:bg-gray-700 shadow-inner resize-none"
          />

          {/* Content Editor */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex gap-2 md:flex-col">
              <Upload type="image" setProgress={setProgress} setData={setImg}>📷</Upload>
              <Upload type="video" setProgress={setProgress} setData={setVideo}>🎬</Upload>
            </div>
            <ReactQuill
              theme="snow"
              value={value}
              onChange={setValue}
              className="flex-1 min-h-[300px] rounded-xl bg-white dark:bg-gray-200 dark:text-gray-800 font-medium border-2 border-gray-300 dark:border-gray-600 shadow-inner"
              readOnly={0 < progress && progress < 100}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={mutation.isPending || (0 < progress && progress < 100)}
            className="bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 px-6 rounded-xl shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mutation.isPending ? "Publishing..." : "Publish"}
          </button>

          {/* Upload Progress */}
          {progress > 0 && progress < 100 && (
            <p className="text-sm text-gray-500">Uploading media: {progress}%</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Write;
