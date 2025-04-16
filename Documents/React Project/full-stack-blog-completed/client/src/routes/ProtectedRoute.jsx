import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  const loggedInUser = localStorage.getItem("token"); // Check if the user is logged in

  if (!loggedInUser) {
    // Redirect to login page if not logged in
    return <Navigate to="/login" replace />;
  }

  // Render the children (protected content) if logged in
  return children;
};

