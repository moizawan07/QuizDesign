import express from "express";
import { submitQuiz, getAllResults, getAvailableQuizzes, getQuizQuestions, getMyAttempts, requestReattempt, getMyReattempts } from "../controllers/quizController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/available", getAvailableQuizzes);
router.get("/my-attempts", protect, getMyAttempts);
router.get("/my-reattempts", protect, getMyReattempts);
router.post("/request-reattempt", protect, requestReattempt);
router.get("/:quizId/questions", getQuizQuestions);
router.post("/submit", protect, submitQuiz);
router.get("/results", getAllResults);

export default router;
