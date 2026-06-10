import Quiz from "../models/Quiz.js";
import QuizResult from "../models/QuizResult.js";
import Question from "../models/Question.js";

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
    const quizzes = await Quiz.find().sort("-createdAt");
    // Also attach question counts
    const enrichedQuizzes = await Promise.all(quizzes.map(async (q) => {
      const count = await Question.countDocuments({ quizId: q._id });
      return { ...q.toObject(), numberOfQuestions: count };
    }));
    res.status(200).json({ success: true, data: enrichedQuizzes });
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
    const { quizId, questionText, options, correctAnswer, difficulty, questionCategory, isLogical, testCases, functionName } = req.body;
    
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

    if (!isLogical) {
      if (!options || options.length < 2 || !correctAnswer) {
        return res.status(400).json({ success: false, message: "For regular MCQ questions, at least two options and a correct answer are required" });
      }
    }

    const question = await Question.create({
      quizId,
      questionText,
      options: options || [],
      correctAnswer: correctAnswer || "",
      difficulty: difficulty || "Medium",
      questionCategory,
      isLogical: !!isLogical,
      testCases: testCases || [],
      functionName: functionName || ""
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
    const results = await QuizResult.find().sort("-createdAt");
    res.status(200).json({ success: true, data: results });
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

    const updatedAnswers = result.detailedAnswers.map(ans => {
      if (ans.questionId === questionId) {
        ans.isCorrect = isCorrect;
      }
      if (ans.isCorrect === true) correctCount++;
      else if (ans.isCorrect === false) wrongCount++;
      else unattemptedCount++;
      return ans;
    });

    result.detailedAnswers = updatedAnswers;
    result.correct = correctCount;
    result.wrong = wrongCount;
    result.unattempted = unattemptedCount;
    result.percentage = Math.round((correctCount / result.total) * 100);

    await result.save();

    res.status(200).json({ success: true, data: result, message: "Grade updated successfully" });
  } catch (error) {
    next(error);
  }
};
