# Quiz Application - Full Stack Setup

## 📋 Overview
Complete quiz application with frontend (React + Vite) and backend (Node.js + Express + MongoDB).

## 🚀 Features

### Frontend
- ✅ React Router for navigation (Home, Quiz, Result, Results Table)
- ✅ AuthContext for user and token management
- ✅ User registration with fields: Name, Father's Name, Email, ID No, Professional
- ✅ Professional-based question filtering (Web Development, UI UX)
- ✅ Quiz with timer, tab detection, copy/paste prevention
- ✅ Result page with "Successfully Submitted" message
- ✅ Results table showing all submissions
- ✅ API integration with Axios

### Backend
- ✅ Express.js server
- ✅ MongoDB with Mongoose ODM
- ✅ JWT Authentication
- ✅ User registration API
- ✅ Quiz submission API
- ✅ Results retrieval APIs
- ✅ CORS enabled

## 📁 Project Structure

```
quiz-app/
├── src/                              # Frontend code
│   ├── components/                   # Reusable components
│   │   ├── HomeScreen.jsx
│   │   ├── QuizScreen.jsx
│   │   ├── ResultScreen.jsx
│   │   └── UserModal.jsx
│   ├── context/
│   │   └── AuthContext.jsx           # Auth state management
│   ├── pages/                        # Route pages
│   │   ├── HomePage.jsx
│   │   ├── QuizPage.jsx
│   │   ├── ResultPage.jsx
│   │   └── ResultsTablePage.jsx
│   ├── utils/
│   │   └── api.js                    # API calls configuration
│   ├── App.jsx                       # Main app with routing
│   ├── index.jsx
│   ├── index.css
│   ├── helpers.js
│   └── questions.js
│
├── backend/                          # Backend code
│   ├── config/
│   │   └── db.js                     # MongoDB connection
│   ├── models/
│   │   ├── User.js                   # User schema
│   │   └── QuizResult.js             # Quiz result schema
│   ├── controllers/
│   │   ├── userController.js         # User logic
│   │   └── quizController.js         # Quiz logic
│   ├── routes/
│   │   ├── userRoutes.js             # User endpoints
│   │   └── quizRoutes.js             # Quiz endpoints
│   ├── middleware/
│   │   └── auth.js                   # JWT verification
│   ├── server.js                     # Main server file
│   ├── .env                          # Environment variables
│   └── package.json
│
├── .env                              # Frontend env
├── package.json
├── vite.config.js
└── index.html
```

## 🛠️ Installation

### Frontend Setup
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Run development server (with nodemon)
npm run dev

# Or run production server
npm start
```

## 📝 Environment Variables

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:5000/api
```

### Backend (backend/.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/quiz_app
JWT_SECRET=your_jwt_secret_key_change_this_in_production
NODE_ENV=development
```

## 🗄️ Database

### MongoDB Collections

#### User Schema
```javascript
{
  idNo: String (required, unique),
  name: String (required),
  fatherName: String (required),
  email: String (required, unique),
  professional: String (enum: "Web Development", "UI UX"),
  createdAt: Date,
  updatedAt: Date
}
```

#### QuizResult Schema
```javascript
{
  userId: ObjectId (ref: User),
  correct: Number,
  wrong: Number,
  unattempted: Number,
  total: Number,
  percentage: Number,
  completedAt: Date,
  timeTaken: Number (seconds),
  note: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔌 API Endpoints

### User Endpoints
```
POST   /api/users/register           # Register user
GET    /api/users/profile            # Get user profile (protected)
```

### Quiz Endpoints
```
POST   /api/quiz/submit              # Submit quiz (protected)
GET    /api/quiz/results             # Get user results (protected)
GET    /api/quiz/results-table       # Get all results table (protected)
```

## 🔐 Authentication

- JWT tokens are issued on registration
- Token stored in localStorage
- AuthContext manages token and user state
- Protected routes require valid JWT token

## 📱 Routes

- `/` - Home page (registration modal if not logged in)
- `/quiz` - Quiz page (requires login)
- `/result` - Result page after quiz completion
- `/results` - All results table view

## 🎯 User Flow

1. User visits home page
2. Registration modal appears if not logged in
3. User registers with ID No and Professional field
4. Token and user data stored in localStorage and AuthContext
5. Questions filtered based on professional selection
6. Quiz starts with timer
7. On submission, result sent to backend
8. Success message displayed with result stats
9. Can view all results on /results page

## ⚙️ Running the Application

### Terminal 1 (Backend)
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

### Terminal 2 (Frontend)
```bash
npm run dev
# App runs on http://localhost:5173
```

## 🔧 Features in Detail

### Question Filtering
Questions are filtered by `professional` field:
- Web Development questions for "Web Development" users
- UI UX questions for "UI UX" users
- Questions without professional field shown to all users

### Quiz Security
- Tab switch detection (3 violations = auto-submit)
- Copy/paste/right-click prevention
- Auto-submit on timeout
- Submit time tracking

### Result Tracking
- Correct/Wrong/Unattempted counts
- Percentage calculation
- Completion timestamp
- Time taken in seconds
- All results visible in table format

## 📊 Next Steps

1. Connect to MongoDB Atlas or local MongoDB
2. Update JWT_SECRET in backend .env
3. Deploy frontend to Vercel/Netlify
4. Deploy backend to Railway/Render/Heroku
5. Update API_BASE_URL in frontend for production
