import express from "express";
import { submitQuiz, getResults, getAllResults } from "../controllers/quizController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/submit", protect, submitQuiz);
router.get("/results", protect, getResults);
router.get("/results-table", protect, getAllResults);

export default router;
