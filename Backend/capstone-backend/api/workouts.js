// id useer_id
import db from "#db/client"
import express from "express";
const router = express.Router();
import {
    getWorkouts,
    createWorkout,
    deleteWorkout,
    updateWorkout
} from "../db/queries/workouts.js";
import requireUser from "../middleware/requireUser.js";
import requireBody from "../middleware/requireBody.js";

router.use(requireUser);

//Get workouts----------------

router.get("/", async (req, res) => {
    const workouts = await getWorkouts(req.user.id);
    res.json(workouts);
});

// Get workout by ID

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const workouts = await getWorkouts(req.user.id);
  const workout = workouts.find(w => w.id === parseInt(id));
  if (!workout) return res.status(404).json({ error: "Workout not found" });
  res.json(workout);
});


//Post workouts----------------

router.post("/", requireBody(["name", "lifts"]), async (req, res) => {
  try {
    const { name, lifts } = req.body;

    if (!lifts || !Array.isArray(lifts) || lifts.length === 0) {
      return res.status(400).json({ error: "At least one lift is required" });
    }

    // Each lift must have sets, reps_min, reps_max, and proximity_to_failure
    for (const lift of lifts) {
      if (
        lift.sets == null ||
        lift.reps_min == null ||
        lift.reps_max == null ||
        lift.proximity_to_failure == null
      ) {
        return res.status(400).json({ error: "All lift fields are required" });
      }
    }

    const workout = await createWorkout({
      user_id: req.user.id,
      name,
      lifts,
    });

    res.status(201).json(workout);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

//update workouts-----------------

router.put("/:id", requireBody, async (req, res) => {
    try {
        const { id } = req.params;

        const updatedWorkout = await updateWorkout({
            id,
            user_id: req.user.id,
            ...req.body
        });

        res.json(updatedWorkout);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//delete workouts------------------------

router.delete("/:id", requireUser, async (req, res) => {
  try {
    const workoutId = req.params.id;

    // Remove associated lifts first
    await db.query("DELETE FROM workout_lifts WHERE workout_id = $1", [workoutId]);

    // Delete the workout
    const { rows: [deletedWorkout] } = await db.query(
      "DELETE FROM workouts WHERE id = $1 AND user_id = $2 RETURNING *",
      [workoutId, req.user.id]
    );

    if (!deletedWorkout) {
      return res.status(404).json({ error: "Workout not found" });
    }

    res.json(deletedWorkout);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});


export default router;