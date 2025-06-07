import { Link } from "react-router-dom";
import Image from "./Image";
import { useQueryClient } from "@tanstack/react-query";
import { fetchAuthorData } from "../utils/api";
import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

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
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="w-full"
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden backdrop-blur-sm">
        {/* Image */}
        {post.img && (
          <Link to={`/${post.slug}`} className="block h-48 overflow-hidden">
            <Image
              src={post.img}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              w="600"
              h="300"
            />
          </Link>
        )}

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow">
          {/* Category */}
          {post.category && (
            <Link
              to={`/category/${post.category}`}
              className="text-xs bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-medium inline-block px-3 py-1 rounded-full mb-3 hover:bg-indigo-200 dark:hover:bg-indigo-800/50 transition-colors duration-300"
            >
              {post.category}
            </Link>
          )}

          {/* Title */}
          <Link
            to={`/${post.slug}`}
            className="text-xl font-bold text-gray-800 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300 mb-3 line-clamp-2"
          >
            {post.title}
          </Link>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{post.desc}</p>

          {/* Footer: author, like, read more */}
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
            {/* Author */}
            <div className="flex items-center gap-2">
              {post.user?.img ? (
                <Image
                  src={post.user.img}
                  alt={post.user.username}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-100 dark:ring-indigo-900"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center ring-2 ring-indigo-100 dark:ring-indigo-900">
                  <svg className="h-6 w-6 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM3 17a7 7 0 0114 0H3z" />
                  </svg>
                </div>
              )}
              <Link
                to={`/authors/${post.user?.username || "#"}`}
                onMouseEnter={prefetchAuthorData}
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300"
              >
                {post.user?.username || "Unknown"}
              </Link>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleLike}
                aria-label={isLiked ? "Unlike post" : "Like post"}
                className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 ${isLiked ? "text-red-500" : "text-gray-400 dark:text-gray-400"}`}
                  fill={isLiked ? "currentColor" : "none"}
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
                <span className="text-sm font-medium select-none">{likeCount}</span>
              </motion.button>

              <Link
                to={`/${post.slug}`}
                className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-300 flex items-center gap-1"
              >
                Read more
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PostListItem;
