import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useAuth } from "../auth/AuthContext.jsx";
import { getLiftById, updateLift, getTargetMuscles } from "../api/lifts";

export default function LiftUpdate() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [liftData, setLiftData] = useState({
    name: "",
    description: "",
    target_muscle: ""
  });
  const [targetMuscles, setTargetMuscles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load existing lift details AND target muscles
useEffect(() => {
  const fetchData = async () => {
    try {
      const lift = await getLiftById(id, token); // needs token for protected route
      setLiftData({
        name: lift.name,
        description: lift.description,
        target_muscle: lift.target_muscle
      });

      const muscles = await getTargetMuscles(); // public route, no token needed
      console.log("Target muscles:", muscles); // <--- add this for debugging
      setTargetMuscles(muscles);
    } catch (err) {
      console.error(err);
      setError("Failed to load lift or target muscles");
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, [id, token]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setLiftData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateLift(token, id, liftData);
      navigate(`/lifts/${id}`);
    } catch (err) {
      console.error(err);
      setError("Failed to update lift");
    }
  };

  if (loading) return <p>Loading lift details...</p>;
  if (error) return <p>{error}</p>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>Update Lift</h2>

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
          {targetMuscles.map(tm => (
            <option key={tm.id || tm.target_muscle} value={tm.target_muscle}>
              {tm.target_muscle}
            </option>
          ))}
        </select>
      </label>

      <button type="submit">Save Changes</button>
      <button type="button" onClick={() => navigate(`/lifts/${id}`)}>
        Cancel
      </button>
    </form>
  );
}
