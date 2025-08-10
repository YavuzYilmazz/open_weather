import axios from "axios";
import { config } from "../config/config";
import { prisma } from "../loaders/db.loader";

export async function fetchWeatherByCity(userId: string, city: string, units = "metric") {
  const apiKey = config.openWeatherApiKey;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=${units}&appid=${apiKey}`;
  const response = await axios.get(url);
  await prisma.weatherQuery.create({
    data: {
      userId,
      city,
      units,
      response: response.data,
      cacheHit: false,
    },
  });
  return response.data;
}
