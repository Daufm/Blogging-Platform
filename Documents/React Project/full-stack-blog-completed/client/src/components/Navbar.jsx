import { useState, useEffect } from "react";
import Image from "./Image";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useContext } from "react";
import { AuthContext } from "../utils/AuthContext";


const Navbar = () => {
 const { user , logout} = useContext(AuthContext);


  const [open, setOpen] = useState(false);
 // const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    
    // User data and token handling
    //const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    const decodedToken = token ? JSON.parse(atob(token.split(".")[1])) : null;
    const expirationTime = decodedToken?.exp * 1000;
    const currentTime = Date.now();

    if (expirationTime && expirationTime < currentTime) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }

    // if (storedUser) {
    //   setUser(JSON.parse(storedUser));
    // }

    return () => window.removeEventListener("scroll", handleScroll);
  }, [navigate]);

  const renderProfile = () => (
    <Link to={`/profile/${user.username}`} className="flex items-center gap-2 group">
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Image
          src={user.img|| "/default-avatar.png"}
          alt="profile"
          className="w-10 h-10 rounded-full object-cover border-2 border-transparent group-hover:border-indigo-500 transition-all duration-300"
        />
      </motion.div>
    </Link>
  );

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/posts?sort=trending", label: "Trending" },
    { path: "/posts?sort=popular", label: "Popular" },
    { path: "/about", label: "About" },
  ];

  const mobileNavVariants = {
    hidden: { x: "100%" },
    visible: { 
      x: 0,
      transition: { 
        type: "spring", 
        stiffness: 100,
        damping: 20
      }
    },
    exit: { 
      x: "100%",
      transition: { 
        ease: "easeInOut",
        duration: 0.3
      }
    }
  };

  const navItemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5
      }
    })
  };

  return (
    <motion.div 
      className={`fixed w-full z-50 ${scrolled ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm" : "bg-transparent"} transition-all duration-300`}
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

          {/* MOBILE MENU */}
          <div className="md:hidden">
            {/* MOBILE BUTTON */}
            <motion.button
              className="relative z-50 p-2"
              onClick={() => setOpen((prev) => !prev)}
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle menu"
            >
              <div className="flex flex-col gap-1.5 w-6">
                <motion.span
                  className="h-[2px] w-full bg-gray-800 dark:bg-white"
                  animate={open ? { rotate: 45, y: 7, width: "100%" } : { rotate: 0, y: 0, width: "100%" }}
                />
                <motion.span
                  className="h-[2px] w-full bg-gray-800 dark:bg-white"
                  animate={open ? { opacity: 0 } : { opacity: 1 }}
                />
                <motion.span
                  className="h-[2px] w-full bg-gray-800 dark:bg-white"
                  animate={open ? { rotate: -45, y: -7, width: "100%" } : { rotate: 0, y: 0, width: "100%" }}
                />
              </div>
            </motion.button>

            {/* MOBILE LINK LIST */}
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
                        className="relative text-2xl font-medium text-gray-900    hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        <span className="relative">
                          {link.label}
                          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 dark:bg-indigo-600 transition-all duration-300 group-hover:w-full" />
                        </span>
                      </Link>
                    </motion.div>
                  ))}

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
                          Login 👋
                        </motion.button>
                        <span className="absolute -top-1 -right-1 flex h-4 w-4">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-600"></span>
                        </span>
                      </Link>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path}
                className="relative group font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <span className="relative">
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 transition-all duration-300 group-hover:w-full" />
                </span>
              </Link>
            ))}

            {user ? (
              renderProfile()
            ) : (
              <Link to="/login" className="relative">
                <motion.button
                  className="py-2 px-6 rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-medium shadow-lg hover:shadow-xl transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Login 👋
                </motion.button>
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-600"></span>
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Navbar;