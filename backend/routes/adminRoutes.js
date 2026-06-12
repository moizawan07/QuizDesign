import express from "express";
import {
  createQuiz,
  getQuizzes,
  updateQuizStatus,
  createQuestion,
  getQuestionsForQuiz,
  getAllResults,
  getAllReattempts,
  updateReattemptStatus,
  getAllUsers,
  deleteUser,
  deleteQuiz,
  deleteReattempt,
  updateResultScore
} from "../controllers/adminController.js";
import { protect, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// Quizzes
router.route("/quizzes").get(protect, isAdmin, getQuizzes).post(protect, isAdmin, createQuiz);
router.route("/quizzes/:quizId/status").put(protect, isAdmin, updateQuizStatus);
router.route("/quizzes/:id").delete(protect, isAdmin, deleteQuiz);

// Questions
router.route("/questions").post(protect, isAdmin, createQuestion);
router.route("/questions/:quizId").get(protect, isAdmin, getQuestionsForQuiz);

// Results
router.route("/results").get(protect, isAdmin, getAllResults);
router.route("/results/:resultId/grade").put(protect, isAdmin, updateResultScore);

// Reattempts
router.route("/reattempts").get(protect, isAdmin, getAllReattempts);
router.route("/reattempts/:id/status").put(protect, isAdmin, updateReattemptStatus);
router.route("/reattempts/:id").delete(protect, isAdmin, deleteReattempt);

// Users
router.route("/users").get(protect, isAdmin, getAllUsers);
router.route("/users/:id").delete(protect, isAdmin, deleteUser);

export default router;
