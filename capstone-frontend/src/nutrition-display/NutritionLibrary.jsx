import { useEffect, useState } from "react";
import { getNutrition } from "../api/nutrition";
import { useAuth } from "../auth/AuthContext";
import NutritionList from "./NutritionList";

export default function NutritionLibrary() {
  const { token } = useAuth(); // ✅ get token from AuthContext
  const [nutrition, setNutrition] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return; // ⚠️ do nothing if no token yet

    const syncNutrition = async () => {
      setLoading(true);
      setError(null);
      try {
        const diet = await getNutrition(token);
        setNutrition(diet);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    syncNutrition();
  }, [token]);

  if (!token) return <p>Please log in to view your nutrition history.</p>;

  return (
    <section>
      <h1>Nutrition Library</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && <NutritionList nutrition={nutrition} />}
    </section>
  );
}
