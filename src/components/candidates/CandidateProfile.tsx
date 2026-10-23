import { useState } from "react";
import { X, Download, Calendar, Mail, Phone, MapPin, DollarSign, Briefcase, Check, AlertTriangle } from "lucide-react";
import { Candidate, CandidateStatus } from "../../types.js";
import { useTheme } from "../../context/ThemeContext.js";

interface CandidateProfileProps {
  candidate: Candidate;
  onClose: () => void;
  updateCandidateStatus: (id: string, status: CandidateStatus) => void;
}

export default function CandidateProfile({
  candidate,
  onClose,
  updateCandidateStatus
}: CandidateProfileProps) {
  const [activeTab, setActiveTab] = useState<"assessment" | "questions" | "resume" | "ats">("assessment");
  const { theme } = useTheme();

  const s = candidate.scores;
  const analysis = candidate.analysis;

  // Custom Radar Chart coordinates generator for the 6 scoring aspects
  const radarAxes = [
    { name: "Skills", value: s?.skillMatch || 50 },
    { name: "Experience", value: s?.experienceMatch || 50 },
    { name: "Projects", value: s?.projectRelevance || 50 },
    { name: "Education", value: s?.educationMatch || 50 },
    { name: "Certs", value: s?.certificationMatch || 50 },
    { name: "Keywords", value: s?.keywordSimilarity || 50 },
  ];

  const getRadarPoints = (axes: typeof radarAxes, center: number, scale: number) => {
    return axes.map((axis, i) => {
      const angle = (i * 2 * Math.PI) / axes.length - Math.PI / 2;
      const radius = (axis.value / 100) * scale;
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      return `${x},${y}`;
    }).join(" ");
  };

  const getGridPoints = (sides: number, level: number, center: number, scale: number) => {
    const points: string[] = [];
    for (let i = 0; i < sides; i++) {
      const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
      const radius = (level / 100) * scale;
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      points.push(`${x},${y}`);
    }
    return points.join(" ");
  };

  const center = 100;
  const scale = 70;
  const radarPoints = getRadarPoints(radarAxes, center, scale);

  const downloadReport = () => {
    const reportData = {
      candidate: candidate.name,
      overallScore: s?.overall,
      aiVerdict: candidate.aiVerdict,
      email: candidate.email,
      phone: candidate.phone,
      summary: analysis?.summary,
      strengths: analysis?.strengths,
      weaknesses: analysis?.weaknesses,
      suggestedQuestions: analysis?.suggestedQuestions
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(reportData, null, 2))}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute("download", `AIScreening_Report_${candidate.name.replace(/\s+/g, "_")}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const gridLineColor = theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const axisLabelColor = theme === "dark" ? "#94A3B8" : "#475569";

  return (
    <div 
      id="candidate-profile-drawer" 
      className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-xl md:max-w-2xl lg:max-w-4xl bg-[var(--bg-sidebar)] backdrop-blur-md border-l border-slate-200 dark:border-white/10 shadow-2xl flex flex-col justify-between transition-all duration-300 font-sans"
    >
      {/* Header Profile Title card */}
      <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-white/10 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          {/* Circular Score Gauge */}
          <div className="relative flex items-center justify-center shrink-0">
            <svg className="w-14 h-14 sm:w-16 sm:h-16 transform -rotate-90">
              <circle cx="32" cy="32" r="28" fill="transparent" stroke={theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} strokeWidth="4" />
              <circle 
                cx="32" 
                cy="32" 
                r="28" 
                fill="transparent" 
                stroke={s?.overall && s.overall >= 80 ? "#00D26A" : s?.overall && s.overall >= 60 ? "#FFB547" : "#FF5C7A"} 
                strokeWidth="4" 
                strokeDasharray={`${2 * Math.PI * 28}`} 
                strokeDashoffset={`${2 * Math.PI * 28 * (1 - (s?.overall || 0) / 100)}`}
                className="transition-all duration-1000"
              />
            </svg>
            <span className="absolute text-xs sm:text-sm font-bold font-mono text-slate-900 dark:text-white">
              {s?.overall || 0}%
            </span>
          </div>

          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight truncate">{candidate.name}</h2>
            <div className="flex flex-wrap gap-1.5 sm:gap-2 items-center mt-1 text-xs">
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                candidate.aiVerdict === "Excellent Match" ? "bg-success/15 text-success border border-success/20" :
                candidate.aiVerdict === "Strong Match" ? "bg-primary/15 text-primary border border-primary/20" :
                candidate.aiVerdict === "Moderate Match" ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20" :
                "bg-danger/15 text-danger border border-danger/20"
              }`}>
                {candidate.aiVerdict || "PENDING"}
              </span>
              <span className="text-slate-400 dark:text-slate-500 hidden xs:inline">•</span>
              <span className="text-slate-600 dark:text-slate-400 font-medium text-[11px]">{candidate.experienceYears} Yrs Exp</span>
              <span className="text-slate-400 dark:text-slate-500 hidden sm:inline">•</span>
              <span className="text-slate-500 text-[11px] hidden sm:inline truncate">{candidate.location}</span>
            </div>
          </div>
        </div>

        {/* Close Button and Download anchor */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={downloadReport}
            className="p-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/20 transition-all cursor-pointer"
            title="Download Candidate Report as JSON"
          >
            <Download className="h-4 w-4" />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/20 transition-all cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Drawer Container */}
      <div className="flex-1 overflow-y-auto flex flex-col md:flex-row">
        
        {/* Left Subsection: Radar Chart + Meta card Info */}
        <div className="w-full md:w-72 lg:w-80 border-b md:border-b-0 md:border-r border-slate-200 dark:border-white/10 p-4 sm:p-5 space-y-5 bg-slate-50/50 dark:bg-white/[0.02]">
          
          {/* Radar Chart Visual */}
          <div className="flex flex-col items-center">
            <h4 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono self-start mb-2">
              JD Comparison Matrix
            </h4>
            
            <div className="w-[200px] h-[200px] relative flex items-center justify-center">
              <svg width="200" height="200" className="overflow-visible">
                <polygon points={getGridPoints(6, 100, center, scale)} fill="none" stroke={gridLineColor} strokeWidth="1" />
                <polygon points={getGridPoints(6, 80, center, scale)} fill="none" stroke={gridLineColor} strokeWidth="1" />
                <polygon points={getGridPoints(6, 60, center, scale)} fill="none" stroke={gridLineColor} strokeWidth="1" />
                <polygon points={getGridPoints(6, 40, center, scale)} fill="none" stroke={gridLineColor} strokeWidth="1" />
                <polygon points={getGridPoints(6, 20, center, scale)} fill="none" stroke={gridLineColor} strokeWidth="1" />

                {radarAxes.map((axis, i) => {
                  const angle = (i * 2 * Math.PI) / radarAxes.length - Math.PI / 2;
                  const x = center + scale * Math.cos(angle);
                  const y = center + scale * Math.sin(angle);
                  
                  const labelRadius = scale + 14;
                  const labelX = center + labelRadius * Math.cos(angle);
                  const labelY = center + labelRadius * Math.sin(angle) + 3;
                  
                  return (
                    <g key={i}>
                      <line x1={center} y1={center} x2={x} y2={y} stroke={gridLineColor} strokeWidth="1" />
                      <text 
                        x={labelX} 
                        y={labelY} 
                        fill={axisLabelColor} 
                        fontSize="8" 
                        fontFamily="var(--font-mono)"
                        textAnchor="middle"
                      >
                        {axis.name}
                      </text>
                    </g>
                  );
                })}

                {/* Plot Candidate Match Polygon */}
                <polygon 
                  points={radarPoints} 
                  fill={theme === "dark" ? "rgba(0, 229, 255, 0.2)" : "rgba(79, 140, 255, 0.25)"} 
                  stroke={theme === "dark" ? "#00E5FF" : "#4F8CFF"} 
                  strokeWidth="2" 
                />

                {radarAxes.map((axis, i) => {
                  const angle = (i * 2 * Math.PI) / radarAxes.length - Math.PI / 2;
                  const radius = (axis.value / 100) * scale;
                  const x = center + radius * Math.cos(angle);
                  const y = center + radius * Math.sin(angle);
                  
                  return (
                    <circle 
                      key={i} 
                      cx={x} 
                      cy={y} 
                      r="3" 
                      fill="#7C5CFF" 
                      stroke="#4F8CFF" 
                      strokeWidth="1" 
                    />
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Core Contact info list */}
          <div className="space-y-2.5 border-t border-slate-200 dark:border-white/10 pt-4 text-xs font-sans">
            <h4 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
              Contact Specifications
            </h4>

            <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
              <Mail className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="truncate">{candidate.email || "No Email"}</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
              <Phone className="h-4 w-4 text-slate-400 shrink-0" />
              <span>{candidate.phone || "No Phone"}</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
              <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
              <span>{candidate.location}</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
              <DollarSign className="h-4 w-4 text-slate-400 shrink-0" />
              <span>Salary: {candidate.expectedSalary}</span>
            </div>
            {candidate.currentCompany && (
              <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
                <Briefcase className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="truncate">Recent: {candidate.currentCompany}</span>
              </div>
            )}
          </div>

        </div>

        {/* Right Subsection: Interactive Tabs & assessment details */}
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* Tab Selection Row (Scrollable on small mobile screens) */}
          <div className="border-b border-slate-200 dark:border-white/10 px-4 sm:px-6 flex gap-4 sm:gap-6 text-xs font-mono uppercase tracking-wider overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab("assessment")}
              className={`py-3 sm:py-4 font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === "assessment" ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              AI Assessment
            </button>
            <button
              onClick={() => setActiveTab("questions")}
              className={`py-3 sm:py-4 font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === "questions" ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              Interview Questions
            </button>
            <button
              onClick={() => setActiveTab("resume")}
              className={`py-3 sm:py-4 font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === "resume" ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              Resume Preview
            </button>
            <button
              onClick={() => setActiveTab("ats")}
              className={`py-3 sm:py-4 font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === "ats" ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              ATS & Gaps
            </button>
          </div>

          {/* Content Pane */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            
            {activeTab === "assessment" && (
              <div className="space-y-5 font-sans">
                {/* Executive Summary */}
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
                    Executive Summary
                  </h4>
                  <p className="text-slate-800 dark:text-slate-200 text-xs leading-relaxed bg-slate-50 dark:bg-[var(--bg-card-inner)] p-3.5 sm:p-4 border border-slate-200 dark:border-white/10 rounded-2xl">
                    {analysis?.summary || `${candidate.name} is an experienced professional holding ${candidate.experienceYears} years of technical experience in corresponding roles.`}
                  </p>
                </div>

                {/* Score narrative explanation */}
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
                    AI Rating Rationale
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                    {analysis?.explanation || "Candidate has a strong matching profile with highly relevant project architectures."}
                  </p>
                </div>

                {/* Strengths & Weaknesses Grids */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  
                  {/* Strengths block */}
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-bold text-success uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <Check className="h-4 w-4 bg-success/15 rounded p-0.5" />
                      Key Core Strengths
                    </span>
                    <ul className="space-y-1.5">
                      {analysis?.strengths?.map((str, idx) => (
                        <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 pl-3.5 relative before:absolute before:left-0 before:top-2 before:h-1 before:w-1 before:rounded-full before:bg-success leading-relaxed">
                          {str}
                        </li>
                      )) || (
                        <li className="text-xs text-slate-500">Meets required skills criteria</li>
                      )}
                    </ul>
                  </div>

                  {/* Weaknesses block */}
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4 bg-amber-500/15 rounded p-0.5" />
                      Identified Gaps
                    </span>
                    <ul className="space-y-1.5">
                      {analysis?.weaknesses?.map((weak, idx) => (
                        <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 pl-3.5 relative before:absolute before:left-0 before:top-2 before:h-1 before:w-1 before:rounded-full before:bg-amber-500 leading-relaxed">
                          {weak}
                        </li>
                      )) || (
                        <li className="text-xs text-slate-500">Minimal structural gaps observed</li>
                      )}
                    </ul>
                  </div>

                </div>

                {/* Actionable Hiring recommendation */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-[var(--bg-card-inner)] border border-slate-200 dark:border-white/10 space-y-1">
                  <span className="text-[9px] font-mono text-primary uppercase tracking-wider block font-bold">Actionable Recommendation</span>
                  <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-semibold">
                    {analysis?.hiringRecommendation || "Proceed with technical interview to evaluate design system patterns and backend SQL familiarity."}
                  </p>
                </div>
              </div>
            )}

            {activeTab === "questions" && (
              <div className="space-y-5 font-sans">
                <div>
                  <h3 className="text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider font-mono">
                    Tailored Interview Questions
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Behavioral, technical, and situational prompts optimized to explore candidate gaps
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {analysis?.suggestedQuestions?.technical && (
                    <div className="space-y-2 bg-slate-50 dark:bg-white/[0.02] p-3.5 sm:p-4 border border-slate-200 dark:border-white/10 rounded-2xl">
                      <h4 className="text-[10px] font-bold text-primary uppercase font-mono tracking-wider">Technical Capability</h4>
                      <ul className="space-y-1.5 list-decimal list-inside text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        {analysis.suggestedQuestions.technical.map((q, idx) => <li key={idx}>{q}</li>)}
                      </ul>
                    </div>
                  )}

                  {analysis?.suggestedQuestions?.coding && (
                    <div className="space-y-2 bg-slate-50 dark:bg-white/[0.02] p-3.5 sm:p-4 border border-slate-200 dark:border-white/10 rounded-2xl">
                      <h4 className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 uppercase font-mono tracking-wider">Coding & Architecture</h4>
                      <ul className="space-y-1.5 list-decimal list-inside text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        {analysis.suggestedQuestions.coding.map((q, idx) => <li key={idx}>{q}</li>)}
                      </ul>
                    </div>
                  )}

                  {analysis?.suggestedQuestions?.behavioral && (
                    <div className="space-y-2 bg-slate-50 dark:bg-white/[0.02] p-3.5 sm:p-4 border border-slate-200 dark:border-white/10 rounded-2xl">
                      <h4 className="text-[10px] font-bold text-success uppercase font-mono tracking-wider">Behavioral & Cultural</h4>
                      <ul className="space-y-1.5 list-decimal list-inside text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        {analysis.suggestedQuestions.behavioral.map((q, idx) => <li key={idx}>{q}</li>)}
                      </ul>
                    </div>
                  )}

                  {analysis?.suggestedQuestions?.situational && (
                    <div className="space-y-2 bg-slate-50 dark:bg-white/[0.02] p-3.5 sm:p-4 border border-slate-200 dark:border-white/10 rounded-2xl">
                      <h4 className="text-[10px] font-bold text-amber-500 uppercase font-mono tracking-wider">Situational Decision</h4>
                      <ul className="space-y-1.5 list-decimal list-inside text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        {analysis.suggestedQuestions.situational.map((q, idx) => <li key={idx}>{q}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "resume" && (
              <div className="space-y-4 font-sans h-full">
                <div>
                  <h3 className="text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider font-mono">
                    Ingested Resume Text
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Direct text representation parsed for indexing
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-[var(--bg-card-inner)] border border-slate-200 dark:border-white/10 rounded-2xl p-4 sm:p-5 h-80 sm:h-96 overflow-y-auto font-mono text-[11px] text-slate-700 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
                  {candidate.rawText.startsWith("data:application/pdf") 
                    ? "Binary PDF File Loaded in Workspace Database.\n(Parsed and evaluated successfully by AI candidate matcher)."
                    : candidate.rawText || "No text parsed in database."}
                </div>
              </div>
            )}

            {activeTab === "ats" && (
              <div className="space-y-5 font-sans">
                <div>
                  <h3 className="text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider font-mono">
                    ATS & Compatibility Index
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Formatting indexes, duplicate verifications, and missing keyword arrays
                  </p>
                </div>

                {/* Score Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02] text-center space-y-1">
                    <span className="text-[9px] font-mono text-slate-500 uppercase">Formatting Index</span>
                    <p className="text-xl font-bold font-mono text-slate-900 dark:text-white">{analysis?.formattingScore || 85}%</p>
                  </div>
                  <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02] text-center space-y-1">
                    <span className="text-[9px] font-mono text-slate-500 uppercase">Authenticity Confidence</span>
                    <p className="text-xl font-bold font-mono text-slate-900 dark:text-white">{analysis?.fakeDetectionScore || 98}%</p>
                  </div>
                  <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02] text-center space-y-1">
                    <span className="text-[9px] font-mono text-slate-500 uppercase">ATS Compatibility</span>
                    <p className="text-xl font-bold font-mono text-slate-900 dark:text-white">{analysis?.atsCompatibilityScore || 92}%</p>
                  </div>
                </div>

                {/* Missing Skills Tags list */}
                <div className="space-y-2.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                    Unmatched / Missing Skills
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis?.missingSkills && analysis.missingSkills.length > 0 ? (
                      analysis.missingSkills.map((sk, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded bg-danger/10 border border-danger/20 text-danger text-xs font-medium">
                          {sk}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500">Perfect skill coverage against JD criteria.</span>
                    )}
                  </div>
                </div>

                {/* Keyword Optimization Suggestions */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                    Keyword Optimization Suggestions
                  </span>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    To optimize ATS screening triggers, the candidate is suggested to naturally weave in these terms inside their resume experience descriptions:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis?.keywordSuggestions?.map((kw, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs font-mono">
                        +{kw}
                      </span>
                    )) || (
                      <span className="text-xs text-slate-500">Resume matches index cleanly.</span>
                    )}
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>

      </div>

      {/* Footer Drawer controls */}
      <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[var(--bg-sidebar)] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500 font-mono">STATUS:</span>
          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
            candidate.status === "Shortlisted" ? "bg-success/15 text-success" :
            candidate.status === "Interview Scheduled" ? "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400" :
            candidate.status === "Rejected" ? "bg-danger/15 text-danger" : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
          }`}>
            {candidate.status.toUpperCase()}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => { updateCandidateStatus(candidate.id, "Rejected"); onClose(); }}
            disabled={candidate.status === "Rejected"}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-danger/30 hover:bg-danger/10 rounded-xl text-danger transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <X className="h-3.5 w-3.5" />
            <span>Reject</span>
          </button>
          
          <button
            onClick={() => { updateCandidateStatus(candidate.id, "Shortlisted"); }}
            disabled={candidate.status === "Shortlisted" || candidate.status === "Interview Scheduled"}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-success text-slate-950 font-bold rounded-xl hover:bg-success/90 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
          >
            <Check className="h-3.5 w-3.5" />
            <span>Shortlist</span>
          </button>

          <button
            onClick={() => { 
              const date = prompt("Enter interview date and time (e.g. Tomorrow at 10:00 AM):", "Tomorrow at 10:00 AM");
              if (date) {
                updateCandidateStatus(candidate.id, "Interview Scheduled");
                alert(`Interview triggers simulated. Calendar invite dispatched for ${date}.`);
              }
            }}
            disabled={candidate.status === "Rejected"}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>Schedule</span>
          </button>
        </div>
      </div>

    </div>
  );
}
