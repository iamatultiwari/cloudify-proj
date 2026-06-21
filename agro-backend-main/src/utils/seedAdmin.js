import User from "../models/User.js";
import bcrypt from "bcryptjs";

const seedAdmin = async () => {
  try {
    const adminEmail = "admin";
    const adminExists = await User.findOne({ email: adminEmail });
    
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("shreeji@55", salt);
      
      await User.create({
        name: "Admin",
        email: adminEmail,
        password: hashedPassword,
      });
      
      console.log(`Default Admin created - Username: ${adminEmail} | Password: shreeji@55`);
    }
  } catch (error) {
    console.error("Error seeding admin user:", error.message);
  }
};

export default seedAdmin;