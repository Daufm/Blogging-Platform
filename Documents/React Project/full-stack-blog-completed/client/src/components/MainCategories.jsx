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
    { name: "For You", path: "/posts", id: "all" },
    { name: "Featured Post", path: "/featured_posts", id: "featured_posts" },
    { name: "Web Design", path: "/posts?cat=web-design", id: "web-design" },
    { name: "Development", path: "/posts?cat=development", id: "development" },
    { name: "Databases", path: "/posts?cat=databases", id: "databases" },
    { name: "Search Engines", path: "/posts?cat=seo", id: "seo" },
    { name: "Marketing", path: "/posts?cat=marketing", id: "marketing" },
  ];

  return (
    <div className="py-4">
      <div className="flex items-center gap-6 flex-wrap">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={category.path}
            className={`
              relative text-base font-medium transition-all duration-200 
              ${activeCategory === category.id 
                ? "text-blue-600 dark:text-blue-400" 
                : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              }
              after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 
              after:bg-blue-600 dark:after:bg-blue-400 after:transition-all after:duration-200
              hover:after:w-full
              ${activeCategory === category.id ? "after:w-full" : ""}
            `}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MainCategories;