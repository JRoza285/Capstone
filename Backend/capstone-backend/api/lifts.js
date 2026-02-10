import express from 'express';
const router = express.Router();
import {
    getLifts,
    getLiftById,
    createLift,
    updateLift,
    deleteLift,
    getLiftsByTarget,
    getTargetMuscles,
    createTargetMuscle
} from "../db/queries/lifts.js";
import requireUser from "../middleware/requireUser.js";
import requirebody from "../middleware/requireBody.js";

router.get("/", async (req, res) => {
    try {
        const lifts = await getLifts();
        res.json(lifts);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// Get lifts by target
router.get("/target/:target", async (req, res) => {
    try {
        const { target } = req.params;
        const lifts = await getLiftsByTarget(target);
        if (!lifts || lifts.length === 0) return res.status(404).send("No lifts found");
        res.json(lifts);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

//get all target muscles

router.get("/targets", async (req, res) => {
    try {
        const targets = await getTargetMuscles();
        res.json(targets);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// Get lift by ID

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params; // destructure correctly
        const lift = await getLiftById(id);
        if (!lift) return res.status(404).send("Lift not found");
        res.json(lift);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});



//protected routes below

router.use(requireUser);

//creates a target muscle

router.post("/targets", requirebody(["target_muscle"]), async (req, res) => {
  try {
    const { target_muscle } = req.body;
    const newTarget = await createTargetMuscle(target_muscle);
    res.status(201).json(newTarget);
  } catch (error) {
    console.error(error);
    if (error.code === "23505") { // unique_violation
      return res.status(400).send("Target muscle already exists");
    }
    res.status(500).send("Internal Server Error");
  }
});



//get lift by target




//create lift

router.post("/", requirebody(["name", "description", "target_muscle"]), async (req, res) => {
    try {
        const { name, description, target_muscle } = req.body;
        const lift = await createLift(req.body);
        res.status(201).json(lift);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});


//update lift

router.put("/:id", requirebody(["name", "description", "target_muscle"]), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, target_muscle } = req.body;
        const updatedLift = await updateLift({ id, name, description, target_muscle });

        if (!updatedLift) return res.status(404).send("Lift not found");
        res.json(updatedLift);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});


//delete lift

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedLift = await deleteLift(id);
        if (!deletedLift) return res.status(404).send("Lift not found");
        res.json(deletedLift);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

export default router;