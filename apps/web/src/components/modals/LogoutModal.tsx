import React from "react";
import { LogOut } from "lucide-react";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-sm p-6 rounded-3xl bg-[#18181b] border border-white/15 shadow-2xl flex flex-col gap-4 text-center animate-in fade-in zoom-in-95">
        <div className="h-12 w-12 rounded-2xl bg-[#ff453a]/15 text-[#ff453a] flex items-center justify-center mx-auto mb-1">
          <LogOut className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white">Log Out of Workspace?</h3>
          <p className="text-xs text-[#86868b] mt-1.5 leading-relaxed">
            Are you sure you want to end your current session? You can return to your courses at any time.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={onClose}
            className="py-2.5 rounded-xl btn-apple-secondary text-xs font-semibold cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="py-2.5 rounded-xl bg-[#ff453a] hover:bg-[#ff3b30] text-white text-xs font-semibold transition-all cursor-pointer shadow-md shadow-[#ff453a]/25"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
