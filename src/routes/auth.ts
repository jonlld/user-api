import express, { Request, Response, NextFunction } from "express";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import knex from "../database/database";

const router = express.Router();

// User registration
router.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    // test connection with POSTMAN
    res.send("POST received!");
  }
);

// Named export
export { router as authRouter };
