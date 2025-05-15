import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "../utils/api";
import PostList from "../components/PostList";
import FeaturedPosts from "../components/FeaturedPosts";
import Loading from "../components/Loading";
import Error from "../components/Error";

const Home = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useQuery({
    queryKey: ["posts", page],
    queryFn: () => fetchPosts(page),
  });

  if (isLoading) return <Loading />;
  if (error) return <Error error={error} />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content - Scrollable */}
        <div className="lg:w-2/3">
          <PostList posts={data.posts} />
          {data.hasMore && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setPage((prev) => prev + 1)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Load More
              </button>
            </div>
          )}
        </div>

        {/* Sidebar - Sticky */}
        <div className="lg:w-1/3">
          <div className="sticky top-4">
            <FeaturedPosts />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 