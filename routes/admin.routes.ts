import { Router } from "express";
import {
  createUser,
  listQueries,
  listUsers,
  updateUser,
  deleteUser,
} from "../controllers/admin.controller";
import { authenticateJWT, authorize } from "../middleware/auth.middleware";

const router: Router = Router();

router.post("/users", authenticateJWT, createUser);
router.get("/users", authenticateJWT, authorize("ADMIN"), listUsers);
router.patch("/users/:id", authenticateJWT, authorize("ADMIN"), updateUser);
router.delete("/users/:id", authenticateJWT, authorize("ADMIN"), deleteUser);
router.get("/queries", authenticateJWT, authorize("ADMIN"), listQueries);

export default router;
