const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();   // FIRST

const userRoutes = require("./routes/userRoutes");   // AFTER dotenv

const app = express();

app.use(cors());
app.use(express.json());
app.use(userRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

