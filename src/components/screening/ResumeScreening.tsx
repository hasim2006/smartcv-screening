import React, { useState } from "react";
import { UploadCloud, FileText, AlertCircle, Trash2, Play, RefreshCw, Layers } from "lucide-react";
import { Candidate, JobDescription } from "../../types.js";

interface ResumeScreeningProps {
  candidates: Candidate[];
  activeJD: JobDescription | null;
  refreshCandidates: () => void;
  refreshStats: () => void;
  setActivePage: (page: string) => void;
}

export default function ResumeScreening({
  candidates,
  activeJD,
  refreshCandidates,
  refreshStats,
  setActivePage
}: ResumeScreeningProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isScreening, setIsScreening] = useState(false);
  const [screeningMessage, setScreeningMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  const pendingCount = candidates.filter(c => c.screeningStatus === "pending").length;
  const processingCount = candidates.filter(c => c.screeningStatus === "processing").length;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const uploadFileToServer = async (fileName: string, fileSize: number, fileType: string, rawText: string) => {
    const fileId = fileName + Date.now();
    setUploadProgress(prev => ({ ...prev, [fileId]: 10 }));
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const curr = prev[fileId] || 10;
        if (curr >= 90) {
          clearInterval(interval);
          return prev;
        }
        return { ...prev, [fileId]: curr + 20 };
      });
    }, 150);

    try {
      const res = await fetch("/api/candidates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName,
          fileSize,
          rawText,
          location: "Remote",
          currentCompany: "",
          expectedSalary: "Not Specified"
        })
      });

      if (res.ok) {
        setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));
        setTimeout(() => {
          setUploadProgress(prev => {
            const copy = { ...prev };
            delete copy[fileId];
            return copy;
          });
        }, 1000);
        refreshCandidates();
        refreshStats();
      } else {
        alert(`Failed to upload resume: ${fileName}`);
      }
    } catch (e) {
      console.error(e);
      alert("Error sending resume data to server");
    } finally {
      clearInterval(interval);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files) as File[];
    processFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    processFiles(files);
  };

  const processFiles = (files: File[]) => {
    files.forEach((file) => {
      const sizeLimit = 15 * 1024 * 1024; // 15MB
      if (file.size > sizeLimit) {
        alert(`File ${file.name} exceeds our 15MB limit.`);
        return;
      }

      const reader = new FileReader();
      if (file.type === "text/plain" || file.name.endsWith(".txt") || file.name.endsWith(".md")) {
        reader.onload = (event) => {
          const rawText = event.target?.result as string;
          if (rawText) {
            uploadFileToServer(file.name, file.size, file.type, rawText);
          }
        };
        reader.readAsText(file);
      } else if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        reader.onload = (event) => {
          const base64Data = event.target?.result as string;
          if (base64Data) {
            uploadFileToServer(file.name, file.size, file.type, base64Data);
          }
        };
        reader.readAsDataURL(file);
      } else {
        reader.onload = (event) => {
          const base64Data = event.target?.result as string;
          uploadFileToServer(file.name, file.size, file.type, base64Data || "Simulated document content");
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeResume = async (id: string) => {
    try {
      const res = await fetch(`/api/candidates/${id}`, { method: "DELETE" });
      if (res.ok) {
        refreshCandidates();
        refreshStats();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const startScreeningCampaign = async () => {
    if (!activeJD) {
      alert("Please upload and configure an active Job Description before screening resumes.");
      return;
    }

    setIsScreening(true);
    
    const phrases = [
      "Calibrating neural screening nodes against active JD...",
      "Extracting skills matrix and timelines...",
      "Calibrating keyword arrays against requirements...",
      "Executing semantic and vector match models...",
      "Calculating certifications & projects relevance...",
      "Compiling final candidates rankings..."
    ];

    let pIdx = 0;
    setScreeningMessage(phrases[pIdx]);
    const phraseInterval = setInterval(() => {
      pIdx = (pIdx + 1) % phrases.length;
      setScreeningMessage(phrases[pIdx]);
    }, 2200);

    try {
      const res = await fetch("/api/screen-all", { method: "POST" });
      if (res.ok) {
        refreshCandidates();
        refreshStats();
        setTimeout(() => {
          setActivePage("candidates");
        }, 500);
      } else {
        alert("Screening campaign failed.");
      }
    } catch (e) {
      console.error(e);
      alert("Screening network error");
    } finally {
      clearInterval(phraseInterval);
      setIsScreening(false);
    }
  };

  return (
    <div id="resume-screening-page" className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Page Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-sans">
            Resume Screening
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-sans mt-0.5">
            Upload candidate resumes to execute high-speed semantic matching and score-based rankings.
          </p>
        </div>

        {/* Start Screening campaign button */}
        <button
          onClick={startScreeningCampaign}
          disabled={pendingCount === 0 || isScreening || !activeJD}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-success text-slate-950 font-bold text-xs hover:bg-success/90 shadow-md shadow-success/25 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
        >
          {isScreening ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Play className="h-4 w-4 fill-slate-950" />
          )}
          <span>Start AI Screening ({pendingCount} Pending)</span>
        </button>
      </div>

      {/* Campaign Screening Full-screen Modal overlay */}
      {isScreening && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-md p-6">
          <div className="max-w-md w-full text-center space-y-6 p-6 rounded-3xl bg-[var(--bg-sidebar)] border border-primary/30 shadow-2xl">
            <div className="relative flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent p-[2px] animate-bounce shadow-lg shadow-primary/30">
              <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[var(--bg-sidebar)]">
                <Layers className="h-8 w-8 text-primary animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-wider uppercase font-mono">
                Screening Active
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-mono h-10 flex items-center justify-center">
                {screeningMessage}
              </p>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden relative">
              <div className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-r from-primary via-accent to-secondary animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {/* No active JD Warning */}
      {!activeJD && (
        <div className="p-4 rounded-2xl border border-warning/30 bg-warning/10 text-amber-700 dark:text-warning flex items-center gap-3 text-xs font-sans">
          <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
          <p>
            <strong>Note:</strong> No active Job Description found. Please configure a job specification under <strong>Upload JD</strong> before triggering evaluations.
          </p>
        </div>
      )}

      {/* Top Section: Upload Box & Upload Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upload Drop Zone (Left col spans 2) */}
        <div className="lg:col-span-2 space-y-5">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleFileDrop}
            className={`border-2 border-dashed rounded-3xl p-8 sm:p-10 text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[240px] ${
              isDragging 
                ? "border-primary bg-primary/10 shadow-lg shadow-primary/10" 
                : "border-slate-300 dark:border-white/10 bg-white dark:bg-[var(--bg-card)] hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-white/[0.04]"
            }`}
          >
            <UploadCloud className={`h-12 w-12 mb-3 text-slate-400 transition-transform ${isDragging ? "scale-110 text-primary" : ""}`} />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white font-sans">
              Drag & drop resume files here
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-sans mt-1">
              Supports PDF, DOCX, or plain TXT formats (Up to 15MB each)
            </p>

            <div className="mt-5">
              <label className="px-5 py-2.5 rounded-xl bg-primary text-white hover:bg-primary/90 font-sans text-xs font-semibold shadow-md shadow-primary/25 transition-all cursor-pointer select-none inline-block">
                Browse Files
                <input
                  type="file"
                  multiple
                  accept=".pdf,.txt,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Active upload progression queues */}
          {Object.keys(uploadProgress).length > 0 && (
            <div className="p-4 rounded-2xl bg-white dark:bg-[var(--bg-card)] border border-slate-200 dark:border-white/10 space-y-3">
              <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                Uploading Resumes Queue
              </h5>
              <div className="space-y-2">
                {Object.entries(uploadProgress).map(([file, prog]) => (
                  <div key={file} className="flex items-center gap-3 text-xs font-sans">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-slate-800 dark:text-slate-200 truncate flex-1">{file.substring(0, file.length - 13)}</span>
                    <div className="w-24 sm:w-36 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${prog}%` }} />
                    </div>
                    <span className="font-mono text-slate-500 text-[10px] w-8 text-right">{prog}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Live Datastore Stats Checklist (Right col spans 1) */}
        <div className="lg:col-span-1 p-5 sm:p-6 rounded-3xl bg-white dark:bg-[var(--bg-card)] border border-slate-200 dark:border-white/10 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider font-mono">
              Campaign Overview
            </h4>

            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-2">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-sans">Total Ingested</span>
                <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">{candidates.length}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-2">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-sans">Ready / Pending Match</span>
                <span className="text-sm font-bold font-mono text-amber-500 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                  {pendingCount}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-2">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-sans">Evaluating Live</span>
                <span className="text-sm font-bold font-mono text-cyan-500 flex items-center gap-1.5">
                  {processingCount > 0 && <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-ping" />}
                  {processingCount}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-2">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-sans">Index Complete</span>
                <span className="text-sm font-bold font-mono text-success">{candidates.filter(c => c.screeningStatus === "completed").length}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-white/[0.02] rounded-2xl p-3.5 border border-slate-200 dark:border-white/5 text-[11px] text-slate-500 dark:text-slate-400 font-sans mt-5">
            <p className="leading-relaxed">
              <strong>ATS Optimization Note:</strong> Uploaded documents are parsed with layout consistency parameters to ensure strengths, missing skills, and interview questions align seamlessly.
            </p>
          </div>
        </div>

      </div>

      {/* Uploaded Resumes Data Table List */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-[var(--bg-card)] border border-slate-200 dark:border-white/10 shadow-xs space-y-4">
        <h3 className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono">
          Uploaded Resumes Repository
        </h3>

        {candidates.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-xs text-slate-400 font-sans">No resumes have been uploaded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
            <table className="w-full text-left border-collapse text-xs font-sans min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-mono text-[10px]">
                  <th className="pb-3 font-semibold">Resume Title</th>
                  <th className="pb-3 font-semibold">File Size</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Ingested Timestamp</th>
                  <th className="pb-3 font-semibold text-right">Removal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-slate-700 dark:text-slate-300">
                {candidates.map((cand) => (
                  <tr key={cand.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-2.5">
                        <FileText className="h-4.5 w-4.5 text-primary shrink-0" />
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-slate-200">{cand.name}</p>
                          <span className="text-[10px] text-slate-400 font-mono">{cand.fileName}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5">
                      <span className="font-mono text-[10px] text-slate-500">
                        {cand.fileSize ? `${(cand.fileSize / 1024).toFixed(1)} KB` : "N/A"}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium ${
                        cand.screeningStatus === "completed" ? "bg-success/15 text-success border border-success/20" :
                        cand.screeningStatus === "processing" ? "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20" :
                        cand.screeningStatus === "failed" ? "bg-danger/15 text-danger border border-danger/20" :
                        "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          cand.screeningStatus === "completed" ? "bg-success" :
                          cand.screeningStatus === "processing" ? "bg-cyan-500 animate-ping" :
                          cand.screeningStatus === "failed" ? "bg-danger" :
                          "bg-amber-500 animate-pulse"
                        }`} />
                        {cand.screeningStatus.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <span className="font-mono text-slate-500 text-[11px]">
                        {new Date(cand.uploadTime).toLocaleDateString()} at {new Date(cand.uploadTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => removeResume(cand.id)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-danger hover:border-danger/30 transition-all cursor-pointer"
                        title="Delete candidate"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
