// displays indivual details of each workout
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext.jsx";
import { getWorkoutById, updateWorkout, deleteWorkout } from "../api/workouts";

export default function WorkoutDetails() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    if (!token) return;

    const fetchWorkout = async () => {
      try {
        const data = await getWorkoutById(id, token);
        setWorkout(data);
        setNewName(data.name);
      } catch (err) {
        console.error("Failed to fetch workout:", err);
      }
    };

    fetchWorkout();
  }, [id, token]);

  const handleUpdate = async () => {
    if (!newName.trim()) return;

    try {
      const updatedWorkout = await updateWorkout(
        id,
        { name: newName }, // For now, only updating the name
        token
      );
      setWorkout(updatedWorkout);
      alert("Workout updated!");
    } catch (err) {
      console.error("Failed to update workout:", err);
      alert("Failed to update workout");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this workout?")) return;

    try {
      await deleteWorkout(token, id);
      alert("Workout deleted!");
      navigate("/workoutlibrary");
    } catch (err) {
      console.error("Failed to delete workout:", err);
      alert("Failed to delete workout");
    }
  };

  if (!workout) return <p>Loading workout...</p>;

  return (
    <div>
      <h1>Workout Details</h1>

      <label>
        Workout Name:
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
      </label>
      <button onClick={handleUpdate}>Update Workout Name</button>
      <button onClick={handleDelete}>Delete Workout</button>

      <h2>Lifts</h2>
      {workout.lifts && workout.lifts.length > 0 ? (
        <ul>
          {workout.lifts.map((lift) => (
            <li key={lift.id}>
              <strong>{lift.name}</strong> ({lift.target_muscle}) — {lift.sets} sets x{" "}
              {lift.reps} reps, {lift.proximity_to_failure}% to failure
            </li>
          ))}
        </ul>
      ) : (
        <p>No lifts in this workout.</p>
      )}
    </div>
  );
}
