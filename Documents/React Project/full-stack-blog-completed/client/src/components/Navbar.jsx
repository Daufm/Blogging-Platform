import { useState, useEffect } from "react";
import Image from "./Image";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Assuming user data is stored in localStorage as JSON string
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const renderProfile = () => {
    return (
      <Link to={`/profile/${user.username}`} className="flex items-center gap-2">
        <Image
          src={user.img || "/default-avatar.png"}
          alt="profile"
          className="w-10 h-10 rounded-full object-cover border border-gray-300"
        />
      </Link>
    );
  };

  return (
    <div className="w-full h-16 md:h-20 flex items-center justify-between">
      {/* LOGO */}
      <Link to="/" className="flex items-center gap-4 text-2xl font-bold">
        <Image src="blog.png" alt="BlogSphere Logo" w={35} h={35} />
        <span>BlogSphere</span>
      </Link>

      {/* MOBILE MENU */}
      <div className="md:hidden">
        {/* MOBILE BUTTON */}
        <div className="cursor-pointer text-4xl" onClick={() => setOpen((prev) => !prev)}>
          <div className="flex flex-col gap-[5.4px]">
            <div className={`h-[3px] w-6 bg-black origin-left transition-all ${open && "rotate-45"}`} />
            <div className={`h-[3px] w-6 bg-black transition-all ${open && "opacity-0"}`} />
            <div className={`h-[3px] w-6 bg-black origin-left transition-all ${open && "-rotate-45"}`} />
          </div>
        </div>

        {/* MOBILE LINK LIST */}
        <div
          className={`w-full h-screen bg-[#e6e6ff] flex flex-col items-center justify-center gap-8 font-medium text-lg absolute top-16 transition-all ${
            open ? "-right-0" : "-right-[100%]"
          }`}
        >
          <Link to="/" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/posts?sort=trending" onClick={() => setOpen(false)}>Trending</Link>
          <Link to="/posts?sort=popular" onClick={() => setOpen(false)}>Most Popular</Link>
          <Link to="/" onClick={() => setOpen(false)}>About</Link>
          
          {user ? (
            <Link to={`/profile/${user.username}`} onClick={() => setOpen(false)}>
              <Image
                src={user.img || "/default-avatar.png"}
                alt="profile"
                className="w-10 h-10 rounded-full object-cover border border-gray-300"
              />
            </Link>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)}>
              <button className="py-2 px-4 rounded-3xl bg-blue-800 text-white">Login 👋</button>
            </Link>
          )}
        </div>
      </div>

      {/* DESKTOP MENU */}
      <div className="hidden md:flex items-center gap-8 xl:gap-12 font-medium">
        <Link to="/">Home</Link>
        <Link to="/posts?sort=trending">Trending</Link>
        <Link to="/posts?sort=popular">Most Popular</Link>
        <Link to="/">About</Link>

        {user ? renderProfile() : (
          <Link to="/login">
            <button className="py-2 px-4 rounded-3xl bg-blue-800 text-white">Login 👋</button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
