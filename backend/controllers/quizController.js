import QuizResult from "../models/QuizResult.js";
import User from "../models/User.js";

export const submitQuiz = async (req, res) => {
  try {
      const userId = req.user.id;
      const { correct, wrong, unattempted, total, percentage, completedAt, timeTaken, note } = req.body;

     // check if already attempted
    const user = await User.findById(userId);

    if(!user){
        return res.status(404).json({message: 'user not found'})
    }

    if (user.quizAttempt) {
      return res.status(400).json({
        message: "You already attempted the quiz"
      });
    }


    // Validation
    if (correct === undefined || wrong === undefined || unattempted === undefined || total === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required quiz data",
      });
    }

    // Create quiz result
    const quizResult = await QuizResult.create({
      userId,
      correct,
      wrong,
      unattempted,
      total,
      percentage,
      completedAt,
      timeTaken,
      note,
    });

      // mark quiz as attempted
    await User.findByIdAndUpdate(userId, {
      quizAttempt: true
    });

    res.status(201).json({
      success: true,
      quizResult,
      message: "Quiz submitted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getAllResults = async (req, res) => {
  try {
    const results = await QuizResult.find()
      .populate("userId")
      .sort({ completedAt: -1 });

    res.status(200).json({
      success: true,
      results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
