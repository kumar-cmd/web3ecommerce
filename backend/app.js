const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(bodyParser.json()); // Parse JSON request bodies


// Root Route - Return "Hello, World!"
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Routes
app.post("/buy", (req, res) => {
  const { id, owner, sellingPrice } = req.body;

  if (!id || !owner || !sellingPrice) {
    return res.status(400).json({ error: "Invalid request. Missing fields." });
  }

  console.log(`Cycle bought: ID=${id}, Owner=${owner}, Selling Price=₹${sellingPrice}`);

  // Respond with the data
  res.json({ id, owner, sellingPrice });
});

// Use dynamic port for Render deployment
const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0"; // Listen on all network interfaces

// Start the server
app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
