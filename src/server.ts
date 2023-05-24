import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { urlencoded } from "express";

// Import routers
import { authRouter } from "./routes/auth";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;

// To parse either form data or JSON
app.use(urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Use routers
app.use("/auth", authRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
