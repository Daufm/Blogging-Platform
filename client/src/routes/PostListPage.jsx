import { useState } from "react";
import PostList from "../components/PostList";
import SideMenu from "../components/SideMenu";

const PostListPage = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-4">Posts</h1>
      <p className="text-gray-500 mb-4">
        Here you can find all the posts. You can filter or search for specific
        posts using the options on the right.
      </p>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="bg-blue-800 text-sm text-white px-4 py-2 rounded-2xl mb-4 md:hidden"
      >
        {open ? "Close" : "Filter or Search"}
      </button>
      <div className="flex flex-col-reverse gap-8 md:flex-row justify-between">
      {/* Main content area for posts */}
      <div className="w-full md:w-2/3 lg:w-3/4">
        <PostList />
      </div>
      {/* Sidebar for filters/search */}
      <div className={`${open ? "block" : "hidden"} md:block md:w-1/3 lg:w-1/4`}>
        <SideMenu />
      </div>
    </div>
    </div>
  );
};

export default PostListPage;
