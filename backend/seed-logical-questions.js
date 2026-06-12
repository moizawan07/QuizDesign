import mongoose from "mongoose";
import dotenv from "dotenv";
import Question from "./models/Question.js";

dotenv.config();

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const categories = ["Algorithms", "Data Structures", "Logic Building", "Problem Solving", "System Design Patterns"];
const difficulty = ["Medium", "Hard", "Logical"];

const seedLogicalQuestions = async () => {
    try {
        console.log("Connecting to Database...");
        await mongoose.connect(process.env.MONGODB_URI);
        
        console.log("Clearing existing global logical questions...");
        await Question.deleteMany({ isLogical: true, quizId: { $exists: false } });

        console.log("Generating 1000 Global Logical Questions...");
        
        const fakeQuestions = [];
        for (let i = 0; i < 1000; i++) {
            fakeQuestions.push({
                questionText: `Write a robust JavaScript function to solve problem #${i+1}. You need to implement optimal logic.`,
                isLogical: true,
                difficulty: difficulty[randomInt(0, 2)],
                questionCategory: categories[randomInt(0, 4)],
                // Intentionally keeping options and correctAnswer empty
                options: [],
                correctAnswer: "",
            });
        }
        
        // Insert in chunks
        const chunkSize = 200;
        for (let i = 0; i < fakeQuestions.length; i += chunkSize) {
            const chunk = fakeQuestions.slice(i, i + chunkSize);
            await Question.insertMany(chunk);
        }

        console.log(`\n✅ Successfully Seeded 1000 Global Logical Questions!`);
        process.exit();
    } catch (error) {
        console.error("Error generating data:", error);
        process.exit(1);
    }
};

seedLogicalQuestions();
