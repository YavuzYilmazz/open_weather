import { Request, Response, NextFunction } from "express";
import { fetchWeatherByCity } from "../services/weather.service";
import { ApiError } from "../utils/ApiError";

// GET /weather - Fetch weather data by city
export async function getWeather(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { city, lat, lon, units } = req.query;
  try {
    if (!city) {
      return next(new ApiError(400, "city query parameter is required"));
    }
    const data = await fetchWeatherByCity(
      city as string,
      units as string | undefined
    );
    res.json(data);
  } catch (err: any) {
    next(new ApiError(500, "Failed to fetch weather data", err.message));
  }
}
