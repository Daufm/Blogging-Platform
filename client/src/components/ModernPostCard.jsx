import { Link } from "react-router-dom";
import Image from "./Image";
import { format } from "timeago.js";
import { motion } from "framer-motion";

const ModernPostCard = ({ post }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
    >
      {/* Image Container */}
      {post.img && (
        <div className="relative h-48 overflow-hidden">
          <Image
            src={post.img}
            alt={post.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
          {post.category && (
            <Link
              to={`/category/${post.category}`}
              className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-blue-600 text-xs font-medium px-3 py-1 rounded-full hover:bg-white transition"
            >
              {post.category}
            </Link>
          )}
        </div>
      )}

      {/* Content Container */}
      <div className="p-6">
        {/* Title */}
        <Link
          to={`/${post.slug}`}
          className="block mb-3"
        >
          <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition line-clamp-2">
            {post.title}
          </h2>
        </Link>

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.desc}
        </p>

        {/* Author and Date */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {post.user?.img ? (
              <Image
                src={post.user.img}
                alt={post.user.username}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
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
          className="mt-4 inline-flex items-center justify-center w-full px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium group-hover:bg-blue-600 group-hover:text-white"
        >
          Read More
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform"
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
    </motion.div>
  );
};

export default ModernPostCard; 