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
  cacheTtlSeconds: number;
}

export const jwtSecret = requireEnv("JWT_SECRET");
const portRaw = process.env.PORT ?? "3000";

// Support both uppercase and lowercase DATABASE_URL
const rawDbUrl = process.env.DATABASE_URL ?? process.env.database_url;
if (!rawDbUrl) throw new Error("DATABASE_URL environment variable is required");
export const config: Config = {
  port: Number(portRaw),
  databaseUrl: rawDbUrl,
  openWeatherApiKey: requireEnv("OPENWEATHER_API_KEY"),
  cacheTtlSeconds: Number(process.env.CACHE_TTL_SECONDS ?? "3600"),
};
// Sentry DSN for error monitoring
export const sentryDsn: string = process.env.SENTRY_DSN || "";
