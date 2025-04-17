import React, { useState, useEffect } from "react";
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

const AdminDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
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
    <div className="min-h-screen flex bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
        <MainContent />
      </div>
    </div>
  );
};

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
    <aside className="w-64 bg-gray-100 text-blue-700 dark:bg-gray-300 border-r dark:border-gray-700 p-5">
      <nav className="space-y-3">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg transition ${
                isActive ? "bg-blue-600 text-white" : "hover:bg-gray-200 dark:hover:bg-gray-700"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

const Header = ({ toggleDarkMode, darkMode }) => (
  <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 shadow-sm p-4 flex justify-between items-center">
    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
    <button
      onClick={toggleDarkMode}
      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
    >
      {darkMode ? "Light Mode" : "Dark Mode"}
    </button>
  </header>
);

const MainContent = () => (
  <main className="flex-1 overflow-y-auto p-6 bg-white dark:bg-gray-900">
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

const Dashboard = () => (
  <section>
    <h2 className="text-xl font-semibold mb-2">Dashboard</h2>
    <p className="text-gray-600 dark:text-gray-300">Welcome to the admin dashboard.</p>
  </section>
);

const Posts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get("/api/posts").then((res) => setPosts(res.data)).catch(console.error);
  }, []);

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Posts</h2>
      <ul className="space-y-2">
        {posts.map((post) => (
          <li key={post.id} className="p-3 border-b dark:border-gray-700">
            <span className="font-medium">{post.title}</span> - {post.status}
          </li>
        ))}
      </ul>
      <NavLink to="/create-post" className="inline-block mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
        Create New Post
      </NavLink>
    </section>
  );
};

const PostEditor = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("/api/posts", { title, content })
      .then(() => navigate("/posts"))
      .catch(console.error);
  };

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Create Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border rounded dark:bg-gray-800 dark:border-gray-700"
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-3 border rounded dark:bg-gray-800 dark:border-gray-700"
        ></textarea>
        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>
    </section>
  );
};

const Categories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get("/api/categories").then((res) => setCategories(res.data)).catch(console.error);
  }, []);

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Categories</h2>
      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category.id} className="p-2 border-b dark:border-gray-700">{category.name}</li>
        ))}
      </ul>
    </section>
  );
};

const Comments = () => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    axios.get("/api/comments").then((res) => setComments(res.data)).catch(console.error);
  }, []);

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Comments</h2>
      <ul className="space-y-2">
        {comments.map((comment) => (
          <li key={comment.id} className="p-3 border-b dark:border-gray-700">
            {comment.content} - <span className="text-sm text-gray-500">{comment.status}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

const Analytics = () => (
  <section>
    <h2 className="text-xl font-semibold mb-4">Analytics</h2>
    <p className="text-gray-600 dark:text-gray-300">Analytics data coming soon.</p>
  </section>
);

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("/api/users").then((res) => setUsers(res.data)).catch(console.error);
  }, []);

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Users</h2>
      <ul className="space-y-2">
        {users.map((user) => (
          <li key={user.id} className="p-2 border-b dark:border-gray-700">
            {user.username} - <span className="text-sm text-gray-500">{user.email}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

const Settings = () => (
  <section>
    <h2 className="text-xl font-semibold mb-4">Settings</h2>
    <p className="text-gray-600 dark:text-gray-300">Settings options will be available here soon.</p>
  </section>
);

export default AdminDashboard;
