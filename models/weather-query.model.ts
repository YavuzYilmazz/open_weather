export interface WeatherQuery {
  id: string;
  userId: string;
  city?: string;
  lat?: number;
  lon?: number;
  units?: string;
  response: any;
  cacheHit: boolean;
  createdAt: Date;
}
