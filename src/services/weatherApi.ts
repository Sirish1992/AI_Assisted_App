import { GeoCity, WeatherData, AirQualityData } from '../types';

export const DEFAULT_CITIES: GeoCity[] = [
  { id: 1, name: 'Tokyo', latitude: 35.6762, longitude: 139.6503, country: 'Japan', country_code: 'JP', timezone: 'Asia/Tokyo' },
  { id: 2, name: 'London', latitude: 51.5074, longitude: -0.1278, country: 'United Kingdom', country_code: 'GB', timezone: 'Europe/London' },
  { id: 3, name: 'New York', latitude: 40.7128, longitude: -74.006, country: 'United States', admin1: 'New York', country_code: 'US', timezone: 'America/New_York' },
  { id: 4, name: 'Paris', latitude: 48.8566, longitude: 2.3522, country: 'France', country_code: 'FR', timezone: 'Europe/Paris' },
  { id: 5, name: 'Sydney', latitude: -33.8688, longitude: 151.2093, country: 'Australia', country_code: 'AU', timezone: 'Australia/Sydney' },
  { id: 6, name: 'Dubai', latitude: 25.2048, longitude: 55.2708, country: 'United Arab Emirates', country_code: 'AE', timezone: 'Asia/Dubai' },
  { id: 7, name: 'San Francisco', latitude: 37.7749, longitude: -122.4194, country: 'United States', admin1: 'California', country_code: 'US', timezone: 'America/Los_Angeles' },
];

export async function searchCities(query: string): Promise<GeoCity[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=10&language=en&format=json`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Geocoding request failed with status ${res.status}`);
    }

    const data = await res.json();
    if (!data.results || data.results.length === 0) {
      return [];
    }

    return data.results.map((item: any) => ({
      id: item.id,
      name: item.name,
      latitude: item.latitude,
      longitude: item.longitude,
      country: item.country || '',
      admin1: item.admin1,
      country_code: item.country_code || '',
      timezone: item.timezone || 'auto',
      population: item.population,
    }));
  } catch (err) {
    console.error('City search failed:', err);
    throw new Error(`Unable to find city matching "${trimmed}". Please check the spelling or try another location.`);
  }
}

export async function fetchAirQuality(lat: number, lon: number): Promise<AirQualityData | undefined> {
  try {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone`;
    const res = await fetch(url);
    if (!res.ok) return undefined;
    const data = await res.json();
    if (!data.current) return undefined;

    return {
      usAqi: Math.round(data.current.us_aqi || 0),
      pm25: Math.round(data.current.pm2_5 || 0),
      pm10: Math.round(data.current.pm10 || 0),
      ozone: Math.round(data.current.ozone || 0),
      nitrogenDioxide: Math.round(data.current.nitrogen_dioxide || 0),
      sulphurDioxide: Math.round(data.current.sulphur_dioxide || 0),
      carbonMonoxide: Math.round(data.current.carbon_monoxide || 0),
    };
  } catch (e) {
    console.warn('Air quality fetch omitted:', e);
    return undefined;
  }
}

export async function fetchWeatherData(city: GeoCity): Promise<WeatherData> {
  const { latitude, longitude } = city;

  try {
    const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,surface_pressure,wind_speed_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=auto`;

    const [forecastRes, airQuality] = await Promise.all([
      fetch(forecastUrl),
      fetchAirQuality(latitude, longitude),
    ]);

    if (!forecastRes.ok) {
      throw new Error(`Weather service returned error ${forecastRes.status}`);
    }

    const data = await forecastRes.json();
    const cur = data.current;

    // Calculate live approximate UV index for current hour if available
    let currentUv = 0;
    if (data.hourly && data.hourly.uv_index && data.hourly.time) {
      const nowIso = new Date().toISOString().slice(0, 13); // YYYY-MM-DDTHH
      const matchIndex = data.hourly.time.findIndex((t: string) => t.startsWith(nowIso));
      if (matchIndex !== -1 && data.hourly.uv_index[matchIndex] !== undefined) {
        currentUv = data.hourly.uv_index[matchIndex];
      } else if (data.daily && data.daily.uv_index_max && data.daily.uv_index_max[0]) {
        currentUv = cur.is_day ? Math.round(data.daily.uv_index_max[0] * 0.7) : 0;
      }
    }

    return {
      city,
      current: {
        temperature: cur.temperature_2m,
        apparentTemperature: cur.apparent_temperature,
        humidity: cur.relative_humidity_2m,
        windSpeed: cur.wind_speed_10m,
        windDirection: cur.wind_direction_10m,
        windGusts: cur.wind_gusts_10m || cur.wind_speed_10m * 1.3,
        weatherCode: cur.weather_code,
        isDay: cur.is_day === 1,
        pressure: cur.surface_pressure,
        cloudCover: cur.cloud_cover,
        uvIndex: currentUv,
        precipitation: cur.precipitation || 0,
      },
      hourly: data.hourly,
      daily: data.daily,
      airQuality,
      fetchedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  } catch (err: any) {
    console.error('Weather fetch error:', err);
    throw new Error(`Failed to load weather forecast for ${city.name}: ${err.message || 'Network error'}`);
  }
}

export async function fetchAiWeatherAdvice(weatherData: WeatherData, customQuestion?: string): Promise<string> {
  const { city, current, daily } = weatherData;
  const maxTemp = daily.temperature_2m_max[0] || current.temperature;
  const rainProb = daily.precipitation_probability_max[0] || 0;

  const res = await fetch('/api/weather-ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      city: city.name,
      country: city.country,
      tempC: current.temperature,
      condition: current.weatherCode,
      humidity: current.humidity,
      windSpeed: current.windSpeed,
      uvIndex: current.uvIndex,
      rainProb,
      forecastSummary: `7-day high temp range ${Math.min(...daily.temperature_2m_min)}°C to ${Math.max(...daily.temperature_2m_max)}°C`,
      prompt: customQuestion,
    }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to fetch AI weather intelligence recommendations.');
  }

  const data = await res.json();
  return data.result;
}
