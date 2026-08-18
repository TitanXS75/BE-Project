import React, { useState, useEffect } from "react";
import { Megaphone, Plus, CheckCircle2 } from "lucide-react";
import { ErpApi } from "../supabase";
import { Notice } from "../types";

export function NoticeBoardView() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState<"low" | "normal" | "high" | "urgent">("normal");
  const [publishedBy, setPublishedBy] = useState("Academic Affairs");

  useEffect(() => {
    loadNotices();
  }, []);

  async function loadNotices() {
    const data = await ErpApi.getNotices();
    setNotices(data);
  }

  async function handleCreateNotice(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const created = await ErpApi.createNotice({
      title: title.trim(),
      content: content.trim(),
      priority,
      published_by: publishedBy.trim() || "Academic Dean Office",
    });

    setNotices((prev) => [created, ...prev]);
    setShowAddModal(false);
    setTitle("");
    setContent("");
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Megaphone className="h-6 w-6 text-[#ec4899]" />
            Institutional Notice Board
          </h1>
          <p className="text-xs text-[#86868b] mt-1">
            Broadcast official circulars, exam dates, and campus communications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-apple-primary px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Publish Notice
          </button>
        </div>
      </div>

      {/* Notices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {notices.map((notice) => (
          <div
            key={notice.id}
            className="apple-card p-6 rounded-2xl border border-white/[0.08] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <span
                  className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                    notice.priority === "urgent"
                      ? "bg-red-500/20 text-red-400 border border-red-500/30"
                      : notice.priority === "high"
                      ? "bg-[#ff9f0a]/20 text-[#ff9f0a] border border-[#ff9f0a]/30"
                      : "bg-white/10 text-[#86868b] border border-white/10"
                  }`}
                >
                  {notice.priority} Priority
                </span>
                <span className="text-[11px] text-[#86868b] font-mono">
                  {notice.created_at}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white mb-2 leading-snug">
                {notice.title}
              </h3>
              <p className="text-xs text-[#86868b] leading-relaxed">
                {notice.content}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px]">
              <span className="text-[#86868b]">
                Authorized: <span className="text-white font-medium">{notice.published_by}</span>
              </span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Live
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Publish Notice */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="apple-card p-6 rounded-3xl max-w-md w-full border border-white/20 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Publish Notice</h3>
            <p className="text-xs text-[#86868b] mb-4">
              Compose an official announcement for the institution.
            </p>
            <form onSubmit={handleCreateNotice} className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-semibold text-[#86868b] mb-1 block">
                  Notice Heading
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule for Practical Lab Examinations"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c1e] border border-white/10 text-white text-xs focus:outline-none focus:border-[#0071e3]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#86868b] mb-1 block">
                    Priority Level
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#1c1c1e] border border-white/10 text-white text-xs focus:outline-none focus:border-[#0071e3] cursor-pointer"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#86868b] mb-1 block">
                    Issuing Authority
                  </label>
                  <input
                    type="text"
                    placeholder="Academic Council"
                    value={publishedBy}
                    onChange={(e) => setPublishedBy(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c1e] border border-white/10 text-white text-xs focus:outline-none focus:border-[#0071e3]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#86868b] mb-1 block">
                  Notice Body Text
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter detailed notice description..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c1e] border border-white/10 text-white text-xs focus:outline-none focus:border-[#0071e3] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-full btn-apple-secondary text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full btn-apple-primary text-xs cursor-pointer"
                >
                  Broadcast Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
