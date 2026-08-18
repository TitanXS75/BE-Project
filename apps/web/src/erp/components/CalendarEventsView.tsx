import React, { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Plus, Clock } from "lucide-react";
import { ErpApi } from "../supabase";
import { CalendarEvent } from "../types";

export function CalendarEventsView() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("2026-08-25T09:00");
  const [endDate, setEndDate] = useState("2026-08-25T17:00");
  const [eventType, setEventType] = useState<CalendarEvent["event_type"]>("academic");

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    const data = await ErpApi.getEvents();
    setEvents(data);
  }

  async function handleAddEvent(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    const created = await ErpApi.createEvent({
      title: title.trim(),
      description: description.trim() || undefined,
      start_date: startDate,
      end_date: endDate,
      event_type: eventType,
    });

    setEvents((prev) => [...prev, created]);
    setShowAddModal(false);
    setTitle("");
    setDescription("");
  }

  const getTypeStyle = (type: CalendarEvent["event_type"]) => {
    switch (type) {
      case "academic":
        return "bg-[#0071e3]/15 text-[#0071e3] border-[#0071e3]/30";
      case "exam":
        return "bg-[#ff9f0a]/15 text-[#ff9f0a] border-[#ff9f0a]/30";
      case "holiday":
        return "bg-amber-500/15 text-amber-400 border-amber-500/30";
      case "sports":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
      default:
        return "bg-white/10 text-white border-white/10";
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <CalendarIcon className="h-6 w-6 text-[#38bdf8]" />
            Academic &amp; Campus Calendar
          </h1>
          <p className="text-xs text-[#86868b] mt-1">
            Institutional key milestones, examination periods, holidays, and symposiums.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-apple-primary px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Event
          </button>
        </div>
      </div>

      {/* Events List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {events.map((event) => {
          const sDate = new Date(event.start_date);
          const formattedDate = sDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });
          const formattedTime = sDate.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div
              key={event.id}
              className="apple-card p-5 rounded-2xl border border-white/[0.08] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${getTypeStyle(
                      event.event_type
                    )}`}
                  >
                    {event.event_type}
                  </span>
                  <span className="text-xs text-[#86868b] font-mono">
                    {formattedDate}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white mb-1.5">
                  {event.title}
                </h3>
                {event.description && (
                  <p className="text-xs text-[#86868b] leading-relaxed">
                    {event.description}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-[#86868b]">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-[#0071e3]" /> Starts {formattedTime}
                </span>
                <span className="text-white/60 font-medium">Campus</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Add Event */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="apple-card p-6 rounded-3xl max-w-md w-full border border-white/20 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Schedule Event</h3>
            <p className="text-xs text-[#86868b] mb-4">
              Add a new date to the institutional calendar.
            </p>
            <form onSubmit={handleAddEvent} className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-semibold text-[#86868b] mb-1 block">
                  Event Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Annual Sports Meet 2026"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c1e] border border-white/10 text-white text-xs focus:outline-none focus:border-[#0071e3]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#86868b] mb-1 block">
                  Event Category
                </label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-[#1c1c1e] border border-white/10 text-white text-xs focus:outline-none focus:border-[#0071e3] cursor-pointer"
                >
                  <option value="academic">Academic Orientation</option>
                  <option value="exam">Examination Window</option>
                  <option value="holiday">Official Holiday</option>
                  <option value="sports">Sports &amp; Extracurricular</option>
                  <option value="general">General Meeting</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#86868b] mb-1 block">
                    Start Date &amp; Time
                  </label>
                  <input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#1c1c1e] border border-white/10 text-white text-xs focus:outline-none focus:border-[#0071e3]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#86868b] mb-1 block">
                    End Date &amp; Time
                  </label>
                  <input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#1c1c1e] border border-white/10 text-white text-xs focus:outline-none focus:border-[#0071e3]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#86868b] mb-1 block">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Optional details or venue location..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                  Add to Calendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
