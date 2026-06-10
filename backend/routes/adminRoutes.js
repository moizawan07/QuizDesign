import express from "express";
import {
  createQuiz,
  getQuizzes,
  updateQuizStatus,
  createQuestion,
  getQuestionsForQuiz,
  getAllResults,
  updateResultScore
} from "../controllers/adminController.js";
import { protect, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// Quizzes
router.route("/quizzes").get(protect, isAdmin, getQuizzes).post(protect, isAdmin, createQuiz);
router.route("/quizzes/:quizId/status").put(protect, isAdmin, updateQuizStatus);

// Questions
router.route("/questions").post(protect, isAdmin, createQuestion);
router.route("/questions/:quizId").get(protect, isAdmin, getQuestionsForQuiz);

// Results
router.route("/results").get(protect, isAdmin, getAllResults);
router.route("/results/:resultId/grade").put(protect, isAdmin, updateResultScore);

export default router;
