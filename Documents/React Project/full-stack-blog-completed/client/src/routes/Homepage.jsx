import { Link } from "react-router-dom";
import { useEffect, useState, lazy, Suspense } from "react";
import MainCategories from "../components/MainCategories";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

const FeaturedPosts = lazy(() => import("../components/FeaturedPosts"));
const PostList = lazy(() => import("../components/PostList"));

const Homepage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const controls = useAnimation();
  const [ref, inView] = useInView();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, inView]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="mt-6 flex flex-col gap-6 overflow-hidden">
      {/* Floating background elements (hidden on small screens) */}
      <div className="fixed -z-10 w-full h-full overflow-hidden pointer-events-none hidden sm:block">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-indigo-100 dark:bg-indigo-900 opacity-20 blur-3xl animate-float1"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-blue-100 dark:bg-blue-900 opacity-20 blur-3xl animate-float2"></div>
        <div className="absolute bottom-1/4 right-1/3 w-72 h-72 rounded-full bg-purple-100 dark:bg-purple-900 opacity-20 blur-3xl animate-float3"></div>
      </div>

      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3 text-sm md:text-base font-medium my-2 mt-5" // Added mt-16
      >
        <Link
          to="/"
          className="text-gray-600 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-300 hover:underline underline-offset-4"
        >
          Home
        </Link>
        <span className="text-gray-400 dark:text-gray-500">•</span>
        <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
          Blogs and Articles
        </span>
      </motion.div>

      {/* Intro Section */}
      <motion.div
        variants={container}
        initial="hidden"
        animate={isLoaded ? "show" : "hidden"}
        className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 py-4"
      >
        {/* Title Section */}
        <motion.div variants={item} className="max-w-3xl relative">
          <motion.h1
            className="text-gray-800 dark:text-gray-600 text-4xl md:text-6xl lg:text-5xl font-bold leading-tight"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <span className="relative">
              Discover{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
                Inspiring Stories
              </span>
              <motion.span
                className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
              />
            </span>
            <br />
            and Ideas from Around the World.
          </motion.h1>

          <motion.p
            className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Join our community of writers and readers. Share your thoughts,
            explore new perspectives, and connect with like-minded individuals.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link
              to="write"
              className="lg:hidden mt-8 inline-flex items-center bg-gradient-to-r from-indigo-600 to-blue-700 text-white px-8 py-4 rounded-full font-medium transition-all hover:shadow-lg hover:scale-105 shadow-indigo-500/30 hover:shadow-indigo-500/50 focus:outline-none focus:ring-4 focus:ring-indigo-400"
              aria-label="Write your story"
            >
              <span>Write your story</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="ml-2 animate-pulse"
              >
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </Link>
          </motion.div>
        </motion.div>

        {/* Animated CTA Button (large screen) */}
        <motion.div
          className="hidden lg:block relative"
          initial={{ opacity: 0, scale: 0.5, rotate: -30 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.8, type: "spring" }}
        >
          <svg
            viewBox="0 0 200 200"
            width="260"
            height="260"
            className="text-lg tracking-widest animate-[spin_20s_linear_infinite] hover:animate-[spin_10s_linear_infinite] transition-all"
          >
            <defs>
              <linearGradient id="textGradient" gradientTransform="rotate(45)">
                <stop offset="0%" stopColor="#4f46e5" />
                <stop offset="50%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
              <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <path
              id="circlePath"
              fill="none"
              d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
            />
            <text fill="url(#textGradient)" filter="url(#glow)">
              <textPath href="#circlePath" startOffset="0%">
                ✍️ Write your story •
              </textPath>
              <textPath href="#circlePath" startOffset="50%">
                💡 Share your idea •
              </textPath>
            </text>
          </svg>
          <Link
            to="write"
            className="absolute top-0 left-0 right-0 bottom-0 m-auto w-28 h-28 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 group"
            aria-label="Write a story"
          >
            <div className="absolute inset-0 rounded-full border-4 border-indigo-300/30 group-hover:border-indigo-300/50 animate-ping-slow pointer-events-none"></div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="50"
              height="50"
              fill="none"
              stroke="white"
              strokeWidth="2"
              className="transition-transform duration-500 group-hover:rotate-45 group-hover:scale-110"
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </Link>
        </motion.div>
      </motion.div>

      {/* Categories */}
      <motion.div
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" },
          },
        }}
        className="relative"
      >
        <div className="absolute -top-6 -left-6 w-32 h-32 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-8 -right-6 w-32 h-32 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <MainCategories />
      </motion.div>

      {/* Featured Posts */}
      <Suspense fallback={<div>Loading featured posts...</div>}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="relative z-10"
        >
          <FeaturedPosts />
        </motion.div>
      </Suspense>

      {/* Post List */}
      <Suspense fallback={<div>Loading posts...</div>}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative"
        >
          <motion.h2
            className="my-8 text-3xl font-bold text-gray-700 dark:text-gray-300 flex items-center"
            initial={{ x: -50 }}
            whileInView={{ x: 0 }}
            transition={{ type: "spring" }}
            viewport={{ once: true }}
          >
            <span className="relative pb-2">
              Recent Posts
              <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 via-purple-500 to-blue-600 rounded-full"></span>
            </span>
          </motion.h2>
          <PostList />
        </motion.div>
      </Suspense>

      {/* Floating CTA at bottom */}
      <motion.div
        className="fixed bottom-8 right-8 z-50"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
      >
        <Link
          to="write"
          className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 group focus:outline-none focus:ring-4 focus:ring-indigo-400"
          aria-label="Write a post"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="30"
            height="30"
            fill="none"
            stroke="white"
            strokeWidth="2"
            className="group-hover:rotate-45 transition-transform"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </Link>
      </motion.div>
    </div>
  );
};

export default Homepage;
