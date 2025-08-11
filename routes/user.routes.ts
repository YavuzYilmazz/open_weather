import { Router } from "express";
import { listUserQueries } from "../controllers/user.controller";
import { authenticateJWT } from "../middleware/auth.middleware";

const router: Router = Router();

/**
 * @openapi
 * /me/queries:
 *   get:
 *     summary: List weather queries for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Array of weather queries
 *       '401':
 *         description: Unauthorized
 */
router.get("/queries", authenticateJWT, listUserQueries);

export default router;
