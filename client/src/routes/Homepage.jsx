import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Suspense, lazy } from "react";
import MainCategories from "../components/MainCategories";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import PopularAuthors from "../components/popular";

const PostList = lazy(() => import("../components/PostList"));

const Homepage = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) controls.start("visible");
    else controls.start("hidden");
  }, [controls, inView]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Enhanced floating background elements */}
      <div className="fixed -z-10 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-indigo-200 dark:bg-indigo-800 opacity-30 blur-[100px] animate-float1"></div>
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-blue-200 dark:bg-blue-800 opacity-30 blur-[100px] animate-float2"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 rounded-full bg-purple-200 dark:bg-purple-800 opacity-30 blur-[100px] animate-blob"></div>
        <div className="absolute top-1/2 left-1/3 w-72 h-72 rounded-full bg-pink-200 dark:bg-pink-800 opacity-30 blur-[100px] animate-float3"></div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 text-sm md:text-base font-medium mb-8"
        >
          <Link
            to="/"
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 hover:scale-105"
            aria-label="Go to homepage"
          >
            Home
          </Link>
          <span className="text-gray-400 dark:text-gray-500">•</span>
          <span className="text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full">
            Blogs and Articles
          </span>
        </motion.div>

        {/* Enhanced Categories Section */}
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
          className="relative mb-12"
        >
          <div className="absolute -top-6 -left-6 w-40 h-40 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-8 -right-6 w-40 h-40 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" style={{ animationDelay: "2s" }} />
          <div className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <MainCategories />
          </div>
        </motion.div>

        {/* Enhanced Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Enhanced Post List */}
          <div className="w-full lg:w-[70%]">
            <Suspense fallback={
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            }>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <motion.h2
                  className="mb-8 text-4xl font-bold text-gray-800 dark:text-gray-200 flex items-center"
                  initial={{ x: -50 }}
                  whileInView={{ x: 0 }}
                  transition={{ type: "spring", stiffness: 100 }}
                  viewport={{ once: true }}
                >
                  <span className="relative pb-2">
                    Recent Posts
                    <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 via-purple-500 to-blue-600 rounded-full transform scale-x-100 transition-transform duration-300"></span>
                  </span>
                </motion.h2>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                  <PostList />
                </div>
              </motion.div>
            </Suspense>
          </div>

          {/* Enhanced Popular Authors */}
          <div className="w-full lg:w-[30%]">
            <div className="sticky top-24">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <motion.h2
                  className="mb-8 text-3xl font-bold text-gray-800 dark:text-gray-200 flex items-center"
                  initial={{ x: -50 }}
                  whileInView={{ x: 0 }}
                  transition={{ type: "spring", stiffness: 100 }}
                  viewport={{ once: true }}
                >
                  <span className="relative pb-2">
                    Who to Follow
                    <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 via-purple-500 to-blue-600 rounded-full transform scale-x-100 transition-transform duration-300"></span>
                  </span>
                </motion.h2>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 backdrop-blur-sm">
                  <PopularAuthors />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
