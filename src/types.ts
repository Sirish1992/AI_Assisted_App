export interface GeoCity {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
  country_code: string;
  timezone: string;
  population?: number;
}

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  weatherCode: number;
  isDay: boolean;
  pressure: number;
  cloudCover: number;
  uvIndex: number;
  precipitation: number;
}

export interface HourlyData {
  time: string[];
  temperature_2m: number[];
  apparent_temperature: number[];
  precipitation_probability: number[];
  precipitation: number[];
  weather_code: number[];
  wind_speed_10m: number[];
  uv_index: number[];
  relative_humidity_2m: number[];
  surface_pressure: number[];
}

export interface DailyData {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  apparent_temperature_max: number[];
  apparent_temperature_min: number[];
  sunrise: string[];
  sunset: string[];
  uv_index_max: number[];
  precipitation_sum: number[];
  precipitation_probability_max: number[];
  wind_speed_10m_max: number[];
}

export interface AirQualityData {
  usAqi: number;
  pm25: number;
  pm10: number;
  ozone: number;
  nitrogenDioxide: number;
  sulphurDioxide: number;
  carbonMonoxide: number;
}

export interface WeatherData {
  city: GeoCity;
  current: CurrentWeather;
  hourly: HourlyData;
  daily: DailyData;
  airQuality?: AirQualityData;
  fetchedAt: string;
}

export type TempUnit = 'C' | 'F';
export type SpeedUnit = 'kmh' | 'mph';

export interface ActivityScore {
  id: string;
  name: string;
  score: number; // 0 to 100
  rating: 'Optimal' | 'Favorable' | 'Moderate' | 'Unfavorable';
  icon: string;
  reason: string;
}

export interface WeatherCodeInfo {
  code: number;
  label: string;
  iconName: string;
  description: string;
  bgGradient: string;
  cardBg: string;
  accentColor: string;
}
