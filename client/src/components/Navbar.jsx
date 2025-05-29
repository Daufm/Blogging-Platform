import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../utils/AuthContext";
import Image from "./Image"; 
import Search from "./Search"; 




const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "system");
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);

    // Token expiry check and redirect to login if expired
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const expirationTime = decodedToken.exp * 1000;
        if (Date.now() > expirationTime) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }
      } catch {
        // invalid token format, logout
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, [navigate]);

  useEffect(() => {
    if (theme === "system") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.toggle("dark", isDark);
    } else {
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/posts?sort=trending", label: "Trending" },
    { path: "/posts?sort=popular", label: "Popular" },
    { path: "/about", label: "About" },
  ];

  // Variants for framer-motion animations
  const mobileNavVariants = {
    hidden: { x: "100%" },
    visible: {
      x: 0,
      transition: { type: "spring", stiffness: 100, damping: 20 },
    },
    exit: {
      x: "100%",
      transition: { ease: "easeInOut", duration: 0.3 },
    },
  };

  const navItemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5 },
    }),
  };

  const handleThemeChange = (selectedTheme) => {
    setTheme(selectedTheme);
    setThemeMenuOpen(false);
  };

  const renderProfile = () => (
    <Link to={`/profile/${user.username}`} className="flex items-center gap-2 group">
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Image
          src={user.img || "/default-avatar.png"}
          alt="profile"
          className="w-10 h-10 rounded-full object-cover border-2 border-transparent group-hover:border-indigo-500 transition-all duration-300"
        />
      </motion.div>
    </Link>
  );

  return (
    <motion.div
      className={`fixed w-full z-50 ${
        scrolled
          ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm"
          : "bg-white/80 dark:bg-gray-900/90 backdrop-blur-md"
      } transition-all duration-300`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full h-16 md:h-20 flex items-center justify-between">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Image
                src="logo.png"
                alt="BlogSphere Logo"
                w={40}
                h={40}
                className="drop-shadow-lg"
              />
            </motion.div>
            <motion.span
              className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              BlogSphere
            </motion.span>
          </Link>

          {/* Separator */}
          <div className="h-10 w-px bg-gradient-to-b from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>

          {/* Search */}
          <div className="transition-transform duration-200 hover:scale-105">
            <Search />
          </div>

          {/* MOBILE MENU */}
          <div className="md:hidden">
            <motion.button
              className="relative z-50 p-2"
              onClick={() => setOpen((prev) => !prev)}
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle menu"
            >
              <div className="flex flex-col gap-1.5 w-6">
                <motion.span
                  className="h-[2px] w-full bg-gray-800 dark:bg-white"
                  animate={
                    open
                      ? { rotate: 45, y: 7, width: "100%" }
                      : { rotate: 0, y: 0, width: "100%" }
                  }
                />
                <motion.span
                  className="h-[2px] w-full bg-gray-800 dark:bg-white"
                  animate={open ? { opacity: 0 } : { opacity: 1 }}
                />
                <motion.span
                  className="h-[2px] w-full bg-gray-800 dark:bg-white"
                  animate={
                    open
                      ? { rotate: -45, y: -7, width: "100%" }
                      : { rotate: 0, y: 0, width: "100%" }
                  }
                />
              </div>
            </motion.button>

            <AnimatePresence>
              {open && (
                <motion.div
                  className="fixed inset-0 bg-white/90 dark:bg-gray-900/95 backdrop-blur-lg pt-20 px-6 flex flex-col items-center justify-start gap-8 font-medium text-lg"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={mobileNavVariants}
                >
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.path}
                      custom={i}
                      initial="hidden"
                      animate="visible"
                      variants={navItemVariants}
                    >
                      <Link
                        to={link.path}
                        onClick={() => setOpen(false)}
                        className="relative text-2xl font-medium text-gray-900 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        <span className="relative">
                          {link.label}
                          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 dark:bg-indigo-600 transition-all duration-300 group-hover:w-full" />
                        </span>
                      </Link>
                    </motion.div>
                  ))}

                  {/* Write Button */}
                  <motion.div
                    className="flex justify-end px-4 py-2"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Link
                      to="write"
                      className="relative group"
                      aria-label="Write a post"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                      <div className="relative flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="transform group-hover:rotate-45 transition-transform duration-300"
                        >
                          <path d="M12 19l7-7 3 3-7 7-3-3z" />
                          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                          <path d="M2 2l7.586 7.586" />
                          <circle cx="11" cy="11" r="2" />
                        </svg>
                        <span className="font-medium">Write</span>
                      </div>
                    </Link>
                  </motion.div>

                  <motion.div
                    custom={navLinks.length}
                    initial="hidden"
                    animate="visible"
                    variants={navItemVariants}
                  >
                    {user ? (
                      <Link
                        to={`/profile/${user.username}`}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3"
                      >
                        <Image
                          src={user.img || "/default-avatar.png"}
                          alt="profile"
                          className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500"
                        />
                        <span className="text-lg font-medium">My Profile</span>
                      </Link>
                    ) : (
                      <Link
                        to="/login"
                        onClick={() => setOpen(false)}
                        className="relative"
                      >
                        <motion.button
                          className="py-3 px-8 rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-medium shadow-lg hover:shadow-xl transition-all"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Login
                        </motion.button>
                      </Link>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-8 font-medium text-lg">
            {navLinks.map((link) => (
              <Link
                to={link.path}
                key={link.path}
                className="group relative text-gray-800 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}

            {/* Write Button */}
            <Link
              to="write"
              className="relative group"
              aria-label="Write a post"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="transform group-hover:rotate-45 transition-transform duration-300"
                >
                  <path d="M12 19l7-7 3 3-7 7-3-3z" />
                  <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                  <path d="M2 2l7.586 7.586" />
                  <circle cx="11" cy="11" r="2" />
                </svg>
                <span className="font-medium">Write</span>
              </div>
            </Link>

            {/* User Profile or Login */}
            {user ? (
              renderProfile()
            ) : (
              <Link to="/login">
                <button className="py-2 px-6 rounded-full bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-700 transition-colors">
                  Login
                </button>
              </Link>
            )}

            {/* Theme Toggle */}
            <div className="relative">
              <button
                onClick={() => setThemeMenuOpen((prev) => !prev)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle theme menu"
              >
                {theme === "light" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6 text-yellow-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3v1m0 16v1m8.485-9H21m-16 0H3m14.364 5.364l-.707-.707M7.05 7.05l-.707-.707m12.02 12.02l-.707-.707M7.05 16.95l-.707-.707M12 7a5 5 0 100 10 5 5 0 000-10z"
                    />
                  </svg>
                )}
                {theme === "dark" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6 text-gray-100"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"
                    />
                  </svg>
                )}
                {theme === "system" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6 text-gray-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v1m0 14v1m8-8h1M3 12H2m15.364-5.364l-.707-.707M7.05 16.95l-.707-.707m12.02 0l-.707-.707M7.05 7.05l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                )}
              </button>

              {/* Theme Menu */}
              {themeMenuOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 py-1 z-50">
                  {["light", "dark", "system"].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => handleThemeChange(mode)}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-indigo-100 dark:hover:bg-indigo-700 ${
                        theme === mode ? "font-semibold text-indigo-600" : ""
                      }`}
                    >
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </motion.div>
  );
};

export default Navbar;
