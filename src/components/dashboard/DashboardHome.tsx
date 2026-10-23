import { useEffect, useState } from "react";
import { Users, CheckCircle2, XCircle, Award, Compass, RefreshCw, Sparkles, Flame } from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, Cell
} from "recharts";
import { DashboardStats } from "../../types.js";
import { useTheme } from "../../context/ThemeContext.js";

interface DashboardHomeProps {
  setActivePage: (page: string) => void;
  openCandidateProfileByTopScore: () => void;
  stats: DashboardStats | null;
  refreshStats: () => void;
}

export default function DashboardHome({ 
  setActivePage, 
  stats, 
  refreshStats 
}: DashboardHomeProps) {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();

  const fetchAnalytics = async () => {
    try {
      const res = await fetch("/api/analytics");
      if (res.ok) {
        const data = await res.json();
        setAnalyticsData(data);
      }
    } catch (e) {
      console.error("Failed to load analytics charts", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [stats]);

  const cards = [
    {
      id: "total_cand",
      title: "Total Candidates",
      value: stats?.totalCandidates ?? 0,
      icon: Users,
      color: "text-primary",
      bgLight: "bg-blue-500/10 border-blue-500/20",
      label: "Profiles in Datastore",
      action: "candidates"
    },
    {
      id: "short_cand",
      title: "Shortlisted",
      value: stats?.shortlisted ?? 0,
      icon: CheckCircle2,
      color: "text-success",
      bgLight: "bg-emerald-500/10 border-emerald-500/20",
      label: "Above 75% Threshold",
      action: "shortlist"
    },
    {
      id: "rej_cand",
      title: "Rejected",
      value: stats?.rejected ?? 0,
      icon: XCircle,
      color: "text-danger",
      bgLight: "bg-rose-500/10 border-rose-500/20",
      label: "Screened Out",
      action: "candidates"
    },
    {
      id: "avg_match",
      title: "Avg Match Score",
      value: `${stats?.averageMatchScore ?? 0}%`,
      icon: Award,
      color: "text-cyan-500",
      bgLight: "bg-cyan-500/10 border-cyan-500/20",
      label: "Overall Health",
      action: "analytics"
    },
    {
      id: "top_match",
      title: "Top Candidate",
      value: stats?.topCandidate || "None Loaded",
      icon: Flame,
      color: "text-secondary",
      bgLight: "bg-purple-500/10 border-purple-500/20",
      label: "Highest AI Fit Rating",
      action: "candidates",
      isTruncated: true
    },
    {
      id: "engine_status",
      title: "Screening Engine",
      value: stats?.processingStatus || "Idle",
      icon: Compass,
      color: "text-amber-500",
      bgLight: "bg-amber-500/10 border-amber-500/20",
      label: "Background State",
      action: "resume-screening"
    }
  ];

  // Map analytics values for charts
  const scoreDistData = analyticsData?.scoreDist?.map((item: any) => ({
    name: item.range.split(" ")[0],
    count: item.count
  })) || [
    { name: "90-100", count: 1 },
    { name: "80-89", count: 1 },
    { name: "60-79", count: 1 },
    { name: "45-59", count: 1 },
    { name: "0-44", count: 1 }
  ];

  const skillCoverageData = analyticsData?.topSkills || [
    { name: "React", value: 3 },
    { name: "TypeScript", value: 3 },
    { name: "Tailwind CSS", value: 3 },
    { name: "Node.js", value: 2 },
    { name: "PostgreSQL", value: 2 }
  ];

  const funnelData = analyticsData?.funnel || [
    { stage: "Applied", count: 5 },
    { stage: "Screened", count: 5 },
    { stage: "Shortlisted", count: 2 },
    { stage: "Interviews", count: 0 },
    { stage: "Rejected", count: 1 }
  ];

  const tooltipBg = theme === "dark" ? "rgba(13, 20, 38, 0.95)" : "rgba(255, 255, 255, 0.95)";
  const tooltipBorder = theme === "dark" ? "rgba(0, 229, 255, 0.3)" : "rgba(79, 140, 255, 0.3)";
  const tooltipTextColor = theme === "dark" ? "#F8FAFC" : "#0F172A";

  return (
    <div id="dashboard-home" className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Welcome Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-sans flex items-center gap-2">
            AI Screening Workspace
            <Sparkles className="h-5 w-5 text-accent animate-pulse" />
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-sans mt-0.5">
            Review automated resume indexing, candidate scores, and strategic skill alignments in real-time.
          </p>
        </div>
        
        {/* Dynamic Re-sync Indicator */}
        <button
          onClick={() => { refreshStats(); fetchAnalytics(); }}
          className="self-start sm:self-auto flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-xs text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-white hover:border-primary/40 shadow-xs transition-all font-sans cursor-pointer active:scale-95"
        >
          <RefreshCw className="h-3.5 w-3.5 text-primary animate-spin" style={{ animationDuration: '4s' }} />
          <span>Sync Workspace</span>
        </button>
      </div>

      {/* Six Interactive Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              id={`stat-card-${card.id}`}
              onClick={() => setActivePage(card.action)}
              className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[var(--bg-card)] cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/40 flex flex-col justify-between min-h-[110px]"
            >
              <div>
                <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                  {card.title}
                </p>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight mt-1.5 leading-none truncate">
                  {card.value}
                </h3>
              </div>
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 dark:border-white/5">
                <span className="text-[9px] text-slate-400 dark:text-slate-500 font-sans truncate pr-1">
                  {card.label}
                </span>
                <div className={`p-1.5 rounded-lg ${card.bgLight}`}>
                  <Icon className={`h-3.5 w-3.5 ${card.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Bento Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        
        {/* Chart 1: Candidate Distribution & Funnel */}
        <div className="lg:col-span-1 p-5 sm:p-6 rounded-3xl bg-white dark:bg-[var(--bg-card)] border border-slate-200 dark:border-white/10 shadow-xs relative">
          <div className="mb-4">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider font-mono">
              Talent Acquisition Funnel
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-500 font-sans mt-0.5">
              Candidate volume throughput by screening stage
            </p>
          </div>

          {isLoading ? (
            <div className="h-60 sm:h-64 flex items-center justify-center">
              <span className="text-xs font-mono text-slate-400">Recalculating pipeline...</span>
            </div>
          ) : (
            <div className="space-y-3.5">
              {funnelData.map((f: any, idx: number) => {
                const maxVal = Math.max(...funnelData.map((d: any) => d.count), 1);
                const percent = (f.count / maxVal) * 100;
                return (
                  <div key={f.stage} className="space-y-1">
                    <div className="flex justify-between text-xs font-sans">
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{f.stage}</span>
                      <span className="text-slate-500 dark:text-slate-400 font-mono font-semibold">{f.count} Profiles</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800/60 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${
                          idx === 0 ? "bg-primary" :
                          idx === 1 ? "bg-accent" :
                          idx === 2 ? "bg-success" :
                          idx === 3 ? "bg-secondary" : "bg-danger"
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Chart 2: Match Score Area Chart */}
        <div className="lg:col-span-1 p-5 sm:p-6 rounded-3xl bg-white dark:bg-[var(--bg-card)] border border-slate-200 dark:border-white/10 shadow-xs relative">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider font-mono">
                Match Score Distribution
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-500 font-sans mt-0.5">
                AI evaluation brackets index density
              </p>
            </div>
            <span className="text-[10px] font-mono text-accent bg-accent/10 px-2 py-0.5 rounded font-bold">
              0-100 INDEX
            </span>
          </div>

          {isLoading ? (
            <div className="h-60 sm:h-64 flex items-center justify-center">
              <span className="text-xs font-mono text-slate-400">Loading distribution...</span>
            </div>
          ) : (
            <div className="h-60 sm:h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={scoreDistData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="scoreGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#00E5FF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: tooltipBg, 
                      borderColor: tooltipBorder,
                      borderRadius: "12px",
                      color: tooltipTextColor,
                      fontSize: "11px",
                      boxShadow: "0 10px 25px -5px rgba(0,0,0,0.2)"
                    }} 
                  />
                  <Area type="monotone" dataKey="count" name="Candidates" stroke="#00E5FF" strokeWidth={2} fillOpacity={1} fill="url(#scoreGlow)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Chart 3: Tech Skill Coverage */}
        <div className="lg:col-span-1 p-5 sm:p-6 rounded-3xl bg-white dark:bg-[var(--bg-card)] border border-slate-200 dark:border-white/10 shadow-xs relative">
          <div className="mb-4">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider font-mono">
              Top Technical Skill Coverage
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-500 font-sans mt-0.5">
              Occurrence frequency of core technologies
            </p>
          </div>

          {isLoading ? (
            <div className="h-60 sm:h-64 flex items-center justify-center">
              <span className="text-xs font-mono text-slate-400">Analyzing coverage...</span>
            </div>
          ) : (
            <div className="h-60 sm:h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillCoverageData} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                  <XAxis type="number" stroke="#64748B" fontSize={10} tickLine={false} />
                  <YAxis dataKey="name" type="category" stroke="#64748B" fontSize={10} width={75} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: tooltipBg, 
                      borderColor: tooltipBorder,
                      borderRadius: "12px",
                      color: tooltipTextColor,
                      fontSize: "11px",
                      boxShadow: "0 10px 25px -5px rgba(0,0,0,0.2)"
                    }} 
                  />
                  <Bar dataKey="value" name="Candidates" fill="#7C5CFF" radius={[0, 4, 4, 0]}>
                    {skillCoverageData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#7C5CFF" : "#4F8CFF"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

      </div>

      {/* Extra Feature: Quick Actions & Instructions Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border border-slate-200 dark:border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-start sm:items-center gap-4 text-left">
          <div className="h-11 w-11 sm:h-12 sm:w-12 shrink-0 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shadow-xs">
            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white tracking-wider uppercase font-sans">
              Screening Workflow Guide
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-xl font-sans leading-relaxed">
              Navigate to <strong>Upload JD</strong> to configure role criteria, then drag-and-drop resume PDFs/TXTs in <strong>Resume Screening</strong>. Run the matcher to categorize profiles instantly!
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => setActivePage("upload-jd")}
            className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold rounded-xl bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/25 transition-all cursor-pointer active:scale-95 text-center"
          >
            Configure JD
          </button>
          <button
            onClick={() => setActivePage("resume-screening")}
            className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold rounded-xl bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-white/15 transition-all cursor-pointer active:scale-95 text-center"
          >
            Upload Resumes
          </button>
        </div>
      </div>
    </div>
  );
}
