import { Router, type RequestHandler } from "express";
import { getWeather } from "../controllers/weather.controller";
import { authenticateJWT } from "../middleware/auth.middleware";

const router: ReturnType<typeof Router> = Router();

router.get("/", authenticateJWT, getWeather);

export default router;
