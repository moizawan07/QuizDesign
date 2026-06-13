import mongoose from "mongoose";

const QuizResultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: [true, "Quiz ID is required"],
    },
    correct: { type: Number, default: 0 },
    wrong: { type: Number, default: 0 },
    unattempted: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    completedAt: { type: Date, default: Date.now },
    timeTaken: { type: Number, default: 0 },
    bonusTimeUsed: { type: Number, default: 0 },
    tabViolations: { type: Number, default: 0 },
    isInvalidated: { type: Boolean, default: false },
    note: { type: String, default: "Manual submit" },
    detailedAnswers: [
      {
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
        questionText: String,
        selectedOption: String,
        correctAnswer: String,
        isCorrect: Boolean,
      }
    ]
  },
  { timestamps: true }
);

QuizResultSchema.pre(/^find/, function (next) {
  if (this.options._recursed) {
    return next();
  }
  this.populate("userId").populate("quizId");
  next();
});

export default mongoose.model("QuizResult", QuizResultSchema);
