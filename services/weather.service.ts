import axios from 'axios';
import { config } from '../config/config';

export async function fetchWeatherByCity(city: string, units = 'metric') {
  const apiKey = config.openWeatherApiKey;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=${units}&appid=${apiKey}`;
  const response = await axios.get(url);
  return response.data;
}
