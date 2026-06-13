import Quiz from "../models/Quiz.js";
import QuizResult from "../models/QuizResult.js";
import Question from "../models/Question.js";
import Reattempt from "../models/Reattempt.js";
import User from "../models/User.js";
import mongoose from "mongoose";
import Role from "../models/Role.js";

// --- QUIZZES ---
export const createQuiz = async (req, res, next) => {
  try {
    const { head, category, title, timeLimit, bonusPoints } = req.body;
    if (!head || !category || !title || !timeLimit) {
      return res.status(400).json({ success: false, message: "Head, category, title, and time limit are required" });
    }
    const quiz = await Quiz.create({
      head,
      category,
      title,
      timeLimit,
      bonusPoints: bonusPoints || [0, 0, 0],
      stack: "General", // Keeping for backward compatibility if needed, or remove
      numberOfQuestions: 0 // Will be derived from actual questions
    });
    res.status(201).json({ success: true, data: quiz });
  } catch (error) {
    next(error);
  }
};

export const updateQuiz = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { head, category, title, timeLimit, bonusPoints } = req.body;
    
    if (!head || !category || !title || !timeLimit) {
      return res.status(400).json({ success: false, message: "Head, category, title, and time limit are required" });
    }

    const quiz = await Quiz.findByIdAndUpdate(
      id,
      { head, category, title, timeLimit, bonusPoints: bonusPoints || [0, 0, 0] },
      { new: true, runValidators: true }
    );

    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }

    res.status(200).json({ success: true, data: quiz });
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

export const getQuizById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }
    const count = await Question.countDocuments({ quizId: quiz._id });
    res.status(200).json({ success: true, data: { ...quiz.toObject(), numberOfQuestions: count } });
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

export const createQuestionsBulk = async (req, res, next) => {
  try {
    const { quizId, questions } = req.body;
    
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }
    if (quiz.status === "Closed") {
      return res.status(400).json({ success: false, message: "Cannot add questions to a closed quiz" });
    }

    if (!quizId || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ success: false, message: "Quiz ID and an array of questions are required" });
    }

    const validatedQuestions = [];
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText || !q.questionCategory) {
        return res.status(400).json({ success: false, message: `Question at index ${i} is missing questionText or questionCategory.` });
      }
      
      const type = q.type || "theoretical";
      let filteredOptions = [];
      let correctAnswer = q.correctAnswer || "";

      if (type === "theoretical") {
        if (!q.options || !Array.isArray(q.options) || q.options.length < 2) {
          return res.status(400).json({ success: false, message: `Question at index ${i} must have at least 2 options.` });
        }
        filteredOptions = q.options.filter(o => o && o.toString().trim() !== "");
        if (filteredOptions.length < 2) {
          return res.status(400).json({ success: false, message: `Question at index ${i} has fewer than 2 non-empty options.` });
        }
        if (!correctAnswer) {
          return res.status(400).json({ success: false, message: `Question at index ${i} requires a correctAnswer.` });
        }
        if (!filteredOptions.includes(correctAnswer)) {
          return res.status(400).json({ success: false, message: `Question at index ${i} has a correctAnswer that does not match any option.` });
        }
      }

      validatedQuestions.push({
        quizId,
        questionText: q.questionText,
        type,
        starterCode: q.starterCode || "",
        options: filteredOptions,
        correctAnswer,
        difficulty: q.difficulty || "Medium",
        questionCategory: q.questionCategory
      });
    }

    const createdQuestions = await Question.insertMany(validatedQuestions);
    res.status(201).json({ success: true, data: createdQuestions });
  } catch (error) {
    next(error);
  }
};

export const getQuestionsForQuiz = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const questions = await Question.find({ quizId }).sort("createdAt").lean();
    
    // Fetch all VALID quiz results to calculate statistics
    const results = await QuizResult.find({ quizId, isInvalidated: { $ne: true } }).lean();
    
    const statsMap = {};
    questions.forEach(q => {
      statsMap[q._id.toString()] = { correct: 0, wrong: 0, unattempted: 0, total: 0 };
    });

    results.forEach(result => {
      if (result.detailedAnswers) {
        result.detailedAnswers.forEach(ans => {
          const qId = ans.questionId?.toString();
          if (qId && statsMap[qId]) {
            statsMap[qId].total++;
            if (ans.isCorrect === true) statsMap[qId].correct++;
            else if (ans.isCorrect === false) statsMap[qId].wrong++;
            else statsMap[qId].unattempted++;
          }
        });
      }
    });

    const enrichedQuestions = questions.map(q => ({
      ...q,
      stats: statsMap[q._id.toString()]
    }));

    res.status(200).json({ success: true, data: enrichedQuestions });
  } catch (error) {
    next(error);
  }
};

export const updateQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { questionText, type, starterCode, options, correctAnswer, difficulty, questionCategory } = req.body;
    
    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found" });
    }
    
    const quiz = await Quiz.findById(question.quizId);
    if (quiz && quiz.status === "Closed") {
      return res.status(400).json({ success: false, message: "Cannot edit questions of a closed quiz" });
    }

    question.questionText = questionText || question.questionText;
    question.type = type || question.type;
    question.starterCode = starterCode !== undefined ? starterCode : question.starterCode;
    question.options = options || question.options;
    question.correctAnswer = correctAnswer || question.correctAnswer;
    question.difficulty = difficulty || question.difficulty;
    question.questionCategory = questionCategory || question.questionCategory;

    await question.save();
    res.status(200).json({ success: true, data: question });
  } catch (error) {
    next(error);
  }
};

export const deleteQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found" });
    }

    const quiz = await Quiz.findById(question.quizId);
    if (quiz && quiz.status === "Closed") {
      return res.status(400).json({ success: false, message: "Cannot delete questions of a closed quiz" });
    }

    await question.deleteOne();
    res.status(200).json({ success: true, message: "Question deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const deleteQuestionsBulk = async (req, res, next) => {
  try {
    const { questionIds } = req.body;
    if (!Array.isArray(questionIds) || questionIds.length === 0) {
      return res.status(400).json({ success: false, message: "An array of question IDs is required" });
    }

    const sampleQuestion = await Question.findById(questionIds[0]);
    if (sampleQuestion) {
      const quiz = await Quiz.findById(sampleQuestion.quizId);
      if (quiz && quiz.status === "Closed") {
        return res.status(400).json({ success: false, message: "Cannot delete questions of a closed quiz" });
      }
    }

    await Question.deleteMany({ _id: { $in: questionIds } });
    res.status(200).json({ success: true, message: "Selected questions deleted successfully" });
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
    const quizId = req.query.quizId;

    let filter = { isInvalidated: { $ne: true } };
    if (quizId && quizId !== "all") {
      filter.quizId = quizId;
    }

    const results = await QuizResult.find(filter)
      .populate("userId")
      .populate("quizId")
      .sort("-createdAt")
      .skip(skip)
      .limit(limit);
    const total = await QuizResult.countDocuments(filter);

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

    let theoryCorrect = 0;
    let theoryWrong = 0;
    let theoryUnattempted = 0;
    let logicalScore = 0;
    let allLogicalGraded = true;

    result.detailedAnswers.forEach(ans => {
      // Update the specific question's correctness
      if (ans.questionId.toString() === questionId.toString()) {
        ans.isCorrect = isCorrect;
      }

      // Tally theory vs logical
      if (ans.type === "logical") {
        if (ans.isCorrect === true) {
          logicalScore++;
        }
        if (ans.isCorrect === null || ans.isCorrect === undefined) {
          allLogicalGraded = false;
        }
      } else {
        if (ans.isCorrect === true) theoryCorrect++;
        else if (ans.isCorrect === false) theoryWrong++;
        else theoryUnattempted++;
      }
    });

    result.theoryCorrect = theoryCorrect;
    result.theoryWrong = theoryWrong;
    result.theoryUnattempted = theoryUnattempted;
    result.logicalScore = logicalScore;
    
    // Check if fully graded
    if (result.logicalTotal > 0) {
      result.isGraded = allLogicalGraded;
    } else {
      result.isGraded = true;
    }

    // Overall percentage based on both
    const totalPointsEarned = theoryCorrect + logicalScore;
    result.overallPercentage = result.total > 0 ? Math.round((totalPointsEarned / result.total) * 100) : 0;

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
      await QuizResult.updateMany(
        { userId: request.userId, quizId: request.quizId },
        { $set: { isInvalidated: true } }
      );
    } else {
      await QuizResult.updateMany(
        { userId: request.userId, quizId: request.quizId },
        { $set: { isInvalidated: false } }
      );
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

// --- DELETE QUIZ RESULT ---
export const deleteResult = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await QuizResult.findByIdAndDelete(id);
    if (!result) return res.status(404).json({ success: false, message: "Quiz result not found" });

    res.status(200).json({ success: true, message: "Quiz result deleted successfully" });
  } catch (error) {
    next(error);
  }
};
// --- DASHBOARD STATS ---
export const getDashboardStats = async (req, res, next) => {
  try {
    const { quizId } = req.query;
    
    let filter = {};
    if (quizId && quizId !== "all") {
      filter.quizId = new mongoose.Types.ObjectId(quizId);
    }

    let activeQuizzesCount = 0;
    if (quizId && quizId !== "all") {
      activeQuizzesCount = await Quiz.countDocuments({ _id: filter.quizId, status: "Open" });
    } else {
      activeQuizzesCount = await Quiz.countDocuments({ status: "Open" });
    }

    const pipeline = [];
    if (quizId && quizId !== "all") {
      pipeline.push({ $match: filter });
    }
    
    pipeline.push({
      $group: {
        _id: null,
        totalSubmissions: { $sum: 1 },
        avgScore: { $avg: { $ifNull: ["$overallPercentage", "$percentage"] } }
      }
    });

    const stats = await QuizResult.aggregate(pipeline);
    
    let totalSubmissions = 0;
    let averageScore = 0;

    if (stats.length > 0) {
      totalSubmissions = stats[0].totalSubmissions;
      averageScore = Math.round(stats[0].avgScore || 0);
    }

    res.status(200).json({
      success: true,
      data: {
        totalSubmissions,
        averageScore,
        activeQuizzes: activeQuizzesCount
      }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteQuizzesBulk = async (req, res, next) => {
  try {
    const { quizIds } = req.body;
    if (!Array.isArray(quizIds) || quizIds.length === 0) {
      return res.status(400).json({ success: false, message: "An array of quiz IDs is required" });
    }

    // Validate IDs
    const allValid = quizIds.every(id => mongoose.Types.ObjectId.isValid(id));
    if (!allValid) {
      return res.status(400).json({ success: false, message: "One or more quiz IDs are invalid" });
    }

    const deleteQuizzesResult = await Quiz.deleteMany({ _id: { $in: quizIds } });
    const deleteQuestionsResult = await Question.deleteMany({ quizId: { $in: quizIds } });
    const deleteResultsResult = await QuizResult.deleteMany({ quizId: { $in: quizIds } });
    const deleteReattemptsResult = await Reattempt.deleteMany({ quizId: { $in: quizIds } });

    res.status(200).json({ 
      success: true, 
      message: "Quizzes and related data deleted successfully",
      data: {
        deletedQuizzesCount: deleteQuizzesResult.deletedCount,
        deletedQuestionsCount: deleteQuestionsResult.deletedCount,
        deletedResultsCount: deleteResultsResult.deletedCount,
        deletedReattemptsCount: deleteReattemptsResult.deletedCount
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateQuizzesStatusBulk = async (req, res, next) => {
  try {
    const { quizIds, status } = req.body;
    if (!Array.isArray(quizIds) || quizIds.length === 0 || !status) {
      return res.status(400).json({ success: false, message: "Quiz IDs and status are required" });
    }

    if (!["Open", "Closed"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value. Must be 'Open' or 'Closed'" });
    }

    // Validate IDs
    const allValid = quizIds.every(id => mongoose.Types.ObjectId.isValid(id));
    if (!allValid) {
      return res.status(400).json({ success: false, message: "One or more quiz IDs are invalid" });
    }

    const updateQuizzesResult = await Quiz.updateMany({ _id: { $in: quizIds } }, { status });

    res.status(200).json({ 
      success: true, 
      message: "Quizzes status updated successfully",
      data: {
        updatedQuizzesCount: updateQuizzesResult.modifiedCount || updateQuizzesResult.nModified || 0
      }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUsersBulk = async (req, res, next) => {
  try {
    const { userIds } = req.body;
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ success: false, message: "An array of user IDs is required" });
    }

    // Validate IDs
    const allValid = userIds.every(id => mongoose.Types.ObjectId.isValid(id));
    if (!allValid) {
      return res.status(400).json({ success: false, message: "One or more user IDs are invalid" });
    }

    // Protect admin users
    const adminRole = await Role.findOne({ title: "Admin" });
    const query = { _id: { $in: userIds } };
    if (adminRole) {
      query.role = { $ne: adminRole._id };
    }

    const deleteUsersResult = await User.deleteMany(query);
    const deleteResultsResult = await QuizResult.deleteMany({ userId: { $in: userIds } });
    const deleteReattemptsResult = await Reattempt.deleteMany({ userId: { $in: userIds } });

    res.status(200).json({ 
      success: true, 
      message: "Users and related data deleted successfully",
      data: {
        deletedUsersCount: deleteUsersResult.deletedCount,
        deletedResultsCount: deleteResultsResult.deletedCount,
        deletedReattemptsCount: deleteReattemptsResult.deletedCount
      }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteResultsBulk = async (req, res, next) => {
  try {
    const { resultIds } = req.body;
    if (!Array.isArray(resultIds) || resultIds.length === 0) {
      return res.status(400).json({ success: false, message: "An array of result IDs is required" });
    }

    // Validate IDs
    const allValid = resultIds.every(id => mongoose.Types.ObjectId.isValid(id));
    if (!allValid) {
      return res.status(400).json({ success: false, message: "One or more result IDs are invalid" });
    }

    const deleteResultsResult = await QuizResult.deleteMany({ _id: { $in: resultIds } });

    res.status(200).json({ 
      success: true, 
      message: "Selected results deleted successfully",
      data: {
        deletedResultsCount: deleteResultsResult.deletedCount
      }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReattemptsBulk = async (req, res, next) => {
  try {
    const { reattemptIds } = req.body;
    if (!Array.isArray(reattemptIds) || reattemptIds.length === 0) {
      return res.status(400).json({ success: false, message: "An array of reattempt request IDs is required" });
    }

    // Validate IDs
    const allValid = reattemptIds.every(id => mongoose.Types.ObjectId.isValid(id));
    if (!allValid) {
      return res.status(400).json({ success: false, message: "One or more reattempt IDs are invalid" });
    }

    const deleteReattemptsResult = await Reattempt.deleteMany({ _id: { $in: reattemptIds } });

    res.status(200).json({ 
      success: true, 
      message: "Selected requests deleted successfully",
      data: {
        deletedReattemptsCount: deleteReattemptsResult.deletedCount
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateReattemptsStatusBulk = async (req, res, next) => {
  try {
    const { reattemptIds, status } = req.body;
    if (!Array.isArray(reattemptIds) || reattemptIds.length === 0 || !status) {
      return res.status(400).json({ success: false, message: "Request IDs and status are required" });
    }

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value. Must be 'Approved' or 'Rejected'" });
    }

    // Validate IDs
    const allValid = reattemptIds.every(id => mongoose.Types.ObjectId.isValid(id));
    if (!allValid) {
      return res.status(400).json({ success: false, message: "One or more reattempt request IDs are invalid" });
    }

    const updateReattemptsResult = await Reattempt.updateMany({ _id: { $in: reattemptIds } }, { status });
    
    if (status === "Approved") {
      const requests = await Reattempt.find({ _id: { $in: reattemptIds } });
      for (const reqObj of requests) {
        await QuizResult.deleteMany({ userId: reqObj.userId, quizId: reqObj.quizId });
      }
    }
    
    res.status(200).json({ 
      success: true, 
      message: "Reattempts status updated successfully",
      data: {
        updatedReattemptsCount: updateReattemptsResult.modifiedCount || updateReattemptsResult.nModified || 0
      }
    });
  } catch (error) {
    next(error);
  }
};
