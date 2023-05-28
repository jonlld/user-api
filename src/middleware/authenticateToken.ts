import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend Request interface, adding userID property
interface AuthenticatedRequest extends Request {
  userId?: string;
}

// Authentication middleware
const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  // Extract from authorization header and split at space: BEARER <TOKEN>
  const token = req.headers.authorization?.split(" ")[1];

  // If no token, return 401
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // If token, verify
  try {
    // Return payload and token if veried; throw error if not
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    );

    // Add userId property to AuthenticatedRequest object - for id check in update/delete endpoints
    req.userId = (decoded as { id: string }).id;

    // Pass request to route handler
    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
};

export { AuthenticatedRequest, authenticateToken };
