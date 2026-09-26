"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface AppleSelectOption {
  value: string;
  label: string;
  badge?: string;
  description?: string;
  icon?: React.ReactNode;
}

interface AppleSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: (AppleSelectOption | string)[];
  placeholder?: string;
  className?: string;
  dropdownClassName?: string;
  disabled?: boolean;
  size?: "sm" | "md";
}

export function AppleSelect({
  value,
  onChange,
  options,
  placeholder = "Select option",
  className = "",
  dropdownClassName = "",
  disabled = false,
  size = "md",
}: AppleSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Normalize options
  const normalizedOptions: AppleSelectOption[] = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const sizeClasses =
    size === "sm"
      ? "px-3 py-1.5 text-xs rounded-xl"
      : "px-3.5 py-2 text-xs rounded-xl";

  return (
    <div
      className={`relative inline-block text-left ${className} ${
        isOpen ? "z-[60]" : "z-10"
      }`}
      ref={containerRef}
    >
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2.5 bg-[#1c1c1e] hover:bg-[#252528] active:bg-[#202023] border border-white/10 hover:border-white/20 text-white font-medium transition-all cursor-pointer shadow-sm disabled:opacity-40 disabled:cursor-not-allowed ${sizeClasses} ${
          isOpen ? "border-[#0071e3] ring-2 ring-[#0071e3]/20 bg-[#202023]" : ""
        }`}
      >
        <span className="truncate flex items-center gap-2">
          {selectedOption?.icon}
          <span>{selectedOption ? selectedOption.label : placeholder}</span>
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-[#86868b] transition-transform duration-200 flex-shrink-0 ${
            isOpen ? "rotate-180 text-white" : ""
          }`}
        />
      </button>

      {/* Floating Custom Dropdown Panel */}
      {isOpen && (
        <div
          className={`absolute left-0 right-0 sm:right-auto sm:min-w-full min-w-[200px] mt-1.5 z-[100] rounded-2xl bg-[#121214]/95 backdrop-blur-2xl p-1.5 border border-white/[0.12] shadow-2xl shadow-black/95 max-h-64 overflow-y-auto ring-1 ring-white/5 animate-in fade-in zoom-in-95 duration-150 flex flex-col gap-0.5 ${dropdownClassName}`}
        >
          {normalizedOptions.length === 0 ? (
            <div className="px-3 py-2 text-xs text-[#86868b] text-center">
              No options available
            </div>
          ) : (
            normalizedOptions.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between gap-2 transition-all cursor-pointer border ${
                    isSelected
                      ? "bg-[#0071e3]/15 border-[#0071e3]/40 text-white font-semibold shadow-sm"
                      : "border-transparent text-[#a1a1a6] hover:bg-white/[0.06] hover:border-white/[0.08] hover:text-white"
                  }`}
                >
                  <div className="flex flex-col gap-0.5 truncate">
                    <span className="truncate flex items-center gap-2">
                      {opt.icon}
                      <span className={isSelected ? "text-white" : ""}>{opt.label}</span>
                    </span>
                    {opt.description && (
                      <span className="text-[10px] text-[#86868b] truncate">
                        {opt.description}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0 ml-1">
                    {opt.badge && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/10 text-[#86868b] font-mono">
                        {opt.badge}
                      </span>
                    )}
                    {isSelected && <Check className="h-3.5 w-3.5 text-[#0071e3]" />}
                  </div>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
