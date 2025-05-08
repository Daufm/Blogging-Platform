
import { Link } from "react-router-dom";
import Image from "./Image";
import { format } from "timeago.js";
import { useQueryClient } from "@tanstack/react-query";
import { fetchAuthorData } from "../utils/api";
import { useState , useEffect } from "react";
import { toast } from "react-toastify";




const PostListItem = ({ post }) => {
  const queryClient = useQueryClient();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);

  
  const currentUser = JSON.parse(localStorage.getItem("user")) || null ;
  const currentUserId = currentUser?.id || null;

  // Set the initial value of isLiked based on whether the current user has liked the post
   useEffect(() => {
    console.log("post.likes:", post.likes);
    console.log("currentUserId:", currentUserId);
    if (post.likes?.includes(currentUserId)) {
      setIsLiked(true);
    }
  }, [post.likes, currentUserId]);


  const prefetchAuthorData = () => {
    queryClient.prefetchQuery({
      queryKey: ["author", post.user?.username],
      queryFn: () => fetchAuthorData(post.user?.username),
    });
  };

  const handleLike = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/posts/${post._id}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setIsLiked(!isLiked);
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to like post");
    }
  };

  return (
    <div className="w-full md:w-1/2 pr-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-full flex flex-col">
        {/* Post Image */}
        {post.img && (
          <div className="w-full h-40 overflow-hidden mb-3">
            <Image
              src={post.img}
              alt={post.title}
              className="w-full h-full object-cover"
              w="600"
              h="300"
            />
          </div>
        )}

        {/* Category */}
        {post.category && (
          <Link
            to={`/category/${post.category}`}
            className="inline-block bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full mb-2"
          >
            {post.category}
          </Link>
        )}

        {/* Title */}
        <Link
          to={`/${post.slug}`}
          className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2"
        >
          {post.title}
        </Link>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{post.desc}</p>

        {/* Metadata and Actions */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            {post.user?.img ? (
              <Image
                src={post.user.img}
                alt={post.user.username}
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
            <Link
              to={post.user ? `/authors/${post.user.username}` : "#"}
              className="text-xs font-medium text-gray-600"
              onMouseEnter={post.user ? prefetchAuthorData : undefined}
            >
              {post.user?.username || "Unknown Author"}
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLike}
              className="flex items-center gap-1 text-gray-500 hover:text-red-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill={isLiked ? "red" : "currentColor"}
              >
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs">{likeCount}</span>
            </button>
            <Link to={`/${post.slug}`} className="text-xs text-blue-600 underline">
              Read more
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostListItem;
