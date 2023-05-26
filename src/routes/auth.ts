import express, { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { knex } from "../database/database";
import Joi from "joi";

const router = express.Router();

// To sanitize and validate input for /register endpoint
// abortEarly:false to pool *all* validation errors
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

    // If validation fails, return 400 'bad request' with detail
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Otherwise, continue
    const { name, email, password } = req.body;

    // Check if user already exists
    // Filter for first row with matching email
    const userExists = await knex("users").where({ email }).first();

    // If user already exists, return 409 'conflict' with message
    if (userExists) {
      return res.status(409).json({ error: "User already exists" });
    }

    // If user does not exist, hash password and add to db
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { name, email, password: hashedPassword };
    await knex("users").insert(newUser);

    // Then return 201 'created' with message
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    // 500 'internal server error'
    res.status(500).json({ error: "Internal server error" });
  }
});

// User login
// Issue JWT token to client on successful login
router.post("/login", async (req: Request, res: Response) => {
  try {
    // Validate req.body
    const { error } = loginSchema.validate(req.body);

    // If validation fails, return 400 'bad request' with detail
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Otherwise, continue
    const { email, password } = req.body;

    // Check if user exists; if no record, return 'no resource' and message
    const user = await knex("users").where({ email }).first();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // If user exists, check password
    // If no match, return 'invalid' and message
    const pswdMatch = await bcrypt.compare(password, user.password);
    if (!pswdMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // If match, issue 1hr token
    // Note: sign takes payload, key (using 'as string' type assertion), options
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "1h" }
    );

    // Respond to client with default 200 status and token
    res.status(200).json({ token });
  } catch (error) {
    // 500 'internal server error'
    res.status(500).json({ error: "Internal server error" });
  }
});

// Named export, to differentiate
export { router as authRoutes };
