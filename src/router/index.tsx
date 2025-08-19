import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import DashboardPage from "../pages/dashboard";
import CallsPage from "../pages/calls";
import CallDetailsPage from "../pages/calls/[id]";
import ManagersPage from "../pages/managers";
import ManagerDetailsPage from "../pages/managers/[id]";
import ProcessesPage from "../pages/processes";
import SettingsPage from "../pages/settings";
import UsersPage from "../pages/users";
import AuthPage from "../pages/auth";
import Layout from "../components/layout";
import ProtectedRoute from "../components/ProtectedRoute";
import PublicRoute from "../components/PublicRoute";

const RootLayout: React.FC = () => {
  return (
    <ProtectedRoute>
      <Layout />
    </ProtectedRoute>
  );
};

export const router = createBrowserRouter([
  {
    path: "/auth",
    element: (
      <PublicRoute>
        <AuthPage />
      </PublicRoute>
    ),
  },
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "calls",
        element: (
          <ProtectedRoute>
            <CallsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "calls/:id",
        element: (
          <ProtectedRoute>
            <CallDetailsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "managers",
        element: (
          <ProtectedRoute>
            <ManagersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "managers/:id",
        element: (
          <ProtectedRoute>
            <ManagerDetailsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "processes",
        element: (
          <ProtectedRoute>
            <ProcessesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "users",
        element: (
          <ProtectedRoute>
            <UsersPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/auth" replace />,
  },
]);

const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
