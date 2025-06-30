import { useState } from "react";
import { format } from "timeago.js";
import Image from "./Image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";

const Comment = ({ comment, postId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(comment.desc);

  const token = localStorage.getItem("token");
  const user = token ? JSON.parse(localStorage.getItem("user")) : null;
  const role = user?.role

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!token) throw new Error("Not authenticated");
      return axios.delete(
        `${import.meta.env.VITE_API_URL}/comments/delete/${comment._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      toast.success("Comment deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data || error.message);
    },
  });

  const editMutation = useMutation({
    mutationFn: async (desc) => {
      if (!token) throw new Error("Not authenticated");
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/comments/edit/${comment._id}`,
        { desc },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data; // updatedComment
    },
    onSuccess: (updatedComment) => {
      setEditValue(updatedComment.desc);
      setIsEditing(false);
      toast.success("Comment updated");
      // Invalidate to refetch the latest comments from backend
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
    onError: (error) => {
      toast.error(error.response?.data || error.message);
    },
  });

  // console.log("Comment:", comment);
  console.log("user name", user.username)
  console.log("role ", role)

  const isAuthor = user && comment.user?.username === user.username;

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
          <span className="font-semibold text-gray-800 dark:text-gray-100 mr-2">
            {comment.user?.username || "Anonymous"}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {format(comment.createdAt)}
          </span>
        </div>
        {isAuthor && !isEditing && (
          <button
            className="ml-2 text-xs text-blue-500 hover:text-blue-700"
            onClick={() => setIsEditing(true)}
            title="Edit"
          >
            <EditIcon fontSize="small" />
          </button>
        )}
        {user &&
          (isAuthor || role === "admin") && (
            <button
              className="ml-2 text-xs text-red-400 hover:text-red-600 dark:hover:text-red-300 font-semibold px-2 py-1 rounded transition-all duration-150 border border-transparent hover:border-red-300 dark:hover:border-red-500 bg-transparent hover:bg-red-50 dark:hover:bg-red-900/30"
              onClick={() => deleteMutation.mutate()}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </button>
          )}
      </div>
      <div className="mt-2 text-gray-700 dark:text-gray-200 text-base">
        {isEditing ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              editMutation.mutate(editValue);
            }}
            className="flex flex-col gap-2"
          >
            <textarea
              className="w-full rounded border px-2 py-1 text-gray-900 dark:text-gray-800"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              rows={2}
              required
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm"
                disabled={editMutation.isPending}
              >
                {editMutation.isPending ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
                onClick={() => {
                  setIsEditing(false);
                  setEditValue(comment.desc);
                }}
                disabled={editMutation.isPending}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <p>{comment.desc}</p>
        )}
      </div>
    </div>
  );
};

export default Comment;
