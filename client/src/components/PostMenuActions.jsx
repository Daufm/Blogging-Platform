import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode"; 
import {Link } from 'react-router-dom';


const PostMenuActions = ({ post ,slug}) => {
  const navigate = useNavigate();
  const postId = post._id; // Get the post ID from the post object
  // Retrieve and decode the JWT
  const token = localStorage.getItem("token");
  const user = token ? jwtDecode(token) : null; // Decode the token to get user info
  const userId = user?.id;

  const queryClient = useQueryClient();

  const {
    isPending,
    error,
    data: savedPosts,
  } = useQuery({
    queryKey: ["savedPosts", userId],
    queryFn: async () => {
      if (!userId) return []; // Return empty array if not logged in
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/saved/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    enabled: !!userId, // Only run the query if the user is logged in
  });

  const isAdmin = user?.role === "admin"; // Check if the user is an admin
  const isSaved = Array.isArray(savedPosts) && savedPosts.some((p) => p._id === post._id);


  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!token) {
        throw new Error("Not authenticated");
      }
      return axios.delete(`${import.meta.env.VITE_API_URL}/posts/${post._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      toast.success("Post deleted successfully!");
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.response?.data || "Failed to delete post.");
    },
  });


//mutation for reporting a post
  const reportMutation = useMutation({
    mutationFn: async () => {
      if (!token) {
        throw new Error("Not authenticated");
      }
      return axios.post(
        `${import.meta.env.VITE_API_URL}/posts/reports`,
        {
          postId: post._id,
          reason: "Inappropriate content",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      toast.success("Post reported successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data || "Failed to report post.");
    },
  });


  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!token) {
        throw new Error("Not authenticated");
      }
      return axios.patch(
        `${import.meta.env.VITE_API_URL}/users/save`,
        {
          postId: post._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedPosts", userId] });
    },
    onError: (error) => {
      toast.error(error.response?.data || "Failed to save post.");
    },
  });

  const featureMutation = useMutation({
    mutationFn: async () => {
      if (!token) {
        throw new Error("Not authenticated");
      }
      return axios.patch(
        `${import.meta.env.VITE_API_URL}/posts/feature`,
        {
          postId: post._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", post.slug] });
    },
    onError: (error) => {
      toast.error(error.response?.data || "Failed to feature post.");
    },
  });

  const handleDelete = () => {
    if (!token) {
      toast.error("You need to log in to perform this action.");
      return navigate("/login");
    }
    deleteMutation.mutate();
  };

  const handleReport = async () => {
    if (!token) {
      toast.error("You need to log in to perform this action.");
      return navigate("/login");
    }
    try {
      await reportMutation.mutateAsync();
      toast.success("Post reported successfully!");
    } catch (error) {
      toast.error(error.response?.data || "Failed to report post.");
    }
  };
  

  const handleFeature = () => {
    if (!token) {
      toast.error("You need to log in to perform this action.");
      return navigate("/login");
    }
    featureMutation.mutate();
  };

  const handleSave = () => {
    if (!token) {
      toast.error("You need to log in to save posts.");
      return navigate("/login");
    }
    saveMutation.mutate();
  };

  return (
    <div className="">
      <h1 className="mt-8 mb-4 text-sm font-medium">Actions</h1>
      {isPending ? (
        "Loading..."
      ) : error ? (
        "Saved post fetching failed!"
      ) : (
        <div
          className="flex items-center gap-2 py-2 text-sm cursor-pointer"
          onClick={handleSave}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            width="20px"
            height="20px"
          >
            <path
              d="M12 4C10.3 4 9 5.3 9 7v34l15-9 15 9V7c0-1.7-1.3-3-3-3H12z"
              stroke="black"
              strokeWidth="2"
              fill={
                saveMutation.isPending
                  ? isSaved
                    ? "none"
                    : "black"
                  : isSaved
                  ? "black"
                  : "none"
              }
            />
          </svg>
          <span>Save this Post</span>
          {saveMutation.isPending && (
            <span className="text-xs">(in progress)</span>
          )}
        </div>
      )}
      {isAdmin && (
        <div
          className="flex items-center gap-2 py-2 text-sm cursor-pointer"
          onClick={handleFeature}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            width="20px"
            height="20px"
          >
            <path
              d="M24 2L29.39 16.26L44 18.18L33 29.24L35.82 44L24 37L12.18 44L15 29.24L4 18.18L18.61 16.26L24 2Z"
              stroke="black"
              strokeWidth="2"
              fill={
                featureMutation.isPending
                  ? post.isFeatured
                    ? "none"
                    : "black"
                  : post.isFeatured
                  ? "black"
                  : "none"
              }
            />
          </svg>
          <span>Feature</span>
          {featureMutation.isPending && (
            <span className="text-xs">(in progress)</span>
          )}
        </div>
      )}
      {user && (post.user?._id === user.id || isAdmin) && (
        <div
          className="flex items-center gap-2 py-2 text-sm cursor-pointer"
          onClick={handleDelete}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 50 50"
            fill="red"
            width="20px"
            height="20px"
          >
            <path d="M 21 2 C 19.354545 2 18 3.3545455 18 5 L 18 7 L 10.154297 7 A 1.0001 1.0001 0 0 0 9.984375 6.9863281 A 1.0001 1.0001 0 0 0 9.8398438 7 L 8 7 A 1.0001 1.0001 0 1 0 8 9 L 9 9 L 9 45 C 9 46.645455 10.354545 48 12 48 L 38 48 C 39.645455 48 41 46.645455 41 45 L 41 9 L 42 9 A 1.0001 1.0001 0 1 0 42 7 L 40.167969 7 A 1.0001 1.0001 0 0 0 39.841797 7 L 32 7 L 32 5 C 32 3.3545455 30.645455 2 29 2 L 21 2 z M 21 4 L 29 4 C 29.554545 4 30 4.4454545 30 5 L 30 7 L 20 7 L 20 5 C 20 4.4454545 20.445455 4 21 4 z M 11 9 L 18.832031 9 A 1.0001 1.0001 0 0 0 19.158203 9 L 30.832031 9 A 1.0001 1.0001 0 0 0 31.158203 9 L 39 9 L 39 45 C 39 45.554545 38.554545 46 38 46 L 12 46 C 11.445455 46 11 45.554545 11 45 L 11 9 z M 18.984375 13.986328 A 1.0001 1.0001 0 0 0 18 15 L 18 40 A 1.0001 1.0001 0 1 0 20 40 L 20 15 A 1.0001 1.0001 0 0 0 18.984375 13.986328 z M 24.984375 13.986328 A 1.0001 1.0001 0 0 0 24 15 L 24 40 A 1.0001 1.0001 0 1 0 26 40 L 26 15 A 1.0001 1.0001 0 0 0 24.984375 13.986328 z M 30.984375 13.986328 A 1.0001 1.0001 0 0 0 30 15 L 30 40 A 1.0001 1.0001 0 1 0 32 40 L 32 15 A 1.0001 1.0001 0 0 0 30.984375 13.986328 z" />
          </svg>
          <span>Delete this Post</span>
          {deleteMutation.isPending && (
            <span className="text-xs">(in progress)</span>
          )}
        </div>
      )}
      {user.id === post.user?._id && (
        <Link
          to={`/edit/${slug}`}
          className="flex items-center gap-2 py-2 text-sm cursor-pointe"
        >
          📝 Edit Post
        </Link>
      )}

      {user && post.user?._id !== user.id && !isAdmin && (
        <div className="flex items-center gap-2 py-2 text-sm cursor-pointer"
         onClick={() => handleReport(postId)}>
           🚩
          <span>Report this Post</span>
        </div>
      )}
    </div>
  );
};

export default PostMenuActions;