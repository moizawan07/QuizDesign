import mongoose from "mongoose";

const QuizSchema = new mongoose.Schema(
  {
    head: {
      type: String,
      required: [true, "Quiz head (e.g., Software Engineering) is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Quiz category (e.g., MERN) is required"],
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Quiz title is required"],
      trim: true,
    },
    stack: {
      type: String,
      default: "General"
    },
    numberOfQuestions: {
      type: Number,
      default: 0
    },
    timeLimit: {
      type: Number,
      required: [true, "Time limit in minutes is required"],
      min: 1,
    },
    bonusPoints: {
      type: [Number],
      default: [0, 0, 0]
    },
    status: {
      type: String,
      enum: ["Open", "Closed"],
      default: "Open"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Quiz", QuizSchema);
