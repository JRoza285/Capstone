import { Routes, Route, Navigate } from "react-router";
import { useAuth } from "./auth/AuthContext";

import Layout from "./layout/Layout";
import Login from "./auth/Login";
import Register from "./auth/Register";

// Libraries
import LiftLibrary from "./lifts-display/Lift-Library";
import WorkoutLibrary from "./workouts-display/WorkoutLibrary";
import NutritionLibrary from "./nutrition-display/NutritionLibrary";
import WeightLibrary from "./weight-display/WeightLibrary";
import LiftUpdate from "./lifts-display/Lift-Update";

// Details
import LiftDetails from "./lifts-display/Lift-Details";

// Create / Add Components
import AddWeight from "./weight-display/AddWeight";
import AddNutrition from "./nutrition-display/AddNutrition";
import AddWorkout from "./workouts-display/AddWorkout";

// Dashboard
import ProfileHome from "./profile/ProfileHome";

export default function App() {
  const { token } = useAuth();

  // Helper component for protecting routes
  const ProtectedRoute = ({ children }) => {
    return token ? children : <Navigate to="/login" replace />;
  };

  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Home / Dashboard */}
        <Route
          index
          element={
            token ? (
              <ProfileHome />
            ) : (
              <p>Welcome! Please log in or register to see your dashboard.</p>
            )
          }
        />

        {/* Public Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Libraries */}
        <Route
          path="/liftlibrary"
          element={
            <ProtectedRoute>
              <LiftLibrary />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workoutlibrary"
          element={
            <ProtectedRoute>
              <WorkoutLibrary />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nutritionlibrary"
          element={
            <ProtectedRoute>
              <NutritionLibrary />
            </ProtectedRoute>
          }
        />
        <Route
          path="/weightlibrary"
          element={
            <ProtectedRoute>
              <WeightLibrary />
            </ProtectedRoute>
          }
        />

        {/* Lift details */}
        <Route
          path="/lifts/:id"
          element={
            <ProtectedRoute>
              <LiftDetails />
            </ProtectedRoute>
          }
        />

        {/* Lift Update */}
        <Route
          path="/lifts/:id/update"
          element={
            <ProtectedRoute>
              <LiftUpdate />
            </ProtectedRoute>
          }
        />


        {/* Add / Create Entries */}
        <Route
          path="/addweight"
          element={
            <ProtectedRoute>
              <AddWeight />
            </ProtectedRoute>
          }
        />
        <Route
          path="/addnutrition"
          element={
            <ProtectedRoute>
              <AddNutrition />
            </ProtectedRoute>
          }
        />
        <Route
          path="/addworkout"
          element={
            <ProtectedRoute>
              <AddWorkout />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

