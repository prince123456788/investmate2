const express = require("express");
const mongoose = require("mongoose");
const { User, Investment, Withdrawal, connectToDatabase } = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Connect to the database
connectToDatabase();

// Get all users
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all investments
app.get("/api/investments", async (req, res) => {
  try {
    const investments = await Investment.find({});
    res.json(investments);
  } catch (error) {
    console.error("Error fetching investments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all withdrawals
app.get("/api/withdrawals", async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({});
    res.json(withdrawals);
  } catch (error) {
    console.error("Error fetching withdrawals:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a withdrawal by ID
app.delete("/api/withdrawals/:id", async (req, res) => {
  try {
    const result = await Withdrawal.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Withdrawal not found" });
    }
    res.status(200).json({ message: "Withdrawal deleted successfully" });
  } catch (error) {
    console.error("Error deleting withdrawal:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
