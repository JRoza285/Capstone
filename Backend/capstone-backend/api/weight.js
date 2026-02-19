import express from 'express';
const router = express.Router();
import {
    getWeight,
    getWeightHistory,
    enterWeight,
    getWeightGraph
} from "../db/queries/weight.js";
import requireUser from "../middleware/requireUser.js";
import requireBody from "../middleware/requireBody.js";

router.use(requireUser);

//get weight

router.get("/", async (req, res) => {
    try {
        const weight = await getWeight(req.user.id);
        res.json(weight);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

//get weight history

router.get("/history", async (req, res) => {
    try {
        const weightHistory = await getWeightHistory(req.user.id);
        res.json(weightHistory);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

//enter weight

router.post("/", requireBody(["weight", "date"]), async (req, res) => {
    try {
        const { weight, date } = req.body;

        const newWeightEntry = await enterWeight({
            userId: req.user.id,
            weight,
            date
        });

        res.status(201).json(newWeightEntry);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

router.get("/graph", requireUser, async (req, res) => {
  try {
    const weights = await getWeightGraph(req.user.id);
    res.json(weights);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


export default router;
