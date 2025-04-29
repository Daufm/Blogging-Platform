import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "./routes/Homepage.jsx";
import PostListPage from "./routes/PostListPage.jsx";
import Write from "./routes/Write.jsx";
import AuthorPage from "./components/authore.jsx"
import ProfilePage from "./components/profile.jsx";
import LoginPage from "./routes/LoginPage.jsx";
import RegisterPage from "./routes/RegisterPage.jsx";
import SinglePostPage from "./routes/SinglePostPage.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import VerifyOtpPage from "./routes/VerifyOtpPage.jsx";
import AdminDashboard from "./components/admin.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-quill-new/dist/quill.snow.css";
import {ProtectedRoute} from "./routes/ProtectedRoute.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./utils/AuthContext.jsx";
import About from "./components/about.jsx";
import ForgetPasswordPage from "./components/ForgetPass.jsx";

const queryClient = new QueryClient();

const router = createBrowserRouter([

   {
     path: "/reports",
     element: <AdminDashboard />,
   },

  // 👇 MainLayout → includes Navbar
  {
    element: <MainLayout />, // includes Navbar
    children: [
      { path: "/", element: <Homepage /> },
      { path: "/posts", element: <PostListPage /> },
      { path: "/write", element: <Write /> },
      { path: "/authors/:username", element: <AuthorPage /> },
      
      { 
        path: "/profile/:username", 
        element: <ProtectedRoute><ProfilePage /></ProtectedRoute> 
      },
      { 
        path: "/:slug", 
        element: <ProtectedRoute><SinglePostPage /></ProtectedRoute> 
      },

      {
        path: "/about",element: <About />
      },

    ],
  },
  // 👇 outside MainLayout → no Navbar
  {
    path: "/admin_dashboard",
    element: <ProtectedRoute><AdminDashboard /></ProtectedRoute>,
  },
  {
    path: "/reset-password",
    element: <ForgetPasswordPage />,

  },
  
  {
    path: "/admin/*",
    element: <ProtectedRoute><AdminDashboard /></ProtectedRoute>,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/verify-otp",
    element: <VerifyOtpPage />,
  },
]);


const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
if (!GOOGLE_CLIENT_ID) {
  console.error("Google Client ID is not defined in the environment variables.");
}
createRoot(document.getElementById("root")).render(
  <StrictMode>
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
   <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ToastContainer position="bottom-right" />
    </QueryClientProvider>
    </AuthProvider>
  </GoogleOAuthProvider>
</StrictMode>
);
