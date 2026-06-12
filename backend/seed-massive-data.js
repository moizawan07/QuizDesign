import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";
import Quiz from "./models/Quiz.js";
import Question from "./models/Question.js";
import QuizResult from "./models/QuizResult.js";
import Role from "./models/Role.js";

dotenv.config();

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomArr = (arr) => arr[randomInt(0, arr.length - 1)];

const firstNames = ["Humza", "Moiz", "Ali", "Ahmed", "Sara", "Fatima", "Ayesha", "Zainab", "Umar", "Usman", "Bilal", "Tariq", "Kamran", "Salman", "Nabeel", "Fahad", "Zeeshan", "Kashif", "Imran", "Hassan", "Hussain", "Junaid", "Saad", "Waqas", "Asad", "Haris", "Hamza", "Abdullah", "Aamir", "Adeel", "Daniyal", "Farhan", "Raza", "Shoaib", "Talha", "Yasir", "Waleed", "Hiba", "Iqra", "Kiran", "Maha", "Nida", "Sana", "Sadia"];
const lastNames = ["Rehman", "Awan", "Khan", "Syed", "Sheikh", "Qureshi", "Malik", "Chaudhry", "Ansari", "Baig", "Butt", "Dar", "Farooqi", "Gondal", "Hashmi", "Iqbal", "Jadoon", "Kashmiri", "Lodhi", "Mirza", "Niazi", "Pasha", "Rana", "Shah", "Tariq", "Usmani", "Virk", "Waseem", "Yousaf", "Zaidi", "Zubairi"];
const heads = ["Google Hiring", "Microsoft Internships", "Midterm Evaluation", "Final Exam", "HR Recruitment", "Bootcamp Screening", "General Assessment", "Tech Lead Interview", "React Developer Screening", "MERN Stack Test"];
const categories = ["Software Engineering", "Data Science", "Business Administration", "Design & UI/UX", "Marketing", "General Knowledge", "Information Technology", "Human Resources", "Other"];

const seedMassiveData = async () => {
    try {
        console.log("Connecting to Database...");
        await mongoose.connect(process.env.MONGODB_URI);
        
        let userRole = await Role.findOne({ title: "User" });
        if (!userRole) {
            userRole = await Role.create({ title: "User", permissions: ["TAKE_QUIZ"] });
        }

        console.log("Generating VERY MASSIVE Fake Data directly into Database...");
        
        const fakeUsers = [];
        const defaultPassword = await bcryptjs.hash("123456", 10);
        
        console.log("1. Creating 500 Fake Users...");
        for (let i = 0; i < 500; i++) {
            fakeUsers.push({
                name: `${randomArr(firstNames)} ${randomArr(lastNames)}`,
                email: `student${randomInt(100000, 9999999)}@example.com`,
                idNo: `ID-${Math.random().toString(36).substring(2, 10)}-${i}`,
                password: defaultPassword,
                role: userRole._id,
                quizAttempt: true,
                createdAt: new Date(Date.now() - randomInt(10000000, 10000000000))
            });
        }
        const insertedUsers = await User.insertMany(fakeUsers);

        console.log("2. Creating 50 Fake Quizzes...");
        const fakeQuizzes = [];
        for (let i = 0; i < 50; i++) {
            fakeQuizzes.push({
                title: `Professional Assessment Batch ${randomInt(100, 999)}`,
                head: randomArr(heads),
                category: randomArr(categories),
                timeLimit: randomArr([5, 10, 15, 20, 30, 45, 60]),
                status: randomArr(["Open", "Closed", "Open"]),
                createdAt: new Date(Date.now() - randomInt(10000000, 5000000000))
            });
        }
        const insertedQuizzes = await Quiz.insertMany(fakeQuizzes);

        console.log("3. Creating 500 Fake Questions...");
        const fakeQuestions = [];
        insertedQuizzes.forEach(quiz => {
            for (let i = 0; i < 10; i++) {
                const options = [`Option A ${i}`, `Option B ${i}`, `Option C ${i}`, `Option D ${i}`];
                fakeQuestions.push({
                    quizId: quiz._id,
                    questionText: `What is the correct answer for technical question #${i+1}?`,
                    options,
                    correctAnswer: options[randomInt(0, 3)],
                    difficulty: randomArr(["Easy", "Medium", "Hard"]),
                    questionCategory: quiz.category,
                    createdAt: quiz.createdAt
                });
            }
        });
        const insertedQuestions = await Question.insertMany(fakeQuestions);

        console.log("4. Creating 3000 Fake Quiz Results (Wait for a few seconds)...");
        const fakeResults = [];
        for (let i = 0; i < 3000; i++) {
            const user = randomArr(insertedUsers);
            const quiz = randomArr(insertedQuizzes);
            const quizQuestions = insertedQuestions.filter(q => q.quizId.toString() === quiz._id.toString());
            
            if (quizQuestions.length === 0) continue;
            
            let correct = 0;
            let wrong = 0;
            let unattempted = 0;
            
            const detailedAnswers = quizQuestions.map(q => {
                const state = randomArr(["correct", "correct", "wrong", "unattempted"]); 
                let isCorrect = null;
                let selectedOption = "";
                
                if (state === "correct") {
                    correct++;
                    isCorrect = true;
                    selectedOption = q.correctAnswer;
                } else if (state === "wrong") {
                    wrong++;
                    isCorrect = false;
                    selectedOption = (q.options && q.options.length) ? (q.options[0] !== q.correctAnswer ? q.options[0] : q.options[1]) : "";
                } else {
                    unattempted++;
                }
                
                return {
                    questionId: q._id,
                    questionText: q.questionText,
                    selectedOption,
                    correctAnswer: q.correctAnswer,
                    isCorrect
                };
            });

            fakeResults.push({
                userId: user._id,
                quizId: quiz._id,
                correct,
                wrong,
                unattempted,
                total: quizQuestions.length,
                percentage: Math.round((correct / quizQuestions.length) * 100),
                timeTaken: randomInt(30, quiz.timeLimit * 60 || 300),
                tabViolations: randomArr([0, 0, 0, 1, 0, 2]),
                note: randomArr(["Submitted", "Submitted", "Time Ended", "Tab Violation"]),
                detailedAnswers,
                completedAt: new Date(Date.now() - randomInt(10000, 2000000000))
            });
        }
        
        // Insert results in chunks to avoid memory issues
        const chunkSize = 500;
        for (let i = 0; i < fakeResults.length; i += chunkSize) {
            const chunk = fakeResults.slice(i, i + chunkSize);
            await QuizResult.insertMany(chunk);
        }

        console.log(`\n✅ BOOM! Massive Fake Data Inserted Successfully!`);
        console.log(`- 🧑‍🎓 Added 500 Fake Users`);
        console.log(`- 📝 Added 50 Fake Quizzes`);
        console.log(`- ❓ Added 500 Fake Questions`);
        console.log(`- 📊 Added 3000 Fake Quiz Results`);
        console.log("\nAap apna admin panel refresh karein aur check karein!");
        
        process.exit();
    } catch (error) {
        console.error("Error generating data:", error);
        process.exit(1);
    }
};

seedMassiveData();
