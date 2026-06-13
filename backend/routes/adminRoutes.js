import express from "express";
import {
  createQuiz,
  getQuizzes,
  updateQuiz,
  updateQuizStatus,
  createQuestion,
  getQuestionsForQuiz,
  getAllResults,
  getAllReattempts,
  updateReattemptStatus,
  getAllUsers,
  deleteUser,
  deleteQuiz,
  deleteReattempt
} from "../controllers/adminController.js";
import { protect, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// Quizzes
router.route("/quizzes").get(protect, isAdmin, getQuizzes).post(protect, isAdmin, createQuiz);
router.route("/quizzes/:id").put(protect, isAdmin, updateQuiz).delete(protect, isAdmin, deleteQuiz);
router.route("/quizzes/:quizId/status").put(protect, isAdmin, updateQuizStatus);

// Questions
router.route("/questions").post(protect, isAdmin, createQuestion);
router.route("/questions/:quizId").get(protect, isAdmin, getQuestionsForQuiz);

// Results
router.route("/results").get(protect, isAdmin, getAllResults);

// Reattempts
router.route("/reattempts").get(protect, isAdmin, getAllReattempts);
router.route("/reattempts/:id/status").put(protect, isAdmin, updateReattemptStatus);
router.route("/reattempts/:id").delete(protect, isAdmin, deleteReattempt);

// Users
router.route("/users").get(protect, isAdmin, getAllUsers);
router.route("/users/:id").delete(protect, isAdmin, deleteUser);

export default router;
