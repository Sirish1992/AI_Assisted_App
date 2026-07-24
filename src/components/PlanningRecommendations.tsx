import React, { useState } from 'react';
import {
  Sparkles,
  Footprints,
  Bike,
  Utensils,
  Shirt,
  AlertTriangle,
  Loader2,
  Bot,
  Send,
  CheckCircle2,
} from 'lucide-react';
import { WeatherData } from '../types';
import { calculateActivityScores, generateClothingAdvice } from '../utils/weatherUtils';
import { fetchAiWeatherAdvice } from '../services/weatherApi';

interface PlanningRecommendationsProps {
  data: WeatherData;
}

export const PlanningRecommendations: React.FC<PlanningRecommendationsProps> = ({ data }) => {
  const { current, daily } = data;
  const maxRainProb = daily.precipitation_probability_max[0] ?? 0;
  const maxTemp = daily.temperature_2m_max[0] ?? current.temperature;
  const minTemp = daily.temperature_2m_min[0] ?? current.temperature;

  const activities = calculateActivityScores(current, maxRainProb);
  const clothingTips = generateClothingAdvice(current, maxTemp, minTemp, maxRainProb);

  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [customQuestion, setCustomQuestion] = useState('');

  const handleGenerateAiAdvice = async (promptOverride?: string) => {
    setIsAiLoading(true);
    setAiError(null);
    try {
      const text = await fetchAiWeatherAdvice(data, promptOverride || customQuestion);
      setAiResponse(text);
      setCustomQuestion('');
    } catch (err: any) {
      console.error('AI Advice error:', err);
      setAiError(err.message || 'Failed to fetch AI weather intelligence recommendations.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const getActivityIcon = (iconName: string) => {
    switch (iconName) {
      case 'Footprints':
        return <Footprints className="w-5 h-5 text-emerald-400" />;
      case 'Bike':
        return <Bike className="w-5 h-5 text-cyan-400" />;
      case 'Utensils':
        return <Utensils className="w-5 h-5 text-amber-400" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-purple-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-sky-400" />;
    }
  };

  return (
    <div className="w-full space-y-6" id="planning-recommendations">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          Intelligence & Planning Recommendations
        </h2>
        <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
          Smart Insights
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Outdoor Activity Scores */}
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800/80 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Footprints className="w-4 h-4 text-emerald-400" />
            Outdoor Activity Suitability
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {activities.map((act) => {
              const gaugeColor =
                act.score >= 80 ? 'bg-emerald-500' : act.score >= 60 ? 'bg-amber-400' : act.score >= 40 ? 'bg-orange-400' : 'bg-rose-500';

              const badgeColor =
                act.score >= 80 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : act.score >= 60 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20';

              return (
                <div key={act.id} className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800/80 flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                        {getActivityIcon(act.icon)}
                      </div>
                      <span className="font-semibold text-slate-200 text-xs sm:text-sm">{act.name}</span>
                    </div>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>
                      {act.rating} ({act.score}%)
                    </span>
                  </div>

                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden my-1">
                    <div className={`h-full rounded-full transition-all duration-500 ${gaugeColor}`} style={{ width: `${act.score}%` }} />
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2">{act.reason}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Clothing & Accessories Advice */}
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800/80 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Shirt className="w-4 h-4 text-sky-400" />
            Clothing & Accessories Recommendations
          </h3>

          <ul className="space-y-3">
            {clothingTips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>

          {/* Quick Hazards / Weather Alert Callout if needed */}
          {(current.windSpeed > 30 || current.uvIndex >= 8 || maxRainProb >= 60 || current.weatherCode >= 95) && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2.5 mt-3">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
              <div>
                <span className="font-bold block mb-0.5">Atmospheric Advisory</span>
                {current.weatherCode >= 95
                  ? 'Thunderstorm active in area. Seek indoor shelter.'
                  : current.windSpeed > 30
                  ? 'Strong wind gusts expected. Secure loose outdoor objects.'
                  : current.uvIndex >= 8
                  ? 'Extreme UV levels. Avoid direct solar exposure around mid-day.'
                  : 'High precipitation chance today. Prepare for wet outdoor surfaces.'}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Gemini Weather Intelligence Assistant */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-indigo-500/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                WeatherIntel AI Assistant
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
                  Gemini 3.6 Flash
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                Generate custom travel advice, packing checklists, or outdoor event planning
              </p>
            </div>
          </div>

          <button
            onClick={() => handleGenerateAiAdvice()}
            disabled={isAiLoading}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-md shadow-indigo-600/30 disabled:opacity-50 shrink-0"
            id="generate-ai-synthesis-btn"
          >
            {isAiLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Synthesizing Weather Data...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                Generate AI Intelligence Summary
              </>
            )}
          </button>
        </div>

        {/* AI Quick Prompt Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400">Suggested queries:</span>
          {[
            'What should I pack for a 3-day trip?',
            'Is outdoor dining recommended tonight?',
            'Best time today for an outdoor workout?',
            'Are there any driving/commute hazards?',
          ].map((promptText, pIdx) => (
            <button
              key={pIdx}
              onClick={() => handleGenerateAiAdvice(promptText)}
              disabled={isAiLoading}
              className="text-xs px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-indigo-200 border border-indigo-500/20 transition-colors"
            >
              {promptText}
            </button>
          ))}
        </div>

        {/* Custom prompt input */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="text"
            value={customQuestion}
            onChange={(e) => setCustomQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && customQuestion.trim() && !isAiLoading) {
                handleGenerateAiAdvice();
              }
            }}
            placeholder="Ask AI a custom question about today's weather or travel plans..."
            className="flex-1 bg-slate-950/80 border border-indigo-500/30 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-400"
            id="ai-weather-query-input"
          />
          <button
            onClick={() => handleGenerateAiAdvice()}
            disabled={isAiLoading || !customQuestion.trim()}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all disabled:opacity-40 shrink-0"
            title="Ask AI"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Error message */}
        {aiError && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
            {aiError}
          </div>
        )}

        {/* AI Response Output Card */}
        {aiResponse && (
          <div className="mt-4 p-5 rounded-2xl bg-slate-950/90 border border-indigo-500/30 text-slate-200 text-sm space-y-3 shadow-inner leading-relaxed animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI Weather Synthesis Output
              </span>
              <button
                onClick={() => setAiResponse(null)}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                Clear
              </button>
            </div>
            <div className="whitespace-pre-line text-xs sm:text-sm text-slate-200 space-y-2">
              {aiResponse}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
