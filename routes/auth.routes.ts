import { Router } from "express";
import { login, refresh, logout } from "../controllers/auth.controller";
import { validateBody } from "../middleware/validation.middleware";
import {
  loginSchema,
  refreshSchema,
  logoutSchema,
} from "../validators/auth.validator";

const router: Router = Router();

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: User login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: Login successful, returns JWT token
 *       '400':
 *         description: Validation error
 *       '401':
 *         description: Invalid credentials
 */
router.post("/login", validateBody(loginSchema), login);
/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     summary: Refresh JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *             required:
 *               - refreshToken
 *     responses:
 *       '200':
 *         description: Token refreshed
 *       '400':
 *         description: Validation error
 *       '401':
 *         description: Invalid refresh token
 */
router.post("/refresh", validateBody(refreshSchema), refresh);
/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Logout user and revoke refresh token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *             required:
 *               - refreshToken
 *     responses:
 *       '200':
 *         description: Logout successful
 *       '400':
 *         description: Validation error
 */
router.post("/logout", validateBody(logoutSchema), logout);

export default router;
