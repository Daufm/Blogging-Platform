import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";


export const ProtectedRoute = ({ children }) => {
  const loggedInUser = localStorage.getItem("token"); // Check if the user is logged in
  const decodedToken = loggedInUser ? JSON.parse(atob(loggedInUser.split(".")[1])) : null;
  const expirationTime = decodedToken?.exp * 1000; // Convert to milliseconds
  const currentTime = Date.now();
  const isTokenValid = expirationTime > currentTime; // Check if the token is still valid
  if(!isTokenValid) {
    localStorage.removeItem("token"); // Remove expired token
    localStorage.removeItem("user"); 
    toast("Your Session Expired You Need to Login")
    return <Navigate to="/login" replace />;
  }
  if (!loggedInUser) {
    // Redirect to login page if not logged in
    return <Navigate to="/login" replace />;
  }

  // Render the children (protected content) if logged in
  return children;
};

