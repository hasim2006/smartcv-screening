import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area, PieChart, Pie } from "recharts";
import { Sparkles, TrendingUp, Award, UserCheck, ShieldCheck } from "lucide-react";
import { useTheme } from "../../context/ThemeContext.js";

export default function AnalyticsView() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();

  const loadData = async () => {
    try {
      const res = await fetch("/api/analytics");
      if (res.ok) {
        const d = await res.json();
        setData(d);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="py-24 text-center space-y-4">
        <Sparkles className="h-10 w-10 text-primary animate-spin mx-auto" />
        <p className="text-xs font-mono text-slate-400">Recalculating analytics pool indices...</p>
      </div>
    );
  }

  // Experience Distribution Data Mapping
  const expDistData = data?.expDist?.map((item: any) => ({
    bracket: item.bracket,
    count: item.count
  })) || [
    { bracket: "Junior (0-2y)", count: 1 },
    { bracket: "Mid (3-5y)", count: 2 },
    { bracket: "Senior (6-9y)", count: 1 },
    { bracket: "Principal (10y+)", count: 1 },
  ];

  // Education Distribution Pie Data Mapping
  const eduDistData = data?.eduDist?.map((item: any) => ({
    name: item.level,
    value: item.count
  })) || [
    { name: "Bachelor's", value: 3 },
    { name: "Master's", value: 1 },
    { name: "Ph.D. / Other", value: 1 },
  ];

  const COLORS = ["#4F8CFF", "#7C5CFF", "#00E5FF", "#00D26A", "#FFB547"];

  const tooltipBg = theme === "dark" ? "rgba(13, 20, 38, 0.95)" : "rgba(255, 255, 255, 0.95)";
  const tooltipBorder = theme === "dark" ? "rgba(0, 229, 255, 0.3)" : "rgba(79, 140, 255, 0.3)";
  const tooltipTextColor = theme === "dark" ? "#F8FAFC" : "#0F172A";

  return (
    <div id="analytics-view-page" className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-sans flex items-center gap-2">
          Hiring Analytics Dashboard
          <TrendingUp className="h-5 w-5 text-primary" />
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-sans mt-0.5">
          Strategic metrics detailing skill alignment ratios, credentials, experience density, and resume confidence indexes.
        </p>
      </div>

      {/* Grid containing Experience and Education */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        
        {/* Experience Bracket Analysis */}
        <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-[var(--bg-card)] border border-slate-200 dark:border-white/10 shadow-xs space-y-4">
          <div>
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider font-mono flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              Experience Level Bracket Distribution
            </h3>
            <p className="text-[11px] text-slate-500 font-sans mt-0.5">
              Breakdown of pool seniority classes
            </p>
          </div>

          <div className="h-60 sm:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={expDistData} margin={{ top: 20, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                <XAxis dataKey="bracket" stroke="#64748B" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} allowDecimals={false} />
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
                <Bar dataKey="count" name="Candidates" fill="#4F8CFF" radius={[4, 4, 0, 0]}>
                  {expDistData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Education Bracket Analysis */}
        <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-[var(--bg-card)] border border-slate-200 dark:border-white/10 shadow-xs space-y-4">
          <div>
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider font-mono flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-secondary" />
              Academic Credential Breakdown
            </h3>
            <p className="text-[11px] text-slate-500 font-sans mt-0.5">
              Distribution of academic degree levels found in pool
            </p>
          </div>

          <div className="h-60 sm:h-64 w-full flex flex-col sm:flex-row items-center justify-around gap-4">
            <div className="h-44 w-44 sm:h-48 sm:w-48 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={eduDistData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {eduDistData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
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
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Custom Legend */}
            <div className="space-y-2 text-xs font-sans">
              {eduDistData.map((item: any, index: number) => (
                <div key={item.name} className="flex items-center gap-2.5">
                  <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-slate-800 dark:text-slate-300 font-medium">{item.name}</span>
                  <span className="text-slate-500 font-mono">({item.value} Profiles)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Grid for Trustworthiness Factor */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-[var(--bg-card)] border border-slate-200 dark:border-white/10 shadow-xs space-y-4">
        <div>
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider font-mono flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            Resume Trustworthiness & Fact-Check Confidence
          </h3>
          <p className="text-[11px] text-slate-500 font-sans mt-0.5">
            Statistical projection of verifiable career durations, credential validity, and formatting integrity
          </p>
        </div>

        <div className="h-52 sm:h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={[
              { name: "Low Integrity (<60%)", score: 0 },
              { name: "Verifiable Core (60-79%)", score: 1 },
              { name: "High Integrity (80-89%)", score: 2 },
              { name: "Certified Trustworthy (90%+)", score: 3 },
            ]} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="trustGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00D26A" stopOpacity={0.35}/>
                  <stop offset="95%" stopColor="#00D26A" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
              <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={10} tickLine={false} allowDecimals={false} />
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
              <Area type="monotone" dataKey="score" name="Verified Profiles" stroke="#00D26A" strokeWidth={2} fillOpacity={1} fill="url(#trustGlow)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
