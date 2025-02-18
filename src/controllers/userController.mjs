import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.mjs";

export const registerUser = async (req, res) => {
  const { name, phone_num, email, user_type, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists." });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, phone_num, email, user_type, hashed_password: hashedPassword });

    // Save the new user
    await user.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ error: error.message || "Error registering user" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    console.log("User found:", user); // Debugging line

    // Log the plain password and hashed password
    console.log("Plain password:", password); // Debugging line
    console.log("Hashed password in DB:", user.hashed_password); // Debugging line

    // Check password match
    const isMatch = await bcrypt.compare(password, user.hashed_password);
    console.log("Password match result:", isMatch); // Debugging line
    
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    console.log("Password matched"); // Debugging line

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'default_secret', { expiresIn: "1h" });

    res.status(200).json({ token, user });
  } catch (error) {
    console.error(error); // Debugging line
    res.status(500).json({ error: "Server error" });
  }
};
