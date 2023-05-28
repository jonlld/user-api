import express, { Request, Response } from "express";
import { knex } from "../database/database";
import {
  AuthenticatedRequest,
  authenticateToken,
} from "../middleware/authenticateToken";
import Joi from "joi";

const router = express.Router();

/*
Notes: 
- All routes use authenticateToken middleware to authorise prior to actioning
- Note, the below assumes user is *not* admin
- To this effect, using middleware to access current userId and check match for destructive requests 
*/

// To sanitize and validate input for updating user data
const updateSchema = Joi.object({
  name: Joi.string().trim().min(2).max(256).required(),
  email: Joi.string().trim().email().required(),
}).options({ abortEarly: false });

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
router.put(
  "/:id",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    // Get user id
    const { id } = req.params;

    // If match, update
    if (req.userId?.toString() === id) {
      try {
        // Validate req.body
        const { error } = updateSchema.validate(req.body);

        // If validation fails, return 400 'bad request' with detail
        if (error) {
          return res.status(400).json({ error: error.details[0].message });
        }

        // Otherwise, continue
        // Get payload, renaming properties
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
    }
    // If no match, unauthorized
    else {
      res.status(401).json({ error: "Unauthorized" });
    }
  }
);

// Delete specific user by id
router.delete(
  "/:id",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    // Get user id
    const { id } = req.params;

    // If match, delete
    // Note: id is string while req.userId is number; converting latter to string to fix
    if (req.userId?.toString() === id) {
      try {
        // Query db; returns num of deleted rows (0 or 1)
        await knex("users").where({ id }).del();
        res.status(200).json({ message: "User deleted successfully" });
      } catch (error) {
        res.status(500).json({ error: "Internal server error" });
      }
    }
    // If no match, unauthorized
    else {
      res.status(401).json({ error: "Unauthorized" });
    }
  }
);

// Named export, to differentiate
export { router as userRoutes };
