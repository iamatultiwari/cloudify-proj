import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendRegistrationEmail } from "../services/sendRegistrationEmail.js";
// ================= REGISTER =================
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, district } = req.body; // Added district

    if (!name || !email || !password || !district) {
      return res.status(400).json({ message: "All fields, including district, are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      district, // Added district
    });

    // Trigger Email Notification
    try {
      await sendRegistrationEmail(email, name, district);
    } catch (emailError) {
      console.error("Registration email could not be sent:", emailError);
    }

    res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      user: { _id: user._id, name: user.name, email: user.email, district: user.district },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= LOGIN =================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });

    // Admin Auto-creation logic
    if (!user && email === "admin" && password === "shreeji@55") {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user = await User.create({
        name: "Admin",
        email: "admin",
        password: hashedPassword,
        district: "Headquarters" // Default for Admin
      });
    }

    if (!user) return res.status(400).json({ message: "Invalid Credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: { _id: user._id, name: user.name, email: user.email, district: user.district }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= PROFILE & LOGOUT =================
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logoutUser = async (req, res) => {
  res.status(200).json({ success: true, message: "Logout Successful" });
};