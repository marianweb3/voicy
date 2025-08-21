import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { authAPI } from "../services/api";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const location = useLocation();
  const token = localStorage.getItem("token");

  // If no token, redirect to auth immediately
  if (!token) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Get user profile to validate token and check roles
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: authAPI.getProfile,
    retry: false,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center"></div>
      </div>
    );
  }

  // If there's an error or no user data, token is invalid
  if (error || !user) {
    // Clear invalid token
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (requiredRole) {
    const userRoles = user.role || [];
    const hasRequiredRole = userRoles.includes(requiredRole);

    if (!hasRequiredRole) {
      // User doesn't have required role, redirect to dashboard
      return <Navigate to="/dashboard" replace />;
    }
  }

  // User is authenticated and has required permissions
  return <>{children}</>;
};

export default ProtectedRoute;
