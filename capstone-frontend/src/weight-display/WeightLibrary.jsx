import { useEffect, useState } from "react";
import { getWeightHistory } from "../api/weight";
import { useAuth } from "../auth/AuthContext";
import WeightList from "./WeightList";

export default function WeightLibrary() {
  const { token } = useAuth();
  const [weights, setWeights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch weights from API
  const fetchWeights = async () => {
    if (!token) return; // Do nothing if no token
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

  // Load weights on mount or when token changes
  useEffect(() => {
    fetchWeights();
  }, [token]);

  return (
    <section>
      <h1>Weight History</h1>

      {loading && <p>Loading weights...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && <WeightList weights={weights} />}
    </section>
  );
}


