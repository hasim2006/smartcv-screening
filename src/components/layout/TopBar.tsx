import React, { useState } from "react";
import { Search, Bell, User, Menu, Sun, Moon } from "lucide-react";
import { AppNotification, JobDescription } from "../../types.js";
import { useTheme } from "../../context/ThemeContext.js";

interface TopBarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  onSearch: (searchResults: any[] | null, searchQuery: string) => void;
  activeJD: JobDescription | null;
  notifications: AppNotification[];
  refreshNotifications: () => void;
  onToggleMobileSidebar: () => void;
}

export default function TopBar({ 
  setActivePage, 
  onSearch, 
  activeJD, 
  notifications, 
  refreshNotifications,
  onToggleMobileSidebar
}: TopBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      onSearch(null, "");
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery })
      });
      if (res.ok) {
        const data = await res.json();
        onSearch(data, searchQuery);
        setActivePage("candidates");
      }
    } catch (e) {
      console.error("Search network error", e);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    onSearch(null, "");
  };

  const markAllRead = async () => {
    try {
      const res = await fetch("/api/notifications/read", { method: "POST" });
      if (res.ok) {
        refreshNotifications();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const clearAllNotifications = async () => {
    try {
      const res = await fetch("/api/notifications", { method: "DELETE" });
      if (res.ok) {
        refreshNotifications();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header 
      id="app-topbar" 
      className="fixed top-0 right-0 left-0 lg:left-64 z-30 h-16 bg-[var(--bg-header)] backdrop-blur-md border-b border-[var(--border-main)] flex items-center justify-between px-3 sm:px-6 lg:px-8 transition-colors duration-200"
    >
      {/* Left Area: Mobile Menu Toggle + Search */}
      <div className="flex items-center gap-2 sm:gap-4 flex-1 max-w-lg">
        {/* Mobile Hamburger Button */}
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 transition-colors cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Semantic Search Bar */}
        <form onSubmit={handleSearchSubmit} className="w-full relative flex items-center">
          <Search className="absolute left-3.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            id="topbar-search-input"
            placeholder="Search candidates, skills, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full py-1.5 pl-9 pr-12 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-sans"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3.5 text-slate-400 hover:text-slate-700 dark:hover:text-white text-[11px] font-mono cursor-pointer"
            >
              ✕
            </button>
          )}
          {isSearching && (
            <span className="absolute right-3.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
          )}
        </form>
      </div>

      {/* Right Side Controls */}
      <div className="flex items-center gap-2 sm:gap-4 ml-2">
        {/* Active JD Role Badge (Visible on medium+ screens) */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
          <span className="text-slate-500 dark:text-slate-400 text-xs">Role:</span>
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[130px] truncate">
            {activeJD ? activeJD.title : "No Role Set"}
          </span>
          <span className="px-1.5 py-0.5 rounded-full bg-success/15 text-success text-[9px] font-bold uppercase tracking-wider">Active</span>
        </div>

        {/* Light / Dark Mode Toggle Button */}
        <button
          id="theme-toggle-btn"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-all cursor-pointer relative"
          aria-label="Toggle color theme"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4 text-amber-400 hover:rotate-45 transition-transform" />
          ) : (
            <Moon className="h-4 w-4 text-cyan-600 hover:-rotate-12 transition-transform" />
          )}
        </button>

        {/* Notifications Icon with Badge */}
        <div className="relative">
          <button
            id="notification-bell-btn"
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all relative cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-danger"></span>
              </span>
            )}
          </button>

          {/* Notifications Dropdown Drawer */}
          {showNotifMenu && (
            <div 
              id="notifications-dropdown-menu" 
              className="absolute right-0 mt-3 w-72 sm:w-80 bg-[var(--bg-sidebar)] rounded-2xl shadow-2xl border border-[var(--border-main)] p-4 z-50 text-slate-800 dark:text-slate-200 animate-in fade-in duration-150"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-main)]">
                <h3 className="text-xs font-bold uppercase tracking-wider font-sans">
                  Alert Center ({unreadCount})
                </h3>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={markAllRead} 
                    className="text-[10px] text-primary hover:underline font-mono cursor-pointer"
                  >
                    Read All
                  </button>
                  <span className="text-slate-300 dark:text-slate-600">|</span>
                  <button 
                    onClick={clearAllNotifications} 
                    className="text-[10px] text-danger hover:underline font-mono cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <div className="max-h-64 overflow-y-auto mt-2 space-y-2">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-xs text-slate-400 font-sans">No notifications</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className={`p-3 rounded-xl border transition-all text-xs ${
                        notif.read 
                          ? "bg-slate-50 dark:bg-white/[0.01] border-slate-100 dark:border-white/5 text-slate-500 dark:text-slate-400" 
                          : "bg-primary/5 dark:bg-white/[0.03] border-primary/20 dark:border-white/10 text-slate-800 dark:text-slate-200 font-medium"
                      }`}
                    >
                      <div className="flex items-start gap-2 justify-between">
                        <span className={`font-semibold ${
                          notif.type === 'success' ? 'text-success' :
                          notif.type === 'warning' ? 'text-warning' :
                          notif.type === 'error' ? 'text-danger' : 'text-primary'
                        }`}>
                          {notif.title}
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono">
                          {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="mt-1 text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                        {notif.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar Card */}
        <div className="relative">
          <button
            id="hr-profile-dropdown-btn"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer text-left focus:outline-none"
            aria-label="User profile menu"
          >
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">Chief HR Officer</p>
              <p className="text-[10px] text-slate-500">Talent Lead</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary text-white flex items-center justify-center shadow-xs">
              <User className="h-4 w-4" />
            </div>
          </button>

          {/* Profile Menu Dropdown */}
          {showProfileMenu && (
            <div 
              id="profile-dropdown-menu" 
              className="absolute right-0 mt-3 w-48 bg-[var(--bg-sidebar)] rounded-xl shadow-2xl border border-[var(--border-main)] p-2 text-xs z-50 text-slate-800 dark:text-slate-200"
            >
              <div className="px-3 py-2 text-slate-500 font-mono border-b border-[var(--border-main)] pb-2 mb-1">
                Admin Console
              </div>
              <button 
                onClick={() => {
                  setActivePage("settings");
                  setShowProfileMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all cursor-pointer"
              >
                Workspace Settings
              </button>
              <button 
                onClick={() => {
                  toggleTheme();
                  setShowProfileMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all cursor-pointer"
              >
                Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
