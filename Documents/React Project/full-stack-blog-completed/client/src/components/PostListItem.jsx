import { Link } from "react-router-dom";
import Image from "./Image";
import { format } from "timeago.js";
import { useQueryClient } from "@tanstack/react-query";
import { fetchAuthorData } from "../utils/api";

const PostListItem = ({ post }) => {
  const queryClient = useQueryClient();

  const prefetchAuthorData = () => {
    queryClient.prefetchQuery({
      queryKey: ["author", post.user?.username],
      queryFn: () => fetchAuthorData(post.user?.username),
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col border border-gray-100">
      {/* Post Image */}
      {post.img && (
        <div className="h-48 w-full overflow-hidden">
          <Image 
            src={post.img} 
            alt={post.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            w="600"
            h="300"
          />
        </div>
      )}
      
      {/* Post Content */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Category Badge */}
        {post.category && (
          <Link 
            to={`/category/${post.category}`}
            className="inline-block bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1 rounded-full mb-3 hover:bg-blue-100 transition"
          >
            {post.category}
          </Link>
        )}
        
        {/* Title */}
        <Link 
          to={`/${post.slug}`}
          className="text-xl font-bold text-gray-800 mb-2 hover:text-blue-600 transition line-clamp-2"
        >
          {post.title}
        </Link>
        
        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
          {post.desc}
        </p>
        
        {/* Metadata */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center">
            {post.user?.img ? (
              <Image
                src={post.user.img}
                alt={post.user.username}
                className="w-8 h-8 rounded-full mr-2 object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
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
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition"
              onMouseEnter={post.user ? prefetchAuthorData : undefined}
            >
              {post.user?.username || "Unknown Author"}
            </Link>
          </div>
          
          <span className="text-xs text-gray-500">
            {format(post.createdAt)}
          </span>
        </div>
        
        {/* Read More Button */}
        <Link
          to={`/${post.slug}`}
          className="mt-4 inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm font-medium"
        >
          Read More
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 ml-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default PostListItem;