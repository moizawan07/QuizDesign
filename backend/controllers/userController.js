import User from "../models/User.js";
import Role from "../models/Role.js";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, idNo, password } = req.body;

    if (!name || !email || !idNo || !password) {
      return res.status(400).json({ success: false, message: "Please provide all required fields" });
    }

    const userExists = await User.findOne({ $or: [{ email }, { idNo }] });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User with this email or ID already exists" });
    }

    const userRole = await Role.findOne({ title: "User" });
    if (!userRole) {
      return res.status(500).json({ success: false, message: "Default role not found in DB." });
    }

    let user = await User.create({
      name,
      email,
      idNo,
      password,
      role: userRole._id
    });
    
    user = await user.populate("role");
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        idNo: user.idNo,
        quizAttempt: user.quizAttempt,
        role: user.role
      },
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password").populate("role");
    
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        idNo: user.idNo,
        quizAttempt: user.quizAttempt,
        role: user.role
      },
      message: "Login successful"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("role");
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
