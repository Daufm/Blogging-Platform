import React, { useState, useEffect } from "react";
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Users, FileText, AlertTriangle, CalendarCheck, UserPlus } from "lucide-react";

import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";


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
    { path: "/admin", label: "Dashboard" },
    { path: "/admin/home", label: "Posts" },
    { path: "/admin/write", label: "Approve Blogger" },
    { path: "/admin/reports", label: "Manage Reports" },
    { path: "/admin/analytics", label: "Manage Analytics" },
    { path: "/admin/users", label: "Manage Users" },
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
      <Route path="/reports" element={<Report/>} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/users" element={<Users1/>} />
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
              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors duration-300"
            >
              Delete Post
            </button>

            <button
              onClick={() => handleDismissReport(report._id)}
              className="bg-gray-300 text-gray-800 px-2 py-1 rounded hover:bg-gray-400 transition-colors duration-300"
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



const Analytics = () => {
  const [data, setData] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/analytics/overview`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      }
    };

    fetchAnalytics();
  }, []);

  if (!data) return <p>Loading analytics...</p>;

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Analytics Overview</h2>
      <div className="grid grid-cols-2 gap-4">
      <StatCard label="Total Users" value={data.totalUsers} icon={Users} />
      <StatCard label="Total Posts" value={data.totalPosts} icon={FileText} />
      <StatCard label="Reports" value={data.totalReports} icon={AlertTriangle} />
      <StatCard label="Posts This Week" value={data.postsThisWeek} icon={CalendarCheck} />
      <StatCard label="New Users This Week" value={data.newUsersThisWeek} icon={UserPlus} />

      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-medium mb-3">Posts in 7 Days</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.postsByDay}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </section>
  );
};

const StatCard = ({ label, value, icon: Icon }) => (
  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-2xl shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl duration-200">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-sm font-semibold text-blue-700">{label}</h3>
      {Icon && <Icon className="w-5 h-5 text-blue-500" />}
    </div>
    <p className="text-3xl font-bold text-blue-900 tracking-tight">{value}</p>
  </div>
);



const Users1 = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/users/all`)
      .then((res) => {
        console.log("Fetched users:", res.data);
        setUsers(res.data); 
      })
      .catch(console.error);
  }, []);

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/users/${userId}`);
      setUsers((prevUsers) => prevUsers.filter(user => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user", error);
    }
  };

  const handleBan = async (userId) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/users/${userId}/ban`);
      setUsers((prevUsers) => prevUsers.map(user => 
        user.id === userId ? { ...user, isBanned: true } : user
      ));
    } catch (error) {
      console.error("Error banning user", error);
    }
  };

  return (
    <section>
       <h2 className="text-xl font-semibold mb-4">Admins</h2>
  <ul className="space-y-2">
    {users
      .filter((user) => user.role === "admin")
      .map((user) => (
        <li key={user._id} className="p-3 bg-white rounded shadow border border-gray-100">
          <strong>{user.username}</strong>
          <span className="text-sm text-gray-500"> ({user.email})</span>
        </li>
      ))}
  </ul>

  <h2 className="text-xl font-semibold mt-8 mb-4">Users</h2>
  <ul className="space-y-2">
    {users
      .filter((user) => user.role !== "admin")
      .map((user) => (
        <li key={user._id} className="p-3 bg-white rounded shadow border border-gray-100">
          <strong>{user.username}</strong>
          <span className="text-sm text-gray-500"> ({user.email})</span>
          <div className="mt-2 flex space-x-4">
            <button
              onClick={() => handleDelete(user._id)}
              className="text-red-600 hover:text-red-800"
            >
              Delete
            </button>
            <button
              onClick={() => handleBan(user._id)}
              className="text-yellow-600 hover:text-yellow-800"
            >
              {user.isBanned ? 'Unban' : 'Ban'}
            </button>
          </div>
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
