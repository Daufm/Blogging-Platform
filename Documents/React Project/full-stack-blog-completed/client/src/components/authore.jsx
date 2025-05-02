import { useParams , useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import PostListItem from "../components/PostListItem";
import Image from "./Image";

const fetchAuthorData = async (username) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/authors/${username}`);
  return res.data;
};

const AuthorPage = () => {

  const { username } = useParams();
  const Navigate = useNavigate();

  const { isLoading, error, data } = useQuery({
    queryKey: ["author", username],
    queryFn: () => fetchAuthorData(username),
  });

  if (isLoading) return <div className="text-center py-12 text-gray-600">Loading author profile...</div>;
  if (error) return <div className="text-red-500 text-center py-12">Error: {error.message}</div>;

  const handleSupportAuthore = ()=>{
    Navigate("/support");
  }


  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-10">
      {/* Author Header */}
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 bg-white p-6 rounded-2xl shadow-md border">
        
          <Image
            src={data.author.img || "/default-avatar.png"}
            alt={data.author.username}
            className="w-28 h-28 rounded-full object-cover border-4 border-blue-100 shadow"
          />
        
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900">{data.author.username}</h1>
          <p className="mt-2 text-gray-600 text-sm">{data.author.bio || "No bio available."}</p>
          <p className="mt-1 text-xs text-gray-400">Role: {data.author.role}</p>


          <button
             onClick={handleSupportAuthore}
             className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
             >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-1-13h2v6h3l-4 4-4-4h3V7z" />
              </svg>
                Donate(Support) Author
            </button>

        </div>
      </div>

      {/* Posts Section */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
          📝 Posts by {data.author.username}
        </h2>

        {data.posts.length === 0 ? (
          <p className="text-gray-500 italic">This author hasn&apos;t published any posts yet.</p>
        ) : (
          <div className="flex flex-row  gap-5   ">
            {data.posts.map((post) => (
              <div key={post._id} className="w-full md:w-1/2 lg:w-1/3 p-2">
              <PostListItem key={post._id} post={post} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorPage;
