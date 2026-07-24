import React from 'react';
import { CloudSun, Thermometer, Gauge, Star } from 'lucide-react';
import { TempUnit, SpeedUnit, GeoCity } from '../types';

interface HeaderProps {
  tempUnit: TempUnit;
  speedUnit: SpeedUnit;
  onToggleTempUnit: () => void;
  onToggleSpeedUnit: () => void;
  savedCities: GeoCity[];
  onSelectCity: (city: GeoCity) => void;
  selectedCityId?: number;
}

export const Header: React.FC<HeaderProps> = ({
  tempUnit,
  speedUnit,
  onToggleTempUnit,
  onToggleSpeedUnit,
  savedCities,
  onSelectCity,
  selectedCityId,
}) => {
  return (
    <header className="w-full max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800/80 mb-6">
      {/* Brand Title */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/20">
          <CloudSun className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
            Weather Intelligence
            <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/30 font-medium">
              Open-Meteo
            </span>
          </h1>
          <p className="text-xs text-slate-400">
            Real-time forecasts, atmospheric metrics, and smart planning
          </p>
        </div>
      </div>

      {/* Control Toggles & Favorite Quick Pills */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {/* Favorite Cities Bar */}
        {savedCities.length > 0 && (
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
            <div className="px-2 text-slate-400 text-xs flex items-center gap-1 font-medium">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              Saved:
            </div>
            {savedCities.slice(0, 4).map((city) => (
              <button
                key={city.id}
                onClick={() => onSelectCity(city)}
                className={`px-2.5 py-1 text-xs rounded-lg transition-all ${
                  selectedCityId === city.id
                    ? 'bg-sky-500 text-white font-medium shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                {city.name}
              </button>
            ))}
          </div>
        )}

        {/* Temperature Unit Selector */}
        <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={onToggleTempUnit}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg text-slate-200 hover:text-white transition-colors"
            title="Toggle °C / °F"
            id="unit-temp-toggle"
          >
            <Thermometer className="w-3.5 h-3.5 text-sky-400" />
            <span className={tempUnit === 'C' ? 'text-sky-400 font-bold' : 'text-slate-400'}>°C</span>
            <span className="text-slate-600">/</span>
            <span className={tempUnit === 'F' ? 'text-amber-400 font-bold' : 'text-slate-400'}>°F</span>
          </button>
        </div>

        {/* Speed Unit Selector */}
        <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={onToggleSpeedUnit}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg text-slate-200 hover:text-white transition-colors"
            title="Toggle km/h / mph"
            id="unit-speed-toggle"
          >
            <Gauge className="w-3.5 h-3.5 text-indigo-400" />
            <span className={speedUnit === 'kmh' ? 'text-indigo-400 font-bold' : 'text-slate-400'}>km/h</span>
            <span className="text-slate-600">/</span>
            <span className={speedUnit === 'mph' ? 'text-indigo-400 font-bold' : 'text-slate-400'}>mph</span>
          </button>
        </div>
      </div>
    </header>
  );
};
