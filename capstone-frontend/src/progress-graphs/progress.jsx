import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { getWeightGraph } from "../api/weight";
import { getNutritionGraph } from "../api/nutrition";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Progress() {
  const { token } = useAuth();
  const [weights, setWeights] = useState([]);
  const [nutrition, setNutrition] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      setError("No token found. Please log in.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        const weightData = await getWeightGraph(token);
        const nutritionData = await getNutritionGraph(token);

        setWeights(
          (Array.isArray(weightData) ? weightData : []).map((w) => ({
            ...w,
            weight: Number(w.weight) || 0,
            date: w.date || new Date().toISOString(),
          }))
        );

        setNutrition(
          (Array.isArray(nutritionData) ? nutritionData : []).map((n) => ({
            ...n,
            calories: Number(n.calories) || 0,
            date: n.date || new Date().toISOString(),
          }))
        );
      } catch (err) {
        console.error(err);
        setError("Failed to fetch progress data. Check backend and token.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) return <p>Loading progress...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  // Chart datasets only if we have data
  const weightChartData =
    weights.length > 0
      ? {
          labels: weights.map((w) =>
            new Date(w.date).toLocaleDateString()
          ),
          datasets: [
            {
              label: "Weight (lbs)",
              data: weights.map((w) => w.weight),
              borderColor: "blue",
              backgroundColor: "rgba(0, 0, 255, 0.2)",
              tension: 0.3,
            },
          ],
        }
      : null;

  const nutritionChartData =
    nutrition.length > 0
      ? {
          labels: nutrition.map((n) =>
            new Date(n.date).toLocaleDateString()
          ),
          datasets: [
            {
              label: "Calories",
              data: nutrition.map((n) => n.calories),
              borderColor: "green",
              backgroundColor: "rgba(0, 128, 0, 0.2)",
              tension: 0.3,
            },
          ],
        }
      : null;

  return (
    <div className="progress-page">
      <h1>Progress</h1>

      <section className="chart-card">
        <h2>Weight Progress</h2>
        {weightChartData ? (
          <div className="chart-container">
            <Line data={weightChartData} options={{ maintainAspectRatio: false }} />
          </div>
        ) : (
          <p>No weight data available.</p>
        )}
      </section>

      <section className="chart-card">
        <h2>Calorie Intake</h2>
        {nutritionChartData ? (
          <div className="chart-container">
            <Line data={nutritionChartData} options={{ maintainAspectRatio: false }} />
          </div>
        ) : (
          <p>No nutrition data available.</p>
        )}
      </section>
    </div>
  );
}
