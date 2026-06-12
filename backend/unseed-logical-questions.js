import mongoose from "mongoose";
import dotenv from "dotenv";
import Question from "./models/Question.js";

dotenv.config();

const unseedLogicalQuestions = async () => {
    try {
        console.log("Connecting to Database...");
        await mongoose.connect(process.env.MONGODB_URI);
        
        console.log("Removing the seeded global logical questions...");
        const res = await Question.deleteMany({ isLogical: true, quizId: { $exists: false } });
        console.log(`Deleted ${res.deletedCount} questions.`);

        console.log(`\n✅ Successfully unseeded global logical questions!`);
        process.exit();
    } catch (error) {
        console.error("Error generating data:", error);
        process.exit(1);
    }
};

unseedLogicalQuestions();
