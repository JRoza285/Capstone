import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../auth/AuthContext.jsx";
import { getWeight } from "../api/weight";
import { getNutrition } from "../api/nutrition";
import { getWorkouts } from "../api/workouts";

export default function ProfileHome() {
  const { token } = useAuth();

  const [recentWeight, setRecentWeight] = useState(null);
  const [recentNutrition, setRecentNutrition] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Most recent weight
        const weight = await getWeight(token);
        setRecentWeight(weight);

        // Most recent nutrition
        const nutritions = await getNutrition(token);
        const latestNutrition =
          nutritions.sort((a, b) => new Date(b.date) - new Date(a.date))[0] || null;
        setRecentNutrition(latestNutrition);

        // Workouts
        const workoutsData = await getWorkouts(token);
        setWorkouts(workoutsData || []);
      } catch (err) {
        console.error("Failed to fetch profile data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (!token) return <p>Please log in to view your dashboard.</p>;
  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div>
      <h1>Dashboard</h1>

      <section>
        <h2>Most Recent Weight</h2>
        {recentWeight ? (
          <p>
            {recentWeight.weight} lbs — {new Date(recentWeight.date).toLocaleDateString()}
          </p>
        ) : (
          <p>No weight recorded yet.</p>
        )}
        <div>
          <Link to="/weightlibrary">View Weight History</Link> |{" "}
          <Link to="/addweight">Add Weight</Link>
        </div>
      </section>

      <section>
        <h2>Most Recent Nutrition</h2>
        {recentNutrition ? (
          <p>
            {recentNutrition.calories} kcal —{" "}
            {new Date(recentNutrition.date).toLocaleDateString()}
          </p>
        ) : (
          <p>No nutrition entries yet.</p>
        )}
        <div>
          <Link to="/nutritionlibrary">View Nutrition History</Link> |{" "}
          <Link to="/addnutrition">Add Nutrition</Link>
        </div>
      </section>

      <section>
  <h2>Workouts</h2>
  {workouts.length ? (
    <ul>
      {workouts.map(w => (
        <li key={w.id}>
          <Link to={`/workouts/${w.id}`}>{w.name || `Workout #${w.id}`}</Link>
        </li>
      ))}
    </ul>
  ) : (
    <p>No workouts recorded yet.</p>
  )}
  <div>
    <Link to="/addworkout">Add Workout</Link>
  </div>
</section>

    </div>
  );
}
