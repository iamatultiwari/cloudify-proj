import Farmer from "../models/Farmer.js";
//import { sendRegistrationEmail } from "../utils/sendRegistrationEmail.js";
import { sendRegistrationEmail } from "../services/sendRegistrationEmail.js";

// ================= ADD FARMER =================
export const addFarmer = async (req, res) => {
  console.log(req.body);
  try {
  const {
  name,
  mobileNumber,
  email,
  village,
  district,
  address,
  aadhaarNumber,
  creditLimit,
  status,
} = req.body;

// Convert frontend field name to schema field
const aadharNumber = aadhaarNumber;

    // Validation
    if (
      !name ||
      !mobileNumber ||
      !email ||
      !village ||
      !district ||
      !address ||
      !aadharNumber
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All required fields must be filled, including email and district.",
      });
    }

    // Check existing farmer
    const existingFarmer = await Farmer.findOne({
      $or: [
        { mobileNumber },
        { email: email.toLowerCase().trim() },
        { aadharNumber },
      ],
    });

    if (existingFarmer) {
      return res.status(400).json({
        success: false,
        message:
          "A farmer with this mobile number, email, or Aadhaar already exists.",
      });
    }

    // Create Farmer
    console.log("Request Body:", req.body);
    const farmer = await Farmer.create({
      name,
      mobileNumber,
      email: email.toLowerCase().trim(),
      village,
      district,
      address,
      aadharNumber,
      creditLimit: creditLimit || 0,
      status: status || "active",
    });

    // ================= SEND EMAIL =================
    try {
      await sendRegistrationEmail(
        farmer.email,
        farmer.name,
        farmer.district
      );

      console.log("✅ Registration email sent successfully.");
    } catch (emailError) {
      console.error(
        "❌ Failed to send registration email:",
        emailError.message
      );
    }

    // Response
    res.status(201).json({
      success: true,
      message: "Farmer Added Successfully",
      farmer,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ================= GET ALL FARMERS =================
export const getAllFarmers = async (req, res) => {
  try {
    const farmers = await Farmer.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, totalFarmers: farmers.length, farmers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET SINGLE FARMER =================
export const getSingleFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id);
    if (!farmer) return res.status(404).json({ message: "Farmer not found" });
    res.status(200).json({ success: true, farmer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= UPDATE FARMER =================
export const updateFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id);
    if (!farmer) return res.status(404).json({ message: "Farmer not found" });

    if (req.body.email) req.body.email = req.body.email.toLowerCase().trim();

    const updatedFarmer = await Farmer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: "after", runValidators: true }
    );

    res.status(200).json({ success: true, message: "Farmer Updated Successfully", updatedFarmer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= DELETE FARMER =================
export const deleteFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.findByIdAndDelete(req.params.id);
    if (!farmer) return res.status(404).json({ message: "Farmer not found" });
    res.status(200).json({ success: true, message: "Farmer Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= SEARCH FARMER =================
export const searchFarmer = async (req, res) => {
  try {
    const { keyword } = req.query;
    if (!keyword) return res.status(400).json({ message: "Search keyword is required" });

    const farmers = await Farmer.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { village: { $regex: keyword, $options: "i" } },
        { district: { $regex: keyword, $options: "i" } }, // Added to search
        { mobileNumber: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
      ],
    });

    res.status(200).json({ success: true, totalResults: farmers.length, farmers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};