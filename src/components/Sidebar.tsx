import { LayoutDashboard, FileUp, ScanLine, Users, BarChart3, CalendarCheck, FileText, Settings, X, Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext.js";

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  openCandidateProfile?: (candidateId: string) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export default function Sidebar({ 
  activePage, 
  setActivePage, 
  isMobileOpen,
  onCloseMobile
}: SidebarProps) {
  const { theme, toggleTheme } = useTheme();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "upload-jd", label: "Upload JD", icon: FileUp },
    { id: "resume-screening", label: "Resume Screening", icon: ScanLine },
    { id: "candidates", label: "Candidates", icon: Users },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "shortlist", label: "Interview Shortlist", icon: CalendarCheck },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleNavClick = (id: string) => {
    setActivePage(id);
    onCloseMobile();
  };

  return (
    <aside 
      id="app-sidebar" 
      className={`fixed left-0 top-0 z-50 h-screen w-64 bg-[var(--bg-sidebar)] flex flex-col justify-between border-r border-[var(--border-main)] transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isMobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
      }`}
    >
      {/* Top Header Logo */}
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[#4F8CFF] to-[#7C5CFF] shadow-md shadow-primary/25">
              <div className="w-3.5 h-3.5 bg-white/20 blur-xs absolute"></div>
              <div className="w-2 h-2 bg-white rounded-full relative z-10"></div>
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white uppercase leading-none">
                ResuMatch
              </h1>
              <span className="text-[10px] text-primary font-mono tracking-tight font-semibold uppercase">
                AI Screening Pro
              </span>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Decorative Divider */}
        <div className="mt-5 h-[1px] w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 sm:px-4 space-y-1 overflow-y-auto py-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              id={`sidebar-nav-${item.id}`}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative group cursor-pointer border ${
                isActive
                  ? "bg-primary/10 border-primary/25 text-primary shadow-xs font-semibold"
                  : "text-slate-600 dark:text-slate-400 border-transparent hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.03]"
              }`}
            >
              <Icon className={`h-4.5 w-4.5 transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-primary" : "text-slate-500 dark:text-slate-400 group-hover:text-primary"}`} />
              <span className="truncate">{item.label}</span>
              
              {/* Active Indicator */}
              {isActive && (
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_#4F8CFF]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Footer Controls & Theme Switcher */}
      <div className="p-4 sm:p-5 space-y-3">
        {/* Quick Theme Toggle Card */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-primary/40 transition-all text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            {theme === "dark" ? (
              <Moon className="h-4 w-4 text-cyan-400" />
            ) : (
              <Sun className="h-4 w-4 text-amber-500" />
            )}
            <span className="capitalize">{theme} Mode</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-primary/15 text-primary">
            Switch
          </span>
        </button>

        {/* Engine status indicator */}
        <div className="rounded-xl p-3 bg-gradient-to-br from-primary/5 to-secondary/5 border border-[var(--border-main)] text-center">
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono tracking-wider uppercase">Database Engine</p>
          <div className="mt-1 flex items-center justify-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-success shadow-[0_0_8px_#00D26A]" />
            <span className="font-mono text-[10px] font-semibold text-slate-700 dark:text-slate-300 tracking-wider">
              ONLINE DATASTORE
            </span>
          </div>
          <p className="mt-1.5 text-[9px] text-slate-400 dark:text-slate-500 font-mono">
            V1.4.0 • Enterprise
          </p>
        </div>
      </div>
    </aside>
  );
}
