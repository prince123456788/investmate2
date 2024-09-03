// db.js
const mongoose = require("mongoose");

// MongoDB connection URI
const MONGO_URI =
  "mongodb+srv://okoid721:NJcGvESFVzdiaMJp@cluster0.ur3pl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Define a schema for storing user data
const userSchema = new mongoose.Schema({
  userId: { type: Number, required: true, unique: true },
  firstName: String,
  lastName: String,
  username: String,
  dateJoined: { type: Date, default: Date.now },
});

// Create a model based on the schema
const User = mongoose.model("User", userSchema);

async function connectToDatabase() {
  try {
    await mongoose.connect(MONGO_URI); // No need for useNewUrlParser or useUnifiedTopology options
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

module.exports = {
  connectToDatabase,
  User,
};
