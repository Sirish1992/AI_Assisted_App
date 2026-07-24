import React from 'react';
import {
  Droplets,
  Wind,
  Sun,
  ShieldAlert,
  Gauge,
  Cloud,
  Sunrise,
  Sunset,
  Eye,
  Compass,
} from 'lucide-react';
import { WeatherData, SpeedUnit } from '../types';
import {
  formatSpeed,
  getWindDirectionCardinal,
  getUVStatus,
  getAQIStatus,
} from '../utils/weatherUtils';

interface MetricsGridProps {
  data: WeatherData;
  speedUnit: SpeedUnit;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ data, speedUnit }) => {
  const { current, daily, airQuality } = data;

  const uvStatus = getUVStatus(current.uvIndex);
  const aqiStatus = getAQIStatus(airQuality?.usAqi);

  const sunriseFormatted = daily.sunrise[0]
    ? new Date(daily.sunrise[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '6:00 AM';

  const sunsetFormatted = daily.sunset[0]
    ? new Date(daily.sunset[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '7:30 PM';

  const windDirText = getWindDirectionCardinal(current.windDirection);

  return (
    <div className="w-full space-y-4" id="metrics-grid">
      <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
        <Gauge className="w-5 h-5 text-sky-400" />
        Atmospheric Metrics & Indicators
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* 1. Humidity */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700/80 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Humidity</span>
            <Droplets className="w-4 h-4 text-sky-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-100">{current.humidity}%</div>
            <div className="text-xs text-slate-400 mt-0.5">
              {current.humidity > 70 ? 'High moisture level' : current.humidity < 30 ? 'Dry atmosphere' : 'Comfortable range'}
            </div>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-sky-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, current.humidity)}%` }}
            />
          </div>
        </div>

        {/* 2. Wind & Gusts */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700/80 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Wind & Gusts</span>
            <Wind className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-100">
              {formatSpeed(current.windSpeed, speedUnit)}
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>{windDirText} ({current.windDirection}°)</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-1.5 flex justify-between">
            <span>Gusts:</span>
            <span className="font-semibold text-slate-200">{formatSpeed(current.windGusts, speedUnit)}</span>
          </div>
        </div>

        {/* 3. UV Index */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700/80 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">UV Index</span>
            <Sun className="w-4 h-4 text-amber-400" />
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-100">{current.uvIndex}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${uvStatus.badgeBg}`}>
                {uvStatus.label}
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-1 line-clamp-1">{uvStatus.text}</div>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                current.uvIndex > 7 ? 'bg-red-500' : current.uvIndex > 4 ? 'bg-amber-400' : 'bg-emerald-400'
              }`}
              style={{ width: `${Math.min(100, (current.uvIndex / 12) * 100)}%` }}
            />
          </div>
        </div>

        {/* 4. Air Quality Index (AQI) */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700/80 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Air Quality</span>
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-100">
                {airQuality ? airQuality.usAqi : 'Good'}
              </span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold border ${aqiStatus.badgeBg}`}>
                {aqiStatus.label.split(' ')[0]}
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-1 line-clamp-1">{aqiStatus.tip}</div>
          </div>
          {airQuality && (
            <div className="text-[10px] text-slate-400 border-t border-slate-800/80 pt-1.5 flex justify-between">
              <span>PM2.5: {airQuality.pm25} µg/m³</span>
              <span>PM10: {airQuality.pm10}</span>
            </div>
          )}
        </div>

        {/* 5. Pressure */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700/80 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Barometer</span>
            <Gauge className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-100">
              {Math.round(current.pressure)} <span className="text-xs font-medium text-slate-400">hPa</span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              {current.pressure > 1013 ? 'High pressure system' : 'Low pressure trend'}
            </div>
          </div>
          <div className="text-[11px] text-slate-500 pt-1">Standard sea level ~ 1013 hPa</div>
        </div>

        {/* 6. Cloud Cover */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700/80 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Cloud Cover</span>
            <Cloud className="w-4 h-4 text-slate-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-100">{current.cloudCover}%</div>
            <div className="text-xs text-slate-400 mt-0.5">
              {current.cloudCover > 80 ? 'Overcast skies' : current.cloudCover > 30 ? 'Partly cloudy' : 'Clear skies'}
            </div>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-slate-400 h-full rounded-full" style={{ width: `${current.cloudCover}%` }} />
          </div>
        </div>

        {/* 7. Sunrise & Sunset */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700/80 transition-all col-span-2 sm:col-span-1 lg:col-span-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Sun Cycle</span>
            <Sun className="w-4 h-4 text-amber-400" />
          </div>
          <div className="grid grid-cols-2 gap-2 my-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Sunrise className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-medium">Sunrise</span>
                <span className="font-bold text-slate-100 text-sm sm:text-base">{sunriseFormatted}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Sunset className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-medium">Sunset</span>
                <span className="font-bold text-slate-100 text-sm sm:text-base">{sunsetFormatted}</span>
              </div>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 border-t border-slate-800/80 pt-1.5">
            Daylight cycle synchronized with local timezone
          </div>
        </div>
      </div>
    </div>
  );
};
