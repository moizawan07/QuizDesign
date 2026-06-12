import mongoose from "mongoose";
import dotenv from "dotenv";
import Quiz from "./models/Quiz.js";
import Question from "./models/Question.js";
import QuizResult from "./models/QuizResult.js";
import User from "./models/User.js";
import Role from "./models/Role.js";

dotenv.config();

const fakeData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing data
    await Quiz.deleteMany();
    await Question.deleteMany();
    await QuizResult.deleteMany();
    await User.deleteMany();
    await Role.deleteMany();

    console.log("Old data wiped out.");

    // Create Roles
    const adminRole = await Role.create({
      title: "Admin",
      description: "Super Administrator with full access",
      permissions: ["MANAGE_QUIZZES", "VIEW_RESULTS", "MANAGE_USERS", "MANAGE_ROLES"]
    });

    const userRole = await Role.create({
      title: "User",
      description: "Standard Student/User",
      permissions: ["TAKE_QUIZ"]
    });

    console.log("Roles created.");

    // Create Admin User
    await User.create({
      name: "Super Admin",
      email: "admin@quizpro.com",
      password: "password123",
      role: adminRole._id
    });

    console.log("Admin user created (admin@quizpro.com / password123).");

    // Create a Quiz
    const quiz1 = await Quiz.create({
      title: "React JS Final Evaluation - Batch 5",
      timeLimit: 10,
    });

    const quiz2 = await Quiz.create({
      title: "UI/UX Design Basics",
      timeLimit: 5,
    });

    // Create Questions for Quiz 1
    await Question.insertMany([
      {
        quizId: quiz1._id,
        questionText: "Which hook is used to manage state in a functional component?",
        options: ["useEffect", "useState", "useContext", "useReducer"],
        correctAnswer: "useState",
        difficulty: "Easy"
      },
      {
        quizId: quiz1._id,
        questionText: "What will happen if you provide an empty array [] as the second argument to useEffect?",
        options: ["It runs after every render", "It runs only once on mount", "It never runs", "It causes an infinite loop"],
        correctAnswer: "It runs only once on mount",
        difficulty: "Medium"
      },
      {
        quizId: quiz1._id,
        questionText: "Why is it discouraged to use index as a key in React lists?",
        options: ["It causes performance issues", "It breaks the DOM order on reorders", "React will throw a compilation error", "Both A and B"],
        correctAnswer: "Both A and B",
        difficulty: "Logical"
      }
    ]);

    // Create Questions for Quiz 2
    await Question.insertMany([
      {
        quizId: quiz2._id,
        questionText: "Which principle focuses on visual balance in a design?",
        options: ["Symmetry", "Hierarchy", "Contrast", "Alignment"],
        correctAnswer: "Symmetry",
        difficulty: "Easy"
      },
      {
        quizId: quiz2._id,
        questionText: "What does 'CTA' stand for in web design?",
        options: ["Color Text Alignment", "Call To Action", "Center Top Area", "Control Target Audience"],
        correctAnswer: "Call To Action",
        difficulty: "Medium"
      }
    ]);

    console.log("Fake data seeded successfully!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

fakeData();
