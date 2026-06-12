import mongoose from "mongoose";
import fs from "fs";
import dotenv from "dotenv";

import User from "./models/User.js";
import Quiz from "./models/Quiz.js";
import Question from "./models/Question.js";
import QuizResult from "./models/QuizResult.js";

dotenv.config();

const importData = async () => {
  try {
    console.log("Connecting to Database...");
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Reading from 'db_data.json'...");
    const fileData = fs.readFileSync("db_data.json", "utf-8");
    const dbData = JSON.parse(fileData);

    console.log("Clearing existing database collections...");
    await User.deleteMany({});
    await Quiz.deleteMany({});
    await Question.deleteMany({});
    await QuizResult.deleteMany({});

    console.log("Inserting fake/updated data...");
    if (dbData.users && dbData.users.length > 0) await User.insertMany(dbData.users);
    
    if (dbData.quizzes && dbData.quizzes.length > 0) {
       const patchedQuizzes = dbData.quizzes.map(q => ({
           ...q,
           category: q.category || "General Knowledge",
           head: q.head || "General Assessment"
       }));
       await Quiz.insertMany(patchedQuizzes);
    }
    
    if (dbData.questions && dbData.questions.length > 0) {
       const patchedQuestions = dbData.questions.map(q => ({
           ...q,
           questionCategory: q.questionCategory || "General"
       }));
       await Question.insertMany(patchedQuestions);
    }
    
    if (dbData.results && dbData.results.length > 0) await QuizResult.insertMany(dbData.results);

    console.log("✅ Data Imported Successfully! Your DB is fully loaded.");
    process.exit();
  } catch (error) {
    console.error("❌ Error importing data:", error);
    process.exit(1);
  }
};

importData();
