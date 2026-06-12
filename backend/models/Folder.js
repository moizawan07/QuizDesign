import mongoose from "mongoose";

const FolderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Folder name is required"],
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Folder", FolderSchema);
