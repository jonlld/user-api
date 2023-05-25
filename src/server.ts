import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { urlencoded } from "express";

// Import routers
import { authRoutes } from "./routes/auth";
import { userRoutes } from "./routes/users";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;

// To parse either form data or JSON
app.use(urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Use routers
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Export for use in tests/setup.ts
export { app };
