import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Role title is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    permissions: {
      type: [String], // e.g., ["MANAGE_QUIZZES", "VIEW_RESULTS", "TAKE_QUIZ", "MANAGE_USERS", "MANAGE_ROLES"]
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Role", RoleSchema);
