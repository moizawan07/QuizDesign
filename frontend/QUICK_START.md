# 🚀 Quick Start Guide

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

## Step 2: Configure Backend Environment

Edit `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/quiz_app
JWT_SECRET=your_secret_key_123
NODE_ENV=development
```

For MongoDB Atlas, use:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/quiz_app
```

## Step 3: Start MongoDB (if running locally)

```bash
# Windows (if installed as service, it should run automatically)
# Or use MongoDB Compass

# Linux/Mac
mongod
```

## Step 4: Start Backend Server

```bash
cd backend
npm run dev
```

You should see: `Server running on port 5000` ✅

## Step 5: Install Frontend Dependencies

```bash
# In a new terminal, at root directory
npm install
```

## Step 6: Configure Frontend Environment

Make sure `.env` exists in the root directory:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Step 7: Start Frontend Development Server

```bash
npm run dev
```

Frontend will be at: `http://localhost:5173` ✅

## Testing the Application

### 1. Register as a User
- Open `http://localhost:5173`
- Fill in the registration form:
  - Name: John Doe
  - Father's Name: James Doe
  - Email: john@example.com
  - ID No: 12345
  - Professional: Web Development (or UI UX)
- Click "Continue to Quiz"

### 2. Take the Quiz
- Answer the questions (timer will count down)
- Questions will be filtered based on your professional choice
- Click "Submit Quiz" when done

### 3. View Result
- You'll see the "Successfully Submitted" message
- View your statistics (correct, wrong, unattempted, etc.)

### 4. View All Results
- Click "View Results" button on home page
- See a table of all quiz submissions

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Change port in backend/.env
PORT=5001  # or any other available port
```

### MongoDB Connection Error
```bash
# Make sure MongoDB is running
# Test connection:
mongo  # or mongosh for newer versions
```

### CORS Error
Make sure `backend/server.js` has CORS enabled:
```javascript
app.use(cors());
```

### API Not Responding
1. Check if backend is running on correct port
2. Verify `.env` files are correctly configured
3. Check network tab in browser DevTools
4. Ensure `VITE_API_BASE_URL` matches backend URL

## 📱 API Testing with Postman

### Register User
```
POST http://localhost:5000/api/users/register
Body (JSON):
{
  "name": "John Doe",
  "fatherName": "James Doe",
  "email": "john@example.com",
  "idNo": "12345",
  "professional": "Web Development"
}
```

### Submit Quiz
```
POST http://localhost:5000/api/quiz/submit
Headers:
  Authorization: Bearer <token_from_register>
Body (JSON):
{
  "correct": 15,
  "wrong": 5,
  "unattempted": 0,
  "total": 20,
  "percentage": 75,
  "completedAt": "2024-01-15T10:30:00Z",
  "timeTaken": 600,
  "note": "Manual submit"
}
```

### Get All Results
```
GET http://localhost:5000/api/quiz/results-table
Headers:
  Authorization: Bearer <token>
```

## 🎯 Development Commands

### Frontend
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend
```bash
npm run dev      # Start with nodemon
npm start        # Start production
```

## 📊 Database Structure

After registration and quiz submission, check MongoDB:

```bash
# Connect to MongoDB
mongosh

# Switch to database
use quiz_app

# View collections
show collections

# View users
db.users.find()

# View quiz results
db.quizresults.find()
```

## 💾 Sample Data

### User Document
```json
{
  "_id": ObjectId("..."),
  "idNo": "12345",
  "name": "John Doe",
  "fatherName": "James Doe",
  "email": "john@example.com",
  "professional": "Web Development",
  "createdAt": ISODate("2024-01-15T10:00:00Z"),
  "updatedAt": ISODate("2024-01-15T10:00:00Z")
}
```

### Quiz Result Document
```json
{
  "_id": ObjectId("..."),
  "userId": ObjectId("..."),
  "correct": 15,
  "wrong": 5,
  "unattempted": 0,
  "total": 20,
  "percentage": 75,
  "completedAt": ISODate("2024-01-15T10:30:00Z"),
  "timeTaken": 600,
  "note": "Manual submit",
  "createdAt": ISODate("2024-01-15T10:30:00Z"),
  "updatedAt": ISODate("2024-01-15T10:30:00Z")
}
```

## 📞 Support

If you encounter any issues:
1. Check the browser console for errors
2. Check the terminal output for backend errors
3. Verify all environment variables are set correctly
4. Ensure ports 5000 and 5173 are available
5. Clear browser cache and localStorage if needed

---

**Happy testing! 🎉**
