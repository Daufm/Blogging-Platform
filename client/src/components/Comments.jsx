import axios from "axios";
import Comment from "./Comment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { toast } from "react-toastify";

const fetchComments = async (postId) => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/comments/${postId}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },

    }
  );
  return res.data;

  
};

const Comments = ({ postId }) => {
const token = localStorage.getItem("token");
const user = token ? JSON.parse(atob(token.split(".")[1])).user : null; // Decode the token to get user info
const [commentText, setCommentText] = useState("");
const formRef = useRef();

  const { isPending, error, data } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newComment) => {
      if (!token) {
        throw new Error("Not authenticated");
      }
      return axios.post(
        `${import.meta.env.VITE_API_URL}/comments/${postId}`,
        newComment,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      setCommentText(""); // Clear the input
      formRef.current?.reset(); // Reset the form
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const data = {
      desc: formData.get("desc"),
    };

    mutation.mutate(data);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-800 mb-12">
      <div className="flex items-center gap-2 mb-6">
        <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Comments</h1>
      </div>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row items-end gap-4 mb-8"
      >
        <textarea
          name="desc"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write a comment..."
          className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 resize-none min-h-[60px]"
        />
        <button 
          type="submit"
          disabled={!commentText.trim()}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 px-6 py-3 text-white font-bold rounded-xl shadow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </form>
      {isPending ? (
        <div className="text-gray-500 dark:text-gray-400">Loading...</div>
      ) : error ? (
        <div className="text-red-500">Error loading comments!</div>
      ) : (
        <div className="space-y-6 divide-y divide-gray-200 dark:divide-gray-700">
          {mutation.isPending && (
            <Comment
              comment={{
                desc: `${mutation.variables.desc} (Sending...)`,
                createdAt: new Date(),
                user: {
                  img: user?.imageUrl || "",
                  username: user?.username || "Anonymous",
                },
              }}
            />
          )}
          {data.map((comment) => (
            <Comment key={comment._id} comment={comment} postId={postId} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comments;
