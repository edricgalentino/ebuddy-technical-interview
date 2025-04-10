import { Router, RequestHandler } from "express";
import { getUserData, updateUserData, createUser, getPotentialUsers } from "../controller/api";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// User creation route - no auth required because the user is being created
router.post("/create", createUser);

// Protected routes - require authentication
router.use(authMiddleware as RequestHandler);
router.get("/fetch-user-data", getUserData); // Get all users
router.get("/fetch-user-data/:id", getUserData); // Get user by ID
router.get("/potential-users", getPotentialUsers); // Get users ranked by potential score
router.put("/update-user-data/:id", updateUserData);

export default router;
