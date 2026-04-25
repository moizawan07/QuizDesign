import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    idNo: {
      type: String,
      required: [true, "ID No is required"],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email"],
      lowercase: true,
    },
    professional: {
      type: String,
      enum: ["Web Development", "UI UX"],
      required: [true, "Professional field is required"],
    },
    quizAttempt: {
        type: Boolean,
        default: false
    }
    
  },
  { timestamps: true }
);


export default mongoose.model("User", UserSchema);
