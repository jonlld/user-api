import express, { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
import { knex } from "../database/database";

const router = express.Router();

// New user registration
router.post("/register", async (req: Request, res: Response) => {
  try {
    // TODO Add validation

    const { name, email, password } = req.body;

    // Check if user already exists
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
  } catch (err) {
    // 500 'internal server error'
    res.status(500).json({ error: "Internal server error" });
  }
});

// Named export, to differentiate
export { router as authRouter };
