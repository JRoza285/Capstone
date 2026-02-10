import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext.jsx";
import { getLiftById, updateLift, deleteLift } from "../api/lifts";

export default function LiftDetails() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [lift, setLift] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch lift details on mount
  useEffect(() => {
    const fetchLift = async () => {
      console.log("Fetching lift with id:", id);
      try {
        const fetchedLift = await getLiftById(id);
        console.log("Fetched lift:", fetchedLift);
        setLift(fetchedLift);
      } catch (err) {
        console.error(err);
        setError("Failed to load lift");
      } finally {
        setLoading(false);
      }
    };

    fetchLift();
  }, [id]);


  // Update lift
  const handleUpdateLift = async (liftData) => {
    if (!token) {
      console.error("No token available");
      return;
    }
    try {
      const updatedLift = await updateLift(token, id, liftData);
      setLift(updatedLift);
    } catch (err) {
      console.error("Failed to update lift", err);
    }
  };

  // Delete lift
  const handleDeleteLift = async () => {
    if (!token) {
      console.error("No token available");
      return;
    }
    try {
      await deleteLift(token, id);
      navigate("/liftlibrary"); // Redirect to lift library after deletion
    } catch (err) {
      console.error("Failed to delete lift", err);
    }
  };

  if (loading) return <p>Loading lift details...</p>;
  if (error) return <p>{error}</p>;
  if (!lift) return <p>Lift not found.</p>;

return (
  <article>
    <h2>{lift.name}</h2>
    <p>Target Muscle: {lift.target_muscle}</p>
    <p>Description: {lift.description}</p>

    {token && (
      <div>
        <button onClick={() => navigate(`/lifts/${id}/update`)}>
          Update This Lift
        </button>
        <button onClick={handleDeleteLift}>Delete This Lift</button>
      </div>
    )}
  </article>
);

}
