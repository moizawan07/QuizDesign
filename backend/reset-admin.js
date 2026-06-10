import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const resetAdminPassword = async () => {
    try {
        console.log("Connecting to database...");
        await mongoose.connect(process.env.MONGODB_URI);
        
        const adminEmail = "admin@quizpro.com";
        const admin = await User.findOne({ email: adminEmail });
        
        if (admin) {
            console.log("Admin found! Resetting password...");
            // User.js schema automatically hashes the password before saving
            admin.password = "admin123";
            await admin.save();
            
            console.log("✅ Admin password reset successfully!");
            console.log("----------------------------------");
            console.log("Email:    admin@quizpro.com");
            console.log("Password: admin123");
            console.log("----------------------------------");
        } else {
            console.log("❌ Admin not found in the database!");
        }
        process.exit();
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

resetAdminPassword();
