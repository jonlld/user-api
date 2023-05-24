import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();

// Dynamic port reference
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// TODO Add routes

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
