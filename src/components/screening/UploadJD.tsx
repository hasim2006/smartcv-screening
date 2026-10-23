import React, { useState, useEffect } from "react";
import { FileUp, Sparkles, Check, Save, Edit3, RefreshCw } from "lucide-react";
import { JobDescription, ParsedJD } from "../../types.js";

interface UploadJDProps {
  activeJD: JobDescription | null;
  setActiveJD: (jd: JobDescription | null) => void;
  refreshStats: () => void;
}

export default function UploadJD({ activeJD, setActiveJD, refreshStats }: UploadJDProps) {
  const [jdText, setJdText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Editable form fields
  const [editTitle, setEditTitle] = useState("");
  const [editExp, setEditExp] = useState(0);
  const [editEdu, setEditEdu] = useState("");
  const [editReqSkills, setEditReqSkills] = useState("");
  const [editPrefSkills, setEditPrefSkills] = useState("");
  const [editCerts, setEditCerts] = useState("");
  const [editSoftSkills, setEditSoftSkills] = useState("");
  const [editKeywords, setEditKeywords] = useState("");

  useEffect(() => {
    if (activeJD) {
      setJdText(activeJD.text);
      if (activeJD.parsed) {
        setEditTitle(activeJD.parsed.title);
        setEditExp(activeJD.parsed.experienceYears);
        setEditEdu(activeJD.parsed.education);
        setEditReqSkills(activeJD.parsed.requiredSkills.join(", "));
        setEditPrefSkills(activeJD.parsed.preferredSkills.join(", "));
        setEditCerts(activeJD.parsed.certifications.join(", "));
        setEditSoftSkills(activeJD.parsed.softSkills.join(", "));
        setEditKeywords(activeJD.parsed.keywords.join(", "));
      }
    }
  }, [activeJD]);

  const handleTextSubmit = async () => {
    if (!jdText.trim()) return;
    setIsProcessing(true);
    setIsEditing(false);

    try {
      const res = await fetch("/api/active-jd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: jdText })
      });
      if (res.ok) {
        const data = await res.json();
        setActiveJD(data);
        refreshStats();
      } else {
        alert("Failed to process JD with AI.");
      }
    } catch (e) {
      console.error(e);
      alert("Error sending JD to server");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      if (text) {
        setJdText(text);
      }
    };
    reader.readAsText(file);
  };

  const handleSaveEdits = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeJD) return;

    setIsProcessing(true);

    const updatedParsed: ParsedJD = {
      title: editTitle,
      experienceYears: editExp,
      education: editEdu,
      requiredSkills: editReqSkills.split(",").map(s => s.trim()).filter(Boolean),
      preferredSkills: editPrefSkills.split(",").map(s => s.trim()).filter(Boolean),
      certifications: editCerts.split(",").map(s => s.trim()).filter(Boolean),
      softSkills: editSoftSkills.split(",").map(s => s.trim()).filter(Boolean),
      keywords: editKeywords.split(",").map(s => s.trim()).filter(Boolean),
      responsibilities: activeJD.parsed?.responsibilities || [],
      tools: activeJD.parsed?.tools || [],
      technologies: activeJD.parsed?.technologies || []
    };

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activeJD: {
            ...activeJD,
            title: editTitle,
            parsed: updatedParsed
          }
        })
      });

      const jdRes = await fetch("/api/active-jd");
      if (jdRes.ok) {
        const latestJd = await jdRes.json();
        setActiveJD(latestJd);
        setIsEditing(false);
        refreshStats();
      }
    } catch (e) {
      console.error(e);
      alert("Failed to save edited criteria");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div id="upload-jd-page" className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-sans">
          Upload Job Description
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-sans mt-0.5">
          Provide raw JD text or upload criteria. The AI will extract requirements to compare candidate scores.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Side: Paste / Upload Section */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[var(--bg-card)] border border-slate-200 dark:border-white/10 shadow-xs space-y-5">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider font-mono">
              Raw JD Input
            </h3>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Paste details directly or upload a text draft (.txt / .md)
            </p>
          </div>

          <div className="space-y-4">
            <textarea
              id="jd-raw-textarea"
              placeholder="Paste complete Job Description here... E.g., title, roles, core requirements, required and preferred skills, etc."
              rows={12}
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-primary rounded-2xl p-4 text-xs text-slate-900 dark:text-white outline-none resize-none transition-all font-mono leading-relaxed placeholder-slate-400"
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* File Upload Trigger */}
              <label className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-white/5 text-xs text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-white hover:border-primary/40 transition-all cursor-pointer">
                <FileUp className="h-4 w-4 text-primary" />
                <span>Upload File (.txt)</span>
                <input
                  type="file"
                  accept=".txt,.md"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Submit Process Button */}
              <button
                onClick={handleTextSubmit}
                disabled={isProcessing || !jdText.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 shadow-md shadow-primary/25 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Processing Criteria...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-accent animate-pulse" />
                    <span>Process JD with AI</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Parsed / Extracted Parameters Panel */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[var(--bg-card)] border border-slate-200 dark:border-white/10 shadow-xs flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider font-mono">
                  Extracted Requirements
                </h3>
                <p className="text-xs text-slate-500 font-sans mt-0.5">
                  Extracted criteria for applicant evaluations
                </p>
              </div>

              {activeJD?.parsed && !isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-primary/40 bg-slate-50 dark:bg-white/5 text-[11px] text-slate-700 dark:text-slate-300 font-mono transition-all cursor-pointer"
                >
                  <Edit3 className="h-3.5 w-3.5 text-primary" />
                  <span>Modify Fields</span>
                </button>
              )}
            </div>

            {/* If Processing Loader */}
            {isProcessing && (
              <div className="py-20 text-center space-y-3">
                <div className="flex justify-center">
                  <RefreshCw className="h-8 w-8 text-primary animate-spin" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  Structuring requirements...
                </p>
              </div>
            )}

            {/* If no JD is parsed yet */}
            {!activeJD && !isProcessing && (
              <div className="py-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6">
                <p className="text-xs text-slate-400 font-sans">
                  No active Job Description set. Enter text on the left and trigger parsing to build baseline metrics.
                </p>
              </div>
            )}

            {/* If Active JD parsed exists, display parameters */}
            {activeJD?.parsed && !isProcessing && (
              <>
                {isEditing ? (
                  /* EDITING FORM */
                  <form onSubmit={handleSaveEdits} className="space-y-3.5 text-xs">
                    <div className="space-y-1">
                      <label className="text-slate-500 font-mono uppercase text-[10px]">Job Title</label>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-primary rounded-xl p-2.5 text-slate-900 dark:text-white outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-slate-500 font-mono uppercase text-[10px]">Min Experience (Yrs)</label>
                        <input
                          type="number"
                          value={editExp}
                          onChange={(e) => setEditExp(parseInt(e.target.value) || 0)}
                          className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-primary rounded-xl p-2.5 text-slate-900 dark:text-white outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-500 font-mono uppercase text-[10px]">Education Baseline</label>
                        <input
                          type="text"
                          value={editEdu}
                          onChange={(e) => setEditEdu(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-primary rounded-xl p-2.5 text-slate-900 dark:text-white outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-500 font-mono uppercase text-[10px]">Required Skills (Comma-separated)</label>
                      <input
                        type="text"
                        value={editReqSkills}
                        onChange={(e) => setEditReqSkills(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-primary rounded-xl p-2.5 text-slate-900 dark:text-white outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-500 font-mono uppercase text-[10px]">Preferred / Nice-to-Have Skills</label>
                      <input
                        type="text"
                        value={editPrefSkills}
                        onChange={(e) => setEditPrefSkills(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-primary rounded-xl p-2.5 text-slate-900 dark:text-white outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-slate-500 font-mono uppercase text-[10px]">Soft Skills</label>
                        <input
                          type="text"
                          value={editSoftSkills}
                          onChange={(e) => setEditSoftSkills(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-primary rounded-xl p-2.5 text-slate-900 dark:text-white outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-500 font-mono uppercase text-[10px]">Certifications</label>
                        <input
                          type="text"
                          value={editCerts}
                          onChange={(e) => setEditCerts(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-primary rounded-xl p-2.5 text-slate-900 dark:text-white outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-500 font-mono uppercase text-[10px]">Keywords</label>
                      <input
                        type="text"
                        value={editKeywords}
                        onChange={(e) => setEditKeywords(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-primary rounded-xl p-2.5 text-slate-900 dark:text-white outline-none"
                      />
                    </div>

                    <div className="flex gap-2.5 justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-3.5 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex items-center gap-1.5 px-4 py-1.5 bg-success text-slate-950 rounded-lg font-bold hover:bg-success/90 cursor-pointer text-xs shadow-xs"
                      >
                        <Save className="h-3.5 w-3.5" />
                        <span>Save</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  /* READ-ONLY SPEC CARDS */
                  <div className="space-y-4">
                    {/* Header Spec Block */}
                    <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-[var(--bg-card-inner)] border border-slate-200 dark:border-white/10 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] font-mono text-slate-500 uppercase">CALCULATED TITLE</span>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{activeJD.parsed.title}</h4>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] font-mono text-slate-500 uppercase block">EXPERIENCE</span>
                        <span className="text-xs text-primary font-semibold">{activeJD.parsed.experienceYears}+ Years Req</span>
                      </div>
                    </div>

                    {/* Specifications breakdown */}
                    <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                      <div>
                        <span className="text-[9px] font-mono text-slate-500 uppercase block mb-1">Education Requirement</span>
                        <p className="text-xs text-slate-700 dark:text-slate-300">{activeJD.parsed.education}</p>
                      </div>

                      <div className="mt-2.5">
                        <span className="text-[9px] font-mono text-slate-500 uppercase block mb-1.5">Required Skills</span>
                        <div className="flex flex-wrap gap-1.5">
                          {activeJD.parsed.requiredSkills.map((s, idx) => (
                            <span key={idx} className="px-2.5 py-1 rounded bg-primary/10 border border-primary/20 text-primary text-[10px] font-medium">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      {activeJD.parsed.preferredSkills.length > 0 && (
                        <div className="mt-2.5">
                          <span className="text-[9px] font-mono text-slate-500 uppercase block mb-1.5">Nice-to-Have Skills</span>
                          <div className="flex flex-wrap gap-1.5">
                            {activeJD.parsed.preferredSkills.map((s, idx) => (
                              <span key={idx} className="px-2.5 py-1 rounded bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-medium">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {activeJD.parsed.softSkills.length > 0 && (
                        <div className="mt-2.5">
                          <span className="text-[9px] font-mono text-slate-500 uppercase block mb-1.5">Soft Skills</span>
                          <div className="flex flex-wrap gap-1.5">
                            {activeJD.parsed.softSkills.map((s, idx) => (
                              <span key={idx} className="px-2.5 py-1 rounded bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-[10px]">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {activeJD.parsed.certifications.length > 0 && (
                        <div className="mt-2.5">
                          <span className="text-[9px] font-mono text-slate-500 uppercase block mb-1.5">Certifications</span>
                          <div className="flex flex-wrap gap-1.5">
                            {activeJD.parsed.certifications.map((s, idx) => (
                              <span key={idx} className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px]">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {activeJD?.parsed && !isEditing && (
            <div className="border-t border-slate-100 dark:border-white/5 pt-3.5 flex justify-between items-center text-xs text-slate-500 mt-4">
              <span className="font-mono text-[11px]">Criteria ready</span>
              <div className="flex items-center gap-1 text-success">
                <Check className="h-4 w-4" />
                <span className="font-semibold text-[11px]">Active</span>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
