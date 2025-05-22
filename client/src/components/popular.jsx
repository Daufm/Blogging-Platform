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
<div className="p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-xl shadow w-full max-w-md mx-auto">
  <h2 className="text-lg sm:text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100 text-center">
    Popular Authors
  </h2>

  <ul className="flex flex-col gap-6">
    {authors.map((author) => (
      <li
        key={author._id}
        className="bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-md p-5 flex flex-col items-center text-center hover:shadow-lg transition-shadow"
      >
        <Image
          src={author.img || "default-avatar.png"}
          alt={author.username}
          className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500 mb-3"
        />
        <div className="mb-4">
          <p className="font-semibold text-gray-800 dark:text-gray-200">{author.username}</p>
          <p className="text-gray-500 text-xs">{author.followerCount} followers</p>
        </div>
        <Link
          to={`/profile/${author.username}`}
          className="mt-auto text-sm px-4 py-2 bg-indigo-600 hover:bg-indigo-700 focus:bg-indigo-700 text-white rounded-full transition font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          View Profile
        </Link>
      </li>
    ))}
  </ul>
</div>

);
}

export default PopularAuthors;
