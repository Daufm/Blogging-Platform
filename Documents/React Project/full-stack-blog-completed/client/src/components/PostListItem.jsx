import { Link } from "react-router-dom";
import Image from "./Image";
import { format } from "timeago.js";
import { useQueryClient } from "@tanstack/react-query";
import { fetchAuthorData } from "../utils/api"; // Adjust path as needed

const PostListItem = ({ post }) => {
  const queryClient = useQueryClient(); // Access the queryClient instance

  const prefetchAuthorData = () => {
    queryClient.prefetchQuery({
      queryKey: ["author", post.user.username],
      queryFn: () => fetchAuthorData(post.user.username),
    });
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8 mb-12">
      {/* image */}
      {post.img && (
        <div className="md:hidden xl:block xl:w-1/3">
          <Image src={post.img} className="rounded-2xl object-cover" w="500" h="300" />
        </div>
      )}
      {/* details */}
      <div className="flex flex-col gap-4 xl:w-2/3">
        <Link to={`/${post.slug}`} className="text-4xl font-semibold">
          {post.title}
        </Link>
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <span>Written by</span>
          <Link
            to={post.user ? `/authors/${post.user.username}` : "#"}
            className="text-blue-800"
            onMouseEnter={post.user ? prefetchAuthorData : undefined} // Only prefetch if user exists
             >
            {post.user?.username || "Unknown Author"} {/* Fallback to "Unknown Author" */}
          </Link>
           
          <span>on</span>
          <Link className="text-blue-800">{post.category}</Link>
          <span>{format(post.createdAt)}</span>
        </div>
        <p>{post.desc}</p>
        <Link to={`/${post.slug}`} className="underline text-blue-800 text-sm">
          Read More
        </Link>
      </div>
    </div>
  );
};

export default PostListItem;