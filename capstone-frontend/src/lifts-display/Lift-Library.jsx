import { useEffect, useState } from "react";
import { getLifts, getLiftsByTarget, createLift, getTargetMuscles, createTargetMuscle } from "../api/lifts";
import LiftList from "./Lift-List";
import { useAuth } from "../auth/AuthContext";

export default function LiftLibrary() {
  const [lifts, setLifts] = useState([]);
  const [targetFilter, setTargetFilter] = useState("");
  const [newLift, setNewLift] = useState({ name: "", description: "", target_muscle: "" });
  const [targetMuscles, setTargetMuscles] = useState([]);
  const [newTarget, setNewTarget] = useState(""); // For creating new muscle
  const { token } = useAuth();

  // Fetch all lifts
  const syncLifts = async () => {
    try {
      const fetchedLifts = await getLifts();
      setLifts(fetchedLifts);
    } catch (error) {
      console.error("Error fetching lifts:", error);
    }
  };

  // Fetch all target muscles
  const syncTargetMuscles = async () => {
    try {
      const muscles = await getTargetMuscles();
      setTargetMuscles(muscles);
    } catch (error) {
      console.error("Error fetching target muscles:", error);
    }
  };

  // Filter lifts by target muscle
  const fetchLiftsByTarget = async (e) => {
    e.preventDefault();
    try {
      if (!targetFilter) return syncLifts();
      const fetchedLifts = await getLiftsByTarget(targetFilter);
      setLifts(fetchedLifts);
    } catch (error) {
      console.error("Error fetching lifts by target:", error);
    }
  };

  // Create new target muscle
  const handleCreateTarget = async () => {
    if (!token || !newTarget) return;
    try {
      const created = await createTargetMuscle(token, newTarget);
      setTargetMuscles((prev) => [...prev, created]);
      setNewLift({
        ...newLift,
        target_muscle: created.target_muscle
      });

      setNewTarget(""); // clear input
    } catch (error) {
      console.error("Error creating target muscle:", error);
    }
  };

  // Create new lift
  const handleCreateLift = async (e) => {
    e.preventDefault();
    if (!token || !newLift.target_muscle) return console.error("No token or target muscle selected");
    try {
      const createdLift = await createLift(token, newLift);
      setLifts((prev) => [...prev, createdLift]);
      setNewLift({ name: "", description: "", target_muscle: "" });
    } catch (error) {
      console.error("Error creating lift:", error);
    }
  };

  useEffect(() => {
    syncLifts();
    syncTargetMuscles();
  }, []);

  return (
    <div>
      <h1>Lift Library</h1>

      {/* Filter by target muscle */}
      <form onSubmit={fetchLiftsByTarget}>
        <input
          type="text"
          placeholder="Filter by target muscle"
          value={targetFilter}
          onChange={(e) => setTargetFilter(e.target.value)}
        />
        <button type="submit">Filter</button>
        <button type="button" onClick={() => { setTargetFilter(""); syncLifts(); }}>
          Reset
        </button>
      </form>

      {/* Create new lift if logged in */}
      {token && (
        <>
          <h2>Add New Lift</h2>
          <form onSubmit={handleCreateLift}>
            <input
              type="text"
              placeholder="Lift name"
              value={newLift.name}
              onChange={(e) => setNewLift({ ...newLift, name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={newLift.description}
              onChange={(e) => setNewLift({ ...newLift, description: e.target.value })}
              required
            />

            {/* Dropdown of existing target muscles */}
            <select
              value={newLift.target_muscle}
              onChange={(e) => setNewLift({ ...newLift, target_muscle: e.target.value })}
              required
            >
              <option value="">Select target muscle</option>
              {targetMuscles.map((muscle, i) => (
                <option key={i} value={muscle}>{muscle}</option>
              ))}
            </select>

            <button type="submit">Add Lift</button>
          </form>

          {/* Create new target muscle */}
          <div style={{ marginTop: "1em" }}>
            <input
              type="text"
              placeholder="Add new target muscle"
              value={newTarget}
              onChange={(e) => setNewTarget(e.target.value)}
            />
            <button type="button" onClick={handleCreateTarget}>Create Target Muscle</button>
          </div>
        </>
      )}

      {/* List of lifts */}
      <LiftList lifts={lifts} />
    </div>
  );
}
