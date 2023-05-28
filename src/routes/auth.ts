import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { knex } from "../database/database";
import Joi from "joi";

const router = express.Router();

// Sanitize and validate input for /register endpoint
// Note: 'abortEarly:false' pools all validation errors
const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(256).required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().min(8).max(255).required(),
}).options({ abortEarly: false });

const loginSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().min(8).max(255).required(),
});

// User registration
router.post("/register", async (req: Request, res: Response) => {
  try {
    // Validate req.body
    const { error } = registerSchema.validate(req.body);

    // If fails, return 400 'bad request' and detail
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { name, email, password } = req.body;

    // Check if user exists, filtering for first matching row
    const userExists = await knex("users").where({ email }).first();

    // If exists, return 409 and message
    if (userExists) {
      return res.status(409).json({ error: "User already exists" });
    }

    // If does not exist, hash password and insert
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { name, email, password: hashedPassword };
    await knex("users").insert(newUser);

    // Then return 201 'created' status, with message
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    // 500 'internal server error'
    res.status(500).json({ error: "Internal server error" });
  }
});

// User login - issue JWT token to client if validated
router.post("/login", async (req: Request, res: Response) => {
  try {
    // Validate req.body
    const { error } = loginSchema.validate(req.body);

    // If fails, return 400 'bad request' and detail
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password } = req.body;

    // Check if user exists
    const user = await knex("users").where({ email }).first();

    // If does not exist, return 'no resource' and message
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // If exists, check password
    // If mismatch, return 401 'invalid' and message
    const pswdMatch = await bcrypt.compare(password, user.password);
    if (!pswdMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // If match, issue 1hr access token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "1h" }
    );

    // Respond to client with 200 status and token
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export { router as authRoutes };
