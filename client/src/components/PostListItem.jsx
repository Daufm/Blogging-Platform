import { Link } from "react-router-dom";
import Image from "./Image";
import { useQueryClient } from "@tanstack/react-query";
import { fetchAuthorData } from "../utils/api";
import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "react-toastify";

const PostListItem = ({ post }) => {
  const queryClient = useQueryClient();

  const currentUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  }, []);

  const currentUserId = currentUser?.id || null;

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);

  useEffect(() => {
    if (post.likes?.includes(currentUserId)) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
  }, [post.likes, currentUserId]);

  const prefetchAuthorData = useCallback(() => {
    if (post.user?.username) {
      queryClient.prefetchQuery({
        queryKey: ["author", post.user.username],
        queryFn: () => fetchAuthorData(post.user.username),
      });
    }
  }, [post.user?.username, queryClient]);

  const handleLike = async () => {
    try {
      const newIsLiked = !isLiked;
      setIsLiked(newIsLiked);
      setLikeCount((prev) => (newIsLiked ? prev + 1 : prev - 1));

      const res = await fetch(`${import.meta.env.VITE_API_URL}/posts/${post._id}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();

      if (!res.ok) {
        setIsLiked(!newIsLiked);
        setLikeCount((prev) => (newIsLiked ? prev - 1 : prev + 1));
        toast.error(data.message || "Failed to like post");
      } else {
        toast.success(data.message);
      }
    } catch (error) {
      setIsLiked(!isLiked);
      setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
      toast.error("Failed to like post");
    }
  };

  return (
    <div className="w-full md:w-[60%] lg:w-[70%] pr-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow hover:shadow-md transition-all duration-300 border-0  flex flex-col h-full overflow-hidden">
        {/* Image */}
        {post.img && (
          <Link to={`/${post.slug}`} className="block h-44 overflow-hidden">
            <Image
              src={post.img}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              w="600"
              h="300"
            />
          </Link>
        )}

        {/* Content */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Category */}
          {post.category && (
            <Link
              to={`/category/${post.category}`}
              className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-blue-100 font-medium inline-block px-2 py-1 rounded-full mb-2 hover:bg-blue-200 dark:hover:bg-blue-600 transition"
            >
              {post.category}
            </Link>
          )}

          {/* Title */}
          <Link
            to={`/${post.slug}`}
            className="text-lg font-semibold text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition mb-2 line-clamp-2"
          >
            {post.title}
          </Link>

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{post.desc}</p>

          {/* Footer: author, like, read more */}
          <div className="flex items-center mt-auto">
            {/* Author */}
            <div className="flex items-center gap-2 mr-6">
              {post.user?.img ? (
                <Image
                  src={post.user.img}
                  alt={post.user.username}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM3 17a7 7 0 0114 0H3z" />
                  </svg>
                </div>
              )}
              <Link
                to={`/authors/${post.user?.username || "#"}`}
                onMouseEnter={prefetchAuthorData}
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                {post.user?.username || "Unknown"}
              </Link>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleLike}
                aria-label={isLiked ? "Unlike post" : "Like post"}
                className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition mr-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 ${isLiked ? "text-red-500" : "text-gray-400 dark:text-gray-400"}`}
                  fill={isLiked ? "red" : "none"}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
                  />
                </svg>
                <span className="text-sm select-none">{likeCount}</span>
              </button>

              <Link
                to={`/${post.slug}`}
                className="text-sm text-blue-500 dark:text-blue-400 hover:underline"
              >
                Read more
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostListItem;
