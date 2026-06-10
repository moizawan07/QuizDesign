import mongoose from "mongoose";
import fs from "fs";
import dotenv from "dotenv";

import User from "./models/User.js";
import Quiz from "./models/Quiz.js";
import Question from "./models/Question.js";
import QuizResult from "./models/QuizResult.js";

dotenv.config();

const exportData = async () => {
  try {
    console.log("Connecting to Database...");
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log("Fetching data from all collections...");
    const users = await User.find({});
    const quizzes = await Quiz.find({});
    const questions = await Question.find({});
    const results = await QuizResult.find({});

    const dbData = {
      users,
      quizzes,
      questions,
      results
    };

    fs.writeFileSync("db_data.json", JSON.stringify(dbData, null, 2));
    console.log("✅ Data exported successfully to 'db_data.json'!");
    process.exit();
  } catch (error) {
    console.error("❌ Error exporting data:", error);
    process.exit(1);
  }
};

exportData();
