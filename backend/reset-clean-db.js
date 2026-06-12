import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Quiz from "./models/Quiz.js";
import Question from "./models/Question.js";
import QuizResult from "./models/QuizResult.js";
import Role from "./models/Role.js";

dotenv.config();

const cleanSeed = async () => {
    try {
        console.log("Connecting to Database...");
        await mongoose.connect(process.env.MONGODB_URI);
        
        console.log("Dropping all existing collections (Users, Quizzes, Questions, Results, Roles)...");
        await User.deleteMany({});
        await Quiz.deleteMany({});
        await Question.deleteMany({});
        await QuizResult.deleteMany({});
        await Role.deleteMany({});
        
        console.log("Creating Roles...");
        const adminRole = await Role.create({
            title: "Admin",
            permissions: ["MANAGE_QUIZZES", "VIEW_RESULTS", "MANAGE_USERS", "MANAGE_ROLES"]
        });

        const userRole = await Role.create({
            title: "User",
            permissions: ["TAKE_QUIZ"]
        });

        console.log("Creating Admin and a few Students...");
        
        await User.create({
            name: "Admin",
            email: "admin@quizpro.com",
            password: "admin123",
            role: adminRole._id,
            idNo: "ADMIN-001"
        });

        await User.create({ name: "Humza Rehman", email: "student1@example.com", password: "123456", role: userRole._id, idNo: "STU-001" });
        await User.create({ name: "Moiz Awan", email: "student2@example.com", password: "123456", role: userRole._id, idNo: "STU-002" });
        await User.create({ name: "Ali Khan", email: "student3@example.com", password: "123456", role: userRole._id, idNo: "STU-003" });

        console.log("Creating a few standard Quizzes...");
        const quiz1 = await Quiz.create({ title: "JavaScript Basics", head: "Frontend Evaluation", category: "Software Engineering", timeLimit: 5, status: "Open" });
        const quiz2 = await Quiz.create({ title: "React Fundamentals", head: "Frontend Evaluation", category: "Software Engineering", timeLimit: 10, status: "Open" });

        console.log("Creating normal MCQ Questions (No logical questions)...");
        await Question.create([
            {
                quizId: quiz1._id,
                questionText: "What is the output of typeof null?",
                options: ["undefined", "object", "null", "number"],
                correctAnswer: "object",
                difficulty: "Medium",
                questionCategory: "JavaScript"
            },
            {
                quizId: quiz1._id,
                questionText: "Which keyword is used to declare a constant in JS?",
                options: ["let", "var", "const", "constant"],
                correctAnswer: "const",
                difficulty: "Easy",
                questionCategory: "JavaScript"
            },
            {
                quizId: quiz1._id,
                questionText: "What does DOM stand for?",
                options: ["Document Object Model", "Data Object Model", "Document Oriented Model", "Data Oriented Model"],
                correctAnswer: "Document Object Model",
                difficulty: "Easy",
                questionCategory: "JavaScript"
            },
            {
                quizId: quiz2._id,
                questionText: "Which hook is used for side effects in React?",
                options: ["useState", "useEffect", "useRef", "useMemo"],
                correctAnswer: "useEffect",
                difficulty: "Easy",
                questionCategory: "React"
            },
            {
                quizId: quiz2._id,
                questionText: "Can React state be updated directly?",
                options: ["Yes", "No"],
                correctAnswer: "No",
                difficulty: "Easy",
                questionCategory: "React"
            }
        ]);

        console.log("\n✅ Database Reset Successfully!");
        console.log("-------------------------------------------------");
        console.log("Admin Email: admin@quizpro.com | Password: admin123");
        console.log("Student Email: student1@example.com | Password: 123456");
        console.log("-------------------------------------------------");
        process.exit();
    } catch (error) {
        console.error("Error resetting database:", error);
        process.exit(1);
    }
};

cleanSeed();
