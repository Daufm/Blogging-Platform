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
    <div className="min-h-screen flex bg-gray-50 text-gray-900">
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
    { path: "/home", label: "Posts" },
    { path: "/write", label: "Create Post" },
    { path: "/categories", label: "Categories" },
    { path: "/analytics", label: "Analytics" },
    { path: "/users", label: "Users" },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 shadow-md p-6">
      <nav className="space-y-3">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md text-sm font-medium transition ${
                isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
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
  <header className="bg-white border-b border-gray-200 p-5 flex justify-between items-center shadow-sm">
    <h1 className="text-2xl font-bold text-blue-700">Admin Dashboard</h1>
    <button
      onClick={toggleDarkMode}
      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
    >
      {darkMode ? "Light Mode" : "Dark Mode"}
    </button>
  </header>
);

const MainContent = () => (
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

const Dashboard = () => (
  <section>
    <h2 className="text-xl font-semibold mb-2">Dashboard Overview</h2>
    <p className="text-gray-600">Welcome to your updated admin panel.</p>
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
      <ul className="space-y-3">
        {posts.map((post) => (
          <li key={post.id} className="p-4 bg-white rounded-md shadow border border-gray-100">
            <h3 className="font-medium text-lg">{post.title}</h3>
            <p className="text-sm text-gray-500">Status: {post.status}</p>
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
      <h2 className="text-xl font-semibold mb-4">Create New Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded"
        />
        <textarea
          placeholder="Post Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded"
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
          <li key={category.id} className="p-3 bg-white rounded shadow border border-gray-100">
            {category.name}
          </li>
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
          <li key={comment.id} className="p-3 bg-white rounded shadow border border-gray-100">
            {comment.content} <span className="text-sm text-gray-500">({comment.status})</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

const Analytics = () => (
  <section>
    <h2 className="text-xl font-semibold mb-4">Analytics</h2>
    <p className="text-gray-600">Analytics data will be displayed here.</p>
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
          <li key={user.id} className="p-3 bg-white rounded shadow border border-gray-100">
            <strong>{user.username}</strong> <span className="text-sm text-gray-500">({user.email})</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

const Settings = () => (
  <section>
    <h2 className="text-xl font-semibold mb-4">Settings</h2>
    <p className="text-gray-600">Manage your application settings here.</p>
  </section>
);

export default AdminDashboard;
