import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  getLifts,
  createLift,
  getTargetMuscles,
  createTargetMuscle
} from "../api/lifts";
//import LiftList from "./Lift-List";
import { useAuth } from "../auth/AuthContext";

export default function LiftLibrary() {
  const [lifts, setLifts] = useState([]);
  const [allLifts, setAllLifts] = useState([]);
  const [targetFilter, setTargetFilter] = useState("");
  const [newLift, setNewLift] = useState({
    name: "",
    description: "",
    target_muscle: ""
  });
  const [targetMuscles, setTargetMuscles] = useState([]);
  const [newTarget, setNewTarget] = useState("");
  const { token } = useAuth();

  // --- Helpers ---
  const sortLifts = (arr) =>
    [...arr].sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    );

  const sortMuscles = (arr) =>
    [...arr].sort((a, b) =>
      a.toLowerCase().localeCompare(b.toLowerCase())
    );

  // --- Fetch lifts ---
  const syncLifts = async () => {
    try {
      const fetchedLifts = await getLifts();
      const sorted = sortLifts(fetchedLifts);
      setLifts(sorted);
      setAllLifts(sorted);
    } catch (error) {
      console.error("Error fetching lifts:", error);
    }
  };

  // --- Fetch target muscles ---
  const syncTargetMuscles = async () => {
    try {
      const muscles = await getTargetMuscles();
      setTargetMuscles(sortMuscles(muscles));
    } catch (error) {
      console.error("Error fetching target muscles:", error);
    }
  };

  // --- Filter lifts ---
  useEffect(() => {
    if (!targetFilter) {
      setLifts(allLifts);
      return;
    }

    const filtered = allLifts
      .filter((lift) =>
        lift.target_muscle
          .toLowerCase()
          .includes(targetFilter.toLowerCase())
      )
      .sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );

    setLifts(filtered);
  }, [targetFilter, allLifts]);

  // --- Create target muscle ---
  const handleCreateTarget = async () => {
    if (!token || !newTarget) return;

    try {
      const created = await createTargetMuscle(token, newTarget);

      const updatedMuscles = sortMuscles([
        ...targetMuscles,
        created.target_muscle
      ]);

      setTargetMuscles(updatedMuscles);

      setNewLift((prev) => ({
        ...prev,
        target_muscle: created.target_muscle
      }));

      setNewTarget("");
    } catch (error) {
      console.error("Error creating target muscle:", error);
    }
  };

  // --- Create lift ---
  const handleCreateLift = async (e) => {
    e.preventDefault();

    if (!token || !newLift.target_muscle) {
      console.error("No token or target muscle selected");
      return;
    }

    try {
      const createdLift = await createLift(token, newLift);

      setLifts((prev) => sortLifts([...prev, createdLift]));
      setAllLifts((prev) => sortLifts([...prev, createdLift]));

      setNewLift({
        name: "",
        description: "",
        target_muscle: ""
      });
    } catch (error) {
      console.error("Error creating lift:", error);
    }
  };

  // --- Fetch data on mount ---
  useEffect(() => {
    syncLifts();
    syncTargetMuscles();
  }, []);

  return (
    <div>
      <h1>Lift Library</h1>

      {/* Filter */}
      <div style={{ marginBottom: "1em" }}>
        <input
          type="text"
          placeholder="Filter by target muscle"
          value={targetFilter}
          onChange={(e) => setTargetFilter(e.target.value)}
        />
        <button
          type="button"
          onClick={() => {
            setTargetFilter("");
            setLifts(allLifts);
          }}
        >
          Reset
        </button>
      </div>

      {/* Create Lift Form (Only when logged in) */}
      {token && (
        <div style={{ marginBottom: "2em" }}>
          <h2>Add New Lift</h2>

          <form onSubmit={handleCreateLift}>
            <input
              type="text"
              placeholder="Lift Name"
              value={newLift.name}
              onChange={(e) =>
                setNewLift({ ...newLift, name: e.target.value })
              }
              required
            />

            <br /><br />

            <textarea
              placeholder="Description"
              value={newLift.description}
              onChange={(e) =>
                setNewLift({ ...newLift, description: e.target.value })
              }
              required
            />

            <br /><br />

            <select
              value={newLift.target_muscle}
              onChange={(e) =>
                setNewLift({ ...newLift, target_muscle: e.target.value })
              }
              required
            >
              <option value="">Select Target Muscle</option>
              {targetMuscles.map((muscle, i) => (
                <option key={i} value={muscle}>
                  {muscle}
                </option>
              ))}
            </select>

            <br /><br />

            <button type="submit">Create Lift</button>
          </form>

          {/* Add New Target Muscle */}
          <div style={{ marginTop: "1em" }}>
            <input
              type="text"
              placeholder="Add New Target Muscle"
              value={newTarget}
              onChange={(e) => setNewTarget(e.target.value)}
            />
            <button type="button" onClick={handleCreateTarget}>
              Add Muscle
            </button>
          </div>
        </div>
      )}

      {/* Lift Grid */}
      <div className="lift-grid">
        {lifts.map((lift) => (
          <Link
            key={lift.id}
            to={`/lifts/${lift.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="lift-card">
              <h3>{lift.name}</h3>
              <p>{lift.description}</p>
              <p>
                <strong>Target Muscle:</strong> {lift.target_muscle}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>

  );
}
