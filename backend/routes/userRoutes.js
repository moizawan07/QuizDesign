import express from "express";
import { registerUser, getProfile } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.get("/profile", protect, getProfile);

export default router;
