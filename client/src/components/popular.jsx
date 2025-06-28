import { useEffect, useState } from "react";
import axios from "axios";
import Image from "./Image";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const PopularAuthors = () => {
  const [authors, setAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPopularAuthors = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/popular`);
        setAuthors(res.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching popular authors:", error);
        setIsLoading(false);
      }
    };

    fetchPopularAuthors();
  }, []);
  console.log(authores)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          <div className="absolute top-0 left-0 w-full h-full animate-ping rounded-full border-2 border-indigo-500 opacity-20"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Popular Authors
          </h2>
        </div>

        <div className="space-y-4">
          {authors.map((author, index) => (
            <motion.div
              key={author._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link
                to={`/authors/${author.username}`}
                className="group flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-300"
              >
                <div className="relative">
                  {author.img ? (
                    <Image
                      src={author.img}
                      alt={author.username}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-100 dark:ring-indigo-900 group-hover:ring-indigo-200 dark:group-hover:ring-indigo-800 transition-all duration-300"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center ring-2 ring-indigo-100 dark:ring-indigo-900 group-hover:ring-indigo-200 dark:group-hover:ring-indigo-800 transition-all duration-300">
                      <svg className="h-6 w-6 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM3 17a7 7 0 0114 0H3z" />
                      </svg>
                    </div>
                  )}
                  {author.isVerified && (
                    <div className="absolute -bottom-1 -right-1 bg-indigo-500 rounded-full p-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                      {author.username}
                    </h3>
                    {author.isVerified && (
                      <span className="text-xs bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full">
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                     {author.followers?.length || 0} followers
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                    Follow
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600 dark:text-indigo-400 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {authors.length === 0 && (
          <div className="text-center py-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
              No popular authors yet
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Popular authors will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PopularAuthors;
