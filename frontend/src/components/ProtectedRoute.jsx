import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children, allowedRoles, requireGuest }) {
  const { user, token } = useSelector((state) => state.auth);
  const location = useLocation();

  if (requireGuest) {
    if (user) {
      if (user.role?.title === "Admin") return <Navigate to="/admin" replace />;
      return <Navigate to="/" replace />; // User goes to home
    }
    return children;
  }

  // Need to be logged in for non-guest routes
  if (!user || !token) {
    // Exception: If we're at home page "/", allow access even if not logged in
    // wait, if we are at home page, we want guest users to see it too.
    // So if allowedRoles includes "Guest", let them through.
    if (allowedRoles?.includes("Guest")) return children;
    
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // User is logged in, check roles
  if (allowedRoles) {
    if (user.role?.title === "Admin" && !allowedRoles.includes("Admin")) {
      return <Navigate to="/admin" replace />;
    }
    
    if (user.role?.title === "User" && !allowedRoles.includes("User")) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}
