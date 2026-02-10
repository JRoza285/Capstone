import { useEffect, useState } from "react";
import { getLifts } from "../api/lifts"; // API function to GET /lifts
import { createWorkout } from "../api/workouts"; // API function to POST /workouts

export default function AddWorkout() {
  const [lifts, setLifts] = useState([]); // all lifts from DB
  const [selectedLiftId, setSelectedLiftId] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [proximity, setProximity] = useState("");
  const [workoutLifts, setWorkoutLifts] = useState([]); // lifts added to this workout
  const [workoutName, setWorkoutName] = useState("");
  const [error, setError] = useState(null);

  // Fetch all lifts on mount
  useEffect(() => {
    async function fetchLifts() {
      try {
        const data = await getLifts(); // your API should return [{id, name, target_muscle}]
        setLifts(data);
      } catch (e) {
        console.error(e);
        setError("Failed to load lifts");
      }
    }
    fetchLifts();
  }, []);

  const addLiftToWorkout = () => {
    if (!selectedLiftId || !sets || !reps || !proximity) {
      setError("All fields are required for each lift");
      return;
    }

    const lift = lifts.find((l) => l.id === parseInt(selectedLiftId));
    setWorkoutLifts([
      ...workoutLifts,
      { ...lift, sets: parseInt(sets), reps: parseInt(reps), proximity: parseInt(proximity) },
    ]);

    // reset inputs
    setSelectedLiftId("");
    setSets("");
    setReps("");
    setProximity("");
    setError(null);
  };

  const submitWorkout = async () => {
    if (!workoutName || workoutLifts.length === 0) {
      setError("Workout name and at least one lift are required");
      return;
    }

    try {
      // API should accept { name, lifts: [{lift_id, sets, reps, proximity}] }
      await createWorkout({ name: workoutName, lifts: workoutLifts });
      alert("Workout created successfully!");
      setWorkoutName("");
      setWorkoutLifts([]);
    } catch (e) {
      console.error(e);
      setError("Failed to create workout");
    }
  };

  return (
    <div>
      <h1>Create a New Workout</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <label>
        Workout Name:
        <input
          type="text"
          value={workoutName}
          onChange={(e) => setWorkoutName(e.target.value)}
          required
        />
      </label>

      <h2>Add a Lift</h2>
      <label>
        Select Lift:
        <select value={selectedLiftId} onChange={(e) => setSelectedLiftId(e.target.value)}>
          <option value="">--Select a lift--</option>
          {lifts.map((lift) => (
            <option key={lift.id} value={lift.id}>
              {lift.name} ({lift.target_muscle})
            </option>
          ))}
        </select>
      </label>

      <label>
        Sets:
        <input type="number" value={sets} onChange={(e) => setSets(e.target.value)} />
      </label>
      <label>
        Reps:
        <input type="number" value={reps} onChange={(e) => setReps(e.target.value)} />
      </label>
      <label>
        Proximity to Failure (%):
        <input type="number" value={proximity} onChange={(e) => setProximity(e.target.value)} />
      </label>
      <button type="button" onClick={addLiftToWorkout}>
        Add Lift to Workout
      </button>

      <h3>Lifts in this Workout:</h3>
      <ul>
        {workoutLifts.map((lift, index) => (
          <li key={index}>
            {lift.name}: {lift.sets} sets x {lift.reps} reps, {lift.proximity}% to failure
          </li>
        ))}
      </ul>

      <button type="button" onClick={submitWorkout}>
        Submit Workout
      </button>
    </div>
  );
}
