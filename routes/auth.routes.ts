import { Router } from "express";
import { login, refresh, logout } from "../controllers/auth.controller";
import { validateBody } from "../middleware/validation.middleware";
import {
  loginSchema,
  refreshSchema,
  logoutSchema,
} from "../validators/auth.validator";

const router: Router = Router();

// Apply validation before controllers
router.post("/login", validateBody(loginSchema), login);
router.post("/refresh", validateBody(refreshSchema), refresh);
router.post("/logout", validateBody(logoutSchema), logout);

export default router;
