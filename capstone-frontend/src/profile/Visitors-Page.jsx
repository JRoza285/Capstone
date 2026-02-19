// src/pages/Welcome.jsx
import { Link } from "react-router";

export default function Welcome() {
  return (
    <div style={{ textAlign: "center", marginTop: "5rem" }}>
      <h1>Welcome to My Fitness App!</h1>
      <p>Please log in or register to track your workouts, nutrition, and weight.</p>
      <div style={{ marginTop: "2rem" }}>
        <Link to="/login" style={{ marginRight: "1rem" }}>Log In</Link>
        <Link to="/register">Register</Link>
      </div>
    </div>
  );
}
