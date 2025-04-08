import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink, useNavigate } from 'react-router-dom';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  ArcElement,
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  ArcElement,
  Title, 
  Tooltip, 
  Legend,
  Filler
);

// Mock data for demo purposes
const mockPosts = [
  { id: 1, title: "10 React Best Practices in 2023", status: "published", author: "John Doe", date: "2023-05-20", views: 1245, comments: 23, category: "React" },
  { id: 2, title: "Getting Started with Tailwind CSS", status: "published", author: "Jane Smith", date: "2023-05-18", views: 987, comments: 15, category: "CSS" },
  { id: 3, title: "Introduction to GraphQL", status: "draft", author: "John Doe", date: "2023-05-15", views: 0, comments: 0, category: "APIs" },
  { id: 4, title: "Building a Blog with Next.js", status: "scheduled", author: "Emily Johnson", date: "2023-05-22", views: 0, comments: 0, category: "Next.js" },
  { id: 5, title: "JavaScript Fundamentals", status: "published", author: "Mike Williams", date: "2023-05-10", views: 2354, comments: 42, category: "JavaScript" },
];

const mockComments = [
  { id: 1, postId: 1, author: "User123", content: "Great article, very helpful!", date: "2023-05-21", status: "approved" },
  { id: 2, postId: 1, author: "WebDev", content: "I'd like to add that...", date: "2023-05-21", status: "pending" },
  { id: 3, postId: 2, author: "CSSMaster", content: "Tailwind has been a game changer for me!", date: "2023-05-19", status: "approved" },
  { id: 4, postId: 5, author: "NewbieDev", content: "This is exactly what I was looking for.", date: "2023-05-11", status: "approved" },
  { id: 5, postId: 5, author: "Anonymous", content: "Check out my website at...", date: "2023-05-12", status: "spam" },
];

const mockCategories = [
  { id: 1, name: "React", postCount: 15, slug: "react" },
  { id: 2, name: "JavaScript", postCount: 24, slug: "javascript" },
  { id: 3, name: "CSS", postCount: 8, slug: "css" },
  { id: 4, name: "Next.js", postCount: 12, slug: "nextjs" },
  { id: 5, name: "APIs", postCount: 6, slug: "apis" },
];

// Blog Admin App
const BlogAdmin = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check for dark mode preference
    if (localStorage.theme === 'dark' || 
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <Sidebar darkMode={darkMode} />
          
          {/* Main Content */}
          <div className="flex flex-col flex-1 w-full overflow-x-hidden">
            {/* Header */}
            <Header toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
            
            {/* Main content area */}
            <main className="h-full overflow-y-auto pt-4 pb-10">
              <div className="container px-6 mx-auto">
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
              </div>
            </main>
          </div>
        </div>
      </div>
    </Router>
  );
};

// Sidebar Component
const Sidebar = ({ darkMode }) => {
  return (
    <aside className="z-20 hidden md:block flex-shrink-0 w-64 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-300">
      <div className="flex flex-col h-full">
        {/* Logo & Brand */}
        <div className="py-6 px-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-center">
            BLOG<span className="text-blue-600 dark:text-blue-400">ADMIN</span>
          </h2>
        </div>
        
        {/* Navigation */}
        <div className="py-4 px-4 flex-1 overflow-y-auto">
          <nav className="space-y-1">
            <NavLink to="/" 
              className={({ isActive }) => 
                `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`
              }
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              <span>Dashboard</span>
            </NavLink>
            
            <NavLink to="/posts" 
              className={({ isActive }) => 
                `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`
              }
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
              </svg>
              <span>Posts</span>
            </NavLink>
            
            <NavLink to="/create-post" 
              className={({ isActive }) => 
                `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`
              }
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>New Post</span>
            </NavLink>
            
            <NavLink to="/categories" 
              className={({ isActive }) => 
                `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`
              }
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
              </svg>
              <span>Categories</span>
            </NavLink>
            
            <NavLink to="/comments" 
              className={({ isActive }) => 
                `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`
              }
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8