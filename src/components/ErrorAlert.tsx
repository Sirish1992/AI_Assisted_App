import React from 'react';
import { AlertCircle, RefreshCw, MapPin } from 'lucide-react';
import { GeoCity } from '../types';
import { DEFAULT_CITIES } from '../services/weatherApi';

interface ErrorAlertProps {
  message: string;
  onRetry?: () => void;
  onSelectCity?: (city: GeoCity) => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  message,
  onRetry,
  onSelectCity,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto p-6 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-slate-100 shadow-xl space-y-4 my-6">
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-2xl bg-rose-500/20 text-rose-400 shrink-0">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-base text-rose-200">Unable to Fetch Weather Data</h3>
          <p className="text-sm text-slate-300">{message}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-rose-500/20">
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-md shadow-rose-600/30"
            id="error-retry-btn"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        )}

        {onSelectCity && (
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <span className="text-xs text-slate-400 shrink-0">Try popular cities:</span>
            {DEFAULT_CITIES.slice(0, 4).map((city) => (
              <button
                key={city.id}
                onClick={() => onSelectCity(city)}
                className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-sky-300 border border-slate-700 shrink-0"
              >
                <MapPin className="w-3 h-3" />
                {city.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
