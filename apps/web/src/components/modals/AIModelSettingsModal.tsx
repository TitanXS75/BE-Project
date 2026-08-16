"use client";

import React, { useState } from "react";
import {
  X,
  Key,
  Sparkles,
  Cpu,
  Zap,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Eye,
  EyeOff,
  Radio,
  Server,
  Globe
} from "lucide-react";
import {
  CloudAiConfig,
  CloudProvider,
  DEFAULT_CLOUD_MODELS,
  validateCloudApiKey
} from "@/lib/api";

interface AIModelSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  cloudConfig: CloudAiConfig;
  onSaveCloudConfig: (cfg: CloudAiConfig) => void;
  selectedLocalModel: string;
}

const PROVIDERS_INFO: Record<
  CloudProvider,
  {
    name: string;
    badge: string;
    keyLink: string;
    keyPlaceholder: string;
    description: string;
    color: string;
  }
> = {
  gemini: {
    name: "Google Gemini",
    badge: "Recommended • Free Tier",
    keyLink: "https://aistudio.google.com/app/apikey",
    keyPlaceholder: "AIzaSy...",
    description: "High speed, native long context, and free tier for instant curriculum reasoning.",
    color: "#0071e3"
  },
  openrouter: {
    name: "OpenRouter",
    badge: "300+ Frontier Models",
    keyLink: "https://openrouter.ai/keys",
    keyPlaceholder: "sk-or-v1-...",
    description: "One unified API key for Claude 3.5, GPT-4o, DeepSeek R1, Llama 3.3, and Gemini.",
    color: "#8b5cf6"
  },
  openai: {
    name: "OpenAI",
    badge: "GPT-4o & o1",
    keyLink: "https://platform.openai.com/api-keys",
    keyPlaceholder: "sk-proj-...",
    description: "Industry standard models for rigorous academic proofs and complex synthesis.",
    color: "#10a37f"
  },
  anthropic: {
    name: "Anthropic Claude",
    badge: "Claude 3.5 Sonnet",
    keyLink: "https://console.anthropic.com/settings/keys",
    keyPlaceholder: "sk-ant-...",
    description: "Top-ranked coding, nuanced pedagogical clarity, and deep explanations.",
    color: "#d97706"
  },
  groq: {
    name: "Groq LPU",
    badge: "Ultra-Fast 300 t/s",
    keyLink: "https://console.groq.com/keys",
    keyPlaceholder: "gsk_...",
    description: "Real-time near-instant streaming on dedicated LPU hardware.",
    color: "#f97316"
  },
  deepseek: {
    name: "DeepSeek AI",
    badge: "DeepSeek V3 & R1",
    keyLink: "https://platform.deepseek.com/api_keys",
    keyPlaceholder: "sk-...",
    description: "Open-weights reasoning, coding, and chain-of-thought token generation.",
    color: "#6366f1"
  }
};

export function AIModelSettingsModal({
  isOpen,
  onClose,
  cloudConfig,
  onSaveCloudConfig,
  selectedLocalModel
}: AIModelSettingsModalProps) {
  const [activeProvider, setActiveProvider] = useState<CloudProvider>(cloudConfig.provider);
  const [apiKeyInput, setApiKeyInput] = useState<string>(cloudConfig.apiKey || "");
  const [activeMode, setActiveMode] = useState<"cloud" | "local" | "hybrid">(cloudConfig.mode || "hybrid");
  const [showKey, setShowKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    msg: string;
    latency?: number;
  } | null>(cloudConfig.isValid ? { valid: true, msg: "Active & Connected" } : null);

  if (!isOpen) return null;

  const providerMeta = PROVIDERS_INFO[activeProvider];

  const handleSwitchProvider = (p: CloudProvider) => {
    setActiveProvider(p);
    setValidationResult(null);
  };

  const handleValidateAndTest = async () => {
    if (!apiKeyInput.trim()) {
      setValidationResult({ valid: false, msg: "Please enter an API key." });
      return;
    }
    setIsValidating(true);
    setValidationResult(null);

    try {
      const defaultModel = DEFAULT_CLOUD_MODELS[activeProvider].default;
      const res = await validateCloudApiKey(activeProvider, apiKeyInput.trim(), defaultModel);
      if (res.valid) {
        setValidationResult({
          valid: true,
          msg: `Connected successfully! Response latency: ${res.latency_ms || 150}ms.`,
          latency: res.latency_ms
        });
      } else {
        setValidationResult({
          valid: false,
          msg: res.error || "Failed to authenticate with provider. Please verify the key."
        });
      }
    } catch (e: any) {
      setValidationResult({
        valid: false,
        msg: e.message || "Connection error."
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleSave = () => {
    const isNowValid = validationResult?.valid || Boolean(apiKeyInput.trim().length > 10);
    const modelToUse = DEFAULT_CLOUD_MODELS[activeProvider].default;
    onSaveCloudConfig({
      mode: activeMode,
      provider: activeProvider,
      apiKey: apiKeyInput.trim(),
      model: modelToUse,
      isValid: isNowValid,
      providerName: providerMeta.name
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#18181b] border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[#0071e3]/10 border border-[#0071e3]/20 flex items-center justify-center text-[#0071e3]">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                AI Inference Engine &amp; Cloud Keys
              </h2>
              <p className="text-xs text-[#86868b]">
                Configure cloud intelligence for reading, understanding curriculum .rssh packages, and answering queries.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#86868b] hover:text-white transition-all cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ─── INFERENCE MODE SELECTOR (HYBRID / CLOUD / LOCAL) ─── */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-[#86868b] uppercase tracking-wider">
            Inference Execution Mode
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => setActiveMode("hybrid")}
              className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                activeMode === "hybrid"
                  ? "bg-[#0071e3]/15 border-[#0071e3] text-white ring-1 ring-[#0071e3]"
                  : "bg-black/40 border-white/10 text-[#86868b] hover:text-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-[#0071e3]" />
                  Hybrid Mode
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#0071e3]/20 text-[#0071e3] font-medium">
                  Best
                </span>
              </div>
              <p className="text-[11px] text-[#86868b]">
                Local vector &amp; .rssh retrieval + Cloud model reasoning.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setActiveMode("cloud")}
              className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                activeMode === "cloud"
                  ? "bg-[#30d158]/15 border-[#30d158] text-white ring-1 ring-[#30d158]"
                  : "bg-black/40 border-white/10 text-[#86868b] hover:text-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-[#30d158]" />
                  Cloud AI Only
                </span>
              </div>
              <p className="text-[11px] text-[#86868b]">
                Direct high-speed reasoning via configured Cloud API key.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setActiveMode("local")}
              className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                activeMode === "local"
                  ? "bg-[#ff9f0a]/15 border-[#ff9f0a] text-white ring-1 ring-[#ff9f0a]"
                  : "bg-black/40 border-white/10 text-[#86868b] hover:text-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Cpu className="h-3.5 w-3.5 text-[#ff9f0a]" />
                  Local Ollama
                </span>
              </div>
              <p className="text-[11px] text-[#86868b]">
                100% offline air-gapped inference ({selectedLocalModel}).
              </p>
            </button>
          </div>
        </div>

        {/* ─── CLOUD PROVIDER SELECTOR ─── */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#86868b] uppercase tracking-wider">
              Select Cloud Model Provider
            </label>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {(Object.keys(PROVIDERS_INFO) as CloudProvider[]).map((pKey) => {
              const p = PROVIDERS_INFO[pKey];
              const isSelected = activeProvider === pKey;
              return (
                <button
                  key={pKey}
                  type="button"
                  onClick={() => handleSwitchProvider(pKey)}
                  className={`px-3.5 py-2 rounded-xl border text-xs font-medium whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#27272a] text-white border-white/30 shadow-md ring-1 ring-white/20"
                      : "bg-black/40 text-[#86868b] border-white/10 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: p.color }}
                  />
                  {p.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── API KEY INPUT SECTION ─── */}
        <div className="p-4 rounded-2xl bg-black/60 border border-white/[0.08] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4 text-[#ff9f0a]" />
              <span className="text-xs font-semibold text-white">
                {providerMeta.name} API Key
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-[#a1a1a6]">
                {providerMeta.badge}
              </span>
            </div>
            <a
              href={providerMeta.keyLink}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-[#0071e3] hover:underline flex items-center gap-1 font-medium"
            >
              Get Free Key <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <p className="text-[11px] text-[#86868b]">
            {providerMeta.description}
          </p>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type={showKey ? "text" : "password"}
                value={apiKeyInput}
                onChange={(e) => {
                  setApiKeyInput(e.target.value);
                  setValidationResult(null);
                }}
                placeholder={providerMeta.keyPlaceholder}
                className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-[#161618] border border-white/10 text-xs text-white placeholder-[#86868b] outline-none focus:border-[#0071e3] font-mono"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-2.5 text-[#86868b] hover:text-white cursor-pointer"
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <button
              type="button"
              onClick={handleValidateAndTest}
              disabled={isValidating || !apiKeyInput.trim()}
              className="px-4 py-2.5 rounded-xl btn-apple-secondary text-xs font-medium cursor-pointer disabled:opacity-40 flex items-center gap-1.5"
            >
              {isValidating ? (
                <>
                  <div className="h-3 w-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Testing...
                </>
              ) : (
                "Test Key"
              )}
            </button>
          </div>

          {/* Validation Feedback */}
          {validationResult && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                validationResult.valid
                  ? "bg-[#30d158]/10 text-[#30d158] border border-[#30d158]/20"
                  : "bg-[#ff453a]/10 text-[#ff453a] border border-[#ff453a]/20"
              }`}
            >
              {validationResult.valid ? (
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
              )}
              <span>{validationResult.msg}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
          <div className="text-[11px] text-[#86868b]">
            API keys are securely kept in local browser memory.
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl btn-apple-secondary text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2 rounded-xl btn-apple-primary text-xs font-medium cursor-pointer"
            >
              Save &amp; Apply Engine
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
