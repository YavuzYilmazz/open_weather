import { Router } from "express";
import { createUser, listQueries, listUsers, updateUser, deleteUser } from "../controllers/admin.controller";
import { authenticateJWT, authorize } from "../middleware/auth.middleware";
import { validateBody, validateParams } from "../middleware/validation.middleware";
import { createUserSchema, updateUserSchema, idParamSchema } from "../validators/admin.validator";

const router: Router = Router();

router.post(
  "/users",
  authenticateJWT,
  validateBody(createUserSchema),
  createUser
);

router.get("/users", authenticateJWT, authorize("ADMIN"), listUsers);

router.patch(
  "/users/:id",
  authenticateJWT,
  authorize("ADMIN"),
  validateParams(idParamSchema),
  validateBody(updateUserSchema),
  updateUser
);

router.delete(
  "/users/:id",
  authenticateJWT,
  authorize("ADMIN"),
  validateParams(idParamSchema),
  deleteUser
);
router.get("/queries", authenticateJWT, authorize("ADMIN"), listQueries);

export default router;
