 import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      const query = e.target.value;
      if (location.pathname === "/posts") {
        setSearchParams({ ...Object.fromEntries(searchParams), search: query });
      } else {
        navigate(`/posts?search=${query}`);
      }
    }
  };

  return (
   <div className="sm:w-1/2 p-2">
  <div className="relative w-full">
    {/* Search Icon */}
    <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 text-lg"></i>

    {/* Search Input */}
    <input
      type="text"
      placeholder="search a post"
       className="w-[260px] sm:w-[320px] pl-12 pr-4 py-2 rounded-full border border-gray-400 bg-white text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      onKeyDown={handleKeyPress}
    />
  </div>
</div>

  );
};

export default Search;
