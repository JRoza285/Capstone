import { useEffect, useState } from "react";
import { getWeightHistory } from "../api/weight";
import { useAuth } from "../auth/AuthContext";
import WeightList from "./WeightList";

// Helper: group weights by calendar week and calculate averages
function getWeeklyAverages(weights) {
  const weeks = {};

  weights.forEach((entry) => {
    const date = new Date(entry.date);

    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDays = Math.floor((date - firstDayOfYear) / 86400000);
    const weekNumber = Math.ceil(
      (pastDays + firstDayOfYear.getDay() + 1) / 7
    );

    const key = `${date.getFullYear()}-W${weekNumber}`;

    if (!weeks[key]) {
      weeks[key] = { total: 0, count: 0 };
    }

    weeks[key].total += entry.weight;
    weeks[key].count += 1;
  });

  return Object.entries(weeks).map(([week, data]) => ({
    week,
    average: data.total / data.count,
  }));
}

export default function WeightLibrary() {
  const { token } = useAuth();
  const [weights, setWeights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch weights from API
  const fetchWeights = async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getWeightHistory(token);
      setWeights(data);
    } catch (err) {
      console.error("Failed to fetch weights:", err);
      setError("Failed to load weight history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeights();
  }, [token]);

  // Compute weekly averages
  const weeklyAverages = getWeeklyAverages(weights);

  return (
    <section>
      <h1>Weight History</h1>

      {loading && <p>Loading weights...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <>
          <WeightList weights={weights} />

          <h2>Weekly Averages</h2>
          {weeklyAverages.length === 0 ? (
            <p>No data available.</p>
          ) : (
            <ul>
              {weeklyAverages.map((w) => (
                <li key={w.week}>
                  {w.week}: {w.average.toFixed(1)}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
}


