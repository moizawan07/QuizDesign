import mongoose from "mongoose";
import fs from "fs";
import bcrypt from "bcryptjs";

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomArr = (arr) => arr[randomInt(0, arr.length - 1)];

const firstNames = ["Humza", "Moiz", "Ali", "Ahmed", "Sara", "Fatima", "Ayesha", "Zainab", "Umar", "Usman", "Bilal", "Tariq", "Kamran", "Salman", "Nabeel", "Fahad", "Zeeshan", "Kashif", "Imran", "Hassan", "Hussain", "Junaid", "Saad", "Waqas", "Asad", "Haris", "Hamza", "Abdullah", "Aamir", "Adeel", "Daniyal", "Farhan", "Raza", "Shoaib", "Talha", "Yasir", "Waleed", "Hiba", "Iqra", "Kiran", "Maha", "Nida", "Sana", "Sadia"];
const lastNames = ["Rehman", "Awan", "Khan", "Syed", "Sheikh", "Qureshi", "Malik", "Chaudhry", "Ansari", "Baig", "Butt", "Dar", "Farooqi", "Gondal", "Hashmi", "Iqbal", "Jadoon", "Kashmiri", "Lodhi", "Mirza", "Niazi", "Pasha", "Rana", "Shah", "Tariq", "Usmani", "Virk", "Waseem", "Yousaf", "Zaidi", "Zubairi"];
const heads = ["Google Hiring", "Microsoft Internships", "Midterm Evaluation", "Final Exam", "HR Recruitment", "Bootcamp Screening", "General Assessment", "Tech Lead Interview", "React Developer Screening", "MERN Stack Test"];
const categories = ["Software Engineering", "Data Science", "Business Administration", "Design & UI/UX", "Marketing", "General Knowledge", "Information Technology", "Human Resources", "Other"];

const generateFakeData = async () => {
    console.log("Reading existing db_data.json...");
    let dbData = { users: [], quizzes: [], questions: [], results: [] };
    
    if (fs.existsSync("db_data.json")) {
        dbData = JSON.parse(fs.readFileSync("db_data.json", "utf-8"));
    }

    console.log("Generating BHT BHT SARA fake data...");
    
    const fakeUsers = [];
    const fakeQuizzes = [];
    const fakeQuestions = [];
    const fakeResults = [];
    
    // Create 200 Users
    console.log("Generating 200 Fake Users...");
    const defaultPassword = await bcrypt.hash("123456", 10);
    for (let i = 0; i < 200; i++) {
        const name = `${randomArr(firstNames)} ${randomArr(lastNames)}`;
        fakeUsers.push({
            _id: new mongoose.Types.ObjectId().toString(),
            name,
            email: `student${randomInt(1000, 99999)}@example.com`,
            password: defaultPassword,
            role: "User",
            createdAt: new Date(Date.now() - randomInt(10000000, 10000000000)).toISOString()
        });
    }

    // Create 30 Quizzes
    console.log("Generating 30 Fake Quizzes...");
    for (let i = 0; i < 30; i++) {
        fakeQuizzes.push({
            _id: new mongoose.Types.ObjectId().toString(),
            title: `Assessment Test Batch ${randomInt(1, 100)}`,
            head: randomArr(heads),
            category: randomArr(categories),
            timeLimit: randomArr([5, 10, 15, 20, 30, 45, 60]),
            status: randomArr(["Open", "Closed", "Open"]),
            createdAt: new Date(Date.now() - randomInt(10000000, 5000000000)).toISOString()
        });
    }

    // Create 10 Questions for each Quiz (300 Questions)
    console.log("Generating 300 Fake Questions...");
    fakeQuizzes.forEach(quiz => {
        for (let i = 0; i < 10; i++) {
            const isLogical = Math.random() > 0.8; 
            const options = isLogical ? [] : [`Option A ${i}`, `Option B ${i}`, `Option C ${i}`, `Option D ${i}`];
            fakeQuestions.push({
                _id: new mongoose.Types.ObjectId().toString(),
                quizId: quiz._id,
                questionText: isLogical ? `Write a JavaScript function to solve logical problem #${i+1}` : `What is the correct answer for question #${i+1}?`,
                options,
                correctAnswer: isLogical ? "" : options[randomInt(0, 3)],
                difficulty: randomArr(["Easy", "Medium", "Hard", "Logical"]),
                questionCategory: quiz.category,
                isLogical,
                testCases: isLogical ? [{ input: "1", expectedOutput: "2" }] : [],
                functionName: isLogical ? "solve" : "",
                createdAt: quiz.createdAt
            });
        }
    });

    // Create 2000 Quiz Results 
    console.log("Generating 2000 Fake Quiz Results...");
    for (let i = 0; i < 2000; i++) {
        // We can mix fake users and real users
        const allUsersPool = [...dbData.users, ...fakeUsers];
        const allQuizzesPool = [...dbData.quizzes, ...fakeQuizzes];
        const allQuestionsPool = [...dbData.questions, ...fakeQuestions];
        
        const user = randomArr(allUsersPool);
        const quiz = randomArr(allQuizzesPool);
        const quizQuestions = allQuestionsPool.filter(q => q.quizId === quiz._id);
        
        if (quizQuestions.length === 0) continue;
        
        // Prevent duplicate attempt for same user+quiz (basic check)
        if (fakeResults.find(r => r.userId === user._id && r.quizId === quiz._id)) continue;
        
        let correct = 0;
        let wrong = 0;
        let unattempted = 0;
        
        const detailedAnswers = quizQuestions.map(q => {
            const state = randomArr(["correct", "wrong", "unattempted", "correct"]); // Bias towards correct
            let isCorrect = null;
            let selectedOption = "";
            let userCode = "";
            
            if (state === "correct") {
                correct++;
                isCorrect = true;
                selectedOption = q.correctAnswer;
                if(q.isLogical) userCode = "function solve(a) {\n  return a * 2;\n}";
            } else if (state === "wrong") {
                wrong++;
                isCorrect = false;
                selectedOption = (q.options && q.options.length) ? (q.options[0] !== q.correctAnswer ? q.options[0] : q.options[1]) : "";
                if(q.isLogical) userCode = "function solve(a) {\n  // wrong logic\n  return 'wrong';\n}";
            } else {
                unattempted++;
            }
            
            return {
                questionId: q._id,
                questionText: q.questionText,
                selectedOption,
                userCode,
                correctAnswer: q.correctAnswer,
                isCorrect
            };
        });

        fakeResults.push({
            _id: new mongoose.Types.ObjectId().toString(),
            userId: user._id,
            quizId: quiz._id,
            correct,
            wrong,
            unattempted,
            total: quizQuestions.length,
            percentage: Math.round((correct / quizQuestions.length) * 100),
            timeTaken: randomInt(30, quiz.timeLimit * 60 || 300),
            tabViolations: randomArr([0, 0, 0, 1, 0, 2]),
            note: randomArr(["Submitted", "Submitted", "Submitted", "Time Ended", "Tab Violation"]),
            detailedAnswers,
            completedAt: new Date(Date.now() - randomInt(10000, 2000000000)).toISOString()
        });
    }

    dbData.users.push(...fakeUsers);
    dbData.quizzes.push(...fakeQuizzes);
    dbData.questions.push(...fakeQuestions);
    dbData.results.push(...fakeResults);

    fs.writeFileSync("db_data.json", JSON.stringify(dbData, null, 2));
    
    console.log(`\n✅ BOOM! Extremely Huge Fake Data Generated Successfully!`);
    console.log(`- 🧑‍🎓 Added ${fakeUsers.length} Fake Users`);
    console.log(`- 📝 Added ${fakeQuizzes.length} Fake Quizzes`);
    console.log(`- ❓ Added ${fakeQuestions.length} Fake Questions`);
    console.log(`- 📊 Added ${fakeResults.length} Fake Quiz Results`);
    console.log(`\nTotal Data inside JSON now:`);
    console.log(`- Users: ${dbData.users.length}`);
    console.log(`- Quizzes: ${dbData.quizzes.length}`);
    console.log(`- Questions: ${dbData.questions.length}`);
    console.log(`- Results: ${dbData.results.length}`);
    console.log("\nAb foran 'node import-db.js' chalayein aur jaadoo dekhein!");
};

generateFakeData();
