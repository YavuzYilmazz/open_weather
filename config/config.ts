import dotenv from "dotenv";
dotenv.config();

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} environment variable is required`);
  return value;
}

interface Config {
  port: number;
  databaseUrl: string;
  openWeatherApiKey: string;
}

export const jwtSecret = requireEnv("JWT_SECRET");
const portRaw = process.env.PORT ?? "3000";

export const config: Config = {
  port: Number(portRaw),
  databaseUrl: requireEnv("DATABASE_URL"),
  openWeatherApiKey: requireEnv("OPENWEATHER_API_KEY"),
};
// Sentry DSN for error monitoring
export const sentryDsn: string = process.env.SENTRY_DSN || "";
