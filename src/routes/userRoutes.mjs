import express from "express";
import User from "../models/User.mjs";
import { registerUser, loginUser } from "../controllers/userController.mjs";
const router = express.Router();

// Create a new user
router.post("/", async (req, res) => {
  try {
    const { name, phone_num, email, user_type, hashed_password } = req.body;

    // Optional: Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists." });
    }

    const newUser = new User({ name, phone_num, email, user_type, hashed_password });
    await newUser.save();

    res.status(201).json({ message: "User created successfully!", user: newUser });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/register", registerUser);

router.post("/login", loginUser);

export default router;
