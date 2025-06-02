import { useEffect, useState } from "react";
import axios from "axios";
import Image from "./Image";
import { Link } from "react-router-dom";

const PopularAuthors = () => {
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    const fetchPopularAuthors = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/popular`);
        setAuthors(res.data);
      } catch (error) {
        console.error("Error fetching popular authors:", error);
      }
    };

    fetchPopularAuthors();
  }, []);

  return (
    <div className="p-6 bg-white dark:bg-gray-900 shadow-md rounded-xl max-w-xl mx-auto">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 text-center">
        🌟 Popular Authors
      </h2>
      <ul className="flex flex-col gap-6">
        {authors.map((author) => (
         <li key={author._id} className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <div className="flex items-center justify-between gap-4">
            {/* Author Info */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="w-12 h-12 shrink-0">
                <Image
                  src={author.img}
                  alt={author.username}
                  className="w-full h-full rounded-full object-cover border border-gray-300 dark:border-gray-600"
                />
              </div>
              <div className="truncate">
                <p className="text-base font-semibold text-gray-800 dark:text-gray-100 truncate">
                  {author.username || "Unknown Author"}
                </p>
                <p className="text-sm text-indigo-600 dark:text-indigo-400">
                  {author.followers?.length || 0} Followers
                </p>
              </div>
            </div>

            {/* View Profile Button (won’t shrink) */}
            <Link
              to={`/authors/${author.username}`}
              className="
                flex-shrink-0
                text-sm font-medium
                px-4 py-1.5
                border border-indigo-500
                text-indigo-600
                rounded-full
                transition duration-200
                hover:bg-indigo-500 hover:text-white
                dark:border-indigo-400 dark:text-indigo-400
                dark:hover:bg-indigo-400 dark:hover:text-black
                focus:outline-none focus:ring-2 focus:ring-indigo-300
              "
            >
              View Profile
            </Link>
          </div>
        </li>

        ))}
      </ul>
    </div>
  );
};

export default PopularAuthors;
