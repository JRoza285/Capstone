import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../auth/AuthContext.jsx";
import { getWeight } from "../api/weight";
import { getNutrition } from "../api/nutrition";
import { getWorkouts } from "../api/workouts";


export default function ProfileHome() {
  const { token } = useAuth();

  const [weight, setWeight] = useState(null);
  const [nutrition, setNutrition] = useState(null);
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    if (!token) return;
    async function fetchData() {
      const weights = await getWeight(token);
      setWeight(weights[0] || null); // most recent weight

      const nutritions = await getNutrition(token);
      setNutrition(nutritions[0] || null); // most recent nutrition

      const workoutsData = await getWorkouts(token);
      setWorkouts(workoutsData || []);
    }
    fetchData();
  }, [token]);

  return (
    <div>
      <h1>Dashboard</h1>

      <section>
        <h2>Weight</h2>
        {weight && <p>{weight.date}: {weight.weight} lbs</p>}
        <div>
          <Link to="/weightlibrary">View Weight History</Link> | 
          <Link to="/addweight">Add Weight</Link>
        </div>
      </section>

      <section>
        <h2>Nutrition</h2>
        {nutrition && <p>{nutrition.date}: {nutrition.calories} kcal</p>}
        <div>
          <Link to="/nutritionlibrary">View Nutrition History</Link> | 
          <Link to="/addnutrition">Add Nutrition</Link>
        </div>
      </section>

      <section>
        <h2>Workouts</h2>
        {workouts.length ? (
          <ul>
            {workouts.map(w => (
              <li key={w.id}>{w.name}</li>
            ))}
          </ul>
        ) : (
          <p>No workouts recorded yet.</p>
        )}
        <div>
          <Link to="/workoutlibrary">View Workout History</Link> | 
          <Link to="/addworkout">Add Workout</Link>
        </div>
      </section>
    </div>
  );
}
