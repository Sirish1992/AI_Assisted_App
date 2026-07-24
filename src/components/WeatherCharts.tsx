import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { LineChart as ChartIcon, Thermometer, Droplets, Wind, Sun } from 'lucide-react';
import { WeatherData, TempUnit, SpeedUnit } from '../types';
import { cToF, kmhToMph } from '../utils/weatherUtils';

interface WeatherChartsProps {
  data: WeatherData;
  tempUnit: TempUnit;
  speedUnit: SpeedUnit;
}

export const WeatherCharts: React.FC<WeatherChartsProps> = ({
  data,
  tempUnit,
  speedUnit,
}) => {
  const [activeTab, setActiveTab] = useState<'temp' | 'precip' | 'wind' | 'uv'>('temp');

  const { hourly } = data;
  if (!hourly || !hourly.time || hourly.time.length === 0) return null;

  // Prepare chart dataset for 24h
  const nowIsoHour = new Date().toISOString().slice(0, 13);
  let startIndex = hourly.time.findIndex((t) => t.startsWith(nowIsoHour));
  if (startIndex === -1) startIndex = 0;

  const chartData = hourly.time.slice(startIndex, startIndex + 24).map((timeStr, idx) => {
    const actualIdx = startIndex + idx;
    const dateObj = new Date(timeStr);
    const hourLabel = dateObj.toLocaleTimeString([], { hour: 'numeric' });

    const rawTemp = hourly.temperature_2m[actualIdx] ?? 0;
    const rawFeels = hourly.apparent_temperature[actualIdx] ?? 0;
    const rawWind = hourly.wind_speed_10m[actualIdx] ?? 0;

    const tempVal = tempUnit === 'F' ? cToF(rawTemp) : Math.round(rawTemp);
    const feelsVal = tempUnit === 'F' ? cToF(rawFeels) : Math.round(rawFeels);
    const windVal = speedUnit === 'mph' ? kmhToMph(rawWind) : Math.round(rawWind);

    return {
      time: hourLabel,
      Temperature: tempVal,
      FeelsLike: feelsVal,
      PrecipitationChance: hourly.precipitation_probability[actualIdx] ?? 0,
      RainVolume: hourly.precipitation[actualIdx] ?? 0,
      WindSpeed: windVal,
      UVIndex: hourly.uv_index[actualIdx] ?? 0,
      Pressure: hourly.surface_pressure[actualIdx] ?? 1013,
    };
  });

  return (
    <div className="w-full bg-slate-900/90 backdrop-blur-md border border-slate-800/80 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4" id="weather-charts">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <ChartIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">Interactive Weather Intelligence Charts</h2>
            <p className="text-xs text-slate-400">24-Hour atmospheric forecast trends</p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800/80 self-stretch sm:self-auto overflow-x-auto">
          <button
            onClick={() => setActiveTab('temp')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              activeTab === 'temp'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            Temperature
          </button>

          <button
            onClick={() => setActiveTab('precip')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              activeTab === 'precip'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            Precipitation
          </button>

          <button
            onClick={() => setActiveTab('wind')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              activeTab === 'wind'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            Wind Speed
          </button>

          <button
            onClick={() => setActiveTab('uv')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              activeTab === 'uv'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            UV & Barometer
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-72 sm:h-80 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === 'temp' ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="feelsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit={`°${tempUnit}`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                formatter={(val: number) => [`${val}°${tempUnit}`, '']}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
              <Area type="monotone" dataKey="Temperature" stroke="#38bdf8" strokeWidth={3} fillOpacity={1} fill="url(#tempGradient)" />
              <Area type="monotone" dataKey="FeelsLike" name="Feels Like" stroke="#818cf8" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#feelsGradient)" />
            </AreaChart>
          ) : activeTab === 'precip' ? (
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit="%" domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                formatter={(val: number, name: string) => [name === 'PrecipitationChance' ? `${val}%` : `${val} mm`, name === 'PrecipitationChance' ? 'Rain Chance' : 'Volume']}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
              <Bar dataKey="PrecipitationChance" name="Rain Chance (%)" fill="#38bdf8" radius={[6, 6, 0, 0]} />
            </BarChart>
          ) : activeTab === 'wind' ? (
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit={speedUnit === 'mph' ? ' mph' : ' km/h'} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                formatter={(val: number) => [`${val} ${speedUnit === 'mph' ? 'mph' : 'km/h'}`, 'Wind Speed']}
              />
              <Line type="monotone" dataKey="WindSpeed" name={`Wind Speed (${speedUnit})`} stroke="#22d3ee" strokeWidth={3} dot={{ r: 3 }} />
            </LineChart>
          ) : (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="uvGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
              <Area type="monotone" dataKey="UVIndex" name="UV Index" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#uvGradient)" />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
