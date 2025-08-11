import { Router } from "express";
import { getWeather } from "../controllers/weather.controller";
import { authenticateJWT } from "../middleware/auth.middleware";
import { validateQuery } from "../middleware/validation.middleware";
import { weatherQuerySchema } from "../validators/weather.validator";
import { listUserQueries } from "../controllers/user.controller";

const router: ReturnType<typeof Router> = Router();
/**
 * @openapi
 * /weather:
 *   get:
 *     summary: Get weather information by city or coordinates
 *     parameters:
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: City name to fetch weather for
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *         description: Latitude for coordinate-based query
 *       - in: query
 *         name: lon
 *         schema:
 *           type: number
 *         description: Longitude for coordinate-based query
 *       - in: query
 *         name: units
 *         schema:
 *           type: string
 *         description: Units for temperature (e.g., metric or imperial)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Weather data
 *       '400':
 *         description: Missing or invalid query parameters
 *       '401':
 *         description: Unauthorized
 */

router.get("/", authenticateJWT, validateQuery(weatherQuerySchema), getWeather);
/**
 * @openapi
 * /weather/queries:
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
