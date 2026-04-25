import express from "express";
import { SignupOrLogin, getProfile } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", SignupOrLogin);
router.get("/profile", protect, getProfile);

export default router;
