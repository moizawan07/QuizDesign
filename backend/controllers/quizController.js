import QuizResult from "../models/QuizResult.js";
import User from "../models/User.js";
import Quiz from "../models/Quiz.js";
import Question from "../models/Question.js";
import Reattempt from "../models/Reattempt.js";

// Get available quizzes for users to select
export const getAvailableQuizzes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    const query = search ? { title: { $regex: search, $options: "i" } } : {};
    const quizzes = await Quiz.find(query).sort("-createdAt");
    
    // Only return quizzes that have at least 1 question
    const validQuizzes = [];
    for (const q of quizzes) {
      const count = await Question.countDocuments({ quizId: q._id });
      if (count > 0) {
        validQuizzes.push({ ...q.toObject(), numberOfQuestions: count });
      }
    }
    
    const paginatedQuizzes = validQuizzes.slice(skip, skip + limit);
    
    res.status(200).json({ 
      success: true, 
      quizzes: paginatedQuizzes,
      pagination: { total: validQuizzes.length, page, pages: Math.ceil(validQuizzes.length / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get questions for a specific quiz
export const getQuizQuestions = async (req, res) => {
  try {
    const { quizId } = req.params;
    const questions = await Question.find({ quizId });
    
    // We send back questions including correctAnswer so frontend logic works out-of-the-box
    res.status(200).json({ success: true, questions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyAttempts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const attempts = await QuizResult.find({ userId: req.user.id })
      .select("quizId completedAt percentage total correct wrong timeTaken")
      .sort({ completedAt: -1 })
      .skip(skip)
      .limit(limit);
      
    const total = await QuizResult.countDocuments({ userId: req.user.id });

    res.status(200).json({ 
      success: true, 
      attempts,
      pagination: { total, page, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const submitQuiz = async (req, res) => {
  try {
    const userId = req.user.id;
    const { quizId, correct, wrong, unattempted, total, percentage, completedAt, timeTaken, detailedAnswers, tabViolations, note } = req.body;

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({message: 'User not found'})
    }

    // Check if the user has already attempted THIS specific quiz
    const existingAttempts = await QuizResult.find({ userId, quizId });
    if (existingAttempts.length >= 1) {
      const approvedReattempt = await Reattempt.findOne({ userId, quizId, status: "Approved" });
      if (!approvedReattempt) {
        return res.status(400).json({ message: "You have already attempted this specific quiz." });
      }
      if (existingAttempts.length >= 2) {
        return res.status(400).json({ message: "You have already exhausted your approved reattempt." });
      }
    }

    if (!quizId || correct === undefined || wrong === undefined || unattempted === undefined || total === undefined) {
      return res.status(400).json({ success: false, message: "Please provide all required quiz data" });
    }

    const quizResult = await QuizResult.create({
      userId,
      quizId,
      correct,
      wrong,
      unattempted,
      total,
      percentage,
      completedAt,
      timeTaken,
      tabViolations: tabViolations || 0,
      note: note || "Manual submit",
      detailedAnswers: detailedAnswers || []
    });

    // Removed global quizAttempt flag update so users can attempt different quizzes.

    res.status(201).json({ success: true, quizResult, message: "Quiz submitted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllResults = async (req, res) => {
  try {
    const results = await QuizResult.find()
      .populate("userId")
      .populate("quizId")
      .sort({ completedAt: -1 });

    res.status(200).json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const requestReattempt = async (req, res) => {
  try {
    const userId = req.user.id;
    const { quizId, reason } = req.body;

    if (!quizId || !reason) {
      return res.status(400).json({ success: false, message: "Quiz ID and reason are required." });
    }

    const existingRequest = await Reattempt.findOne({ userId, quizId });
    if (existingRequest) {
      return res.status(400).json({ success: false, message: "You have already submitted a re-attempt request for this quiz." });
    }

    const newRequest = await Reattempt.create({ userId, quizId, reason });
    res.status(201).json({ success: true, message: "Re-attempt request submitted.", data: newRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyReattempts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const userId = req.user.id;
    const requests = await Reattempt.find({ userId }).sort("-createdAt").skip(skip).limit(limit);
    const total = await Reattempt.countDocuments({ userId });

    res.status(200).json({ 
      success: true, 
      data: requests,
      pagination: { total, page, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
