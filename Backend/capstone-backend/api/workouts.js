// id useer_id

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

//Post workouts----------------

router.post("/", requireBody, async (req, res) => {
    try {
        const workout = await createWorkout({
            user_id: req.user.id,
            ...req.body
        });

        res.status(201).json(workout);
    } catch (error) {
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

router.delete("/:id", async (req, res) => {
    try {
        const deletedWorkout = await deleteWorkout({ id: req.params.id, user_id: req.user.id });
        res.json(deletedWorkout);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;