import express from "express";
const router = express.Router();
import {
    getQuestions,
    getAnswers,
    createQuestion,
    createAnswer
} from "../db/queries/faq.js";
import requireBody from "../middleware/requireBody.js";
import requireUser from "../middleware/requireUser.js";


router.get("/questions", async (req, res) => {
    try {
        const questions = await getQuestions();
        res.json(questions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/answers/:question_id", async (req, res) => {
    try {
        const answers = await getAnswers(req.params.question_id);
        res.json(answers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/questions", requireBody, async (req, res) => {
    try {
        const question = await createQuestion({ question: req.body.question });
        res.status(201).json(question);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.use(requireUser); // Require authentication for all routes below

router.post("/answers", requireBody, async (req, res) => {
    try {
        const answer = await createAnswer({ question_id: req.body.question_id, answer: req.body.answer });
        res.status(201).json(answer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;