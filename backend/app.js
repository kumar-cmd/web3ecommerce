const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Allow requests from the frontend
app.use(bodyParser.json()); // Parse JSON request bodies

// Routes
app.post("/buy", (req, res) => {
  const { id, owner, sellingPrice } = req.body;

  if (!id || !owner || !sellingPrice) {
    return res.status(400).json({ error: "Invalid request. Missing fields." });
  }

  console.log(`Cycle bought: ID=${id}, Owner=${owner}, Selling Price=₹${sellingPrice}`);

  // Simulating a response
  res.json({ id, owner, sellingPrice });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
