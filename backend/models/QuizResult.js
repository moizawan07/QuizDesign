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
    total: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    completedAt: { type: Date, default: Date.now },
    timeTaken: { type: Number, default: 0 },
    bonusTimeUsed: { type: Number, default: 0 },
    tabViolations: { type: Number, default: 0 },
    isInvalidated: { type: Boolean, default: false },
    note: { type: String, default: "Manual submit" },
    theoryTotal: { type: Number, default: 0 },
    theoryCorrect: { type: Number, default: 0 },
    theoryWrong: { type: Number, default: 0 },
    theoryUnattempted: { type: Number, default: 0 },
    logicalTotal: { type: Number, default: 0 },
    logicalAttempted: { type: Number, default: 0 },
    logicalUnattempted: { type: Number, default: 0 },
    logicalScore: { type: Number, default: 0 }, // Score out of logicalTotal
    isGraded: { type: Boolean, default: false }, // True once admin grades logical questions
    overallPercentage: { type: Number, default: 0 },
    detailedAnswers: [
      {
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
        questionText: String,
        type: { type: String, default: "theoretical" },
        selectedOption: String,
        submittedCode: String,
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
