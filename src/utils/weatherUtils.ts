import { WeatherCodeInfo, ActivityScore, CurrentWeather, DailyData } from '../types';

export const WMO_CODES: Record<number, WeatherCodeInfo> = {
  0: {
    code: 0,
    label: 'Clear Sky',
    iconName: 'Sun',
    description: 'Completely clear skies with high visibility.',
    bgGradient: 'from-amber-500 via-orange-400 to-sky-500',
    cardBg: 'bg-amber-500/10 border-amber-500/20',
    accentColor: 'text-amber-500',
  },
  1: {
    code: 1,
    label: 'Mainly Clear',
    iconName: 'SunMedium',
    description: 'Mostly sunny with scattered light cloud cover.',
    bgGradient: 'from-sky-400 via-blue-400 to-amber-300',
    cardBg: 'bg-sky-500/10 border-sky-500/20',
    accentColor: 'text-sky-500',
  },
  2: {
    code: 2,
    label: 'Partly Cloudy',
    iconName: 'CloudSun',
    description: 'Mix of sun and passing clouds.',
    bgGradient: 'from-sky-500 via-indigo-400 to-slate-400',
    cardBg: 'bg-sky-500/10 border-sky-500/20',
    accentColor: 'text-sky-400',
  },
  3: {
    code: 3,
    label: 'Overcast',
    iconName: 'Cloud',
    description: 'Dense cloud cover blocking direct sunlight.',
    bgGradient: 'from-slate-500 via-zinc-600 to-slate-700',
    cardBg: 'bg-slate-500/10 border-slate-500/20',
    accentColor: 'text-slate-400',
  },
  45: {
    code: 45,
    label: 'Foggy',
    iconName: 'CloudFog',
    description: 'Thick fog reducing outdoor visibility.',
    bgGradient: 'from-zinc-500 via-slate-600 to-neutral-700',
    cardBg: 'bg-zinc-500/10 border-zinc-500/20',
    accentColor: 'text-zinc-400',
  },
  48: {
    code: 48,
    label: 'Depositing Rime Fog',
    iconName: 'CloudFog',
    description: 'Freezing fog forming frost layers on exposed surfaces.',
    bgGradient: 'from-slate-600 via-teal-700 to-slate-800',
    cardBg: 'bg-teal-500/10 border-teal-500/20',
    accentColor: 'text-teal-400',
  },
  51: {
    code: 51,
    label: 'Light Drizzle',
    iconName: 'CloudDrizzle',
    description: 'Fine, gentle drizzle in short intervals.',
    bgGradient: 'from-blue-500 via-sky-600 to-slate-700',
    cardBg: 'bg-blue-500/10 border-blue-500/20',
    accentColor: 'text-blue-400',
  },
  53: {
    code: 53,
    label: 'Moderate Drizzle',
    iconName: 'CloudDrizzle',
    description: 'Steady light mist and drizzling rainfall.',
    bgGradient: 'from-blue-600 via-slate-600 to-indigo-800',
    cardBg: 'bg-blue-500/10 border-blue-500/20',
    accentColor: 'text-blue-400',
  },
  55: {
    code: 55,
    label: 'Dense Drizzle',
    iconName: 'CloudDrizzle',
    description: 'Heavy drizzle with reduced ground visibility.',
    bgGradient: 'from-indigo-600 via-blue-700 to-slate-800',
    cardBg: 'bg-indigo-500/10 border-indigo-500/20',
    accentColor: 'text-indigo-400',
  },
  61: {
    code: 61,
    label: 'Slight Rain',
    iconName: 'CloudRain',
    description: 'Light rainfall showers throughout the area.',
    bgGradient: 'from-blue-600 via-indigo-600 to-slate-800',
    cardBg: 'bg-blue-500/10 border-blue-500/20',
    accentColor: 'text-blue-400',
  },
  63: {
    code: 63,
    label: 'Moderate Rain',
    iconName: 'CloudRain',
    description: 'Steady rain showers with wet road conditions.',
    bgGradient: 'from-cyan-700 via-blue-800 to-slate-900',
    cardBg: 'bg-cyan-500/10 border-cyan-500/20',
    accentColor: 'text-cyan-400',
  },
  65: {
    code: 65,
    label: 'Heavy Rain',
    iconName: 'CloudRainWind',
    description: 'Torrential rain with high surface water runoff.',
    bgGradient: 'from-slate-700 via-blue-900 to-gray-950',
    cardBg: 'bg-blue-600/15 border-blue-600/30',
    accentColor: 'text-blue-500',
  },
  66: {
    code: 66,
    label: 'Freezing Rain',
    iconName: 'CloudHail',
    description: 'Supercooled rain creating ice hazards on contact.',
    bgGradient: 'from-teal-700 via-slate-800 to-cyan-900',
    cardBg: 'bg-teal-500/10 border-teal-500/20',
    accentColor: 'text-teal-300',
  },
  71: {
    code: 71,
    label: 'Slight Snow',
    iconName: 'CloudSnow',
    description: 'Light snow flurries floating in the air.',
    bgGradient: 'from-sky-300 via-indigo-400 to-slate-600',
    cardBg: 'bg-sky-400/10 border-sky-400/20',
    accentColor: 'text-sky-300',
  },
  73: {
    code: 73,
    label: 'Moderate Snow',
    iconName: 'CloudSnow',
    description: 'Steady snowfall accumulating on surfaces.',
    bgGradient: 'from-slate-400 via-indigo-600 to-slate-800',
    cardBg: 'bg-slate-400/10 border-slate-400/20',
    accentColor: 'text-sky-200',
  },
  75: {
    code: 75,
    label: 'Heavy Snowfall',
    iconName: 'Snowflake',
    description: 'Intense snowfall causing reduced visibility and snow cover.',
    bgGradient: 'from-cyan-600 via-slate-700 to-indigo-950',
    cardBg: 'bg-cyan-400/10 border-cyan-400/20',
    accentColor: 'text-cyan-200',
  },
  80: {
    code: 80,
    label: 'Rain Showers',
    iconName: 'CloudRain',
    description: 'Passing rain showers interspersed with breaks.',
    bgGradient: 'from-blue-500 via-sky-600 to-indigo-800',
    cardBg: 'bg-blue-500/10 border-blue-500/20',
    accentColor: 'text-blue-400',
  },
  81: {
    code: 81,
    label: 'Moderate Showers',
    iconName: 'CloudRain',
    description: 'Frequent rain showers with brief heavy downpours.',
    bgGradient: 'from-indigo-600 via-blue-800 to-slate-900',
    cardBg: 'bg-indigo-500/10 border-indigo-500/20',
    accentColor: 'text-indigo-400',
  },
  82: {
    code: 82,
    label: 'Violent Rain Showers',
    iconName: 'CloudRainWind',
    description: 'Extreme sudden downpours with strong gusts.',
    bgGradient: 'from-blue-900 via-slate-900 to-zinc-950',
    cardBg: 'bg-blue-700/20 border-blue-700/40',
    accentColor: 'text-blue-400',
  },
  85: {
    code: 85,
    label: 'Slight Snow Showers',
    iconName: 'CloudSnow',
    description: 'Passing snow showers with cold winds.',
    bgGradient: 'from-indigo-400 via-sky-600 to-slate-800',
    cardBg: 'bg-sky-400/10 border-sky-400/20',
    accentColor: 'text-sky-300',
  },
  95: {
    code: 95,
    label: 'Thunderstorm',
    iconName: 'CloudLightning',
    description: 'Thunder and lightning with rain bursts.',
    bgGradient: 'from-purple-800 via-indigo-900 to-slate-950',
    cardBg: 'bg-purple-500/15 border-purple-500/30',
    accentColor: 'text-purple-400',
  },
  96: {
    code: 96,
    label: 'Thunderstorm with Hail',
    iconName: 'CloudLightning',
    description: 'Severe thunderstorm accompanied by light hail.',
    bgGradient: 'from-purple-900 via-slate-900 to-zinc-950',
    cardBg: 'bg-purple-600/20 border-purple-600/40',
    accentColor: 'text-purple-300',
  },
  99: {
    code: 99,
    label: 'Heavy Hail Thunderstorm',
    iconName: 'CloudLightning',
    description: 'Severe thunderstorm with destructive hail impact.',
    bgGradient: 'from-fuchsia-900 via-slate-900 to-black',
    cardBg: 'bg-fuchsia-600/20 border-fuchsia-600/40',
    accentColor: 'text-fuchsia-400',
  },
};

export function getWmoInfo(code: number): WeatherCodeInfo {
  return WMO_CODES[code] || {
    code,
    label: 'Variable Weather',
    iconName: 'Cloud',
    description: 'Local atmospheric conditions.',
    bgGradient: 'from-sky-500 via-slate-600 to-slate-800',
    cardBg: 'bg-slate-500/10 border-slate-500/20',
    accentColor: 'text-sky-400',
  };
}

export function cToF(c: number): number {
  return Math.round((c * 9) / 5 + 32);
}

export function kmhToMph(kmh: number): number {
  return Math.round(kmh * 0.621371);
}

export function formatTemp(tempC: number, unit: 'C' | 'F'): string {
  if (unit === 'F') {
    return `${cToF(tempC)}°F`;
  }
  return `${Math.round(tempC)}°C`;
}

export function formatSpeed(speedKmh: number, unit: 'kmh' | 'mph'): string {
  if (unit === 'mph') {
    return `${kmhToMph(speedKmh)} mph`;
  }
  return `${Math.round(speedKmh)} km/h`;
}

export function getWindDirectionCardinal(deg: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(deg / 22.5) % 16;
  return directions[index] || 'N';
}

export function getUVStatus(uv: number): { label: string; color: string; badgeBg: string; text: string } {
  if (uv <= 2) {
    return { label: 'Low', color: 'text-emerald-500', badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', text: 'No protection required.' };
  }
  if (uv <= 5) {
    return { label: 'Moderate', color: 'text-amber-500', badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20', text: 'Wear sunglasses & sunscreen.' };
  }
  if (uv <= 7) {
    return { label: 'High', color: 'text-orange-500', badgeBg: 'bg-orange-500/10 text-orange-400 border-orange-500/20', text: 'Hat, SPF 30+, & shade recommended.' };
  }
  if (uv <= 10) {
    return { label: 'Very High', color: 'text-red-500', badgeBg: 'bg-red-500/10 text-red-400 border-red-500/20', text: 'Avoid sun 11 am – 4 pm. SPF 50+.' };
  }
  return { label: 'Extreme', color: 'text-purple-500', badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20', text: 'Extreme skin damage hazard. Stay indoors.' };
}

export function getAQIStatus(aqi?: number): { label: string; color: string; badgeBg: string; tip: string } {
  if (!aqi) {
    return { label: 'Good', color: 'text-emerald-400', badgeBg: 'bg-emerald-500/10 text-emerald-400', tip: 'Air quality is satisfactory.' };
  }
  if (aqi <= 50) {
    return { label: 'Good (AQI ' + aqi + ')', color: 'text-emerald-400', badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', tip: 'Air quality is clear and safe for outdoor activities.' };
  }
  if (aqi <= 100) {
    return { label: 'Moderate (AQI ' + aqi + ')', color: 'text-amber-400', badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20', tip: 'Acceptable air quality for most individuals.' };
  }
  if (aqi <= 150) {
    return { label: 'Unhealthy for Sensitive Groups', color: 'text-orange-400', badgeBg: 'bg-orange-500/10 text-orange-400 border-orange-500/20', tip: 'Sensitive individuals should limit prolonged outdoor exertion.' };
  }
  if (aqi <= 200) {
    return { label: 'Unhealthy (AQI ' + aqi + ')', color: 'text-red-400', badgeBg: 'bg-red-500/10 text-red-400 border-red-500/20', tip: 'Everyone may begin to experience health effects.' };
  }
  return { label: 'Hazardous (AQI ' + aqi + ')', color: 'text-purple-400', badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20', tip: 'Health alert: stay indoors and keep windows closed.' };
}

export function calculateActivityScores(current: CurrentWeather, precipProbMax: number): ActivityScore[] {
  const temp = current.temperature;
  const wind = current.windSpeed;
  const precip = current.precipitation;
  const code = current.weatherCode;

  // 1. Running / Jogging
  let runScore = 100;
  if (temp < 5 || temp > 28) runScore -= 25;
  if (temp > 33 || temp < 0) runScore -= 30;
  if (wind > 25) runScore -= 20;
  if (precip > 1 || precipProbMax > 40) runScore -= 35;
  if (code >= 95) runScore = 5;
  runScore = Math.max(5, Math.min(100, runScore));

  // 2. Cycling
  let bikeScore = 100;
  if (wind > 20) bikeScore -= (wind - 20) * 2;
  if (temp < 8 || temp > 32) bikeScore -= 25;
  if (precip > 0.5 || precipProbMax > 30) bikeScore -= 40;
  if (code >= 95) bikeScore = 0;
  bikeScore = Math.max(0, Math.min(100, bikeScore));

  // 3. Outdoor Dining & Social
  let dineScore = 100;
  if (temp < 16 || temp > 30) dineScore -= 30;
  if (wind > 15) dineScore -= 20;
  if (precip > 0.1 || precipProbMax > 20) dineScore -= 50;
  if (current.cloudCover > 85) dineScore -= 10;
  dineScore = Math.max(0, Math.min(100, dineScore));

  // 4. Stargazing
  let starScore = 100;
  if (current.isDay) {
    starScore = 10; // Night activity
  } else {
    starScore -= current.cloudCover;
    if (precipProbMax > 20) starScore -= 40;
  }
  starScore = Math.max(0, Math.min(100, starScore));

  // Helper rating resolver
  const getRating = (s: number): ActivityScore['rating'] => {
    if (s >= 80) return 'Optimal';
    if (s >= 60) return 'Favorable';
    if (s >= 40) return 'Moderate';
    return 'Unfavorable';
  };

  return [
    {
      id: 'running',
      name: 'Running & Jogging',
      score: runScore,
      rating: getRating(runScore),
      icon: 'Footprints',
      reason: runScore >= 80 ? 'Ideal temperature & clear conditions.' : runScore >= 50 ? 'Manageable conditions; stay hydrated.' : 'High precipitation or uncomfortable temperatures.',
    },
    {
      id: 'cycling',
      name: 'Cycling & Biking',
      score: bikeScore,
      rating: getRating(bikeScore),
      icon: 'Bike',
      reason: bikeScore >= 80 ? 'Mild winds and dry pavement.' : bikeScore >= 50 ? 'Watch for crosswinds or damp roads.' : 'Strong wind gusts or rain hazard.',
    },
    {
      id: 'outdoor_dining',
      name: 'Outdoor Dining & Patios',
      score: dineScore,
      rating: getRating(dineScore),
      icon: 'Utensils',
      reason: dineScore >= 80 ? 'Pleasant breeze and comfortable warmth.' : dineScore >= 50 ? 'A light jacket or heater may be needed.' : 'Chilly, windy, or wet conditions.',
    },
    {
      id: 'stargazing',
      name: 'Stargazing / Night Sky',
      score: starScore,
      rating: getRating(starScore),
      icon: 'Sparkles',
      reason: current.isDay ? 'Best viewed after twilight.' : starScore >= 70 ? 'Clear nocturnal skies with minimal cloud coverage.' : 'Clouds or precipitation blocking night view.',
    },
  ];
}

export function generateClothingAdvice(current: CurrentWeather, dailyMax: number, dailyMin: number, precipProbMax: number): string[] {
  const tips: string[] = [];
  const temp = current.temperature;

  if (temp < 0) {
    tips.push('🧥 Heavy winter coat, thermal layers, thermal gloves & beanie required.');
  } else if (temp < 10) {
    tips.push('🧥 Warm jacket or heavy sweater with a windproof outer layer.');
  } else if (temp < 18) {
    tips.push('🧥 Light jacket, hoodie, or cardigan recommended.');
  } else if (temp < 26) {
    tips.push('👕 Comfortable t-shirt, light shirt, or breathable cotton fabrics.');
  } else {
    tips.push('🎽 Lightweight, moisture-wicking clothes, shorts, or summer wear.');
  }

  if (precipProbMax >= 40 || current.precipitation > 0) {
    tips.push('☂️ Carry an umbrella or waterproof rain shell (rain expected).');
  }

  if (current.uvIndex >= 6) {
    tips.push('🕶️ Sunglasses, wide-brim hat, and broad-spectrum SPF 30+ sunscreen.');
  }

  if (current.windSpeed > 25) {
    tips.push('💨 Windbreaker shell or tight-fitting outerwear to block strong gusts.');
  }

  return tips;
}
