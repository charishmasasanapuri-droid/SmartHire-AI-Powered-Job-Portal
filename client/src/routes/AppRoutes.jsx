import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Jobs from "../pages/Jobs";
import PostJob from "../pages/PostJob";
import EditJob from "../pages/EditJob";
import Applications from "../pages/Applications";
import MyApplications from "../pages/MyApplications";
import Profile from "../pages/Profile";
import ResumeAnalyzer from "../pages/ResumeAnalyzer";
import JobRecommendations from "../pages/JobRecommendations";

import ProtectedRoute from "../components/ProtectedRoute";
import RoleProtectedRoute from "../components/RoleProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      {/* ================= Public Routes ================= */}

      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/jobs" element={<Jobs />} />

      {/* ================= Protected Routes ================= */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/resume-analyzer"
        element={
          <ProtectedRoute>
            <ResumeAnalyzer />
          </ProtectedRoute>
        }
      />

      <Route
        path="/job-recommendations"
        element={
          <ProtectedRoute>
            <JobRecommendations />
          </ProtectedRoute>
        }
      />

      {/* ================= Job Seeker ================= */}

      <Route
        path="/my-applications"
        element={
          <ProtectedRoute>
            <MyApplications />
          </ProtectedRoute>
        }
      />

      {/* ================= Employer ================= */}

      <Route
        path="/post-job"
        element={
          <RoleProtectedRoute role="employer">
            <PostJob />
          </RoleProtectedRoute>
        }
      />

      <Route
        path="/applications"
        element={
          <RoleProtectedRoute role="employer">
            <Applications />
          </RoleProtectedRoute>
        }
      />

      <Route
        path="/edit-job/:id"
        element={
          <RoleProtectedRoute role="employer">
            <EditJob />
          </RoleProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;