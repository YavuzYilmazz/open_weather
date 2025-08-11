import { Router, type RequestHandler } from "express";
import { getWeather } from "../controllers/weather.controller";
import { authenticateJWT } from "../middleware/auth.middleware";
import { listUserQueries } from "../controllers/user.controller";

const router: ReturnType<typeof Router> = Router();

router.get("/", authenticateJWT, getWeather);
router.get("/queries", authenticateJWT, listUserQueries);

export default router;
