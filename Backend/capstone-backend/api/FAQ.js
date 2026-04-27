import express from "express";
const router = express.Router();

import {
  getFaqs,
  getFaqById,
  getUnansweredFaqs,
  createQuestion,
  addAnswer
} from "../db/queries/faq.js";

import requireBody from "../middleware/requireBody.js";
import requireUser from "../middleware/requireUser.js";


// --------------------
// PUBLIC
// --------------------
router.get("/", async (req, res) => {
  try {
    const faqs = await getFaqs();
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const faq = await getFaqById(req.params.id);
    res.json(faq);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", requireBody, async (req, res) => {
  try {
    const faq = await createQuestion({
      question: req.body.question
    });

    res.status(201).json(faq);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// --------------------
// ADMIN ONLY
// --------------------
router.get("/unanswered", requireUser, async (req, res) => {
  try {
    const faqs = await getUnansweredFaqs();
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/:id/answer", requireUser, requireBody, async (req, res) => {
  try {
    const updatedFaq = await addAnswer({
      id: req.params.id,
      answer: req.body.answer
    });

    res.status(200).json(updatedFaq);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
