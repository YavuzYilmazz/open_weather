import { Router } from "express";
import { listUserQueries } from "../controllers/user.controller";
import { authenticateJWT } from "../middleware/auth.middleware";

const router: Router = Router();

router.get("/queries", authenticateJWT, listUserQueries);

export default router;
