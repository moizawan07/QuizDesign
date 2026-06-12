import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized to access this route" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Fetch user and populate role
    req.user = await User.findById(decoded.id).populate("role");
    
    if (!req.user) {
      return res.status(401).json({ success: false, message: "User no longer exists" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Not authorized to access this route" });
  }
};

// Middleware to check for specific roles or just Admin
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role || !roles.includes(req.user.role.title)) {
      return res.status(403).json({ 
        success: false, 
        message: `User role '${req.user?.role?.title || "Unknown"}' is not authorized to access this route`
      });
    }
    next();
  };
};

export const isAdmin = authorize("Admin");
