import React, { useState, useEffect } from "react";
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
//import Report from "./report.jsx";


const token = localStorage.getItem("token"); // Get the token from local storage

const handleDeletePost = async (postId) => {
  if (!confirm("Are you sure you want to delete this post?")) return;

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/posts/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      toast("Post deleted successfully");
      // Optionally refresh reports
    } else {
      toast("Failed to delete post");
    }
  } catch (err) {
    console.error("Delete post error:", err);
  }
};

const handleDismissReport = async (reportId) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/posts/reports/${reportId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      toast("Report dismissed");
    } else {
      toast("Failed to dismiss report");
    }
  } catch (err) {
    console.error("Dismiss error:", err);
  }
};






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
    { path: "/admin_dashboard", label: "Dashboard" },
    { path: "/", label: "Posts" },
    { path: "/write", label: "Create Post" },
    { path: "/admin/reports", label: "Reports" },
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
      <Route path="/reports" element={<Report/>} exact/>
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

const Report = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/posts/get/reports`, {
          headers: {
            Authorization: `Bearer ${token}`, // Make sure this token belongs to an admin
          },
        });
        const data = await res.json();
        console.log("Fetched report data:", data); 
        setReports(data?.reports);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch reports", error);
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Reported Posts</h2>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : (reports?.length ?? 0) === 0 ? (  
        <p className="text-gray-600">No reports found.</p>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
           <div key={report._id} className="p-4 border rounded shadow">
           <p><strong>Post Title:</strong> {report.postId?.title}</p>
           <p><strong>Content:</strong> {report.postId?.content?.substring(0, 100)}...</p>
           <p><strong>Reason:</strong> {report.reason}</p>
           <p><strong>Reported By:</strong> {report.reportedBy?.username || report.reportedBy?.email}</p>
           <p className="text-sm text-gray-500">{new Date(report.reportedAt).toLocaleString()}</p>
           <div className="flex space-x-2 mt-2">
           <button
              onClick={() => handleDeletePost(report.postId._id)}
              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
            >
              Delete Post
            </button>

            <button
              onClick={() => handleDismissReport(report._id)}
              className="bg-gray-300 text-gray-800 px-2 py-1 rounded hover:bg-gray-400"
            >
              Dismiss Report
           </button>
          </div>
         
         </div>
          ))}
        </div>
      )}
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
