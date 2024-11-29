const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors()); // Allow cross-origin requests
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

// Export the app (for serverless deployment on platforms like Vercel)
module.exports = app;

// Start the server only if not in a serverless environment
if (require.main === module) {
  const PORT = process.env.PORT || 3000; // Use environment variable PORT or default to 3000
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}
