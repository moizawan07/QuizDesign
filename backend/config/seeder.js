import User from "../models/User.js";
import Quiz from "../models/Quiz.js";
import Question from "../models/Question.js";
import QuizResult from "../models/QuizResult.js";
import Reattempt from "../models/Reattempt.js";
import Role from "../models/Role.js";

// Realistic Mock Data Sources
const studentNames = [
  "Muhammad Ahmed", "Ayesha Siddiqui", "Hamza Rehman", "Fatima Zahra", 
  "Moiz Awan", "Zainab Ali", "Bilal Khan", "Sana Yousuf", 
  "Omar Farooq", "Hafsa Malik", "Usman Tariq", "Mariam Jameel", 
  "Mustafa Kamal", "Nida Yasir", "Ali Raza", "Kiran Shah", 
  "Fahad Mustafa", "Zoya Khan", "Saad Bin Jung", "Hina Altaf"
];

const realisticQuizzes = [
  {
    title: "JavaScript Closures & Scope",
    category: "JavaScript",
    head: "Web Development Division",
    timeLimit: 15,
    mcq: {
      questionText: "Which of the following is true about lexical scoping in JavaScript?",
      options: [
        "Inner functions have access to variables declared in their outer scopes.",
        "Outer functions have access to variables defined in their inner scopes.",
        "Scope is resolved dynamically at runtime rather than compile time.",
        "Variables defined with var are block scoped."
      ],
      correctAnswer: "Inner functions have access to variables declared in their outer scopes.",
      questionCategory: "JS Core"
    },
    coding: {
      questionText: "Write a function named 'createCounter(initialVal)' that returns an object with three methods: 'increment()', 'decrement()', and 'getValue()'. All operations must modify the initial value privately.",
      starterCode: "function createCounter(initialVal) {\n  let count = initialVal;\n  return {\n    increment() {\n      count++;\n    },\n    decrement() {\n      count--;\n    },\n    getValue() {\n      return count;\n    }\n  };\n}",
      questionCategory: "Closures"
    }
  },
  {
    title: "React Functional Hooks",
    category: "React",
    head: "Frontend Engineering Group",
    timeLimit: 20,
    mcq: {
      questionText: "Which hook is designed to cache the result of an expensive calculation between re-renders?",
      options: ["useCallback", "useMemo", "useRef", "useEffect"],
      correctAnswer: "useMemo",
      questionCategory: "React Hooks"
    },
    coding: {
      questionText: "Implement a function 'useToggle(initialState)' that returns an array with a boolean value and a memoized toggle function.",
      starterCode: "function useToggle(initialState = false) {\n  const [value, setValue] = React.useState(initialState);\n  const toggle = React.useCallback(() => setValue(v => !v), []);\n  return [value, toggle];\n}",
      questionCategory: "React Custom Hooks"
    }
  },
  {
    title: "Node.js Event Loop & Streams",
    category: "Node.js",
    head: "Backend Engineering Group",
    timeLimit: 25,
    mcq: {
      questionText: "Which event loop phase executes callbacks registered by process.nextTick()?",
      options: [
        "Timers Phase",
        "Poll Phase",
        "It executes immediately after the current operation finishes, before the event loop continues.",
        "Check Phase"
      ],
      correctAnswer: "It executes immediately after the current operation finishes, before the event loop continues.",
      questionCategory: "Event Loop"
    },
    coding: {
      questionText: "Write a Node.js function 'streamData(readStream, writeStream)' that pipes data from a read stream to a write stream while handling errors on both streams.",
      starterCode: "function streamData(readStream, writeStream) {\n  readStream.on('error', (err) => console.error(err));\n  writeStream.on('error', (err) => console.error(err));\n  readStream.pipe(writeStream);\n}",
      questionCategory: "Streams"
    }
  },
  {
    title: "CSS Grid & Flexbox layouts",
    category: "HTML/CSS",
    head: "UI/UX & Design Team",
    timeLimit: 15,
    mcq: {
      questionText: "Which property aligns grid items along the block (vertical) axis in CSS Grid?",
      options: ["justify-items", "align-items", "justify-content", "place-content"],
      correctAnswer: "align-items",
      questionCategory: "CSS Grid"
    },
    coding: {
      questionText: "Write a CSS helper function in JS 'getResponsiveColumns(count)' that returns a CSS grid-template-columns string using repeat, auto-fit, and minmax.",
      starterCode: "function getResponsiveColumns(count) {\n  return `repeat(auto-fit, minmax(200px, 1fr))`;\n}",
      questionCategory: "CSS Utilities"
    }
  },
  {
    title: "MongoDB Aggregation Pipeline",
    category: "Databases",
    head: "Data Science Division",
    timeLimit: 30,
    mcq: {
      questionText: "Which aggregation stage filters documents in a similar manner to SQL's WHERE clause?",
      options: ["$project", "$match", "$group", "$filter"],
      correctAnswer: "$match",
      questionCategory: "Aggregation"
    },
    coding: {
      questionText: "Write an aggregation array that filters users with status 'Active', groups them by 'category', and calculates the average score.",
      starterCode: "const pipeline = [\n  { $match: { status: 'Active' } },\n  { $group: { _id: '$category', avgScore: { $avg: '$score' } } }\n];",
      questionCategory: "MongoDB Grouping"
    }
  },
  {
    title: "Docker Containerization Essentials",
    category: "DevOps",
    head: "Infrastructure & Security",
    timeLimit: 20,
    mcq: {
      questionText: "In a Dockerfile, which instruction specifies the command that runs when the container starts?",
      options: ["RUN", "CMD", "EXPOSE", "COPY"],
      correctAnswer: "CMD",
      questionCategory: "Dockerfiles"
    },
    coding: {
      questionText: "Write a standard Dockerfile configuration string to containerize a Node.js web server running on port 8080.",
      starterCode: "FROM node:18-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nEXPOSE 8080\nCMD [\"node\", \"server.js\"]",
      questionCategory: "DevOps Containers"
    }
  },
  {
    title: "TypeScript Interfaces & Types",
    category: "TypeScript",
    head: "Software Architecture",
    timeLimit: 15,
    mcq: {
      questionText: "Which keyword in TypeScript is used to combine multiple types into a single intersection type?",
      options: ["&", "|", "extends", "implements"],
      correctAnswer: "&",
      questionCategory: "Type Intersection"
    },
    coding: {
      questionText: "Create a TypeScript interface 'UserProfile' representing a user with name (string), age (number), and optional bio (string).",
      starterCode: "interface UserProfile {\n  name: string;\n  age: number;\n  bio?: string;\n}",
      questionCategory: "Interfaces"
    }
  },
  {
    title: "Next.js 14 Routing Paradigms",
    category: "Next.js",
    head: "Frontend Engineering Group",
    timeLimit: 20,
    mcq: {
      questionText: "By default, are components in the Next.js App Router Server Components or Client Components?",
      options: ["Server Components", "Client Components", "Hybrid Components", "Dynamic Components"],
      correctAnswer: "Server Components",
      questionCategory: "App Router"
    },
    coding: {
      questionText: "Write a server component named 'ProductList' that fetches a list of products from '/api/products' asynchronously and renders them.",
      starterCode: "async function ProductList() {\n  const res = await fetch('https://api.example.com/products');\n  const products = await res.json();\n  return (\n    <ul>\n      {products.map(p => <li key={p.id}>{p.name}</li>)}\n    </ul>\n  );\n}",
      questionCategory: "Server Components"
    }
  },
  {
    title: "Redux Toolkit State Slices",
    category: "Redux",
    head: "Frontend Engineering Group",
    timeLimit: 15,
    mcq: {
      questionText: "Which utility in Redux Toolkit automatically creates action creators and action types?",
      options: ["createSlice", "createReducer", "configureStore", "createAction"],
      correctAnswer: "createSlice",
      questionCategory: "State Management"
    },
    coding: {
      questionText: "Create a slice named 'counter' using Redux Toolkit containing increment and decrement reducers.",
      starterCode: "import { createSlice } from '@reduxjs/toolkit';\n\nconst counterSlice = createSlice({\n  name: 'counter',\n  initialState: { value: 0 },\n  reducers: {\n    increment: state => { state.value += 1; },\n    decrement: state => { state.value -= 1; }\n  }\n});",
      questionCategory: "Redux Slices"
    }
  },
  {
    title: "JWT Authentication & Security",
    category: "Backend",
    head: "Infrastructure & Security",
    timeLimit: 20,
    mcq: {
      questionText: "Which part of a JSON Web Token (JWT) contains claims and expiration settings?",
      options: ["Header", "Payload", "Signature", "Verify Hash"],
      correctAnswer: "Payload",
      questionCategory: "Authentication"
    },
    coding: {
      questionText: "Write an Express.js middleware function named 'verifyToken' that verifies a JWT stored inside the 'Authorization' header.",
      starterCode: "function verifyToken(req, res, next) {\n  const token = req.headers['authorization']?.split(' ')[1];\n  if (!token) return res.status(401).send('Access Denied');\n  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {\n    if (err) return res.status(403).send('Invalid Token');\n    req.user = user;\n    next();\n  });\n}",
      questionCategory: "Security Middleware"
    }
  },
  {
    title: "Git Version Control & Workflows",
    category: "DevOps",
    head: "Software Architecture",
    timeLimit: 10,
    mcq: {
      questionText: "Which command is used to record staged snapshots into the project history?",
      options: ["git commit", "git push", "git add", "git status"],
      correctAnswer: "git commit",
      questionCategory: "Git Basics"
    },
    coding: {
      questionText: "Write a shell script or node sequence that runs git pull, resolves conflicts by using incoming changes, and pushes the merge.",
      starterCode: "git stash\ngit pull origin main\ngit stash pop\ngit add .\ngit commit -m 'resolve upstream merges'\ngit push origin main",
      questionCategory: "Conflict Resolution"
    }
  },
  {
    title: "Python Data Structures",
    category: "Python",
    head: "Computer Science Dept",
    timeLimit: 15,
    mcq: {
      questionText: "Which of the following Python data structures is mutable and does not allow duplicate items?",
      options: ["List", "Tuple", "Set", "Dictionary"],
      correctAnswer: "Set",
      questionCategory: "Python Basics"
    },
    coding: {
      questionText: "Write a Python function 'get_unique_sorted(numbers)' that takes a list of integers and returns a sorted list of unique values.",
      starterCode: "def get_unique_sorted(numbers):\n    return sorted(list(set(numbers)))",
      questionCategory: "Python Sets"
    }
  },
  {
    title: "SQL Joins & Relational Algebra",
    category: "Databases",
    head: "Data Science Division",
    timeLimit: 20,
    mcq: {
      questionText: "Which SQL join returns all records when there is a match in either left or right table records?",
      options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"],
      correctAnswer: "FULL OUTER JOIN",
      questionCategory: "SQL Joins"
    },
    coding: {
      questionText: "Write a SQL query that retrieves employee names and their department names from 'employees' and 'departments' tables.",
      starterCode: "SELECT e.name, d.dept_name\nFROM employees e\nINNER JOIN departments d ON e.dept_id = d.id;",
      questionCategory: "Relational SQL"
    }
  },
  {
    title: "Express.js REST APIs",
    category: "Backend",
    head: "Backend Engineering Group",
    timeLimit: 15,
    mcq: {
      questionText: "Which Express method is used to define middleware that operates across all incoming HTTP routes?",
      options: ["app.get", "app.post", "app.use", "app.listen"],
      correctAnswer: "app.use",
      questionCategory: "Express Middleware"
    },
    coding: {
      questionText: "Create a simple Express POST route at '/api/feedback' that extracts 'message' from body and returns a 201 status.",
      starterCode: "app.post('/api/feedback', (req, res) => {\n  const { message } = req.body;\n  res.status(201).json({ success: true, message });\n});",
      questionCategory: "REST endpoints"
    }
  },
  {
    title: "Data Structures: Binary Trees",
    category: "Computer Science",
    head: "Computer Science Dept",
    timeLimit: 25,
    mcq: {
      questionText: "What is the time complexity of searching for an element in a balanced Binary Search Tree (BST)?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
      correctAnswer: "O(log n)",
      questionCategory: "Time Complexity"
    },
    coding: {
      questionText: "Write a recursive function 'inOrderTraversal(root, list)' that performs in-order traversal of a binary tree.",
      starterCode: "function inOrderTraversal(root, list = []) {\n  if (root !== null) {\n    inOrderTraversal(root.left, list);\n    list.push(root.val);\n    inOrderTraversal(root.right, list);\n  }\n  return list;\n}",
      questionCategory: "Recursion"
    }
  },
  {
    title: "Algorithms: Quick Sort",
    category: "Computer Science",
    head: "Computer Science Dept",
    timeLimit: 20,
    mcq: {
      questionText: "In the worst-case scenario, what is the time complexity of the Quick Sort algorithm?",
      options: ["O(n log n)", "O(n^2)", "O(n)", "O(2^n)"],
      correctAnswer: "O(n^2)",
      questionCategory: "Sorting Algorithms"
    },
    coding: {
      questionText: "Write a basic implementation of the pivot partition function used in Quick Sort.",
      starterCode: "function partition(arr, low, high) {\n  let pivot = arr[high];\n  let i = low - 1;\n  for (let j = low; j < high; j++) {\n    if (arr[j] < pivot) {\n      i++;\n      [arr[i], arr[j]] = [arr[j], arr[i]];\n    }\n  }\n  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];\n  return i + 1;\n}",
      questionCategory: "Pivot Sort"
    }
  },
  {
    title: "AWS S3 Bucket Policies",
    category: "DevOps",
    head: "Infrastructure & Security",
    timeLimit: 20,
    mcq: {
      questionText: "Which S3 security setting is highly recommended to block all anonymous public access to objects?",
      options: ["CORS Configuration", "Block Public Access settings", "Lifecycle rules", "Object Locking"],
      correctAnswer: "Block Public Access settings",
      questionCategory: "Cloud Security"
    },
    coding: {
      questionText: "Write an AWS S3 Bucket Policy JSON schema string that allows read-only access to objects inside a bucket named 'my-public-bucket'.",
      starterCode: "{\n  \"Version\": \"2012-10-17\",\n  \"Statement\": [\n    {\n      \"Sid\": \"PublicReadGetObject\",\n      \"Effect\": \"Allow\",\n      \"Principal\": \"*\",\n      \"Action\": \"s3:GetObject\",\n      \"Resource\": \"arn:aws:s3:::my-public-bucket/*\"\n    }\n  ]\n}",
      questionCategory: "S3 Policies"
    }
  },
  {
    title: "HTML5 SEO Best Practices",
    category: "HTML/CSS",
    head: "UI/UX & Design Team",
    timeLimit: 15,
    mcq: {
      questionText: "Which HTML5 semantic tag represents self-contained content that can be distributed independently, like a forum post or newspaper article?",
      options: ["<section>", "<article>", "<aside>", "<main>"],
      correctAnswer: "<article>",
      questionCategory: "Semantics"
    },
    coding: {
      questionText: "Write a JavaScript object structured to dynamically append metadata tags (title, description) into the document head for SEO optimization.",
      starterCode: "function setMetaTags(title, desc) {\n  document.title = title;\n  let meta = document.querySelector('meta[name=\"description\"]') || document.createElement('meta');\n  meta.name = 'description';\n  meta.content = desc;\n  document.head.appendChild(meta);\n}",
      questionCategory: "SEO Scripts"
    }
  },
  {
    title: "Tailwind CSS Layout Rules",
    category: "HTML/CSS",
    head: "UI/UX & Design Team",
    timeLimit: 10,
    mcq: {
      questionText: "In Tailwind CSS, which class sets the grid column count to 4 on large screens and 1 on mobile screens?",
      options: ["grid-cols-4 lg:grid-cols-1", "grid-cols-1 lg:grid-cols-4", "cols-1 lg:cols-4", "md:grid-cols-4"],
      correctAnswer: "grid-cols-1 lg:grid-cols-4",
      questionCategory: "Tailwind Grid"
    },
    coding: {
      questionText: "Write a React component header container using Tailwind classes for flex layout, alignment, and hover transitions.",
      starterCode: "const CardHeader = () => (\n  <div className=\"flex items-center justify-between p-6 bg-white border-b border-slate-200 transition-all hover:bg-slate-50\">\n    <h3 className=\"text-lg font-semibold text-slate-900\">System Details</h3>\n  </div>\n);",
      questionCategory: "Tailwind Utility"
    }
  },
  {
    title: "Next.js Static Generation",
    category: "Next.js",
    head: "Software Architecture",
    timeLimit: 15,
    mcq: {
      questionText: "Which page generation mechanism builds pages at build time to deliver static HTML and JSON directly from a CDN?",
      options: ["Static Site Generation (SSG)", "Server Side Rendering (SSR)", "Incremental Static Regeneration (ISR)", "Client Side Rendering (CSR)"],
      correctAnswer: "Static Site Generation (SSG)",
      questionCategory: "Data Fetching"
    },
    coding: {
      questionText: "Implement a helper to cache API requests inside Next.js data fetching layers to optimize network efficiency.",
      starterCode: "async function getCachedData(url) {\n  const res = await fetch(url, { next: { revalidate: 3600 } });\n  return res.json();\n}",
      questionCategory: "Caching Strategies"
    }
  }
];

const realisticReasons = [
  "My browser suddenly crashed halfway through the assessment and locked me out of the session.",
  "Sudden power outage shut down my computer during the coding section. Please grant me a reset.",
  "Lost internet connection for 5 minutes, and when it restored, the quiz timer had already ended.",
  "My laptop ran out of battery and shutdown. I have setup my charger now. Please grant a reattempt.",
  "Accidentally closed the browser tab during final submission and couldn't re-enter.",
  "I got a tab violation warning because of a system update pop-up. I did not copy anything.",
  "The coding editor was lagging significantly on my device, so I couldn't complete the logical questions in time.",
  "My university Wi-Fi disconnected during the final question submission phase.",
  "My browser became unresponsive when compiling the starter code. I had to reload, which locked me out.",
  "The timer countdown ran out while the manual test cases were still loading. Please allow me to retry."
];

export async function seedMockData() {
  try {
    console.log("Checking DB for seed data...");

    // 1. Clear ALL existing mock data (so that rerun updates the database with high-quality entries)
    // We target any document containing "seed" or "Mock" in its fields.
    const deletedQuizzes = await Quiz.deleteMany({ title: { $in: realisticQuizzes.map(q => q.title) } });
    console.log(`Cleared ${deletedQuizzes.deletedCount} old mock quizzes.`);

    const deletedUsers = await User.deleteMany({ email: /seed_student_.*@example\.com/ });
    console.log(`Cleared ${deletedUsers.deletedCount} old mock users.`);

    // Delete results with mock notes
    const deletedResults = await QuizResult.deleteMany({ note: /Mock Result/ });
    console.log(`Cleared ${deletedResults.deletedCount} old mock results.`);

    // Delete reattempts with mock reasons
    const deletedReattempts = await Reattempt.deleteMany({ reason: /Mock Reattempt/ });
    console.log(`Cleared ${deletedReattempts.deletedCount} old mock reattempts.`);

    // 2. Get or create Core "User" Role
    let userRole = await Role.findOne({ title: "User" });
    if (!userRole) {
      userRole = await Role.create({
        title: "User",
        description: "Standard student role",
        permissions: ["TAKE_QUIZ", "VIEW_RESULTS"]
      });
      console.log("Created core 'User' role");
    }

    // 3. Seed 20 Users (Students) with Realistic Names
    console.log("Seeding 20 mock students...");
    const studentDocs = [];
    for (let i = 0; i < 20; i++) {
      studentDocs.push({
        name: studentNames[i],
        email: `seed_student_${i + 1}@example.com`,
        password: "password123",
        role: userRole._id,
        idNo: `REG-${1000 + i + 1}`,
        professional: i % 2 === 0 ? "CS" : "SE",
        quizAttempt: false
      });
    }
    const seededUsers = await User.insertMany(studentDocs);
    console.log(`Seeded ${seededUsers.length} mock users successfully!`);

    // 4. Seed 20 Quizzes with Realistic Titles
    console.log("Seeding 20 mock quizzes...");
    const quizDocs = [];
    for (let i = 0; i < 20; i++) {
      const qTemplate = realisticQuizzes[i];
      quizDocs.push({
        title: qTemplate.title,
        head: qTemplate.head,
        category: qTemplate.category,
        stack: "General",
        timeLimit: qTemplate.timeLimit,
        bonusPoints: [3, 2, 1],
        status: i % 3 === 0 ? "Closed" : "Open",
        numberOfQuestions: 2
      });
    }
    const seededQuizzes = await Quiz.insertMany(quizDocs);
    console.log(`Seeded ${seededQuizzes.length} mock quizzes successfully!`);

    // 5. Seed Questions (1 MCQ & 1 Coding) for each quiz
    console.log("Seeding questions for quizzes...");
    for (let i = 0; i < 20; i++) {
      const quiz = seededQuizzes[i];
      const qTemplate = realisticQuizzes[i];

      // Create MCQ
      const mcq = await Question.create({
        quizId: quiz._id,
        type: "theoretical",
        questionText: qTemplate.mcq.questionText,
        options: qTemplate.mcq.options,
        correctAnswer: qTemplate.mcq.correctAnswer,
        difficulty: "Medium",
        questionCategory: qTemplate.mcq.questionCategory
      });

      // Create Coding Question
      const coding = await Question.create({
        quizId: quiz._id,
        type: "logical",
        questionText: qTemplate.coding.questionText,
        starterCode: qTemplate.coding.starterCode,
        difficulty: "Hard",
        questionCategory: qTemplate.coding.questionCategory
      });
    }
    console.log("Seeded MCQ and Coding questions successfully.");

    // 6. Seed 20 Quiz Results with Precise Math & Calculations
    console.log("Seeding 20 mock results...");
    const resultDocs = [];
    for (let i = 0; i < 20; i++) {
      const user = seededUsers[i];
      const quiz = seededQuizzes[i];

      // Fetch questions associated with this quiz
      const questions = await Question.find({ quizId: quiz._id });
      const mcqQ = questions.find(q => q.type === "theoretical");
      const codingQ = questions.find(q => q.type === "logical");

      // Set up detailedAnswers with realistic submissions
      const detailedAnswers = [
        {
          questionId: mcqQ._id,
          questionText: mcqQ.questionText,
          type: "theoretical",
          selectedOption: i % 3 === 0 ? "Incorrect Option Choice" : mcqQ.correctAnswer, // Simulated correct/wrong
          submittedCode: "",
          correctAnswer: mcqQ.correctAnswer,
          isCorrect: i % 3 !== 0 // MCQ is correct for 66% of candidates
        },
        {
          questionId: codingQ._id,
          questionText: codingQ.questionText,
          type: "logical",
          selectedOption: "",
          submittedCode: codingQ.starterCode + "\n\n// Added custom verification checks\nconsole.log('Processed successfully.');",
          correctAnswer: "",
          isCorrect: false
        }
      ];

      const theoryTotal = 1;
      const theoryCorrect = detailedAnswers[0].isCorrect ? 1 : 0;
      const theoryWrong = detailedAnswers[0].isCorrect ? 0 : 1;
      const logicalTotal = 1;
      
      // Calculations:
      // Grade logical section alternately
      const isGraded = i % 2 === 0;
      const logicalScore = isGraded ? 1 : 0; // 1 out of 1 if graded/passed, 0 otherwise
      
      // Total points: MCQ (1) + Coding (1) = 2 points
      const totalPointsEarned = theoryCorrect + logicalScore;
      const totalQuestionsCount = 2;
      const finalPercentage = Math.round((totalPointsEarned / totalQuestionsCount) * 100);

      resultDocs.push({
        userId: user._id,
        quizId: quiz._id,
        total: totalQuestionsCount,
        percentage: Math.round((theoryCorrect / 1) * 100), // MCQ specific score
        completedAt: new Date(Date.now() - i * 4 * 3600 * 1000), // Staggered timestamp
        timeTaken: 250 + i * 45, // Seconds
        bonusTimeUsed: 0,
        tabViolations: i % 5 === 0 ? 2 : 0, // Occasional violations
        isInvalidated: false,
        note: `Mock Result ${i + 1}`,
        theoryTotal,
        theoryCorrect,
        theoryWrong,
        theoryUnattempted: 0,
        logicalTotal,
        logicalAttempted: 1,
        logicalUnattempted: 0,
        logicalScore,
        isGraded,
        overallPercentage: finalPercentage,
        detailedAnswers
      });
    }
    const seededResults = await QuizResult.insertMany(resultDocs);
    console.log(`Seeded ${seededResults.length} quiz results with precise calculations.`);

    // 7. Seed 20 Reattempts with Realistic Student Excuses
    console.log("Seeding 20 mock reattempts...");
    const reattemptDocs = [];
    const statuses = ["Pending", "Approved", "Rejected", "Exhausted"];
    for (let i = 0; i < 20; i++) {
      const user = seededUsers[i];
      const quiz = seededQuizzes[i];

      reattemptDocs.push({
        userId: user._id,
        quizId: quiz._id,
        reason: `Mock Reattempt: ${realisticReasons[i % realisticReasons.length]}`,
        status: statuses[i % statuses.length],
        createdAt: new Date(Date.now() - i * 8 * 3600 * 1000)
      });
    }
    const seededReattempts = await Reattempt.insertMany(reattemptDocs);
    console.log(`Seeded ${seededReattempts.length} mock reattempts successfully!`);

    console.log("Mock data seeding checks complete.");
  } catch (error) {
    console.error("Error seeding mock data:", error);
  }
}
