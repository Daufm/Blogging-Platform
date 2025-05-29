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
<div className=" p-4 sm:p-6 bg-white dark:bg-gray-900   w-full max-w-md mx-auto">
 
  <ul className="flex flex-col gap-6">
    <hr className="my-8 border-gray-300 dark:border-gray-700" />
    {authors.map((author) => (
      <li
        key={author._id}
      >
        <div className="flex items-center justify-between p-2">
  {/* Left Section: Profile Picture and Name */}
  <div className="flex items-center space-x-3">
   
    {/* Author Name */}
    <span className="font-semibold text-gray-800 dark:text-gray-200">
      {author.username || 'Unknown Author'}
      <p className="text-indigo-600">{author.followers ? author.followers.length : 0} Followers</p>
    </span>
  </div>

  {/* Right Section: View Profile Button */}
  <Link
    to={`/authors/${author.username}`}
    className="
      text-sm
      px-3 py-1.5 // Slightly smaller padding for a compact button
      bg-transparent
      border border-indigo-500
      text-indigo-600
      rounded-full
      transition-colors duration-200 
      focus:outline-none focus:ring-2 focus:ring-indigo-400
      hover:bg-indigo-500 hover:text-white
      dark:border-indigo-400 dark:text-indigo-400
      dark:hover:bg-indigo-400 dark:hover:text-black
    "
  >
    View Profile
  </Link>
</div>
<hr className="my-8 border-gray-300 dark:border-gray-700" />
      </li>
    ))}
  </ul>
</div>

);
}

export default PopularAuthors;
