import express from "express";
import { submitQuiz, getAllResults } from "../controllers/quizController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/submit", protect, submitQuiz);
router.get("/results", protect, getAllResults);

export default router;
