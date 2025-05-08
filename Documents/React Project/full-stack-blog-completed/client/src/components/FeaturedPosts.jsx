import { Link } from "react-router-dom";
import Image from "./Image";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { format } from "timeago.js";
import { useQueryClient } from "@tanstack/react-query";
import { fetchAuthorData } from "../utils/api";

const fetchPost = async () => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/posts?featured=true&limit=4&sort=newest`
  );
  return res.data;
};

const FeaturedPosts = () => {
  const queryClient = useQueryClient();
  const { isPending, error, data } = useQuery({
    queryKey: ["featuredPosts"],
    queryFn: () => fetchPost(),
  });

  const prefetchAuthorData = (username) => {
    queryClient.prefetchQuery({
      queryKey: ["author", username],
      queryFn: () => fetchAuthorData(username),
    });
  };

  if (isPending) return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="text-center py-12">
      <div className="max-w-md mx-auto p-6 bg-red-50 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Error loading featured posts</h2>
        <p className="text-gray-600">{error.message}</p>
      </div>
    </div>
  );

  const posts = data.posts;
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">No featured posts yet</h3>
        <p className="mt-1 text-gray-500">Check back later for featured content.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 flex flex-col gap-8">
      {posts.map((post, index) => (
        <div 
          key={post._id} 
          className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
        >
          <div className="flex flex-col md:flex-row gap-6 p-6">
            {/* Number */}
            <div className="text-3xl font-bold text-gray-200 dark:text-gray-600 group-hover:text-blue-500 transition-colors">
              {(index + 1).toString().padStart(2, '0')}.
            </div>
            
            {/* Image */}
            {post.img && (
              <div className="md:w-1/3 aspect-video overflow-hidden rounded-lg">
                <Image
                  src={post.img}
                  alt={post.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  w="400"
                  h="225"
                />
              </div>
            )}
            
            {/* Content */}
            <div className="flex-1 flex flex-col">
              {/* Category and Date */}
              <div className="flex items-center gap-4 text-sm mb-3">
                <Link 
                  to={`/category/${post.category}`}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {post.category}
                </Link>
                <span className="text-gray-500">{format(post.createdAt)}</span>
              </div>
              
              {/* Title */}
              <Link
                to={`/${post.slug}`}
                className="block mb-3"
              >
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {post.title}
                </h2>
              </Link>
              
              {/* Description */}
              <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                {post.desc}
              </p>

              {/* Author and Read More */}
              <div className="mt-auto flex items-center justify-between">
                <div className="flex items-center">
                  {post.user?.img ? (
                    <Image
                      src={post.user.img}
                      alt={post.user.username}
                      className="w-8 h-8 rounded-full mr-2 object-cover"
                      w="32"
                      h="32"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                  <Link
                    to={post.user ? `/authors/${post.user.username}` : "#"}
                    className="text-sm font-medium text-gray-700 hover:text-blue-600 transition"
                    onMouseEnter={post.user ? () => prefetchAuthorData(post.user.username) : undefined}
                  >
                    {post.user?.username || "Unknown Author"}
                  </Link>
                </div>

                <Link
                  to={`/${post.slug}`}
                  className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium"
                >
                  Read More
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturedPosts;
