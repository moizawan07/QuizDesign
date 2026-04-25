import User from "../models/User.js";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const SignupOrLogin = async (req, res) => {
  try {
    const { name, email, idNo, professional } = req.body;

    // validation
    if (!name || !email || !idNo || !professional) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // check existing user
    let user = await User.findOne({
      $or: [{ email }, { idNo }],
    });

    let isNewUser = false;

    // create new user if not exists
    if (!user) {
      user = await User.create({
        name,
        email,
        idNo,
        professional,
      });

      isNewUser = true;
    }

    // generate token
    const token = generateToken(user._id);

    res.status(isNewUser ? 201 : 200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        idNo: user.idNo,
        professional: user.professional,
        quizAttempt: user.quizAttempt
      },
      message: isNewUser
        ? "User registered successfully"
        : "Login successful",
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
