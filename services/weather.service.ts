import axios from "axios";
import { config } from "../config/config";
import { prisma } from "../loaders/db.loader";

import { ApiError } from "../utils/ApiError";
export async function fetchWeather(params: {
  userId: string;
  city?: string;
  lat?: number;
  lon?: number;
  units?: string;
}): Promise<any> {
  const { userId, city, lat, lon, units = "metric" } = params;
  const apiKey = config.openWeatherApiKey;
  let url = "https://api.openweathermap.org/data/2.5/weather?";
  if (city) {
    url += `q=${encodeURIComponent(city)}&`;
  } else if (lat !== undefined && lon !== undefined) {
    url += `lat=${lat}&lon=${lon}&`;
  } else {
    throw new ApiError(400, "Either city or both lat and lon must be provided");
  }
  url += `units=${units}&appid=${apiKey}`;
  // In test environment, stub external API call
  let apiData: any;
  if (process.env.NODE_ENV === "test") {
    apiData = { temp: 20, weather: [{ description: "Test weather" }] };
  } else {
    const resp = await axios.get(url);
    apiData = resp.data;
  }
  // Persist query and return the record
  const record = await prisma.weatherQuery.create({
    data: {
      userId,
      city: city ?? null,
      lat: lat ?? null,
      lon: lon ?? null,
      units,
      response: apiData,
      cacheHit: false,
    },
  });
  return record;
}
