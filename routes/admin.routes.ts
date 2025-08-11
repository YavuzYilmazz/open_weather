import { Router } from "express";
import {
  createUser,
  listQueries,
  listUsers,
  updateUser,
  deleteUser,
} from "../controllers/admin.controller";
import { authenticateJWT, authorize } from "../middleware/auth.middleware";
import type { Request, Response, NextFunction } from "express";
import { prisma } from "../loaders/db.loader";
import {
  validateBody,
  validateParams,
} from "../middleware/validation.middleware";
import {
  createUserSchema,
  updateUserSchema,
  idParamSchema,
} from "../validators/admin.validator";

const router: Router = Router();
// Middleware to allow creating the first admin without authentication
const allowFirstAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const count = await prisma.user.count();
  // Only allow creating the very first user if role is ADMIN
  if (count === 0 && req.body?.role === "ADMIN") {
    return next();
  }
  authenticateJWT(req, res, (err?: any) => {
    if (err) return next(err);
    authorize("ADMIN")(req, res, next);
  });
};
/**
 * @openapi
 * /admin/users:
 *   post:
 *     summary: Create a new user (Admin only)
 *     security:
 *       - bearerAuth: []
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
 *               role:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *               - role
 *     responses:
 *       '201':
 *         description: User created
 *       '400':
 *         description: Validation error
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 */

router.post(
  "/users",
  allowFirstAdmin,
  validateBody(createUserSchema),
  createUser
);
/**
 * @openapi
 * /admin/users:
 *   get:
 *     summary: List all users (Admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Array of user objects
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 */

router.get("/users", authenticateJWT, authorize("ADMIN"), listUsers);
/**
 * @openapi
 * /admin/users/{id}:
 *   patch:
 *     summary: Update a user's role (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: UUID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *             required:
 *               - role
 *     responses:
 *       '200':
 *         description: User updated
 *       '400':
 *         description: Validation error
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '404':
 *         description: User not found
 */

router.patch(
  "/users/:id",
  authenticateJWT,
  authorize("ADMIN"),
  validateParams(idParamSchema),
  validateBody(updateUserSchema),
  updateUser
);
/**
 * @openapi
 * /admin/users/{id}:
 *   delete:
 *     summary: Delete a user (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: UUID of the user to delete
 *     responses:
 *       '200':
 *         description: User deleted
 *       '400':
 *         description: Validation error
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '404':
 *         description: User not found
 */

router.delete(
  "/users/:id",
  authenticateJWT,
  authorize("ADMIN"),
  validateParams(idParamSchema),
  deleteUser
);
/**
 * @openapi
 * /admin/queries:
 *   get:
 *     summary: List all weather queries (Admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Array of weather queries
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 */
router.get("/queries", authenticateJWT, authorize("ADMIN"), listQueries);

export default router;
