import { Link, useLocation } from "react-router-dom";
import Search from "./Search";
import { useState, useEffect } from "react";

const MainCategories = () => {
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState("");

  // Extract category from URL on component mount and when location changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get("cat") || "all";
    setActiveCategory(category);
  }, [location]);

  const categories = [
    { name: "All Posts", path: "/posts", id: "all" },
    { name: "Web Design", path: "/posts?cat=web-design", id: "web-design" },
    { name: "Development", path: "/posts?cat=development", id: "development" },
    { name: "Databases", path: "/posts?cat=databases", id: "databases" },
    { name: "Search Engines", path: "/posts?cat=seo", id: "seo" },
    { name: "Marketing", path: "/posts?cat=marketing", id: "marketing" },
  ];

  return (
    <div className="hidden md:flex bg-white dark:bg-gray-800 rounded-3xl xl:rounded-full p-4 shadow-lg backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 items-center justify-center gap-8 transition-all duration-300">
      {/* links */}
      <div className="flex-1 flex items-center justify-between flex-wrap gap-2">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={category.path}
            className={`
              relative px-4 py-2 rounded-full font-medium transition-all duration-200 ease-in-out
              ${activeCategory === category.id 
                ? "bg-gradient-to-r from-indigo-600 to-blue-700 text-white shadow-md scale-105" 
                : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 hover:scale-105"
              }
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50
            `}
            onClick={() => setActiveCategory(category.id)}
          >
            <span className="relative z-10">{category.name}</span>
            {activeCategory === category.id && (
              <span className="absolute inset-0 bg-indigo-600 rounded-full animate-pulse opacity-20"></span>
            )}
          </Link>
        ))}
      </div>
      
      {/* separator */}
      <div className="h-10 w-px bg-gradient-to-b from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
      
      {/* search */}
      <div className="transition-transform duration-200 hover:scale-105">
        <Search />
      </div>
    </div>
  );
};

export default MainCategories;