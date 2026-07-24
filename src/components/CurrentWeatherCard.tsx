import React from 'react';
import {
  Sun,
  SunMedium,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudHail,
  CloudSnow,
  Snowflake,
  CloudLightning,
  MapPin,
  Clock,
  Star,
  ArrowUp,
  ArrowDown,
  Droplets,
  Wind,
} from 'lucide-react';
import { WeatherData, TempUnit, SpeedUnit } from '../types';
import { getWmoInfo, formatTemp, formatSpeed } from '../utils/weatherUtils';

interface CurrentWeatherCardProps {
  data: WeatherData;
  tempUnit: TempUnit;
  speedUnit: SpeedUnit;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  data,
  tempUnit,
  speedUnit,
  isFavorite,
  onToggleFavorite,
}) => {
  const { city, current, daily, fetchedAt } = data;
  const wmo = getWmoInfo(current.weatherCode);

  const maxTempToday = daily.temperature_2m_max[0] ?? current.temperature;
  const minTempToday = daily.temperature_2m_min[0] ?? current.temperature;

  // Render weather icon according to WMO mapping
  const renderWeatherIcon = (iconName: string) => {
    const props = { className: 'w-20 h-20 sm:w-24 sm:h-24 drop-shadow-md text-amber-300' };
    switch (iconName) {
      case 'Sun':
        return <Sun {...props} className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-lg text-amber-400 animate-pulse" />;
      case 'SunMedium':
        return <SunMedium {...props} className="w-20 h-20 sm:w-24 sm:h-24 text-amber-300" />;
      case 'CloudSun':
        return <CloudSun {...props} className="w-20 h-20 sm:w-24 sm:h-24 text-sky-200" />;
      case 'Cloud':
        return <Cloud {...props} className="w-20 h-20 sm:w-24 sm:h-24 text-slate-300" />;
      case 'CloudFog':
        return <CloudFog {...props} className="w-20 h-20 sm:w-24 sm:h-24 text-slate-300" />;
      case 'CloudDrizzle':
        return <CloudDrizzle {...props} className="w-20 h-20 sm:w-24 sm:h-24 text-blue-300" />;
      case 'CloudRain':
        return <CloudRain {...props} className="w-20 h-20 sm:w-24 sm:h-24 text-cyan-300" />;
      case 'CloudRainWind':
        return <CloudRainWind {...props} className="w-20 h-20 sm:w-24 sm:h-24 text-blue-400" />;
      case 'CloudHail':
        return <CloudHail {...props} className="w-20 h-20 sm:w-24 sm:h-24 text-teal-300" />;
      case 'CloudSnow':
        return <CloudSnow {...props} className="w-20 h-20 sm:w-24 sm:h-24 text-sky-200" />;
      case 'Snowflake':
        return <Snowflake {...props} className="w-20 h-20 sm:w-24 sm:h-24 text-cyan-200" />;
      case 'CloudLightning':
        return <CloudLightning {...props} className="w-20 h-20 sm:w-24 sm:h-24 text-purple-300 animate-pulse" />;
      default:
        return <Cloud {...props} className="w-20 h-20 sm:w-24 sm:h-24 text-slate-300" />;
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br ${wmo.bgGradient} shadow-2xl text-white transition-all duration-300`}
      id="current-weather-hero"
    >
      {/* Background Overlay Pattern */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />

      <div className="relative z-10 flex flex-col justify-between h-full gap-6">
        {/* Top Header: City & Favorite Button */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-slate-100 font-semibold text-lg sm:text-xl">
              <MapPin className="w-5 h-5 text-sky-300 shrink-0" />
              <span>{city.name}</span>
              {city.country && (
                <span className="text-xs px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-white font-normal">
                  {city.country}
                </span>
              )}
            </div>
            {city.admin1 && (
              <p className="text-xs text-white/80 pl-7 mt-0.5">{city.admin1}</p>
            )}
            <div className="flex items-center gap-2 text-xs text-white/70 pl-7 mt-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Fetched at {fetchedAt}</span>
            </div>
          </div>

          <button
            onClick={onToggleFavorite}
            className={`p-2.5 rounded-2xl backdrop-blur-md transition-all ${
              isFavorite
                ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/30'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title={isFavorite ? 'Saved in favorites' : 'Save as favorite location'}
            id="favorite-toggle-btn"
          >
            <Star className={`w-5 h-5 ${isFavorite ? 'fill-slate-950' : ''}`} />
          </button>
        </div>

        {/* Middle Hero Section: Icon, Temperature, Conditions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-2">
          <div className="flex items-center gap-6">
            <div className="p-3 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20">
              {renderWeatherIcon(wmo.iconName)}
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl sm:text-7xl font-extrabold tracking-tight">
                  {formatTemp(current.temperature, tempUnit)}
                </span>
              </div>
              <div className="text-sm sm:text-base font-medium text-white/90 mt-1 flex items-center gap-2">
                <span>Feels like {formatTemp(current.apparentTemperature, tempUnit)}</span>
              </div>
            </div>
          </div>

          {/* Condition Tag & High / Low Range */}
          <div className="flex flex-col items-center sm:items-end text-center sm:text-right">
            <div className="px-4 py-1.5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 text-base font-bold shadow-sm">
              {wmo.label}
            </div>

            <p className="text-xs sm:text-sm text-white/80 max-w-xs mt-2">
              {wmo.description}
            </p>

            <div className="flex items-center gap-4 mt-3 bg-black/20 px-3 py-1.5 rounded-xl border border-white/10 text-xs sm:text-sm font-semibold">
              <span className="flex items-center text-emerald-300">
                <ArrowUp className="w-3.5 h-3.5 mr-0.5" />
                H: {formatTemp(maxTempToday, tempUnit)}
              </span>
              <span className="text-white/40">|</span>
              <span className="flex items-center text-sky-300">
                <ArrowDown className="w-3.5 h-3.5 mr-0.5" />
                L: {formatTemp(minTempToday, tempUnit)}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Quick Bar: Rain chance & Wind speed */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/15 text-xs sm:text-sm">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl">
            <Droplets className="w-4 h-4 text-sky-300 shrink-0" />
            <div>
              <span className="text-white/70 block text-[10px] uppercase font-semibold">Precipitation</span>
              <span className="font-semibold text-white">
                {current.precipitation > 0 ? `${current.precipitation} mm` : '0% chance currently'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl">
            <Wind className="w-4 h-4 text-cyan-300 shrink-0" />
            <div>
              <span className="text-white/70 block text-[10px] uppercase font-semibold">Wind Gusts</span>
              <span className="font-semibold text-white">
                {formatSpeed(current.windSpeed, speedUnit)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
