import type { Request, Response, NextFunction } from "express";
import { fetchWeather } from "../services/weather.service";
import { ApiError } from "../utils/ApiError";

// GET /weather - Fetch weather data by city
export async function getWeather(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { city, lat, lon, units } = req.query;
  try {
    const userId = (req as any).user?.id || "anonymous";
    // Prepare parameters for fetchWeather without explicit undefineds
    const params: {
      userId: string;
      city?: string;
      lat?: number;
      lon?: number;
      units?: string;
    } = { userId };
    if (typeof city === "string") params.city = city;
    if (typeof lat === "string") params.lat = Number(lat);
    if (typeof lon === "string") params.lon = Number(lon);
    if (typeof units === "string") params.units = units;
    const data = await fetchWeather(params);
    res.json(data);
  } catch (err: any) {
    next(new ApiError(500, "Failed to fetch weather data", err.message));
  }
}
