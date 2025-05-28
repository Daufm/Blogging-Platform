import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import axios from "axios";
import { toast } from "react-toastify";
import Upload from "../components/Upload";

const EditPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [id , setId] = useState(""); 
  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("general");
  const [cover, setCover] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        console.log("Fetching post with slug:", slug);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${slug}`);
        const post = res.data;
        setTitle(post.title);
        setId(post._id); 
        setDesc(post.desc);
        setCategory(post.category);
        setValue(post.content);
        setCover({ filePath: post.img });
        setLoading(false);
      } catch (err) {
        toast.error("Failed to load post.");
      }
    };
    fetchPost();
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/posts/update/${id}`,
        {
          img: cover.filePath,
          title,
          category,
          desc,
          content: value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Post updated successfully!");
      navigate(`/${slug}`);
    } catch (err) {
      toast.error("Update failed.");
    }
  };

  if (loading) return <p className="text-center py-12 text-gray-500">Loading...</p>;

  return (
    <div className="h-full p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Post</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <Upload type="image" setData={setCover}>
          <button type="button" className="p-2 text-sm bg-white rounded-xl shadow-md text-gray-500">
            Change Cover Image
          </button>
        </Upload>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-2xl font-semibold p-2 bg-white shadow rounded-xl"
          type="text"
          placeholder="Title"
          required
        />

        <div className="flex gap-4 items-center">
          <label className="text-sm">Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-2 rounded-xl bg-white shadow"
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

        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="p-4 bg-white shadow rounded-xl"
          placeholder="Short Description"
          required
        />

        <ReactQuill
          theme="snow"
          className="bg-white rounded-xl shadow"
          value={value}
          onChange={setValue}
        />

        <button
          type="submit"
          className="bg-blue-700 text-white font-medium rounded-xl p-2 mt-4 w-40 self-start hover:bg-blue-800"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditPost;
