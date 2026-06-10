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
    isLogical: {
      type: Boolean,
      default: false
    },
    testCases: [{
      input: { type: String }, // JSON parsable string, e.g., "[2, 3]"
      expectedOutput: { type: String } // JSON parsable string, e.g., "5"
    }],
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard", "Logical"],
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
