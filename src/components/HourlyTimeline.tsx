import React from 'react';
import { Clock, Droplets } from 'lucide-react';
import { WeatherData, TempUnit, SpeedUnit } from '../types';
import { formatTemp, getWmoInfo } from '../utils/weatherUtils';

interface HourlyTimelineProps {
  data: WeatherData;
  tempUnit: TempUnit;
  speedUnit: SpeedUnit;
}

export const HourlyTimeline: React.FC<HourlyTimelineProps> = ({
  data,
  tempUnit,
}) => {
  const { hourly } = data;

  if (!hourly || !hourly.time || hourly.time.length === 0) {
    return null;
  }

  // Slice next 24 hours starting from current hour
  const nowIsoHour = new Date().toISOString().slice(0, 13);
  let startIndex = hourly.time.findIndex((t) => t.startsWith(nowIsoHour));
  if (startIndex === -1) startIndex = 0;

  const next24Hours = hourly.time.slice(startIndex, startIndex + 24).map((timeStr, idx) => {
    const actualIdx = startIndex + idx;
    const dateObj = new Date(timeStr);
    const hourLabel = dateObj.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    const isNow = idx === 0;

    const temp = hourly.temperature_2m[actualIdx] ?? 0;
    const code = hourly.weather_code[actualIdx] ?? 0;
    const precipProb = hourly.precipitation_probability[actualIdx] ?? 0;
    const wmo = getWmoInfo(code);

    return {
      timeStr,
      hourLabel: isNow ? 'Now' : hourLabel,
      temp,
      code,
      precipProb,
      wmo,
      isNow,
    };
  });

  return (
    <div className="w-full space-y-3" id="hourly-timeline">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Clock className="w-5 h-5 text-sky-400" />
          24-Hour Forecast Timeline
        </h2>
        <span className="text-xs text-slate-400">Scroll horizontally →</span>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-4 pt-1 snap-x scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
        {next24Hours.map((item, idx) => (
          <div
            key={idx}
            className={`snap-start shrink-0 w-28 sm:w-32 p-3.5 rounded-2xl border transition-all duration-200 flex flex-col items-center justify-between gap-2 text-center ${
              item.isNow
                ? 'bg-gradient-to-b from-sky-500/20 to-indigo-600/20 border-sky-500/50 shadow-lg shadow-sky-500/10'
                : 'bg-slate-900/80 backdrop-blur-md border-slate-800/80 hover:border-slate-700'
            }`}
          >
            {/* Time label */}
            <span className={`text-xs font-semibold ${item.isNow ? 'text-sky-300 font-bold' : 'text-slate-300'}`}>
              {item.hourLabel}
            </span>

            {/* Condition badge / text */}
            <div className="my-1 flex flex-col items-center">
              <span className="text-2xl my-1" title={item.wmo.label}>
                {item.code === 0 ? '☀️' : item.code <= 2 ? '🌤️' : item.code <= 3 ? '☁️' : item.code >= 95 ? '🌩️' : item.code >= 71 ? '❄️' : '🌧️'}
              </span>
              <span className="text-[11px] font-bold text-slate-100 mt-1">
                {formatTemp(item.temp, tempUnit)}
              </span>
            </div>

            {/* Precipitation prob */}
            <div className="w-full pt-1.5 border-t border-slate-800/80 flex items-center justify-center gap-1 text-[10px]">
              <Droplets className={`w-3 h-3 ${item.precipProb > 30 ? 'text-sky-400' : 'text-slate-500'}`} />
              <span className={item.precipProb > 30 ? 'text-sky-300 font-bold' : 'text-slate-400'}>
                {item.precipProb}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
