import express, { Request, Response } from "express";
import { knex } from "../database/database";
import { authenticateToken } from "../middleware/authenticateToken";

const router = express.Router();

// Get all users
router.get("/", authenticateToken, async (req: Request, res: Response) => {
  try {
    // Only id, name, email fields
    const users = await knex("users").select("id", "name", "email");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
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

    // In case of 'undefined' user, send 404 'not found' error
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Send default status and user data
    res.status(200).json(user);
  } catch (error) {
    // If error, send 500 and message
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put(":/id", authenticateToken, async (req: Request, res: Response) => {
  try {
    // Get id and payload
    const { id } = req.params;
    const { name: newName, email: newEmail } = req.body;

    // Update db
    await knex("users")
      .where({ id })
      .update({ name: newName, email: newEmail });

    // Send processed status and message
    res.status(204).json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Named export, to differentiate
export { router as userRoutes };
