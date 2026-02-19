import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useAuth } from "../auth/AuthContext";
import { getLiftById, getTargetMuscles, updateLift } from "../api/lifts";

export default function LiftUpdate() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [liftData, setLiftData] = useState(null);
  const [targetMuscles, setTargetMuscles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch lift and target muscles on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const lift = await getLiftById(id);
        setLiftData(lift);

        const muscles = await getTargetMuscles();
        setTargetMuscles(muscles);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load lift data.");
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setLiftData({ ...liftData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return setError("You must be logged in to update lifts.");
    try {
      await updateLift(id, liftData, token);
      navigate(`/lifts/${id}`);
    } catch (err) {
      console.error(err);
      setError("Failed to update lift.");
    }
  };

  // Show loading while fetching
  if (loading) return <p>Loading...</p>;

  // Show error if no lift data
  if (!liftData) return <p>{error || "Lift not found."}</p>;

  return (
    <div>
      <h2>Update Lift</h2>

      {!token && <p style={{ color: "red" }}>You must be logged in to update a lift.</p>}

      {token && (
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={liftData.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Description:
            <textarea
              name="description"
              value={liftData.description}
              onChange={handleChange}
              required
              className="short-textarea"
            />

          </label>

          <label>
            Target Muscle:
            <select
              name="target_muscle"
              value={liftData.target_muscle}
              onChange={handleChange}
              required
            >
              <option value="">Select a target muscle</option>
              {targetMuscles.map((muscle, i) => (
                <option key={i} value={muscle}>
                  {muscle}
                </option>
              ))}
            </select>
          </label>

          <button type="submit">Save Changes</button>
          <button type="button" onClick={() => navigate(`/lifts/${id}`)}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}
