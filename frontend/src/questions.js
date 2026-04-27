// ============================================================
// QUIZ QUESTIONS — Organized by Professional Field
// ============================================================

export const QUIZ_CONFIG = {
  TIMER_MINUTES: 5,   // Change this to adjust quiz time
  TOTAL_MARKS_PER_QUESTION: 1,
};

export const WebDeveloperQuestions = [
  // FIRST 25 (YOUR EXISTING QUESTIONS - KEPT AS IS)
  {
    id: 1,
    professional: "Web Development",
    question: "Which semantic HTML tag is best used for the main navigation menu?",
    options: ["<menu>", "<navigation>", "<nav>", "<section>"],
    answer: "<nav>",
  },
  {
    id: 2,
    professional: "Web Development",
    question: "Which semantic tag should be used for self-contained content like blog posts?",
    options: ["<section>", "<article>", "<aside>", "<main>"],
    answer: "<article>",
  },
  {
    id: 3,
    professional: "Web Development",
    question: "What is the purpose of the 'defer' attribute in a script tag?",
    options: [
      "Stops script execution",
      "Loads script after HTML parsing",
      "Loads script before HTML parsing",
      "Makes script async"
    ],
    answer: "Loads script after HTML parsing",
  },
  {
    id: 4,
    professional: "Web Development",
    question: "What is a closure in JavaScript?",
    options: [
      "A function with its lexical scope",
      "A loop statement",
      "A callback function",
      "An object method"
    ],
    answer: "A function with its lexical scope",
  },
  {
    id: 5,
    professional: "Web Development",
    question: "What does Promise.all() do?",
    options: [
      "Runs promises one by one",
      "Waits for all promises to resolve",
      "Ignores rejected promises",
      "Runs only one promise"
    ],
    answer: "Waits for all promises to resolve",
  },
  {
    id: 6,
    professional: "Web Development",
    question: "What is the prototype in JavaScript?",
    options: [
      "A CSS feature",
      "A way to inherit properties and methods",
      "A function parameter",
      "A React hook"
    ],
    answer: "A way to inherit properties and methods",
  },
  {
    id: 7,
    professional: "Web Development",
    question: "What is the main purpose of useState in React?",
    options: [
      "Managing side effects",
      "Managing state",
      "Managing API calls",
      "Managing routes"
    ],
    answer: "Managing state",
  },
  {
    id: 8,
    professional: "Web Development",
    question: "When does useEffect run if dependency array is empty?",
    options: [
      "On every render",
      "Only once after initial render",
      "Before render",
      "Never"
    ],
    answer: "Only once after initial render",
  },
  {
    id: 9,
    professional: "Web Development",
    question: "What is the purpose of React.memo?",
    options: [
      "Managing state",
      "Preventing unnecessary re-renders",
      "Handling API calls",
      "Routing"
    ],
    answer: "Preventing unnecessary re-renders",
  },
  {
    id: 10,
    professional: "Web Development",
    question: "What problem does useContext solve?",
    options: [
      "State persistence",
      "Prop drilling",
      "Routing issue",
      "API caching"
    ],
    answer: "Prop drilling",
  },
  {
    id: 11,
    professional: "Web Development",
    question: "What is event bubbling in JavaScript?",
    options: [
      "Event moves from child to parent",
      "Event moves from parent to child",
      "Event stops execution",
      "Event duplicates"
    ],
    answer: "Event moves from child to parent",
  },
  {
    id: 12,
    professional: "Web Development",
    question: "Which hook is best for memoizing expensive calculations?",
    options: ["useEffect", "useMemo", "useRef", "useState"],
    answer: "useMemo",
  },
  {
    id: 13,
    professional: "Web Development",
    question: "What is middleware in Express.js?",
    options: [
      "Database layer",
      "Functions between request and response cycle",
      "Frontend handler",
      "Authentication token"
    ],
    answer: "Functions between request and response cycle",
  },
  {
    id: 14,
    professional: "Web Development",
    question: "Which middleware is used to parse JSON in Express?",
    options: [
      "express.json()",
      "bodyParser()",
      "jsonParser()",
      "parse.json()"
    ],
    answer: "express.json()",
  },
  {
    id: 15,
    professional: "Web Development",
    question: "What is the role of a controller in MVC architecture?",
    options: [
      "Database connection",
      "Business logic handling",
      "Routing only",
      "Authentication only"
    ],
    answer: "Business logic handling",
  },
  {
    id: 16,
    professional: "Web Development",
    question: "What does next() do in Express middleware?",
    options: [
      "Ends response",
      "Moves to next middleware",
      "Restarts request",
      "Throws error"
    ],
    answer: "Moves to next middleware",
  },
  {
    id: 17,
    professional: "Web Development",
    question: "What is MongoDB populate() used for?",
    options: [
      "Insert documents",
      "Join referenced documents",
      "Delete relations",
      "Update schema"
    ],
    answer: "Join referenced documents",
  },
  {
    id: 18,
    professional: "Web Development",
    question: "Which MongoDB relationship stores multiple ObjectIds in one document?",
    options: [
      "One-to-One",
      "One-to-Many",
      "Many-to-One",
      "Embedded relation"
    ],
    answer: "One-to-Many",
  },
  {
    id: 19,
    professional: "Web Development",
    question: "What is JWT mainly used for?",
    options: [
      "Database queries",
      "Authentication",
      "Styling",
      "Caching"
    ],
    answer: "Authentication",
  },
  {
    id: 20,
    professional: "Web Development",
    question: "What HTTP status code is commonly used for unauthorized access?",
    options: ["200", "201", "401", "500"],
    answer: "401",
  },
  {
    id: 21,
    professional: "Web Development",
    question: "What is global error handling in Express?",
    options: [
      "Handling all app errors in one middleware",
      "Handling frontend errors",
      "Database backup",
      "Authentication process"
    ],
    answer: "Handling all app errors in one middleware",
  },
  {
    id: 22,
    professional: "Web Development",
    question: "What does bcrypt do?",
    options: [
      "Encrypt API calls",
      "Hash passwords",
      "Store sessions",
      "Generate tokens"
    ],
    answer: "Hash passwords",
  },
  {
    id: 23,
    professional: "Web Development",
    question: "Which method is used to create a new document in Mongoose?",
    options: ["find()", "save()", "populate()", "aggregate()"],
    answer: "save()",
  },
  {
    id: 24,
    professional: "Web Development",
    question: "What is the purpose of express.Router()?",
    options: [
      "Create modular routes",
      "Connect database",
      "Handle authentication",
      "Handle errors"
    ],
    answer: "Create modular routes",
  },
  {
    id: 25,
    professional: "Web Development",
    question: "What is the main benefit of using async/await in Node.js?",
    options: [
      "Makes code synchronous",
      "Improves readability of async code",
      "Stops promises",
      "Avoids database usage"
    ],
    answer: "Improves readability of async code",
  },

  // ==============================================
  // NEXT 25 QUESTIONS (3 EASY + 15 MEDIUM + 7 HARD)
  // ==============================================

  // ---------- EASY (3 Questions) ----------
  {
    id: 26,
    professional: "Web Development",
    question: "Which command starts a new Node.js project?",
    options: ["npm start", "npm init", "node init", "npm create"],
    answer: "npm init",
  },
  {
    id: 27,
    professional: "Web Development",
    question: "What does the `res.send()` method do in Express?",
    options: [
      "Sends a file to the client",
      "Sends a response to the client",
      "Redirects the client",
      "Ends the request without response"
    ],
    answer: "Sends a response to the client",
  },
  {
    id: 28,
    professional: "Web Development",
    question: "Which React Hook is used to reference a DOM element directly?",
    options: ["useState", "useEffect", "useRef", "useContext"],
    answer: "useRef",
  },

  // ---------- MEDIUM (15 Questions) ----------
  {
    id: 29,
    professional: "Web Development",
    question: "What is the output of: console.log(typeof null); in JavaScript?",
    options: ["null", "undefined", "object", "number"],
    answer: "object",
  },
  {
    id: 30,
    professional: "Web Development",
    question: "What does the `process.env` object contain in Node.js?",
    options: [
      "Command line arguments",
      "Environment variables",
      "Running process ID",
      "Memory usage stats"
    ],
    answer: "Environment variables",
  },
  {
    id: 31,
    professional: "Web Development",
    question: "Which status code means 'Resource Not Found'?",
    options: ["200", "301", "404", "500"],
    answer: "404",
  },
  {
    id: 32,
    professional: "Web Development",
    question: "What does CORS protect against?",
    options: [
      "SQL injection",
      "Cross-origin requests from malicious websites",
      "Password theft",
      "XSS attacks"
    ],
    answer: "Cross-origin requests from malicious websites",
  },
  {
    id: 33,
    professional: "Web Development",
    question: "What is the default behavior of `useEffect` when no dependency array is provided?",
    options: [
      "Runs only once",
      "Runs after every render",
      "Never runs",
      "Runs before render"
    ],
    answer: "Runs after every render",
  },
  {
    id: 34,
    professional: "Web Development",
    question: "What is the purpose of `express.static()`?",
    options: [
      "Serve static files like CSS and images",
      "Parse JSON bodies",
      "Handle authentication",
      "Connect to MongoDB"
    ],
    answer: "Serve static files like CSS and images",
  },
  {
    id: 35,
    professional: "Web Development",
    question: "Which of the following is a NoSQL database?",
    options: ["MySQL", "PostgreSQL", "MongoDB", "SQLite"],
    answer: "MongoDB",
  },
  {
    id: 36,
    professional: "Web Development",
    question: "What does the `__dirname` variable contain in Node.js?",
    options: [
      "Current file name",
      "Current directory path",
      "Root directory path",
      "Global objects"
    ],
    answer: "Current directory path",
  },
  {
    id: 37,
    professional: "Web Development",
    question: "What is the purpose of `pre` middleware in Mongoose?",
    options: [
      "Run after a document is saved",
      "Run before a specific operation",
      "Run only on errors",
      "Run during aggregation"
    ],
    answer: "Run before a specific operation",
  },
  {
    id: 38,
    professional: "Web Development",
    question: "What does `localStorage.setItem('key', 'value')` do?",
    options: [
      "Saves data to server",
      "Saves data to browser storage",
      "Creates a cookie",
      "Stores data temporarily in memory"
    ],
    answer: "Saves data to browser storage",
  },
  {
    id: 39,
    professional: "Web Development",
    question: "What is the difference between `let` and `var`?",
    options: [
      "let is function-scoped, var is block-scoped",
      "var is block-scoped, let is function-scoped",
      "let is block-scoped, var is function-scoped",
      "No difference"
    ],
    answer: "let is block-scoped, var is function-scoped",
  },
  {
    id: 40,
    professional: "Web Development",
    question: "What does the `findOneAndUpdate` method do in Mongoose?",
    options: [
      "Finds and deletes a document",
      "Finds a document and updates it",
      "Updates multiple documents",
      "Inserts a new document"
    ],
    answer: "Finds a document and updates it",
  },
  {
    id: 41,
    professional: "Web Development",
    question: "Which HTTP method should be used to delete a resource?",
    options: ["GET", "POST", "PUT", "DELETE"],
    answer: "DELETE",
  },
  {
    id: 42,
    professional: "Web Development",
    question: "What does `npm run build` typically do in a React app?",
    options: [
      "Starts development server",
      "Creates a production-ready bundle",
      "Installs dependencies",
      "Runs tests"
    ],
    answer: "Creates a production-ready bundle",
  },
  {
    id: 43,
    professional: "Web Development",
    question: "What is the purpose of `useCallback` Hook?",
    options: [
      "Memoize entire components",
      "Memoize functions to prevent recreation",
      "Memoize values",
      "Handle side effects"
    ],
    answer: "Memoize functions to prevent recreation",
  },

  // ---------- HARD (7 Questions - Advanced Theory) ----------
  {
    id: 44,
    professional: "Web Development",
    question: "What is the event loop in Node.js?",
    options: [
      "A loop that runs synchronous code",
      "A mechanism that handles asynchronous callbacks",
      "A database connection pool",
      "A routing system"
    ],
    answer: "A mechanism that handles asynchronous callbacks",
  },
  {
    id: 45,
    professional: "Web Development",
    question: "What causes a memory leak in a React component?",
    options: [
      "Using useState too many times",
      "Not cleaning up subscriptions or timers in useEffect",
      "Using too many components",
      "Large CSS files"
    ],
    answer: "Not cleaning up subscriptions or timers in useEffect",
  },
  {
    id: 46,
    professional: "Web Development",
    question: "What is the difference between `process.nextTick()` and `setImmediate()`?",
    options: [
      "nextTick runs before I/O events, setImmediate after",
      "nextTick runs after I/O, setImmediate before",
      "Both are exactly the same",
      "setImmediate runs before setTimeout"
    ],
    answer: "nextTick runs before I/O events, setImmediate after",
  },
  {
    id: 47,
    professional: "Web Development",
    question: "What is the 'waterfall' problem in Promise chaining and how is it solved?",
    options: [
      "Too many nested callbacks; solved by async/await",
      "Slow execution; solved by Promise.all",
      "Memory leaks; solved by cleanup functions",
      "Unhandled rejections; solved by try/catch"
    ],
    answer: "Slow execution; solved by Promise.all",
  },
  {
    id: 48,
    professional: "Web Development",
    question: "In Express, why should you always call `next()` in middleware?",
    options: [
      "To end the response cycle",
      "To pass control to the next middleware",
      "To restart the request",
      "To throw an error"
    ],
    answer: "To pass control to the next middleware",
  },
  {
    id: 49,
    professional: "Web Development",
    question: "What is the 'stale closure' problem in React Hooks?",
    options: [
      "State not updating because of old prop values trapped in a closure",
      "Components not rendering at all",
      "Too many re-renders",
      "Memory leaks from useEffect"
    ],
    answer: "State not updating because of old prop values trapped in a closure",
  },
  {
    id: 50,
    professional: "Web Development",
    question: "What is the main security risk of storing JWT in localStorage?",
    options: [
      "Token expiration issues",
      "Vulnerable to XSS attacks",
      "Vulnerable to CSRF attacks",
      "Slow performance"
    ],
    answer: "Vulnerable to XSS attacks",
  }
];


export const UiUxQuestions = [
  {
    id: 101,
    professional: "UI UX",
    question: "What does UX stand for?",
    options: ["User eXperience", "Unique eXperience", "User Extension", "Ultra eXperience"],
    answer: "User eXperience",
  },
  {
    id: 102,
    professional: "UI UX",
    question: "What is the primary goal of UX design?",
    options: ["To make things pretty", "To create a good user experience", "To use many colors", "To complicate interfaces"],
    answer: "To create a good user experience",
  },
  {
    id: 103,
    professional: "UI UX",
    question: "What does UI stand for?",
    options: ["User Interface", "Unique Interface", "Universal Interface", "User Interaction"],
    answer: "User Interface",
  },
  {
    id: 104,
    professional: "UI UX",
    question: "Which of these is NOT a principle of good UI design?",
    options: ["Consistency", "Simplicity", "Complexity", "Clarity"],
    answer: "Complexity",
  },
  {
    id: 105,
    professional: "UI UX",
    question: "What is wireframing?",
    options: ["A design tool", "A low-fidelity layout of a website", "A programming language", "A color palette"],
    answer: "A low-fidelity layout of a website",
  },
  {
    id: 106,
    professional: "UI UX",
    question: "What is the purpose of user research in UX design?",
    options: ["To make designs beautiful", "To understand user needs and behaviors", "To speed up design process", "To reduce costs"],
    answer: "To understand user needs and behaviors",
  },
  {
    id: 107,
    professional: "UI UX",
    question: "What does 'prototyping' mean in UI/UX design?",
    options: ["Final product", "Creating an interactive mockup", "Writing code", "Testing stage"],
    answer: "Creating an interactive mockup",
  },
  {
    id: 108,
    professional: "UI UX",
    question: "Which tool is commonly used for UI/UX design?",
    options: ["Visual Studio Code", "Figma", "MongoDB", "Express"],
    answer: "Figma",
  },
  {
    id: 109,
    professional: "UI UX",
    question: "What is 'user empathy' in UX design?",
    options: ["Liking the user", "Understanding and feeling user emotions", "Marketing", "Selling products"],
    answer: "Understanding and feeling user emotions",
  },
  {
    id: 110,
    professional: "UI UX",
    question: "What is an 'information architecture' in UX?",
    options: ["Building structure", "Organizing and structuring information", "Database design", "Server architecture"],
    answer: "Organizing and structuring information",
  },
  {
    id: 111,
    professional: "UI UX",
    question: "What is 'accessibility' in UI/UX design?",
    options: ["Easy to find", "Designing for people of all abilities", "Making things cheap", "Fast loading"],
    answer: "Designing for people of all abilities",
  },
  {
    id: 112,
    professional: "UI UX",
    question: "What does 'white space' do in UI design?",
    options: ["It's wasted space", "Improves readability and reduces clutter", "Increases file size", "Slows down loading"],
    answer: "Improves readability and reduces clutter",
  },
  {
    id: 113,
    professional: "UI UX",
    question: "What is 'color theory' in UI design?",
    options: ["Art history", "Study of colors and their relationships", "Painting techniques", "Photography"],
    answer: "Study of colors and their relationships",
  },
  {
    id: 114,
    professional: "UI UX",
    question: "What is a 'user persona'?",
    options: ["A real user", "Fictional representation of target user", "Job title", "Username"],
    answer: "Fictional representation of target user",
  },
  {
    id: 115,
    professional: "UI UX",
    question: "What is 'usability testing'?",
    options: ["Testing code", "Getting feedback from actual users", "Beta testing", "QA testing"],
    answer: "Getting feedback from actual users",
  },
  {
    id: 116,
    professional: "UI UX",
    question: "What does 'responsive design' mean?",
    options: ["Fast page loading", "UI adapts to different screen sizes", "Server-side rendering", "Interactive design"],
    answer: "UI adapts to different screen sizes",
  },
  {
    id: 117,
    professional: "UI UX",
    question: "What is 'interaction design'?",
    options: ["Physical interaction", "Designing how users interact with products", "Social media", "Customer service"],
    answer: "Designing how users interact with products",
  },
  {
    id: 118,
    professional: "UI UX",
    question: "What is a 'design system'?",
    options: ["Operating system", "Organized set of design guidelines and components", "Design tool", "File system"],
    answer: "Organized set of design guidelines and components",
  },
  {
    id: 119,
    professional: "UI UX",
    question: "What is 'call to action (CTA)' in UI design?",
    options: ["Customer service", "Button prompting user to do something", "Phone number", "Email address"],
    answer: "Button prompting user to do something",
  },
  {
    id: 120,
    professional: "UI UX",
    question: "What is 'heuristic evaluation' in UX?",
    options: ["User testing", "Expert review using established principles", "Algorithm", "Machine learning"],
    answer: "Expert review using established principles",
  },
];

// Combine all questions based on professional field
export const ALL_QUESTIONS = [...WebDeveloperQuestions, ...UiUxQuestions];
 