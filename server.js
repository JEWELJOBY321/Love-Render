const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

// Schema
const LoveSchema = new mongoose.Schema({
  yourName: String,
  crushName: String,
  match: Number,
  time: String
});

const Love = mongoose.model("Love", LoveSchema);

// Save data
app.post("/submit", async (req, res) => {
  const { yourName, crushName, match } = req.body;
  await Love.create({
    yourName,
    crushName,
    match,
    time: new Date().toLocaleString()
  });
  res.json({ success: true });
});

// ADMIN (only you)
app.get("/admin", async (req, res) => {
  if (req.query.key !== process.env.ADMIN_KEY) {
    return res.status(403).send("Access Denied");
  }
  const data = await Love.find().sort({ _id: -1 });
  res.json(data);
});

// ROOT ROUTE (THIS FIXES NOT FOUND)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
