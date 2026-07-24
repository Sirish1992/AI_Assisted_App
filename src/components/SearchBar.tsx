import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Loader2, Navigation, Star } from 'lucide-react';
import { GeoCity } from '../types';
import { searchCities, DEFAULT_CITIES } from '../services/weatherApi';

interface SearchBarProps {
  onSelectCity: (city: GeoCity) => void;
  onUseCurrentLocation: () => void;
  isLoadingLocation: boolean;
  savedCities: GeoCity[];
  onToggleFavorite: (city: GeoCity) => void;
  isFavorite: (cityId: number) => boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSelectCity,
  onUseCurrentLocation,
  isLoadingLocation,
  savedCities,
  onToggleFavorite,
  isFavorite,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoCity[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced city search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSearchError(null);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      setSearchError(null);
      try {
        const cityResults = await searchCities(query);
        setResults(cityResults);
        if (cityResults.length === 0) {
          setSearchError(`No cities found for "${query}". Try checking spelling or searching for a major city nearby.`);
        }
      } catch (err: any) {
        setSearchError(err.message || 'Error searching city.');
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city: GeoCity) => {
    onSelectCity(city);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto" ref={dropdownRef}>
      <div className="relative flex items-center shadow-lg rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 p-1.5 transition-all duration-200 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/20">
        <div className="pl-3 text-slate-400">
          <Search className="w-5 h-5 text-sky-400" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search city name (e.g., Tokyo, London, San Francisco)..."
          className="w-full bg-transparent px-3 py-2 text-slate-100 placeholder-slate-400 focus:outline-none text-base"
          id="city-search-input"
        />

        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setSearchError(null);
            }}
            className="p-1.5 text-slate-400 hover:text-slate-200 transition-colors rounded-lg"
            title="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={onUseCurrentLocation}
          disabled={isLoadingLocation}
          className="flex items-center gap-1.5 px-3 py-2 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 hover:text-sky-200 border border-sky-500/30 rounded-xl font-medium text-sm transition-all duration-150 disabled:opacity-50 shrink-0 ml-1"
          title="Use GPS for current location weather"
          id="gps-location-btn"
        >
          {isLoadingLocation ? (
            <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
          ) : (
            <Navigation className="w-4 h-4 text-sky-400 fill-sky-400/20" />
          )}
          <span className="hidden sm:inline">My Location</span>
        </button>
      </div>

      {/* Auto-suggest dropdown & Error banner */}
      {isOpen && (query.length > 0 || savedCities.length > 0) && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {isSearching && (
            <div className="p-4 text-center text-slate-400 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
              Searching global meteorology database...
            </div>
          )}

          {!isSearching && searchError && (
            <div className="p-4 text-amber-300/90 text-sm bg-amber-500/10 border-b border-amber-500/20 flex flex-col gap-2">
              <p>{searchError}</p>
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-xs text-slate-400">Try quick cities:</span>
                {DEFAULT_CITIES.slice(0, 4).map((city) => (
                  <button
                    key={city.id}
                    onClick={() => handleSelect(city)}
                    className="text-xs px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700"
                  >
                    {city.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!isSearching && results.length > 0 && (
            <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60">
              <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400 bg-slate-800/40">
                Found Locations ({results.length})
              </div>
              {results.map((city) => {
                const fav = isFavorite(city.id);
                return (
                  <div
                    key={city.id}
                    className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-sky-500/10 transition-colors group cursor-pointer"
                    onClick={() => handleSelect(city)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-800 text-sky-400 group-hover:bg-sky-500/20 group-hover:text-sky-300">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-100 flex items-center gap-2">
                          {city.name}
                          {city.country_code && (
                            <span className="text-xs font-normal px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
                              {city.country_code}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400">
                          {[city.admin1, city.country].filter(Boolean).join(', ')}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(city);
                      }}
                      className={`p-2 rounded-lg transition-colors ${
                        fav ? 'text-amber-400 bg-amber-400/10' : 'text-slate-500 hover:text-amber-400'
                      }`}
                      title={fav ? 'Remove from favorites' : 'Save as favorite city'}
                    >
                      <Star className={`w-4 h-4 ${fav ? 'fill-amber-400' : ''}`} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {!query && (
            <div className="p-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-2 mb-2 flex items-center justify-between">
                <span>Popular Cities</span>
                <span className="text-[10px] text-slate-500 font-normal">Click to load weather</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {DEFAULT_CITIES.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => handleSelect(city)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/80 text-sm font-medium transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5 text-sky-400" />
                    {city.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
