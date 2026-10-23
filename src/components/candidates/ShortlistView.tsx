import React, { useState, useMemo } from "react";
import { Calendar, AlertTriangle, Check, X, ChevronRight } from "lucide-react";
import { Candidate, CandidateStatus } from "../../types.js";

interface ShortlistViewProps {
  candidates: Candidate[];
  onSelectCandidate: (id: string) => void;
  updateCandidateStatus: (id: string, status: CandidateStatus) => void;
}

export default function ShortlistView({
  candidates,
  onSelectCandidate,
  updateCandidateStatus
}: ShortlistViewProps) {
  const [gateThreshold, setGateThreshold] = useState(75);
  const [schedulingId, setSchedulingId] = useState<string | null>(null);
  
  // Scheduling form inputs
  const [schedDate, setSchedDate] = useState("");
  const [schedTime, setSchedTime] = useState("");
  const [schedType, setSchedType] = useState("Technical");

  const shortlistedCandidates = useMemo(() => {
    return candidates.filter((c) => {
      const score = c.scores?.overall || 0;
      return score >= gateThreshold && c.screeningStatus === "completed" && c.status !== "Rejected";
    });
  }, [candidates, gateThreshold]);

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedulingId || !schedDate || !schedTime) return;

    updateCandidateStatus(schedulingId, "Interview Scheduled");
    alert(`Interview Dispatched!\nType: ${schedType}\nDate: ${schedDate}\nTime: ${schedTime}\nAn invite has been placed on Google Calendar.`);
    setSchedulingId(null);
    setSchedDate("");
    setSchedTime("");
  };

  return (
    <div id="shortlist-view-page" className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-sans">
            Interview Shortlist
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-sans mt-0.5">
            Review top-tier talent matching or exceeding corporate rating criteria thresholds.
          </p>
        </div>

        {/* Dynamic Interactive Threshold Slider */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[var(--bg-card)] border border-slate-200 dark:border-white/10 shadow-xs flex items-center gap-3 text-xs font-sans self-start sm:self-auto">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono text-slate-400 uppercase block leading-none">Threshold Gate:</span>
            <span className="text-xs text-slate-800 dark:text-white font-semibold">Min Score: <span className="text-primary font-bold font-mono">{gateThreshold}%</span></span>
          </div>
          <input
            type="range"
            min={50}
            max={95}
            step={5}
            value={gateThreshold}
            onChange={(e) => setGateThreshold(parseInt(e.target.value))}
            className="w-28 sm:w-32 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>
      </div>

      {/* Grid of Shortlisted Candidate Cards */}
      {shortlistedCandidates.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl p-6 font-sans bg-white/50 dark:bg-transparent">
          <p className="text-sm text-slate-500">
            No candidates are currently exceeding the selected <strong className="text-primary">{gateThreshold}%</strong> score gateway.
          </p>
          <button 
            onClick={() => setGateThreshold(60)} 
            className="mt-3 text-xs font-semibold text-primary hover:underline cursor-pointer"
          >
            Adjust threshold gate to 60%
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {shortlistedCandidates.map((cand) => {
            const isSelectedForSched = schedulingId === cand.id;
            const score = cand.scores?.overall || 0;
            const isAlreadyScheduled = cand.status === "Interview Scheduled";

            return (
              <div
                key={cand.id}
                id={`shortlist-card-${cand.id}`}
                className="rounded-3xl p-4 sm:p-5 bg-white dark:bg-[var(--bg-card)] border border-slate-200 dark:border-white/10 shadow-xs flex flex-col justify-between space-y-4 transition-all duration-200 hover:shadow-md hover:border-primary/40"
              >
                {/* Card Top Section: Brief metadata and rating circle */}
                <div className="flex justify-between items-start gap-2">
                  <div className="space-y-1 min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight hover:text-primary transition-colors cursor-pointer truncate" onClick={() => onSelectCandidate(cand.id)}>
                      {cand.name}
                    </h3>
                    <p className="text-[10px] font-mono text-slate-500 truncate">
                      {cand.email} • Exp: {cand.experienceYears} yrs
                    </p>
                    <span className="inline-block text-[9px] text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded font-medium mt-1">
                      {cand.location}
                    </span>
                  </div>

                  {/* Circular visual Score */}
                  <div className="h-10 w-10 sm:h-11 sm:w-11 shrink-0 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center font-bold font-mono text-xs text-primary shadow-xs">
                    {score}%
                  </div>
                </div>

                {/* Card Middle: Summary or major strengths parsed */}
                <div className="space-y-2 border-t border-b border-slate-100 dark:border-white/5 py-3 text-xs">
                  <div>
                    <span className="text-[9px] font-mono text-success uppercase block mb-1 font-bold">Strongest Alignments</span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[11px] truncate">
                      {cand.analysis?.strengths?.[0] || "Exceptional matches in key development languages and architecture."}
                    </p>
                    {cand.analysis?.strengths?.[1] && (
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[11px] truncate mt-1">
                        {cand.analysis.strengths[1]}
                      </p>
                    )}
                  </div>

                  {cand.analysis?.missingSkills && cand.analysis.missingSkills.length > 0 && (
                    <div className="pt-1.5">
                      <span className="text-[9px] font-mono text-amber-500 uppercase block mb-1 flex items-center gap-1 font-bold">
                        <AlertTriangle className="h-3 w-3 text-amber-500" />
                        Skills Gap Detected
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {cand.analysis.missingSkills.slice(0, 3).map((sk, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 rounded bg-danger/10 border border-danger/20 text-danger text-[9px] font-medium font-sans">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Bottom: Interactive scheduling forms or buttons */}
                <div className="pt-1">
                  {isSelectedForSched ? (
                    /* Calendar Input simulation Form */
                    <form onSubmit={handleScheduleSubmit} className="space-y-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-[var(--bg-sidebar)] border border-slate-200 dark:border-white/10 text-xs">
                      <div className="flex justify-between items-center pb-1.5 border-b border-slate-200 dark:border-white/10">
                        <span className="font-mono text-[10px] text-primary uppercase font-bold">Scheduler Desk</span>
                        <button type="button" onClick={() => setSchedulingId(null)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">✕</button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-slate-500 text-[10px]">Date</label>
                          <input
                            type="date"
                            required
                            value={schedDate}
                            onChange={(e) => setSchedDate(e.target.value)}
                            className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-primary rounded p-1.5 text-xs text-slate-800 dark:text-white outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-500 text-[10px]">Time</label>
                          <input
                            type="time"
                            required
                            value={schedTime}
                            onChange={(e) => setSchedTime(e.target.value)}
                            className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-primary rounded p-1.5 text-xs text-slate-800 dark:text-white outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-500 text-[10px]">Interview Focus</label>
                        <select
                          value={schedType}
                          onChange={(e) => setSchedType(e.target.value)}
                          className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-primary rounded p-1.5 text-xs text-slate-800 dark:text-white outline-none"
                        >
                          <option value="Technical">Technical Live Coding</option>
                          <option value="System Design">System Architecture</option>
                          <option value="Behavioral">Behavioral & Culture Fit</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-1.5 bg-primary text-white font-bold rounded-lg cursor-pointer hover:bg-primary/90 transition-colors"
                      >
                        Confirm Dispatch
                      </button>
                    </form>
                  ) : (
                    /* Default Action buttons */
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => onSelectCandidate(cand.id)}
                        className="flex items-center gap-1 text-[11px] font-mono text-slate-500 dark:text-slate-400 hover:text-primary transition-all cursor-pointer"
                      >
                        <span>Full Assessment</span>
                        <ChevronRight className="h-3 w-3" />
                      </button>

                      <div className="flex gap-2">
                        <button
                          onClick={() => updateCandidateStatus(cand.id, "Rejected")}
                          className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-danger hover:border-danger/30 cursor-pointer transition-all"
                          title="Decline Candidate"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                        
                        {isAlreadyScheduled ? (
                          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/15 border border-primary/25 text-primary text-[10px] font-bold font-mono">
                            <Check className="h-3.5 w-3.5 text-primary" />
                            SCHEDULED
                          </span>
                        ) : (
                          <button
                            onClick={() => setSchedulingId(cand.id)}
                            className="flex items-center gap-1 px-3.5 py-1.5 bg-success text-slate-950 font-bold rounded-xl hover:bg-success/90 transition-all text-[11px] cursor-pointer shadow-xs"
                          >
                            <Calendar className="h-3.5 w-3.5" />
                            <span>Schedule</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
