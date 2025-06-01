import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import PostListItem from "../components/PostListItem";
import Image from "./Image";
import {toast} from "react-toastify";

const fetchAuthorData = async (username) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/authors/${username}`);
  return res.data;
};

const AuthorPage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);




  const { isLoading, error, data } = useQuery({
    queryKey: ["author", username],
    queryFn: () => fetchAuthorData(username),
  });

    useEffect(() => {
    if (data?.isFollowing !== undefined) {
      setIsFollowing(data.isFollowing);
    }
  }, [data]);

  if (isLoading) 
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error) 
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center">
        <div className="bg-red-50 text-red-600 p-6 rounded-lg inline-block">
          <h2 className="text-xl font-medium mb-2">Error loading author</h2>
          <p>{error.message}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-3 text-sm bg-white px-3 py-1 rounded-md border border-red-200 hover:bg-red-100 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  const handleSupportAuthor = () => {
    navigate("/support");
  };

  const handlePaymentMethod = () => {
    navigate("/payment-methods");
  };

// Function to handle follow/unfollow action
const handleFollow = async (authorId) => {
  try {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/author/follow`, 
      { authorId },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (res.status === 200) {
      toast.success(res.data.message);
      setIsFollowing((prev) => !prev);
    } else {
      toast.error("Failed to follow/unfollow the author.");
    }
  } catch (error) {
    console.error("Error following/unfollowing author:", error);
    toast.error("An error occurred.");
  }
};



  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Author Header */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 mb-10">
        <div className="flex flex-col md:flex-row items-center gap-8 p-6 md:p-8">
          <div className="relative group">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg ring-2 ring-blue-100">
              <Image
                src={data.authorData.img || "/default-avatar.png"}
                alt={data.authorData.username}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {data.authorData.username}
                </h1>
                <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                  {data.authorData.role}
                </span>
              </div>
              
              <button
                onClick={handleSupportAuthor}
                className="flex-shrink-0 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 4a2 2 0 00-2 2v8a2 2 0 002 2h10a2 2 0 002-2V8a2 2 0 00-2-2h-2.5a1 1 0 01-.8-.4l-1.5-2A1 1 0 0010 3H6a1 1 0 00-.8.4l-1.5 2A1 1 0 014 5H2zm10 7h-1v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H6v1a1 1 0 11-2 0v-1H3V6h1v1a1 1 0 102 0V6h1v1a1 1 0 102 0V6h1v1a1 1 0 102 0V6h1v5z"
                    clipRule="evenodd"
                  />
                </svg>
                Support Author
              </button>

              <button
                onClick={handlePaymentMethod}
                className="flex-shrink-0 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
                
                fullWidth={{ xs: true, sm: false }}
               >
               Payment
              </button>
            </div>

            

            <p className="text-gray-600 mb-4">
              {data.authorData.bio || "This author hasn't written a bio yet."}
            </p>

            <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
              {data.authorData.website && (
                <a
                  href={data.authorData.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm font-medium transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Website
                </a>
              )}
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-800 rounded-lg text-sm font-medium">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
                Joined { new Date(data.authorData.createdAt).toLocaleDateString()}
              </span>

               {console.log('id', data.authorData._id)}

             <button
                onClick={() => handleFollow(data.authorData._id)}
            
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors 
                  ${isFollowing 
                    ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                    : 'bg-blue-100 text-blue-800 hover:bg-blue-200'}
                `}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>


            </div>

            <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-sm font-medium">
                  {data.authorData.followers.length} Followers
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-sm font-medium">
                  {data.authorData.following.length} Following
                </span>
              </div>

            </div>


          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
            </svg>
            Latest Posts
          </h2>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {data.posts.length} {data.posts.length === 1 ? "post" : "posts"}
          </span>
        </div>

        {data.posts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 p-8 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No posts published yet
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              When {data.author.username} publishes posts, they&apos;ll appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.posts.map((post) => (
              <PostListItem key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorPage;