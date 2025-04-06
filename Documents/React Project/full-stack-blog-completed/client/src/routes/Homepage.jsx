import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import MainCategories from "../components/MainCategories";
import FeaturedPosts from "../components/FeaturedPosts";
import PostList from "../components/PostList";

const Homepage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Add a slight delay for staggered animation effect
    setIsLoaded(true);
  }, []);

  return (
    <div className="mt-6 flex flex-col gap-6 transition-all duration-300">
      {/* BREADCRUMB */}
      <div className={`flex items-center gap-3 text-sm md:text-base font-medium transition-all duration-500 ease-out transform ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
        <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
          Home
        </Link>
        <span className="text-gray-400 dark:text-gray-500">•</span>
        <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Blogs and Articles</span>
      </div>
      
      {/* INTRODUCTION */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 py-4">
        {/* titles */}
        <div className={`max-w-3xl transition-all duration-700 ease-out delay-100 transform ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'}`}>
          <h1 className="text-gray-800 dark:text-black text-3xl md:text-5xl lg:text-4xl font-bold leading-tight">
          Discover Inspiring Stories and Ideas from Around the World.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 dark:text-brown-400">
          Join our community of writers and readers. Share your thoughts, 
          explore new perspectives, and connect with like-minded individuals..
          </p>
          <Link to="write" className="lg:hidden mt-6 inline-flex items-center bg-gradient-to-r from-indigo-600 to-blue-700 text-white px-6 py-3 rounded-full font-medium transition-all hover:shadow-lg hover:scale-105">
            <span>Write your story</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" className="ml-2">
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </Link>
        </div>
        
        {/* animated button */}
        <div className={`hidden lg:block relative transition-all duration-700 ease-out delay-300 transform ${isLoaded ? 'translate-y-0 opacity-100 rotate-0' : '-translate-y-8 opacity-0 rotate-12'}`}>
          <svg
            viewBox="0 0 200 200"
            width="220"
            height="220"
            className="text-lg tracking-widest animate-[spin_15s_linear_infinite]"
          >
            <defs>
              <linearGradient id="textGradient" gradientTransform="rotate(45)">
                <stop offset="0%" stopColor="#4f46e5" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
            <path
              id="circlePath"
              fill="none"
              d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
            />
            <text fill="url(#textGradient)" className="font-medium">
              <textPath href="#circlePath" startOffset="0%">
                Write your story •
              </textPath>
              <textPath href="#circlePath" startOffset="50%">
                Share your idea •
              </textPath>
            </text>
          </svg>
          <Link to="write" className="absolute top-0 left-0 right-0 bottom-0 m-auto w-24 h-24 bg-gradient-to-r from-indigo-600 to-blue-700 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="45"
              height="45"
              fill="none"
              stroke="white"
              strokeWidth="2"
              className="transition-transform duration-300 group-hover:rotate-45"
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </Link>
        </div>
      </div>
      
      {/* CATEGORIES */}
      <div className={`transition-all duration-700 ease-out delay-400 transform ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'}`}>
        <MainCategories />
      </div>
      
      {/* FEATURED POSTS */}
      <div className={`transition-all duration-700 ease-out delay-500 transform ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'}`}>
        <FeaturedPosts />
      </div>
      
      {/* POST LIST */}
      <div className={`transition-all duration-700 ease-out delay-600 transform ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'}`}>
        <h2 className="my-8 text-2xl font-bold text-gray-700 dark:text-gray-300 flex items-center">
          <span className="relative">
            Recent Posts
            <span className="absolute -bottom-1 left-0 w-1/2 h-1 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full"></span>
          </span>
        </h2>
        <PostList/>
      </div>
    </div>
  );
};

export default Homepage;