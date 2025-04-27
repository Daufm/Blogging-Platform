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

    // Check if the user is authenticated
    const isAuthenticated = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            return false; // If no token exists, the user is not authenticated
        }

        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const expirationTime = decodedToken.exp * 1000; // Convert to milliseconds
        const currentTime = Date.now();

       return expirationTime > currentTime; // Check if the token is still valid
    };

    // Redirect to login if the user is not authenticated
    useEffect(() => {
        if (!isAuthenticated()) {
            toast.error("You need to log in to create a post.");
            navigate("/login");
        }
    }, [navigate]);

    useEffect(() => {
        if (img) {
            setValue((prev) => 
                prev + `<p><img src="${img.url}" width="600" height="400" style="max-width: 100%; height: auto;"/></p>`
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
            console.log("Token:", token);
            return axios.post(`${import.meta.env.VITE_API_URL}/posts/create`, newPost, {
                headers: {
                    Authorization: `Bearer ${token}`, 
                },
            });
        },
        onSuccess: (res) => {
            toast.success("Post has been created");
            navigate(`/${res.data.slug}`);
        },
        onError: (error) => {
            if (error.response) {
                toast.error(error.response.data);
            } else if (error.request) {
                console.error("No response received:", error.request);
            } else {
                console.error("Error", error.message);
            }
            toast.error("Failed to create post. Please try again.");
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

        console.log("Submitting data:", data); // Log data

        mutation.mutate(data);
    };

    return (
        <div className="h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] flex flex-col gap-6">
            <h1 className="text-cl font-light">Create a New Post</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1 mb-6">
                <Upload type="image" setProgress={setProgress} setData={setCover}>
                    <button type="button" className="w-max p-2 shadow-md rounded-xl text-sm text-gray-500 bg-white">
                        Add a cover image
                    </button>
                </Upload>
                <input
                    className="text-4xl font-semibold bg-transparent outline-none"
                    type="text"
                    placeholder="My Awesome Story"
                    name="title"
                    required
                />
                <div className="flex items-center gap-4">
                    <label htmlFor="" className="text-sm">
                        Choose a category:
                    </label>
                    <select
                        name="category"
                        className="p-2 rounded-xl bg-white shadow-md"
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
                    className="p-4 rounded-xl bg-white shadow-md"
                    name="desc"
                    placeholder="A Short Description"
                    required
                />
                <div className="flex flex-1">
                    <div className="flex flex-col gap-2 mr-2">
                        <Upload type="image" setProgress={setProgress} setData={setImg}>
                            🌆
                        </Upload>
                        <Upload type="video" setProgress={setProgress} setData={setVideo}>
                            ▶️
                        </Upload>
                    </div>
                    <ReactQuill
                        theme="snow"
                        className="flex-1 rounded-xl bg-white shadow-md"
                        value={value}
                        onChange={setValue}
                        readOnly={0 < progress && progress < 100}
                    />
                </div>
                <button
                    disabled={mutation.isPending || (0 < progress && progress < 100)}
                    className="bg-blue-800 text-white font-medium rounded-xl mt-4 p-2 w-36 disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                    {mutation.isPending ? "Loading..." : "Send"}
                </button>
                {"Progress:" + progress}
            </form>
        </div>
    );
};

export default Write;