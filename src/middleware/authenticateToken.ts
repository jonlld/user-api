import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend interface to add userID property
interface AuthenticatedRequest extends Request {
  userId?: string;
}

// Returned by jwt.verify
interface DecodedToken {
  id: number;
  email: string;
  iat: number;
  exp: number;
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
    // Returns payload and token if veried; throws error if not
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as DecodedToken;
    // Add userId property to AuthenticatedRequest object - for id comparison in endpoints
    req.userId = decoded.id.toString();

    // Pass request to route handler
    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
};

export { AuthenticatedRequest, authenticateToken };
