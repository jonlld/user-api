import express, { Request, Response } from "express";
import { knex } from "../database/database";
import {
  AuthenticatedRequest,
  authenticateToken,
} from "../middleware/authenticateToken";

const router = express.Router();

/*
Notes: 
- All routes use authenticateToken middleware to authorise prior to actioning
- Note, the below assumes user is *not* admin
- To this effect, using middleware to access current userId and check match for id-related requests 
*/

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

// Update specific user by id
router.put("/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    // Get id and payload, renaming properties
    const { id } = req.params;
    const { name: newName, email: newEmail } = req.body;

    // Update db
    await knex("users")
      .where({ id })
      .update({ name: newName, email: newEmail });

    // Send default status and message
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete specific user by id
router.delete(
  "/:id",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    // Get user id
    const { id } = req.params;

    if (req.userId === id) {
      try {
        // Query db; returns num of deleted rows (0 or 1)
        const deletedCount = await knex("users").where({ id }).del();

        if (deletedCount > 0) {
          res.status(200).json({ message: "User deleted successfully" });
        } else {
          // Send not found status and message
          res.status(404).json({ message: "User not found" });
        }
      } catch (error) {
        res.status(500).json({ error: "Internal server error" });
      }
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  }
);

// Named export, to differentiate
export { router as userRoutes };
