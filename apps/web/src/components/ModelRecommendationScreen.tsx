import React from "react";
import { Key, ExternalLink, CheckCircle2 } from "lucide-react";
import { SystemDiagnostics, ModelRecommendation } from "@/lib/api";

interface ModelRecommendationScreenProps {
  diagnostics: SystemDiagnostics | null;
  geminiApiKey: string;
  setGeminiApiKey: (key: string) => void;
  savedGeminiKey: string | null;
  recommendation: ModelRecommendation | null;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  isRecommending: boolean;
  onAnalyzeGemini: () => void;
  onBack: () => void;
  onContinue: () => void;
}

export function ModelRecommendationScreen({
  diagnostics,
  geminiApiKey,
  setGeminiApiKey,
  savedGeminiKey,
  recommendation,
  selectedModel,
  setSelectedModel,
  isRecommending,
  onAnalyzeGemini,
  onBack,
  onContinue
}: ModelRecommendationScreenProps) {
  return (
    <div className="h-screen max-h-screen overflow-hidden flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full">
      <div className="w-full apple-card p-6 rounded-3xl border border-white/10 shadow-2xl flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div>
            <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider">
              Step 2 of 3
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
              AI Model Recommendation
            </h2>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-[#86868b] block">Detected System</span>
            <span className="text-xs font-mono font-medium text-white">
              {diagnostics?.hardware.ram_total_gb || 16} GB RAM • {diagnostics?.hardware.cpu_cores || 12} Cores
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#161618] border border-white/[0.06] flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-white flex items-center gap-2">
              <Key className="h-3.5 w-3.5 text-[#ff9f0a]" />
              Google Gemini API Key (Optional)
            </label>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-[#0071e3] hover:underline flex items-center gap-1"
            >
              Get Key <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <p className="text-[11px] text-[#86868b] leading-relaxed">
            Provide your Gemini API key to analyze hardware benchmarks and deliver hybrid assistant guidance.
          </p>
          <div className="flex gap-2.5">
            <input
              type="password"
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="flex-1 px-3.5 py-2 rounded-xl bg-black border border-white/10 text-xs text-white placeholder-[#86868b] outline-none focus:border-[#0071e3] font-mono"
            />
            <button
              onClick={onAnalyzeGemini}
              disabled={isRecommending || !geminiApiKey.trim()}
              className="px-4 py-2 rounded-xl btn-apple-primary disabled:opacity-40 text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {isRecommending ? (
                <div className="h-3.5 w-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <span>Apply Key</span>
              )}
            </button>
          </div>
          {savedGeminiKey && (
            <div className="flex items-center gap-1.5 text-[11px] text-[#30d158]">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Gemini API Key verified and active for in-app guidance.</span>
            </div>
          )}
        </div>

        {recommendation && (
          <div className="p-4 rounded-2xl bg-[#161618] border border-white/[0.08] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#30d158]" />
                <span className="text-xs font-semibold text-white">
                  Recommended:
                </span>
                <span className="text-xs font-medium text-[#f5f5f7] px-2 py-0.5 rounded-md bg-[#2c2c2e]">
                  {recommendation.display_name}
                </span>
              </div>
              <span className="text-[11px] text-[#30d158] font-medium">
                {recommendation.speed_rating}
              </span>
            </div>

            <p className="text-xs text-[#86868b] leading-relaxed">
              {recommendation.reason}
            </p>

            <div className="pt-2.5 border-t border-white/[0.06] flex flex-col gap-2">
              <span className="text-[11px] font-semibold text-[#86868b]">
                Select Local Model:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedModel(recommendation.recommended_model)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                    selectedModel === recommendation.recommended_model
                      ? "bg-[#1c1c1e] border-[#0071e3] text-white font-medium"
                      : "bg-black border-white/10 text-[#86868b] hover:text-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{recommendation.display_name}</span>
                    <span className="text-[10px] text-[#0071e3] font-medium">Default</span>
                  </div>
                </button>

                {recommendation.alternatives.map((alt, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedModel(alt.model)}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                      selectedModel === alt.model
                        ? "bg-[#1c1c1e] border-[#0071e3] text-white font-medium"
                        : "bg-black border-white/10 text-[#86868b] hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{alt.name}</span>
                      <span className="text-[10px] text-[#86868b]">{alt.ram_req}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-white/[0.08]">
          <button
            onClick={onBack}
            className="px-5 py-2 rounded-full btn-apple-secondary text-xs cursor-pointer"
          >
            Back
          </button>
          <button
            onClick={onContinue}
            className="px-6 py-2.5 rounded-full btn-apple-primary text-xs font-semibold cursor-pointer"
          >
            Continue to Role Selection
          </button>
        </div>
      </div>
    </div>
  );
}
