import { Request, Response, NextFunction } from "express";
import admin from "../config/firebaseConfig";

export interface AuthRequest extends Request {
  user?: {
    uid: string;
    email?: string;
  };
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized - Missing or invalid authentication token" });
    }

    const token = authHeader.split("Bearer ")[1];

    // For simplicity in this example, we'll do a basic check
    // In a real application, you would verify the token with Firebase
    if (!token || token.trim() === "") {
      return res.status(401).json({ error: "Unauthorized - Invalid token" });
    }

    try {
      // Uncomment this in a real application to verify the token with Firebase
      // const decodedToken = await admin.auth().verifyIdToken(token);
      // req.user = { uid: decodedToken.uid, email: decodedToken.email };

      // For this example, we'll just mock the user
      req.user = { uid: "sample-user-id", email: "user@example.com" };

      next();
    } catch (error) {
      return res.status(401).json({ error: "Unauthorized - Invalid token" });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({ error: "Internal server error during authentication" });
  }
};
