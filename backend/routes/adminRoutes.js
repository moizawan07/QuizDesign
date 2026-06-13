import express from "express";
import {
  createQuiz,
  getQuizzes,
  getQuizById,
  updateQuiz,
  updateQuizStatus,
  createQuestion,
  createQuestionsBulk,
  getQuestionsForQuiz,
  updateQuestion,
  deleteQuestion,
  deleteQuestionsBulk,
  getAllResults,
  getAllReattempts,
  updateReattemptStatus,
  getAllUsers,
  deleteUser,
  deleteQuiz,
  deleteReattempt,
  deleteResult,
  updateResultScore,
  getDashboardStats,
  deleteQuizzesBulk,
  updateQuizzesStatusBulk,
  deleteUsersBulk,
  deleteResultsBulk,
  deleteReattemptsBulk,
  updateReattemptsStatusBulk
} from "../controllers/adminController.js";
import { protect, isAdmin } from "../middleware/auth.js";

const router = express.Router();

router.route("/dashboard-stats").get(protect, isAdmin, getDashboardStats);

// Quizzes
router.route("/quizzes").get(protect, isAdmin, getQuizzes).post(protect, isAdmin, createQuiz);
router.route("/quizzes/bulk-delete").post(protect, isAdmin, deleteQuizzesBulk);
router.route("/quizzes/bulk-status").post(protect, isAdmin, updateQuizzesStatusBulk);
router.route("/quizzes/:id").get(protect, isAdmin, getQuizById).put(protect, isAdmin, updateQuiz).delete(protect, isAdmin, deleteQuiz);
router.route("/quizzes/:quizId/status").put(protect, isAdmin, updateQuizStatus);

// Questions
router.route("/questions").post(protect, isAdmin, createQuestion);
router.route("/questions/bulk").post(protect, isAdmin, createQuestionsBulk);
router.route("/questions/bulk-delete").post(protect, isAdmin, deleteQuestionsBulk);
router.route("/questions/individual/:id").put(protect, isAdmin, updateQuestion).delete(protect, isAdmin, deleteQuestion);
router.route("/questions/:quizId").get(protect, isAdmin, getQuestionsForQuiz);

// Results
router.route("/results").get(protect, isAdmin, getAllResults);
router.route("/results/bulk-delete").post(protect, isAdmin, deleteResultsBulk);
router.route("/results/:id").delete(protect, isAdmin, deleteResult);
router.route("/results/:resultId/grade").put(protect, isAdmin, updateResultScore);

// Reattempts
router.route("/reattempts").get(protect, isAdmin, getAllReattempts);
router.route("/reattempts/bulk-delete").post(protect, isAdmin, deleteReattemptsBulk);
router.route("/reattempts/bulk-status").post(protect, isAdmin, updateReattemptsStatusBulk);
router.route("/reattempts/:id/status").put(protect, isAdmin, updateReattemptStatus);
router.route("/reattempts/:id").delete(protect, isAdmin, deleteReattempt);

// Users
router.route("/users").get(protect, isAdmin, getAllUsers);
router.route("/users/bulk-delete").post(protect, isAdmin, deleteUsersBulk);
router.route("/users/:id").delete(protect, isAdmin, deleteUser);

export default router;
