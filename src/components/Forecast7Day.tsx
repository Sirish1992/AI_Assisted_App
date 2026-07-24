import React, { useState } from 'react';
import { Calendar, ChevronDown, ChevronUp, Droplets, Sun } from 'lucide-react';
import { WeatherData, TempUnit } from '../types';
import { formatTemp, getWmoInfo, getUVStatus } from '../utils/weatherUtils';

interface Forecast7DayProps {
  data: WeatherData;
  tempUnit: TempUnit;
}

export const Forecast7Day: React.FC<Forecast7DayProps> = ({ data, tempUnit }) => {
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  const { daily, hourly } = data;
  if (!daily || !daily.time || daily.time.length === 0) return null;

  // Week global min and max for range bar normalization
  const weekMin = Math.min(...daily.temperature_2m_min);
  const weekMax = Math.max(...daily.temperature_2m_max);
  const weekRange = Math.max(1, weekMax - weekMin);

  const days = daily.time.slice(0, 7).map((dateStr, idx) => {
    const dateObj = new Date(dateStr + 'T00:00:00');
    const todayStr = new Date().toISOString().slice(0, 10);
    const isToday = dateStr === todayStr || idx === 0;

    let dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
    if (isToday) dayName = 'Today';

    const dateFormatted = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    const maxTemp = daily.temperature_2m_max[idx];
    const minTemp = daily.temperature_2m_min[idx];
    const code = daily.weather_code[idx];
    const precipProb = daily.precipitation_probability_max[idx] ?? 0;
    const precipSum = daily.precipitation_sum[idx] ?? 0;
    const uvMax = daily.uv_index_max[idx] ?? 0;
    const wmo = getWmoInfo(code);

    // Calculate position for temp range bar
    const leftPercent = Math.max(0, Math.min(100, ((minTemp - weekMin) / weekRange) * 100));
    const widthPercent = Math.max(8, Math.min(100 - leftPercent, ((maxTemp - minTemp) / weekRange) * 100));

    // Get hourly slots for this day if expanded
    const dayHourly = hourly && hourly.time ? hourly.time
      .map((t, hIdx) => ({
        time: t,
        temp: hourly.temperature_2m[hIdx],
        code: hourly.weather_code[hIdx],
        precipProb: hourly.precipitation_probability[hIdx],
      }))
      .filter((item) => item.time.startsWith(dateStr)) : [];

    return {
      idx,
      dateStr,
      dayName,
      dateFormatted,
      maxTemp,
      minTemp,
      code,
      precipProb,
      precipSum,
      uvMax,
      wmo,
      leftPercent,
      widthPercent,
      isToday,
      dayHourly,
    };
  });

  return (
    <div className="w-full bg-slate-900/90 backdrop-blur-md border border-slate-800/80 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4" id="forecast-7day">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-sky-400" />
          7-Day Meteorological Outlook
        </h2>
        <span className="text-xs text-slate-400">Click a day to view hourly timeline</span>
      </div>

      <div className="divide-y divide-slate-800/80">
        {days.map((day) => {
          const isExpanded = expandedDay === day.idx;
          const uvInfo = getUVStatus(day.uvMax);

          return (
            <div key={day.idx} className="py-3 transition-colors hover:bg-slate-800/30 rounded-2xl px-2">
              <div
                onClick={() => setExpandedDay(isExpanded ? null : day.idx)}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer select-none"
              >
                {/* Day Name & Date */}
                <div className="w-32 shrink-0 flex items-center gap-2">
                  <span className={`text-sm font-bold ${day.isToday ? 'text-sky-400' : 'text-slate-100'}`}>
                    {day.dayName}
                  </span>
                  <span className="text-xs text-slate-400">{day.dateFormatted}</span>
                </div>

                {/* Icon & WMO Label */}
                <div className="flex items-center gap-2 w-44 shrink-0">
                  <span className="text-2xl" title={day.wmo.label}>
                    {day.code === 0 ? '☀️' : day.code <= 2 ? '🌤️' : day.code <= 3 ? '☁️' : day.code >= 95 ? '🌩️' : day.code >= 71 ? '❄️' : '🌧️'}
                  </span>
                  <span className="text-xs font-semibold text-slate-200 line-clamp-1">{day.wmo.label}</span>
                </div>

                {/* Rain Chance Badge */}
                <div className="w-20 shrink-0 flex items-center gap-1 text-xs font-medium text-slate-300">
                  <Droplets className={`w-3.5 h-3.5 ${day.precipProb > 30 ? 'text-sky-400' : 'text-slate-500'}`} />
                  <span className={day.precipProb > 30 ? 'text-sky-300 font-bold' : 'text-slate-400'}>
                    {day.precipProb}%
                  </span>
                </div>

                {/* Temperature Bar */}
                <div className="flex-1 w-full sm:w-auto flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-400 w-10 text-right">
                    {formatTemp(day.minTemp, tempUnit)}
                  </span>

                  {/* Range visualizer */}
                  <div className="flex-1 bg-slate-800 h-2 rounded-full relative overflow-hidden">
                    <div
                      className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-500"
                      style={{
                        left: `${day.leftPercent}%`,
                        width: `${day.widthPercent}%`,
                      }}
                    />
                  </div>

                  <span className="text-xs font-bold text-slate-100 w-10">
                    {formatTemp(day.maxTemp, tempUnit)}
                  </span>
                </div>

                {/* Expand Toggle */}
                <div className="pl-2 text-slate-400 hover:text-slate-200">
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-sky-400" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>

              {/* Collapsible Hourly View */}
              {isExpanded && day.dayHourly.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-800/80 bg-slate-950/60 p-3 rounded-2xl animate-in fade-in duration-200">
                  <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center justify-between">
                    <span>Hourly timeline for {day.dayName} ({day.dateFormatted})</span>
                    <span className="flex items-center gap-1 text-amber-400">
                      <Sun className="w-3 h-3" /> UV Max: {day.uvMax} ({uvInfo.label})
                    </span>
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-thin">
                    {day.dayHourly.map((slot, hIdx) => {
                      const hTime = new Date(slot.time).toLocaleTimeString([], { hour: 'numeric' });
                      return (
                        <div
                          key={hIdx}
                          className="shrink-0 w-20 p-2 rounded-xl bg-slate-900 border border-slate-800/80 text-center flex flex-col items-center"
                        >
                          <span className="text-[10px] text-slate-400">{hTime}</span>
                          <span className="text-lg my-1">
                            {slot.code === 0 ? '☀️' : slot.code <= 2 ? '🌤️' : slot.code <= 3 ? '☁️' : '🌧️'}
                          </span>
                          <span className="text-xs font-bold text-slate-100">
                            {formatTemp(slot.temp, tempUnit)}
                          </span>
                          {slot.precipProb > 0 && (
                            <span className="text-[9px] text-sky-400 font-semibold mt-1">
                              {slot.precipProb}%
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
