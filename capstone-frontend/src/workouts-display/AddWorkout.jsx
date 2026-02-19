import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext"; // ✅ import auth context
import { getLifts } from "../api/lifts";
import { createWorkout } from "../api/workouts";

export default function AddWorkout() {
  const { token } = useAuth(); // ✅ get token from auth context

  const [lifts, setLifts] = useState([]);
  const [selectedLiftId, setSelectedLiftId] = useState("");
  const [sets, setSets] = useState("");
  const [repsMin, setRepsMin] = useState("");
  const [repsMax, setRepsMax] = useState("");
  const [proximity, setProximity] = useState("");
  const [workoutLifts, setWorkoutLifts] = useState([]);
  const [workoutName, setWorkoutName] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLifts() {
      try {
        const data = await getLifts();
        setLifts(data);
      } catch (e) {
        console.error(e);
        setError("Failed to load lifts");
      }
    }
    fetchLifts();
  }, []);

  const addLiftToWorkout = () => {
    if (!selectedLiftId || !sets || !repsMin || !repsMax || !proximity) {
      setError("All fields are required for each lift");
      return;
    }

    const min = parseInt(repsMin);
    const max = parseInt(repsMax);
    if (min <= 0 || max <= 0 || min > max) {
      setError("Reps range must be positive and min ≤ max");
      return;
    }

    const s = parseInt(sets);
    const p = parseInt(proximity);
    if (s <= 0 || p < 0 || p > 100) {
      setError("Sets must be positive and proximity 0–100%");
      return;
    }

    const lift = lifts.find((l) => l.id === parseInt(selectedLiftId));
    setWorkoutLifts([
      ...workoutLifts,
      {
        ...lift,
        sets: s,
        repsMin: min,
        repsMax: max,
        proximity: p,
      },
    ]);

    setSelectedLiftId("");
    setSets("");
    setRepsMin("");
    setRepsMax("");
    setProximity("");
    setError(null);
  };

  const removeLift = (index) => {
    setWorkoutLifts(workoutLifts.filter((_, i) => i !== index));
  };

  const submitWorkout = async () => {
    if (!workoutName || workoutLifts.length === 0) {
      setError("Workout name and at least one lift are required");
      return;
    }

    if (!token) {
      setError("You must be logged in to create a workout.");
      return;
    }

    try {
      const payload = {
        name: workoutName,
        lifts: workoutLifts.map((l) => ({
          lift_id: l.id,
          sets: l.sets,
          reps_min: l.repsMin,
          reps_max: l.repsMax,
          proximity_to_failure: l.proximity,
        })),
      };


      await createWorkout(token, payload);

      setWorkoutName("");
      setWorkoutLifts([]);
      setError(null);
      alert("Workout created successfully!");
    } catch (e) {
      console.error(e);
      setError(e.message || "Failed to create workout");
    }
  };

return (
  <div className="create-workout-form">
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
      Reps (range):
      <input
        type="number"
        placeholder="min"
        value={repsMin}
        onChange={(e) => setRepsMin(e.target.value)}
      />
      -
      <input
        type="number"
        placeholder="max"
        value={repsMax}
        onChange={(e) => setRepsMax(e.target.value)}
      />
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
          {lift.name}: {lift.sets} sets x {lift.repsMin}-{lift.repsMax} reps, {lift.proximity}% to failure{" "}
          <button onClick={() => removeLift(index)}>Remove</button>
        </li>
      ))}
    </ul>

    <button type="button" onClick={submitWorkout}>
      Submit Workout
    </button>
  </div>
);

}
