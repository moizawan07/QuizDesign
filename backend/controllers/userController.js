import User from "../models/User.js";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const registerUser = async (req, res) => {
  try {
    const { name, fatherName, email, idNo, professional } = req.body;

    // Validation
    if (!name || !fatherName || !email || !idNo || !professional) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Check if user already exists
    let user = await User.findOne({ $or: [{ email }, { idNo }] });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User with this email or ID already exists",
      });
    }

    // Create user
    user = await User.create({
      name,
      fatherName,
      email,
      idNo,
      professional,
    });

    // Generate token
    const token = generateToken(user._id);

    // Return user and token
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      idNo: user.idNo,
      professional: user.professional,
    };

    res.status(201).json({
      success: true,
      token,
      user: userResponse,
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
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
