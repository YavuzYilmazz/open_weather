import { Router } from "express";
import { createUser, listQueries } from "../controllers/admin.controller";
import { authenticateJWT, authorize } from "../middleware/auth.middleware";

const router: Router = Router();

router.post("/users", createUser);
router.get("/queries", authenticateJWT, authorize("ADMIN"), listQueries);

export default router;
