import express from 'express';
const router = express.Router();
import{
    getNutrition,
    getCalories,
    getNutritionGraph,
    newNutrition,
    updateNutrition,
    deleteNutrition
} from "../db/queries/nutrition.js";
import requireUser from "../middleware/requireUser.js";
import requireBody from "../middleware/requireBody.js";

router.use(requireUser);

//get nutrition

router.get("/", async (req, res) => {
    try {
        const nutrition = await getNutrition(req.user.id);
        res.json(nutrition);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

//get calories

router.get("/calories", async (req, res) => {
    try {
        const nutrition = await getCalories(req.user.id);
        if (!nutrition) return res.status(404).send("No nutrition found for given calories");
        res.json(nutrition);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

//newNutrition

router.post(
  "/",
  requireBody(["date", "calories", "protein", "carbs", "fats"]),
  async (req, res) => {
    try {
      const { date, calories, protein, carbs, fats } = req.body;
      const newNutritionEntry = await newNutrition({
        userId: req.user.id,
        date,
        calories,
        protein,
        carbs,
        fats,
      });

      res.status(201).json(newNutritionEntry); // ✅ send the created entry
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" }); // ✅ return JSON on errors
    }
  }
);


//update nutrition

router.put("/:id", requireBody(["date", "calories", "protein", "carbs", "fats"]), async (req, res) => {
    try {
        const { id } = req.params;
        const { date, calories, protein, carbs, fats } = req.body;
        const updatedNutrition = await updateNutrition({ id, user_id: req.user.id, date, calories, protein, carbs, fats });
        if (!updatedNutrition) return res.status(404).send("Nutrition entry not found");
        res.json(updatedNutrition);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

//delete nutrition

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedNutrition = await deleteNutrition(id, req.user.id);
        if (!deletedNutrition) return res.status(404).send("Nutrition entry not found");
        res.json(deletedNutrition);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

router.get("/graph", requireUser, async (req, res) => {
  try {
    const weights = await getNutritionGraph(req.user.id); // backend query
    res.json(weights);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


export default router;

