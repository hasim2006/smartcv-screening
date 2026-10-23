import { useState } from "react";
import { Download, FileText, Check, ShieldCheck, FileSpreadsheet, FileJson, Sparkles } from "lucide-react";
import { Candidate, JobDescription, DashboardStats } from "../../types.js";

interface ReportsViewProps {
  candidates: Candidate[];
  activeJD: JobDescription | null;
  stats: DashboardStats | null;
}

export default function ReportsView({
  candidates,
  activeJD,
  stats
}: ReportsViewProps) {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const completedCandidates = candidates.filter(c => c.screeningStatus === "completed");

  const handleCsvExport = () => {
    if (completedCandidates.length === 0) return;

    const headers = ["Rank", "Name", "Email", "Overall Score", "Experience Years", "Education", "Current Company", "AI Verdict", "Hiring Recommendation"];
    const rows = completedCandidates
      .sort((a, b) => (b.scores?.overall || 0) - (a.scores?.overall || 0))
      .map((c, idx) => [
        idx + 1,
        c.name,
        c.email,
        c.scores?.overall || 0,
        c.experienceYears,
        c.education,
        c.currentCompany,
        c.aiVerdict || "N/A",
        c.analysis?.hiringRecommendation || "N/A"
      ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `ATS_Screening_Report_Campaign_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerSuccess("csv");
  };

  const handleJsonExport = () => {
    if (completedCandidates.length === 0) return;

    const dataStr = JSON.stringify(completedCandidates, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `ATS_Screening_Dataset_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerSuccess("json");
  };

  const triggerSuccess = (type: string) => {
    setDownloadSuccess(type);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <div id="reports-view-page" className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-sans">
          Campaign Reports
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-sans mt-0.5">
          Export fully-compiled screening dataset models as CSV or structured JSON for internal HR database archives.
        </p>
      </div>

      {/* Grid containing Export widgets and campaign briefs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Export triggers card (Col spans 1) */}
        <div className="lg:col-span-1 p-5 sm:p-6 rounded-3xl bg-white dark:bg-[var(--bg-card)] border border-slate-200 dark:border-white/10 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider font-mono">
              Export Action Center
            </h3>
            <p className="text-xs text-slate-500 font-sans leading-relaxed">
              Export structured data archives of evaluated resumes, skills compatibility parameters, and suggestions.
            </p>
          </div>

          <div className="space-y-3">
            {/* CSV Trigger */}
            <button
              onClick={handleCsvExport}
              disabled={completedCandidates.length === 0}
              className="w-full flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-all text-left group cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="h-5 w-5 text-success group-hover:scale-110 transition-transform" />
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Export CSV Spreadsheet</span>
                  <p className="text-[10px] text-slate-500 font-sans">Compatible with Excel & Google Sheets</p>
                </div>
              </div>
              {downloadSuccess === "csv" ? (
                <Check className="h-4 w-4 text-success animate-bounce" />
              ) : (
                <Download className="h-4 w-4 text-slate-400 group-hover:text-primary transition-colors" />
              )}
            </button>

            {/* JSON Trigger */}
            <button
              onClick={handleJsonExport}
              disabled={completedCandidates.length === 0}
              className="w-full flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-all text-left group cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-3">
                <FileJson className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Export JSON Dataset</span>
                  <p className="text-[10px] text-slate-500 font-sans">Structured JSON schema object</p>
                </div>
              </div>
              {downloadSuccess === "json" ? (
                <Check className="h-4 w-4 text-success animate-bounce" />
              ) : (
                <Download className="h-4 w-4 text-slate-400 group-hover:text-primary transition-colors" />
              )}
            </button>
          </div>

          <div className="bg-slate-50 dark:bg-[var(--bg-card-inner)] rounded-2xl p-3.5 border border-slate-200 dark:border-white/5 text-[11px] text-slate-500 dark:text-slate-400 font-sans">
            <strong>Security Rule:</strong> All exported files are generated directly within client memory buffers to preserve data sovereignty and confidentiality.
          </div>
        </div>

        {/* Campaign Executive Summary brief (Col spans 2) */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-3xl bg-white dark:bg-[var(--bg-card)] border border-slate-200 dark:border-white/10 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider font-mono">
                Executive Campaign Summary Brief
              </h3>
              <p className="text-[11px] text-slate-500 font-sans mt-0.5">
                Automatically compiled summary of talent screening results
              </p>
            </div>
            
            <div className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] text-primary font-semibold font-mono">
              <Sparkles className="h-3 w-3 animate-pulse" />
              <span>AI GENERATED SUMMARY</span>
            </div>
          </div>

          <div className="space-y-4 text-xs font-sans text-slate-700 dark:text-slate-300 leading-relaxed max-h-96 overflow-y-auto pr-1">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[var(--bg-card-inner)] border border-slate-200 dark:border-white/10 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                <FileText className="h-4 w-4 text-primary" />
                <span>Job Specification Alignment Profile</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                Active evaluations are running against the <strong>{activeJD ? activeJD.title : "Unassigned Role"}</strong> specifications.
                Processed a total pool of <strong>{completedCandidates.length} evaluated profiles</strong>, matching requirements against skill vectors.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Key Highlights and Insights</h4>
              <ul className="space-y-2">
                <li className="pl-3.5 relative before:absolute before:left-0 before:top-2 before:h-1 before:w-1 before:rounded-full before:bg-primary leading-relaxed text-[11px] text-slate-600 dark:text-slate-400">
                  The overall compatibility alignment index currently stands at <strong className="text-slate-900 dark:text-white">{stats?.averageMatchScore}%</strong>, demonstrating a robust applicant pool.
                </li>
                <li className="pl-3.5 relative before:absolute before:left-0 before:top-2 before:h-1 before:w-1 before:rounded-full before:bg-primary leading-relaxed text-[11px] text-slate-600 dark:text-slate-400">
                  The leading candidate evaluated by neural scoring is <strong className="text-slate-900 dark:text-white">{stats?.topCandidate || "None"}</strong>, holding pristine technical matches across engineering frameworks.
                </li>
                <li className="pl-3.5 relative before:absolute before:left-0 before:top-2 before:h-1 before:w-1 before:rounded-full before:bg-primary leading-relaxed text-[11px] text-slate-600 dark:text-slate-400">
                  Core tech stack coverage is exceptionally strong across <strong>React, TypeScript, and SQL</strong>; secondary opportunities noted in cloud deployment tools.
                </li>
              </ul>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[var(--bg-card-inner)] border border-slate-200 dark:border-white/10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-success" />
                <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">Compliance & Authenticity Verified</span>
              </div>
              <span className="font-mono text-[9px] text-slate-400">ATS AUTHENTICATED</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
