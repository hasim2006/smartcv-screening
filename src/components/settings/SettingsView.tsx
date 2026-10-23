import React, { useState, useEffect } from "react";
import { Save, AlertTriangle, CheckCircle2, Sliders, RefreshCw, Sun, Moon } from "lucide-react";
import { AppSettings } from "../../types.js";
import { useTheme } from "../../context/ThemeContext.js";

interface SettingsViewProps {
  settings: AppSettings | null;
  setSettings: (settings: AppSettings) => void;
  refreshCandidates: () => void;
  refreshStats: () => void;
}

export default function SettingsView({
  settings,
  setSettings,
  refreshCandidates,
  refreshStats
}: SettingsViewProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const { theme, setTheme } = useTheme();

  // Form states
  const [skills, setSkills] = useState(35);
  const [experience, setExperience] = useState(20);
  const [projects, setProjects] = useState(15);
  const [education, setEducation] = useState(10);
  const [certifications, setCertifications] = useState(5);
  const [keywords, setKeywords] = useState(5);
  const [semantic, setSemantic] = useState(10);

  const [threshold, setThreshold] = useState(75);
  const [notifications, setNotifications] = useState(true);
  const [deepEvaluation, setDeepEvaluation] = useState(true);
  const [language, setLanguage] = useState("english");

  useEffect(() => {
    if (settings) {
      setSkills(settings.weights.skills);
      setExperience(settings.weights.experience);
      setProjects(settings.weights.projects);
      setEducation(settings.weights.education);
      setCertifications(settings.weights.certifications);
      setKeywords(settings.weights.keywords);
      setSemantic(settings.weights.semantic);
      
      setThreshold(settings.shortlistThreshold);
      setNotifications(settings.notificationsEnabled);
      setDeepEvaluation(settings.deepEvaluationEnabled ?? true);
      setLanguage(settings.languagePreference || "english");
    }
  }, [settings]);

  const totalWeight = skills + experience + projects + education + certifications + keywords + semantic;
  const isWeightValid = totalWeight === 100;

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isWeightValid || isSaving) return;

    setIsSaving(true);
    setSuccess(false);

    const payload: AppSettings = {
      weights: {
        skills,
        experience,
        projects,
        education,
        certifications,
        keywords,
        semantic
      },
      shortlistThreshold: threshold,
      notificationsEnabled: notifications,
      deepEvaluationEnabled: deepEvaluation,
      languagePreference: language
    };

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setSettings(data);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        refreshCandidates();
        refreshStats();
      } else {
        alert("Failed to save settings parameters");
      }
    } catch (e) {
      console.error(e);
      alert("Error saving settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div id="settings-view-page" className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-sans">
          Workspace Settings
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-sans mt-0.5">
          Recalibrate scoring weights, appearance modes, thresholds, and operational parameters.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6 sm:space-y-8 font-sans">
        
        {/* Theme Appearance Selector Card */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[var(--bg-card)] border border-slate-200 dark:border-white/10 shadow-xs space-y-4">
          <div className="border-b border-slate-100 dark:border-white/5 pb-3">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider font-mono">
              Appearance & Theme Mode
            </h3>
            <p className="text-[11px] text-slate-500 font-sans mt-0.5">
              Select your preferred visual style across all devices
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Dark Theme Option */}
            <div
              onClick={() => setTheme("dark")}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                theme === "dark"
                  ? "border-primary bg-primary/10 shadow-md shadow-primary/10"
                  : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-900 text-cyan-400 border border-slate-800">
                  <Moon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Dark Futuristic</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Deep cosmic neon styling</p>
                </div>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full ${
                theme === "dark" ? "bg-primary text-white" : "bg-slate-200 dark:bg-white/10 text-slate-500"
              }`}>
                {theme === "dark" ? "ACTIVE" : "SELECT"}
              </span>
            </div>

            {/* Light Theme Option */}
            <div
              onClick={() => setTheme("light")}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                theme === "light"
                  ? "border-primary bg-primary/10 shadow-md shadow-primary/10"
                  : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-500 border border-amber-200">
                  <Sun className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Clean Light</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Crisp high-contrast daylight</p>
                </div>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full ${
                theme === "light" ? "bg-primary text-white" : "bg-slate-200 dark:bg-white/10 text-slate-500"
              }`}>
                {theme === "light" ? "ACTIVE" : "SELECT"}
              </span>
            </div>
          </div>
        </div>

        {/* Section 1: Dynamic Formula Weights */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[var(--bg-card)] border border-slate-200 dark:border-white/10 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-white/5 pb-4">
            <div>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider font-mono flex items-center gap-2">
                <Sliders className="h-4 w-4 text-primary" />
                Scoring Formula Custom Weightings
              </h3>
              <p className="text-[11px] text-slate-500 font-sans mt-0.5">
                Sliders must sum up to exactly <strong>100%</strong> to deploy formula parameters
              </p>
            </div>

            {/* Weights validity sum indicator */}
            <div className={`self-start sm:self-auto px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 border ${
              isWeightValid 
                ? "bg-success/10 text-success border-success/20" 
                : "bg-danger/10 text-danger border-danger/20"
            }`}>
              <span className={`h-2 w-2 rounded-full ${isWeightValid ? 'bg-success animate-pulse' : 'bg-danger animate-ping'}`} />
              <span className="font-mono">Sum Total: {totalWeight}%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans">
            
            {/* Left col of sliders */}
            <div className="space-y-4">
              {/* Skills */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-700 dark:text-slate-300">Technical Skill Match</span>
                  <span className="text-primary font-mono font-bold">{skills}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={60}
                  step={5}
                  value={skills}
                  onChange={(e) => setSkills(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* Experience */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-700 dark:text-slate-300">Experience Alignment</span>
                  <span className="text-primary font-mono font-bold">{experience}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={40}
                  step={5}
                  value={experience}
                  onChange={(e) => setExperience(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* Projects */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-700 dark:text-slate-300">Project Relevance Ratio</span>
                  <span className="text-primary font-mono font-bold">{projects}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={30}
                  step={5}
                  value={projects}
                  onChange={(e) => setProjects(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* Education */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-700 dark:text-slate-300">Academic Education Credentials</span>
                  <span className="text-primary font-mono font-bold">{education}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={30}
                  step={5}
                  value={education}
                  onChange={(e) => setEducation(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>

            {/* Right col of sliders */}
            <div className="space-y-4">
              {/* Certifications */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-700 dark:text-slate-300">Certifications Verification</span>
                  <span className="text-primary font-mono font-bold">{certifications}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={20}
                  step={5}
                  value={certifications}
                  onChange={(e) => setCertifications(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* Keywords */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-700 dark:text-slate-300">Industry Vocabulary & Keywords</span>
                  <span className="text-primary font-mono font-bold">{keywords}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={20}
                  step={5}
                  value={keywords}
                  onChange={(e) => setKeywords(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* Semantic AI Match */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-700 dark:text-slate-300">Semantic AI Fit Rating</span>
                  <span className="text-primary font-mono font-bold">{semantic}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={30}
                  step={5}
                  value={semantic}
                  onChange={(e) => setSemantic(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
              
              {!isWeightValid && (
                <div className="p-3 rounded-xl border border-danger/30 bg-danger/10 text-danger flex items-center gap-2 leading-relaxed">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <p className="text-[11px]">
                    <strong>Note:</strong> Total weights equal <strong>{totalWeight}%</strong>. Please adjust to 100% to save.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Section 2: General System parameters */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[var(--bg-card)] border border-slate-200 dark:border-white/10 shadow-xs space-y-6">
          <div className="border-b border-slate-100 dark:border-white/5 pb-3">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider font-mono">
              System Operations
            </h3>
            <p className="text-[11px] text-slate-500 font-sans mt-0.5">
              Configure background tasks and language defaults
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans">
            <div className="space-y-5">
              {/* Minimum Score Threshold */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-700 dark:text-slate-300">Minimum Shortlist Score Threshold</span>
                  <span className="text-success font-mono font-bold">{threshold}%</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={90}
                  step={5}
                  value={threshold}
                  onChange={(e) => setThreshold(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-success"
                />
              </div>

              {/* Toggles */}
              <div className="space-y-3.5">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications}
                    onChange={(e) => setNotifications(e.target.checked)}
                    className="h-4 w-4 rounded accent-primary cursor-pointer"
                  />
                  <div>
                    <span className="text-slate-800 dark:text-slate-200 font-semibold block leading-tight">Enable Alert Notifications</span>
                    <span className="text-[10px] text-slate-500 font-sans">Receive popups when screening finishes</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={deepEvaluation}
                    onChange={(e) => setDeepEvaluation(e.target.checked)}
                    className="h-4 w-4 rounded accent-primary cursor-pointer"
                  />
                  <div>
                    <span className="text-slate-800 dark:text-slate-200 font-semibold block leading-tight">Deep AI Analysis & Formatting Audits</span>
                    <span className="text-[10px] text-slate-500 font-sans">Enforces detailed authenticity checking on resume uploads</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              {/* Language Preferences dropdown */}
              <div className="space-y-1.5">
                <label className="text-slate-500 font-mono text-[10px] uppercase">Default Reporting Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[var(--bg-sidebar)] border border-slate-200 dark:border-white/10 focus:border-primary rounded-xl px-3.5 py-2.5 text-slate-800 dark:text-white outline-none font-sans cursor-pointer text-xs"
                >
                  <option value="english">English (US Standard)</option>
                  <option value="german">German (Deutsch)</option>
                  <option value="french">French (Français)</option>
                  <option value="spanish">Spanish (Español)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Save button and status alerts */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-3xl bg-white dark:bg-[var(--bg-card)] border border-slate-200 dark:border-white/10 shadow-xs">
          <div className="flex items-center gap-2">
            {success && (
              <div className="flex items-center gap-1.5 text-success text-xs font-sans font-semibold">
                <CheckCircle2 className="h-4 w-4" />
                <span>Configuration parameters saved successfully!</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={!isWeightValid || isSaving}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary/90 shadow-md shadow-primary/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer active:scale-95"
          >
            {isSaving ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Updating Engine...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Configurations</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
