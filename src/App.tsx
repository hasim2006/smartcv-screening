import { useState, useEffect } from "react";
import { Sidebar, TopBar } from "./components/layout/index.js";
import { DashboardHome } from "./components/dashboard/index.js";
import { UploadJD, ResumeScreening } from "./components/screening/index.js";
import { Candidates, CandidateProfile, ShortlistView } from "./components/candidates/index.js";
import { AnalyticsView, ReportsView } from "./components/analytics/index.js";
import { SettingsView } from "./components/settings/index.js";

import { Candidate, JobDescription, DashboardStats, AppSettings, AppNotification, CandidateStatus } from "./types.js";

export default function App() {
  const [activePage, setActivePage] = useState<string>("dashboard");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [activeJD, setActiveJD] = useState<JobDescription | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  
  // Mobile responsive sidebar drawer state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Search state passed from TopBar search bar
  const [searchQueryResult, setSearchQueryResult] = useState<Candidate[] | null>(null);
  const [searchQueryString, setSearchQueryString] = useState<string>("");

  // Candidate Profile Drawer state
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);

  // Fetch functions with fallback resilience
  const fetchCandidates = async () => {
    try {
      const res = await fetch("/api/candidates");
      if (res.ok) {
        const data = await res.json();
        setCandidates(data);
      }
    } catch (e) {
      console.error("Error loading candidates database:", e);
    }
  };

  const fetchActiveJD = async () => {
    try {
      const res = await fetch("/api/active-jd");
      if (res.ok) {
        const data = await res.json();
        setActiveJD(data);
      }
    } catch (e) {
      console.error("Error loading active job specifications:", e);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error("Error loading campaign metrics:", e);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (e) {
      console.error("Error loading workspace configurations:", e);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (e) {
      console.error("Error loading notifications:", e);
    }
  };

  // Perform full refresh
  const triggerGlobalSync = () => {
    fetchCandidates();
    fetchActiveJD();
    fetchStats();
    fetchSettings();
    fetchNotifications();
  };

  useEffect(() => {
    triggerGlobalSync();
  }, []);

  // Update a candidate's screening/hiring pipeline status
  const updateCandidateStatus = async (id: string, status: CandidateStatus) => {
    try {
      const res = await fetch(`/api/candidates/${id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchCandidates();
        fetchStats();
        fetchNotifications();
      }
    } catch (e) {
      console.error("Failed to update candidate status:", e);
    }
  };

  // Search results handler
  const handleSearchResults = (results: Candidate[] | null, query: string) => {
    setSearchQueryResult(results);
    setSearchQueryString(query);
  };

  // Profile selection
  const handleSelectCandidate = (id: string) => {
    setSelectedCandidateId(id);
  };

  // Quick select profile of highest scoring candidate
  const handleSelectTopCandidate = () => {
    if (candidates.length === 0) return;
    const sorted = [...candidates]
      .filter(c => c.screeningStatus === 'completed')
      .sort((a, b) => (b.scores?.overall || 0) - (a.scores?.overall || 0));
    if (sorted.length > 0) {
      setSelectedCandidateId(sorted[0].id);
    }
  };

  // Get active selected candidate object
  const activeCandidate = candidates.find(c => c.id === selectedCandidateId);

  return (
    <div id="app-root-layout" className="min-h-screen bg-[var(--bg-app)] text-slate-800 dark:text-slate-200 transition-colors duration-200">
      
      {/* Mobile Drawer Overlay Backdrop */}
      {isMobileSidebarOpen && (
        <div 
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar - Responsive Drawer on Mobile, Fixed on Desktop */}
      <Sidebar 
        activePage={activePage} 
        setActivePage={(page) => {
          setActivePage(page);
          setSearchQueryResult(null);
          setSearchQueryString("");
        }}
        openCandidateProfile={handleSelectCandidate}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Panel Content Box */}
      <div className="lg:pl-64 min-h-screen flex flex-col transition-all duration-300">
        
        {/* Top Header Controls bar */}
        <TopBar 
          activePage={activePage}
          setActivePage={setActivePage}
          onSearch={handleSearchResults}
          activeJD={activeJD}
          notifications={notifications}
          refreshNotifications={fetchNotifications}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
        />

        {/* Content body with responsive padding and max width */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 mt-16 max-w-7xl w-full mx-auto">
          
          {activePage === "dashboard" && (
            <DashboardHome 
              setActivePage={setActivePage}
              openCandidateProfileByTopScore={handleSelectTopCandidate}
              stats={stats}
              refreshStats={triggerGlobalSync}
            />
          )}

          {activePage === "upload-jd" && (
            <UploadJD 
              activeJD={activeJD}
              setActiveJD={setActiveJD}
              refreshStats={fetchStats}
            />
          )}

          {activePage === "resume-screening" && (
            <ResumeScreening 
              candidates={candidates}
              activeJD={activeJD}
              refreshCandidates={fetchCandidates}
              refreshStats={fetchStats}
              setActivePage={setActivePage}
            />
          )}

          {activePage === "candidates" && (
            <Candidates 
              candidates={searchQueryResult !== null ? searchQueryResult : candidates}
              onSelectCandidate={handleSelectCandidate}
              updateCandidateStatus={updateCandidateStatus}
              searchQuery={searchQueryString}
            />
          )}

          {activePage === "analytics" && (
            <AnalyticsView />
          )}

          {activePage === "shortlist" && (
            <ShortlistView 
              candidates={candidates}
              onSelectCandidate={handleSelectCandidate}
              updateCandidateStatus={updateCandidateStatus}
            />
          )}

          {activePage === "reports" && (
            <ReportsView 
              candidates={candidates}
              activeJD={activeJD}
              stats={stats}
            />
          )}

          {activePage === "settings" && (
            <SettingsView 
              settings={settings}
              setSettings={setSettings}
              refreshCandidates={fetchCandidates}
              refreshStats={fetchStats}
            />
          )}

        </main>
      </div>

      {/* Slide-over Profile Drawer (Renders globally if active candidate exists) */}
      {activeCandidate && (
        <>
          {/* Overlay background dim backdrop */}
          <div 
            onClick={() => setSelectedCandidateId(null)}
            className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs transition-opacity" 
          />
          <CandidateProfile 
            candidate={activeCandidate}
            onClose={() => setSelectedCandidateId(null)}
            updateCandidateStatus={updateCandidateStatus}
          />
        </>
      )}

    </div>
  );
}
