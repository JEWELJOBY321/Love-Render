const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static("public"));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection ERROR:", err));

// Schema for storing submissions
const LoveSchema = new mongoose.Schema({
  yourName: String,       // Optional user name
  crushName: String,      // Required crush name
  match: Number,          // Random percentage
  time: String            // Submission timestamp
});

const Love = mongoose.model("Love", LoveSchema);

// Save user submission
app.post("/submit", async (req, res) => {
  const { yourName, crushName, match } = req.body;

  if (!crushName) {
    return res.status(400).json({ success: false, error: "Crush name is required" });
  }

  try {
    await Love.create({
      yourName,
      crushName,
      match,
      time: new Date().toLocaleString()
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin route to see all submissions
app.get("/admin", async (req, res) => {
  const key = req.query.key;
  if (!key || key !== process.env.ADMIN_KEY) {
    return res.status(403).send("Access Denied");
  }

  try {
    const data = await Love.find().sort({ _id: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Serve main page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Serve result page (optional)
app.get("/result.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "result.html"));
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
