import mongoose from "mongoose";

const QuizResultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    correct: {
      type: Number,
      required: [true, "Correct answer count is required"],
      default: 0,
    },
    wrong: {
      type: Number,
      required: [true, "Wrong answer count is required"],
      default: 0,
    },
    unattempted: {
      type: Number,
      required: [true, "Unattempted count is required"],
      default: 0,
    },
    total: {
      type: Number,
      required: [true, "Total questions is required"],
      default: 0,
    },
    percentage: {
      type: Number,
      required: [true, "Percentage is required"],
      default: 0,
    },
    completedAt: {
      type: Date,
      required: [true, "Completion time is required"],
      default: Date.now,
    },
    timeTaken: {
      type: Number,
      description: "Time taken to complete quiz in seconds",
      default: 0,
    },
    note: {
      type: String,
      description: "Any notes about the submission",
    },
  },
  { timestamps: true }
);

// Populate user details when fetching results
QuizResultSchema.pre(/^find/, function (next) {
  if (this.options._recursed) {
    return next();
  }
  this.populate("userId");
  next();
});

export default mongoose.model("QuizResult", QuizResultSchema);
