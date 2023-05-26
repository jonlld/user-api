import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { knex } from "../database/database";

const router = express.Router();

// Extend interface to add userID property
interface AuthenticatedRequest extends Request {
  userId?: number;
}

// Authentication middleware
const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  // Extract from 'authorization' header; split as format is: BEARER <TOKEN>
  const token = req.headers.authorization?.split(" ")[1];

  // If no token, return 401
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // If token, verify
  try {
    // Returns payload and token if veried, and throws error if not
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    );
    // Extract user id from token and add 'userId' property to req object for later use
    req.userId = (decoded as { id: number }).id;
    // Pass request to route handler
    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
};

// Get all users
router.get("/", authenticateToken, async (req: Request, res: Response) => {
  try {
    // Only id, name, email fields
    const users = await knex("users").select("id", "name", "email");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ err: "Internal server error" });
  }
});

// Get specific user by id
router.get("/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    // Get id from parameters
    const { id } = req.params;
    // Query user from db
    const user = await knex("users")
      .select("id", "name", "email")
      .where({ id })
      .first();

    // In case of 'undefined' user send 404 'not found' error
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Send default status and user data
    res.status(200).json(user);
  } catch (err) {
    // If error, send 500 and message
    res.status(500).json({ error: "Internal server error" });
  }
});

// Named export, to differentiate
export { router as userRoutes };
