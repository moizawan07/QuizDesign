import Quiz from "../models/Quiz.js";
import QuizResult from "../models/QuizResult.js";
import Question from "../models/Question.js";
import Reattempt from "../models/Reattempt.js";
import User from "../models/User.js";
import Role from "../models/Role.js";

// --- QUIZZES ---
export const createQuiz = async (req, res, next) => {
  try {
    const { head, category, title, timeLimit } = req.body;
    if (!head || !category || !title || !timeLimit) {
      return res.status(400).json({ success: false, message: "Head, category, title, and time limit are required" });
    }
    const quiz = await Quiz.create({
      head,
      category,
      title,
      timeLimit,
      stack: "General", // Keeping for backward compatibility if needed, or remove
      numberOfQuestions: 0 // Will be derived from actual questions
    });
    res.status(201).json({ success: true, data: quiz });
  } catch (error) {
    next(error);
  }
};

export const getQuizzes = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    const query = search ? { title: { $regex: search, $options: "i" } } : {};

    const quizzes = await Quiz.find(query).sort("-createdAt").skip(skip).limit(limit);
    const total = await Quiz.countDocuments(query);

    // Also attach question counts
    const enrichedQuizzes = await Promise.all(quizzes.map(async (q) => {
      const count = await Question.countDocuments({ quizId: q._id });
      return { ...q.toObject(), numberOfQuestions: count };
    }));
    
    res.status(200).json({ 
      success: true, 
      data: enrichedQuizzes,
      pagination: { total, page, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
};

export const updateQuizStatus = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const { status } = req.body;
    if (!["Open", "Closed"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }
    const quiz = await Quiz.findByIdAndUpdate(quizId, { status }, { new: true });
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }
    res.status(200).json({ success: true, data: quiz });
  } catch (error) {
    next(error);
  }
};

// --- QUESTIONS ---
export const createQuestion = async (req, res, next) => {
  try {
    const { quizId, questionText, type, starterCode, options, correctAnswer, difficulty, questionCategory } = req.body;
    
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }
    if (quiz.status === "Closed") {
      return res.status(400).json({ success: false, message: "Cannot add questions to a closed quiz" });
    }

    if (!quizId || !questionText || !questionCategory) {
      return res.status(400).json({ success: false, message: "Quiz ID, Question Text and Category are required" });
    }

    if (type !== "logical") {
      if (!options || options.length < 2 || !correctAnswer) {
        return res.status(400).json({ success: false, message: "For regular MCQ questions, at least two options and a correct answer are required" });
      }
    }

    const question = await Question.create({
      quizId,
      questionText,
      type: type || "theoretical",
      starterCode: starterCode || "",
      options: options || [],
      correctAnswer: correctAnswer || "",
      difficulty: difficulty || "Medium",
      questionCategory
    });
    res.status(201).json({ success: true, data: question });
  } catch (error) {
    next(error);
  }
};

export const getQuestionsForQuiz = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const questions = await Question.find({ quizId }).sort("-createdAt");
    res.status(200).json({ success: true, data: questions });
  } catch (error) {
    next(error);
  }
};

// --- RESULTS ---
export const getAllResults = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const results = await QuizResult.find().populate("userId").populate("quizId").sort("-createdAt").skip(skip).limit(limit);
    const total = await QuizResult.countDocuments();

    res.status(200).json({ 
      success: true, 
      data: results,
      pagination: { total, page, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
};

export const updateResultScore = async (req, res, next) => {
  try {
    const { resultId } = req.params;
    const { questionId, isCorrect } = req.body;

    const result = await QuizResult.findById(resultId);
    if (!result) return res.status(404).json({ success: false, message: "Result not found" });

    let correctCount = 0;
    let wrongCount = 0;
    let unattemptedCount = 0;

    result.detailedAnswers.forEach(ans => {
      // Update the specific question's correctness
      if (ans.questionId.toString() === questionId.toString()) {
        ans.isCorrect = isCorrect;
      }

      // Tally the counts
      if (ans.isCorrect === true) correctCount++;
      else if (ans.isCorrect === false) wrongCount++;
      else unattemptedCount++;
    });

    result.correct = correctCount;
    result.wrong = wrongCount;
    result.unattempted = unattemptedCount;
    
    // Total scorable questions are the total minus the logical questions that haven't been graded yet
    // Actually, it's simpler: total scorable is just the total questions (both MCQ and Logical).
    // The percentage is based on the TOTAL number of questions in the quiz.
    result.percentage = Math.round((correctCount / result.total) * 100);

    await result.save();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

// --- REATTEMPTS ---
export const getAllReattempts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const requests = await Reattempt.find()
      .populate("userId", "name email")
      .populate("quizId", "title")
      .sort("-createdAt")
      .skip(skip)
      .limit(limit);
      
    const total = await Reattempt.countDocuments();

    res.status(200).json({ 
      success: true, 
      data: requests,
      pagination: { total, page, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
};

export const updateReattemptStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const request = await Reattempt.findById(id);
    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    if (status === "Approved") {
      await QuizResult.deleteOne({ userId: request.userId, quizId: request.quizId });
    }

    request.status = status;
    await request.save();

    res.status(200).json({ success: true, data: request });
  } catch (error) {
    next(error);
  }
};

// --- USERS ---
export const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    const adminRole = await Role.findOne({ title: "Admin" });

    let query = {};
    if (adminRole) {
      query.role = { $ne: adminRole._id };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { idNo: { $regex: search, $options: "i" } }
      ];
    }

    const users = await User.find(query).populate("role").sort("-createdAt").skip(skip).limit(limit);
    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: users,
      pagination: { total, page, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    
    // Also delete user's results and reattempts
    await QuizResult.deleteMany({ userId: id });
    await Reattempt.deleteMany({ userId: id });

    res.status(200).json({ success: true, message: "User and related data deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// --- DELETE QUIZ ---
export const deleteQuiz = async (req, res, next) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findByIdAndDelete(id);
    if (!quiz) return res.status(404).json({ success: false, message: "Quiz not found" });
    
    // Cascade delete
    await Question.deleteMany({ quizId: id });
    await QuizResult.deleteMany({ quizId: id });
    await Reattempt.deleteMany({ quizId: id });

    res.status(200).json({ success: true, message: "Quiz and related data deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// --- DELETE REATTEMPT ---
export const deleteReattempt = async (req, res, next) => {
  try {
    const { id } = req.params;
    const request = await Reattempt.findByIdAndDelete(id);
    if (!request) return res.status(404).json({ success: false, message: "Request not found" });

    res.status(200).json({ success: true, message: "Reattempt request deleted" });
  } catch (error) {
    next(error);
  }
};

