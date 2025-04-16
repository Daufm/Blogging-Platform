import React, { useState, useEffect } from "react";
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

// Main Admin Dashboard Component
const AdminDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check for dark mode preference
    const prefersDark = localStorage.theme === "dark" || window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(prefersDark);
    document.documentElement.classList.toggle("dark", prefersDark);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.theme = newMode ? "dark" : "light";
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
        <MainContent />
      </div>
    </div>
  );
};

// Sidebar Component
const Sidebar = () => {
  const links = [
    { path: "/", label: "Dashboard" },
    { path: "/posts", label: "Posts" },
    { path: "/create-post", label: "Create Post" },
    { path: "/categories", label: "Categories" },
    { path: "/comments", label: "Comments" },
    { path: "/analytics", label: "Analytics" },
    { path: "/users", label: "Users" },
    { path: "/settings", label: "Settings" },
  ];

  return (
    <div className="w-64 bg-gray-200 dark:bg-gray-800 h-screen">
      <nav className="p-4">
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `block p-4 rounded-lg ${isActive ? "bg-blue-500 text-white" : "hover:bg-gray-300 dark:hover:bg-gray-700"}`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

// Header Component
const Header = ({ toggleDarkMode, darkMode }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Admin Dashboard</h1>
      <button
        onClick={toggleDarkMode}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
    </header>
  );
};

// Main Content Component
const MainContent = () => {
  return (
    <main className="flex-1 overflow-y-auto p-6">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/create-post" element={<PostEditor />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/comments" element={<Comments />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/users" element={<Users />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </main>
  );
};

// Dashboard Component
const Dashboard = () => (
  <div>
    <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
    <p>Welcome to the admin dashboard. Use the sidebar to navigate.</p>
  </div>
);

// Posts Component
const Posts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get("/api/posts")
      .then((response) => setPosts(response.data))
      .catch((error) => console.error("Error fetching posts:", error));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Posts</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            {post.title} - {post.status}
          </li>
        ))}
      </ul>
      <NavLink to="/create-post" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Create New Post
      </NavLink>
    </div>
  );
};

// PostEditor Component
const PostEditor = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("/api/posts", { title, content })
      .then(() => navigate("/posts"))
      .catch((error) => console.error("Error creating post:", error));
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Create Post</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        ></textarea>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Submit
        </button>
      </form>
    </div>
  );
};

// Categories Component
const Categories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get("/api/categories")
      .then((response) => setCategories(response.data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Categories</h2>
      <ul>
        {categories.map((category) => (
          <li key={category.id}>{category.name}</li>
        ))}
      </ul>
    </div>
  );
};

// Comments Component
const Comments = () => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    axios
      .get("/api/comments")
      .then((response) => setComments(response.data))
      .catch((error) => console.error("Error fetching comments:", error));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Comments</h2>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            {comment.content} - {comment.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

// Analytics Component
const Analytics = () => (
  <div>
    <h2 className="text-2xl font-semibold mb-4">Analytics</h2>
    <p>Analytics data will be displayed here.</p>
  </div>
);

// Users Component
const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get("/api/users")
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.username} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

// Settings Component
const Settings = () => (
  <div>
    <h2 className="text-2xl font-semibold mb-4">Settings</h2>
    <p>Settings form will be displayed here.</p>
  </div>
);

export default AdminDashboard;