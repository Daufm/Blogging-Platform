import { format } from "timeago.js";
import Image from "./Image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";

const Comment = ({ comment, postId }) => {
  
  const token = localStorage.getItem("token");
  const user = token ? JSON.parse(atob(token.split(".")[1])).user : null; // Decode the token to get user info
  const role = user?.role;
  
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      if (!token) {
        throw new Error("Not authenticated");
      }
      return axios.delete(
        `${import.meta.env.VITE_API_URL}/comments/${comment._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      toast.success("Comment deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });

  return (
    <div className="py-5 px-4 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm mb-0">
      <div className="flex items-center gap-4 mb-2">
        {comment.user?.img && (
          <Image
            src={comment.user.img}
            className="w-10 h-10 rounded-full object-cover border-2 border-blue-200 dark:border-blue-700 shadow"
            w="40"
          />
        )}
        <div className="flex-1">
          <span className="font-semibold text-gray-800 dark:text-gray-100 mr-2">{comment.user?.username || "Anonymous"}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{format(comment.createdAt)}</span>
        </div>
        {user &&
          (comment.user.username === user.username || role === "admin") && (
            <button
              className="ml-2 text-xs text-red-400 hover:text-red-600 dark:hover:text-red-300 font-semibold px-2 py-1 rounded transition-all duration-150 border border-transparent hover:border-red-300 dark:hover:border-red-500 bg-transparent hover:bg-red-50 dark:hover:bg-red-900/30"
              onClick={() => mutation.mutate()}
            >
              {mutation.isPending ? 'Deleting...' : 'Delete'}
            </button>
          )}
      </div>
      <div className="mt-2 text-gray-700 dark:text-gray-200 text-base">
        <p>{comment.desc}</p>
      </div>
    </div>
  );
};

export default Comment;
