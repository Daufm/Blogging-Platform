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
    <div className="mt-6 flex flex-col gap-6 overflow-hidden  dark:bg-gray-900 ">
      {/* Floating background elements */}
      <div className="fixed -z-10 w-full h-full overflow-hidden pointer-events-none hidden sm:block">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-indigo-100 dark:bg-indigo-900 opacity-20 blur-3xl animate-float1"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-blue-100 dark:bg-blue-900 opacity-20 blur-3xl animate-float2"></div>
        <div
          className="absolute bottom-1/4 right-1/3 w-72 h-72 rounded-full bg-purple-100 dark:bg-purple-900 opacity-20 blur-3xl animate-blob"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3 text-sm md:text-base font-medium my-2 mt-5"
      >
        <Link
          to="/"
          className="text-gray-600 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-300 hover:underline underline-offset-4"
          aria-label="Go to homepage"
        >
          Home.
        </Link>
        <span className="text-gray-400 dark:text-gray-500">•</span>
        <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
          Blogs and Articles
        </span>
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
        <div
          className="absolute -bottom-8 -right-6 w-32 h-32 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"
          style={{ animationDelay: "2s" }}
        />
        <MainCategories />
      </motion.div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-100px)]">
        {/* Post List */}
        <div className="w-full lg:w-[70%] h-full overflow-y-auto pr-2 scrollbar-thin">
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
        </div>

        {/* Popular Authors */}
        <div className="w-full lg:w-[30%]">
          <div className="sticky top-24 overflow-y-scroll h-[calc(100vh-100px)] pr-2 scrollbar-thin">
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
                  Popular Authors
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 via-purple-500 to-blue-600 rounded-full"></span>
                </span>
              </motion.h2>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
                <PopularAuthors />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
