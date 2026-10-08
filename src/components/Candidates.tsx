import { useState, useMemo } from "react";
import { Search, Eye, CheckCircle2, XCircle, ArrowUpDown } from "lucide-react";
import { Candidate, AIVerdict, CandidateStatus } from "../types.js";

interface CandidatesProps {
  candidates: Candidate[];
  onSelectCandidate: (id: string) => void;
  updateCandidateStatus: (id: string, status: CandidateStatus) => void;
  searchQuery: string;
}

export default function Candidates({
  candidates,
  onSelectCandidate,
  updateCandidateStatus,
  searchQuery: initialSearchQuery
}: CandidatesProps) {
  const [search, setSearch] = useState(initialSearchQuery || "");
  const [verdictFilter, setVerdictFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"score" | "exp" | "name">("score");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Sync search query if passed from TopBar
  useMemo(() => {
    if (initialSearchQuery) {
      setSearch(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  const toggleSort = (field: "score" | "exp" | "name") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const filteredAndSortedCandidates = useMemo(() => {
    return candidates
      .filter((c) => {
        const matchesSearch = 
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.email.toLowerCase().includes(search.toLowerCase()) ||
          c.skills.some(s => s.toLowerCase().includes(search.toLowerCase())) ||
          c.currentCompany.toLowerCase().includes(search.toLowerCase());

        const matchesVerdict = verdictFilter === "ALL" || c.aiVerdict === verdictFilter;
        const matchesStatus = statusFilter === "ALL" || c.status === statusFilter;

        return matchesSearch && matchesVerdict && matchesStatus;
      })
      .sort((a, b) => {
        let valA: any = 0;
        let valB: any = 0;

        if (sortBy === "score") {
          valA = a.scores?.overall || 0;
          valB = b.scores?.overall || 0;
        } else if (sortBy === "exp") {
          valA = a.experienceYears || 0;
          valB = b.experienceYears || 0;
        } else if (sortBy === "name") {
          valA = a.name.toLowerCase();
          valB = b.name.toLowerCase();
        }

        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
  }, [candidates, search, verdictFilter, statusFilter, sortBy, sortOrder]);

  const getVerdictStyle = (v: AIVerdict | null) => {
    switch (v) {
      case "Excellent Match":
        return "bg-success/10 text-success border border-success/30";
      case "Strong Match":
        return "bg-primary/10 text-primary border border-primary/30";
      case "Moderate Match":
        return "bg-warning/15 text-amber-600 dark:text-warning border border-warning/30";
      case "Weak Match":
        return "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700";
      case "Reject":
        return "bg-danger/10 text-danger border border-danger/30";
      default:
        return "bg-slate-100 dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800";
    }
  };

  const getStatusStyle = (s: CandidateStatus) => {
    switch (s) {
      case "Shortlisted":
        return "bg-success/15 text-success border border-success/30";
      case "Interview Scheduled":
        return "bg-accent/15 text-cyan-600 dark:text-accent border border-accent/30";
      case "Rejected":
        return "bg-danger/15 text-danger border border-danger/30";
      case "Screened":
        return "bg-primary/15 text-primary border border-primary/30";
      default:
        return "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700";
    }
  };

  return (
    <div id="candidates-page" className="space-y-5 sm:space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-sans">
          Candidates Directory
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-sans mt-0.5">
          Explore complete resumes matched against the active JD. Sort, filter, or initiate interview triggers.
        </p>
      </div>

      {/* Filtering Header Box */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[var(--bg-card)] border border-slate-200 dark:border-white/10 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        
        {/* Local Search Input */}
        <div className="w-full sm:w-72 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search candidates, skills, role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-primary rounded-xl py-2 pl-9 pr-4 text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none transition-all"
          />
        </div>

        {/* Dropdown Filters and Sort controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-sans">
          
          {/* Verdict Filter */}
          <div className="flex items-center gap-1.5 flex-1 sm:flex-none">
            <span className="text-slate-500 font-mono text-[10px] uppercase">Match:</span>
            <select
              value={verdictFilter}
              onChange={(e) => setVerdictFilter(e.target.value)}
              className="w-full sm:w-auto bg-slate-50 dark:bg-[var(--bg-sidebar)] border border-slate-200 dark:border-white/10 focus:border-primary rounded-xl px-2.5 py-1.5 text-slate-800 dark:text-white outline-none font-sans cursor-pointer text-xs"
            >
              <option value="ALL">All Matches</option>
              <option value="Excellent Match">Excellent Match</option>
              <option value="Strong Match">Strong Match</option>
              <option value="Moderate Match">Moderate Match</option>
              <option value="Weak Match">Weak Match</option>
              <option value="Reject">Reject</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 flex-1 sm:flex-none">
            <span className="text-slate-500 font-mono text-[10px] uppercase">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto bg-slate-50 dark:bg-[var(--bg-sidebar)] border border-slate-200 dark:border-white/10 focus:border-primary rounded-xl px-2.5 py-1.5 text-slate-800 dark:text-white outline-none font-sans cursor-pointer text-xs"
            >
              <option value="ALL">All Statuses</option>
              <option value="Applied">Applied</option>
              <option value="Screened">Screened</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview Scheduled">Interview</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Sort Toggles */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => toggleSort("score")}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border font-mono text-[11px] transition-all cursor-pointer ${
                sortBy === "score" 
                  ? "border-primary bg-primary/10 text-primary font-bold" 
                  : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-primary"
              }`}
            >
              <span>Score</span>
              <ArrowUpDown className="h-3 w-3" />
            </button>

            <button
              onClick={() => toggleSort("exp")}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border font-mono text-[11px] transition-all cursor-pointer ${
                sortBy === "exp" 
                  ? "border-primary bg-primary/10 text-primary font-bold" 
                  : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-primary"
              }`}
            >
              <span>Exp</span>
              <ArrowUpDown className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Candidates Data Table */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[var(--bg-card)] border border-slate-200 dark:border-white/10 shadow-xs">
        {filteredAndSortedCandidates.length === 0 ? (
          <div className="py-14 text-center text-slate-500 font-sans">
            No candidates matched the selected search or filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
            <table className="w-full text-left border-collapse text-xs font-sans min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800/80 text-slate-500 uppercase font-mono text-[10px]">
                  <th className="pb-3 pr-2 text-center w-12">Rank</th>
                  <th className="pb-3">Candidate Info</th>
                  <th className="pb-3 text-center">AI Fit Score</th>
                  <th className="pb-3">Experience</th>
                  <th className="pb-3">Education</th>
                  <th className="pb-3">Top Skills</th>
                  <th className="pb-3">AI Verdict</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-slate-700 dark:text-slate-300">
                {filteredAndSortedCandidates.map((cand, idx) => {
                  const score = cand.scores?.overall || 0;
                  const rank = idx + 1;
                  
                  return (
                    <tr 
                      key={cand.id} 
                      className="hover:bg-slate-50 dark:hover:bg-white/[0.02] cursor-pointer transition-colors group"
                      onClick={() => onSelectCandidate(cand.id)}
                    >
                      {/* Rank Column */}
                      <td className="py-3.5 text-center font-bold font-mono text-slate-500 dark:text-slate-400 text-xs pr-2">
                        {rank === 1 ? (
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-slate-950 font-bold text-[10px] shadow-xs">
                            🏆
                          </span>
                        ) : rank === 2 ? (
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-300 text-slate-900 font-bold text-[10px]">
                            🥈
                          </span>
                        ) : rank === 3 ? (
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-600 text-white font-bold text-[10px]">
                            🥉
                          </span>
                        ) : (
                          `#${rank}`
                        )}
                      </td>

                      {/* Candidate Brief Info */}
                      <td className="py-3.5 pr-4">
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-slate-200 group-hover:text-primary transition-colors">
                            {cand.name}
                          </p>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {cand.email}
                          </span>
                        </div>
                      </td>

                      {/* Match Index Gauge */}
                      <td className="py-3.5 text-center pr-2">
                        {cand.screeningStatus === "pending" ? (
                          <span className="text-[10px] font-mono text-amber-500 font-semibold">PENDING</span>
                        ) : (
                          <div className="inline-flex items-center gap-1">
                            <span className={`text-sm font-bold font-mono ${
                              score >= 90 ? "text-success" :
                              score >= 80 ? "text-primary" :
                              score >= 60 ? "text-amber-500" : "text-danger"
                            }`}>
                              {score}%
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Years Exp */}
                      <td className="py-3.5 font-medium text-slate-800 dark:text-slate-300">
                        {cand.experienceYears} Years
                        {cand.currentCompany && (
                          <span className="text-[10px] text-slate-500 block font-mono">
                            @ {cand.currentCompany}
                          </span>
                        )}
                      </td>

                      {/* Education Details */}
                      <td className="py-3.5 text-slate-600 dark:text-slate-400 font-sans max-w-[130px] truncate" title={cand.education}>
                        {cand.education}
                      </td>

                      {/* Skill badges */}
                      <td className="py-3.5 pr-3">
                        <div className="flex flex-wrap gap-1 max-w-[160px]">
                          {cand.skills.slice(0, 3).map((skill, sIdx) => (
                            <span 
                              key={sIdx} 
                              className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-[9px] font-mono"
                            >
                              {skill}
                            </span>
                          ))}
                          {cand.skills.length > 3 && (
                            <span className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-900/50 text-[8px] text-slate-400 font-mono">
                              +{cand.skills.length - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* AI Verdict Badge */}
                      <td className="py-3.5 pr-2">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-mono font-medium ${getVerdictStyle(cand.aiVerdict)}`}>
                          {cand.aiVerdict || "PENDING"}
                        </span>
                      </td>

                      {/* Candidate Status Tag */}
                      <td className="py-3.5">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusStyle(cand.status)}`}>
                          {cand.status}
                        </span>
                      </td>

                      {/* Direct action triggers */}
                      <td className="py-3.5 text-right pr-1" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-1.5">
                          <button
                            title="Shortlist Candidate"
                            disabled={cand.status === "Shortlisted" || cand.screeningStatus !== "completed"}
                            onClick={() => updateCandidateStatus(cand.id, "Shortlisted")}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-success hover:border-success/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            title="Reject Candidate"
                            disabled={cand.status === "Rejected" || cand.screeningStatus !== "completed"}
                            onClick={() => updateCandidateStatus(cand.id, "Rejected")}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-danger hover:border-danger/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                          </button>
                          <button
                            title="Open Candidate Profile Drawer"
                            onClick={() => onSelectCandidate(cand.id)}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white hover:border-primary/40 transition-all cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
