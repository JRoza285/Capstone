import { Routes, Route, Navigate } from "react-router";
import { useAuth } from "./auth/AuthContext";

import Layout from "./layout/Layout";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Welcome from "./profile/Visitors-Page.jsx";

// Libraries
import LiftLibrary from "./lifts-display/Lift-Library";
import WorkoutLibrary from "./workouts-display/WorkoutLibrary";
import NutritionLibrary from "./nutrition-display/NutritionLibrary";
import WeightLibrary from "./weight-display/WeightLibrary";
import LiftUpdate from "./lifts-display/Lift-Update";
import WorkoutDetails from "./workouts-display/WorkoutDetails";

// Details
import LiftDetails from "./lifts-display/Lift-Details";
import Progress from "./progress-graphs/progress";

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
    <Route index element={token ? <ProfileHome /> : <Welcome />} />

    {/* Public routes */}
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/welcome" element={<Welcome />} />
    <Route path="/liftlibrary" element={<LiftLibrary />} />

    {/* Protected routes */}

    <Route
      path="/workoutlibrary"
      element={<ProtectedRoute><WorkoutLibrary /></ProtectedRoute>}
    />
    <Route
      path="/nutritionlibrary"
      element={<ProtectedRoute><NutritionLibrary /></ProtectedRoute>}
    />
    <Route
      path="/weightlibrary"
      element={<ProtectedRoute><WeightLibrary /></ProtectedRoute>}
    />
    <Route
      path="/workouts/:id"
      element={<ProtectedRoute><WorkoutDetails /></ProtectedRoute>}
    />
    <Route
      path="/lifts/:id"
      element={<ProtectedRoute><LiftDetails /></ProtectedRoute>}
    />
    <Route
      path="/lifts/:id/update"
      element={<ProtectedRoute><LiftUpdate /></ProtectedRoute>}
    />
    <Route
      path="/addweight"
      element={<ProtectedRoute><AddWeight /></ProtectedRoute>}
    />
    <Route
      path="/addnutrition"
      element={<ProtectedRoute><AddNutrition /></ProtectedRoute>}
    />
    <Route
      path="/addworkout"
      element={<ProtectedRoute><AddWorkout /></ProtectedRoute>}
    />

    {/* THIS IS THE FIX */}
    <Route
      path="/progress"
      element={<ProtectedRoute><Progress /></ProtectedRoute>}
    />
  </Route>
</Routes>

  );
}

