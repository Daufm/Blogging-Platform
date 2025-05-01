import PostListItem from "./PostListItem";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSearchParams } from "react-router-dom";

const fetchPosts = async (pageParam, searchParams) => {
  const searchParamsObj = Object.fromEntries([...searchParams]);

  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
    params: { page: pageParam, limit: 10, ...searchParamsObj },
  });
  return res.data;
};

const PostList = () => {
  const [searchParams] = useSearchParams();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["posts", searchParams.toString()],
    queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam, searchParams),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasMore ? pages.length + 1 : undefined,
  });

  if (isFetching) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center text-red-500">Something went wrong!</div>;

  const allPosts = data?.pages?.flatMap((page) => page.posts) || [];

  return (
    <div className="flex flex-wrap gap-6 justify-start">
      {allPosts.length === 0 ? (
        <p className="text-gray-500 text-center w-full">No posts available.</p>
      ) : (
        <InfiniteScroll
          dataLength={allPosts.length}
          next={fetchNextPage}
          hasMore={!!hasNextPage}
          loader={<h4 className="text-center">Loading more posts...</h4>}
          endMessage={
            <p className="text-center text-gray-500">
              {/* <b>All posts loaded!</b> */}
            </p>
          }
          className="flex flex-wrap gap-6 justify-start"
        >
          {allPosts.map((post) => (
            <div
              key={post._id}
              className="flex flex-col w-full sm:w-[calc(60%-1rem)] md:w-[calc(45%-1rem)] lg:w-[calc(30%-1rem)]"
            >
              <PostListItem post={post} />
            </div>
          ))}
        </InfiniteScroll>
      )}
    </div>
  );
};

export default PostList;