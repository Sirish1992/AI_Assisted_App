import { useState, useEffect, useCallback } from 'react';
import { Loader2, CloudSun } from 'lucide-react';
import { GeoCity, WeatherData, TempUnit, SpeedUnit } from './types';
import { fetchWeatherData, DEFAULT_CITIES } from './services/weatherApi';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { MetricsGrid } from './components/MetricsGrid';
import { HourlyTimeline } from './components/HourlyTimeline';
import { WeatherCharts } from './components/WeatherCharts';
import { Forecast7Day } from './components/Forecast7Day';
import { PlanningRecommendations } from './components/PlanningRecommendations';
import { ErrorAlert } from './components/ErrorAlert';

export default function App() {
  const [selectedCity, setSelectedCity] = useState<GeoCity>(() => {
    const saved = localStorage.getItem('weather_last_city');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        /* ignore */
      }
    }
    return DEFAULT_CITIES[0]; // Tokyo
  });

  const [savedCities, setSavedCities] = useState<GeoCity[]>(() => {
    const saved = localStorage.getItem('weather_favorite_cities');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        /* ignore */
      }
    }
    return [DEFAULT_CITIES[0], DEFAULT_CITIES[1], DEFAULT_CITIES[2]];
  });

  const [tempUnit, setTempUnit] = useState<TempUnit>(() => {
    return (localStorage.getItem('weather_temp_unit') as TempUnit) || 'C';
  });

  const [speedUnit, setSpeedUnit] = useState<SpeedUnit>(() => {
    return (localStorage.getItem('weather_speed_unit') as SpeedUnit) || 'kmh';
  });

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Persistence helpers
  useEffect(() => {
    localStorage.setItem('weather_last_city', JSON.stringify(selectedCity));
  }, [selectedCity]);

  useEffect(() => {
    localStorage.setItem('weather_favorite_cities', JSON.stringify(savedCities));
  }, [savedCities]);

  useEffect(() => {
    localStorage.setItem('weather_temp_unit', tempUnit);
  }, [tempUnit]);

  useEffect(() => {
    localStorage.setItem('weather_speed_unit', speedUnit);
  }, [speedUnit]);

  // Load weather data for current city
  const loadWeather = useCallback(async (city: GeoCity) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await fetchWeatherData(city);
      setWeatherData(data);
    } catch (err: any) {
      console.error('Failed to load weather data:', err);
      setErrorMessage(err.message || 'Unable to fetch weather data for this location. Please check your internet connection.');
      setWeatherData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWeather(selectedCity);
  }, [selectedCity, loadWeather]);

  // GPS Location Handler
  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your browser.');
      return;
    }

    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const gpsCity: GeoCity = {
          id: Date.now(),
          name: 'Current Location',
          latitude,
          longitude,
          country: 'Local Device GPS',
          country_code: '',
          timezone: 'auto',
        };
        setSelectedCity(gpsCity);
        setIsLoadingLocation(false);
      },
      (error) => {
        setIsLoadingLocation(false);
        let msg = 'Unable to access your current location.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission was denied. Please allow location access in your browser or search for a city manually.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Location information is currently unavailable.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Request to get location timed out. Please try searching for your city.';
        }
        setErrorMessage(msg);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleToggleFavorite = (cityToToggle: GeoCity) => {
    setSavedCities((prev) => {
      const exists = prev.some((c) => c.id === cityToToggle.id);
      if (exists) {
        return prev.filter((c) => c.id !== cityToToggle.id);
      }
      return [...prev, cityToToggle];
    });
  };

  const isFavorite = (cityId: number) => savedCities.some((c) => c.id === cityId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-sky-500 selection:text-white pb-16">
      {/* Background Decorative Ambient Blobs */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-sky-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        <Header
          tempUnit={tempUnit}
          speedUnit={speedUnit}
          onToggleTempUnit={() => setTempUnit((prev) => (prev === 'C' ? 'F' : 'C'))}
          onToggleSpeedUnit={() => setSpeedUnit((prev) => (prev === 'kmh' ? 'mph' : 'kmh'))}
          savedCities={savedCities}
          onSelectCity={(c) => setSelectedCity(c)}
          selectedCityId={selectedCity.id}
        />

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar
            onSelectCity={(city) => setSelectedCity(city)}
            onUseCurrentLocation={handleUseLocation}
            isLoadingLocation={isLoadingLocation}
            savedCities={savedCities}
            onToggleFavorite={handleToggleFavorite}
            isFavorite={isFavorite}
          />
        </div>

        {/* Error Alert View */}
        {errorMessage && (
          <ErrorAlert
            message={errorMessage}
            onRetry={() => loadWeather(selectedCity)}
            onSelectCity={(c) => setSelectedCity(c)}
          />
        )}

        {/* Main Content Area */}
        {isLoading ? (
          <div className="w-full py-20 flex flex-col items-center justify-center gap-4 text-slate-400">
            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 text-sky-400 shadow-2xl">
              <Loader2 className="w-10 h-10 animate-spin text-sky-400" />
            </div>
            <p className="text-base font-semibold text-slate-200">
              Retrieving live meteorology data for {selectedCity.name}...
            </p>
            <p className="text-xs text-slate-500">Querying Open-Meteo satellite & weather models</p>
          </div>
        ) : weatherData ? (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Top Grid: Hero Weather Card & Key Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-5">
                <CurrentWeatherCard
                  data={weatherData}
                  tempUnit={tempUnit}
                  speedUnit={speedUnit}
                  isFavorite={isFavorite(selectedCity.id)}
                  onToggleFavorite={() => handleToggleFavorite(selectedCity)}
                />
              </div>

              <div className="lg:col-span-7">
                <MetricsGrid data={weatherData} speedUnit={speedUnit} />
              </div>
            </div>

            {/* 24-Hour Timeline */}
            <HourlyTimeline data={weatherData} tempUnit={tempUnit} speedUnit={speedUnit} />

            {/* Interactive Recharts Section */}
            <WeatherCharts data={weatherData} tempUnit={tempUnit} speedUnit={speedUnit} />

            {/* 7-Day Forecast */}
            <Forecast7Day data={weatherData} tempUnit={tempUnit} />

            {/* Planning Recommendations & Gemini Intelligence */}
            <PlanningRecommendations data={weatherData} />
          </div>
        ) : null}

        {/* Footer */}
        <footer className="mt-16 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="flex items-center gap-1.5">
            <CloudSun className="w-4 h-4 text-sky-400" />
            Weather Intelligence App • Powered by <a href="https://open-meteo.com/" target="_blank" rel="noreferrer" className="text-sky-400 hover:underline">Open-Meteo API</a>
          </p>
          <p>Real-time forecasts, 7-day outlooks & AI planning guidance</p>
        </footer>
      </div>
    </div>
  );
}
