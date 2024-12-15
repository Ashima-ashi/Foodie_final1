const express = require("express");
const jwt = require("jsonwebtoken"); // Ensure you have this library installed
const router = express.Router();
const Review = require("../models/reviewModel");
// Middleware to check if the user is logged in and extract their role
const authenticateUser = (req, res, next) => {
  const authHeader = req.header("Authorization");
  console.log("authHeader", authHeader);
  if (!authHeader) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  // Extract token from "Bearer <token>" format
  const token = authHeader.replace("Bearer ", "").trim();

  if (!token) {
    return res.status(401).json({ message: "Access denied. Token is missing." });
  }

  try {
    // Decode token and verify with the secret
    const decoded = jwt.verify(token, process.env.secret);
    req.user = decoded; // Attach user info to req.user
    console.log("Authenticated user:", decoded); // Debugging log
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

// POST: Submit a review
router.post("/submit", authenticateUser, async (req, res) => {
  const { email, rating, reviewText } = req.body;

  // Restrict admins from submitting reviews
  if (req.user.role && req.user.role.toLowerCase() === "admin") {
    return res.status(403).json({ message: "Admins are not allowed to submit reviews." });
  }

  // Validate input
  if (!email || !rating || !reviewText) {
    return res.status(400).json({ message: "Email, rating, and review text are required." });
  }

  // Validate email format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  try {
    const newReview = new Review({ email, rating, reviewText });
    await newReview.save();
    return res.status(201).json({ message: "Review submitted successfully!" });
  } catch (error) {
    console.error("Error saving review:", error);
    return res.status(500).json({ message: "Failed to submit review. Try again later." });
  }
});

// GET: Fetch all reviews
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    return res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res.status(500).json({ message: "Failed to fetch reviews. Try again later." });
  }
});

module.exports = router;