import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: [true, "Quiz ID is required"],
    },
    questionText: {
      type: String,
      required: [true, "Question text is required"],
    },
    options: {
      type: [String],
      default: []
    },
    correctAnswer: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      enum: ["theoretical", "logical"],
      default: "theoretical"
    },
    starterCode: {
      type: String,
      default: ""
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },
    questionCategory: {
      type: String,
      required: [true, "Question category (e.g., Node.js) is required"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Question", QuestionSchema);
