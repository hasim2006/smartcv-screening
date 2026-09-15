import dotenv from "dotenv";
dotenv.config();
dotenv.config({ path: ".env.local", override: true });

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { db } from "./server/db.js";
import { isGeminiConfigured } from "./server/gemini.js";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Support large JSON payloads for base64 file transfers
  app.use(express.json({ limit: "20mb" }));

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      geminiConfigured: isGeminiConfigured(),
      timestamp: new Date().toISOString()
    });
  });

  // Get active job description
  app.get("/api/active-jd", (req, res) => {
    try {
      res.json(db.getActiveJD());
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Set active job description
  app.post("/api/active-jd", async (req, res) => {
    try {
      const { text } = req.body;
      if (!text || text.trim() === "") {
        return res.status(400).json({ error: "Job description text cannot be empty" });
      }
      const jd = await db.setActiveJD(text);
      res.json(jd);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get all candidates
  app.get("/api/candidates", (req, res) => {
    try {
      res.json(db.getCandidates());
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Upload/Create new candidate
  app.post("/api/candidates", (req, res) => {
    try {
      const { name, email, phone, rawText, fileName, fileSize, location, currentCompany, expectedSalary } = req.body;
      if (!fileName || !rawText) {
        return res.status(400).json({ error: "File name and content raw text are required" });
      }

      const candidate = db.addCandidate({
        name: name || fileName.replace(/\.[^/.]+$/, "").split(/[_\s-]+/).map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
        email: email || "",
        phone: phone || "",
        rawText,
        fileName,
        fileSize: fileSize || 0,
        uploadTime: new Date().toISOString(),
        experienceYears: 0,
        education: "Unknown",
        skills: [],
        projects: [],
        achievements: [],
        certifications: [],
        currentCompany: currentCompany || "",
        expectedSalary: expectedSalary || "Not Specified",
        location: location || "Remote"
      });

      res.status(201).json(candidate);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Delete candidate
  app.delete("/api/candidates/:id", (req, res) => {
    try {
      const { id } = req.params;
      const deleted = db.removeCandidate(id);
      if (deleted) {
        res.json({ success: true, message: "Candidate removed successfully" });
      } else {
        res.status(404).json({ error: "Candidate not found" });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update candidate status (e.g. Applied, Screened, Shortlisted, Interview Scheduled, Rejected)
  app.post("/api/candidates/:id/status", (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ error: "Status value is required" });
      }
      const updated = db.updateCandidateStatus(id, status);
      if (updated) {
        res.json({ success: true, candidate: db.getCandidateById(id) });
      } else {
        res.status(404).json({ error: "Candidate not found" });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Run matching screen for single candidate
  app.post("/api/screen/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const candidate = await db.screenCandidate(id);
      res.json(candidate);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Run screening for all pending candidates
  app.post("/api/screen-all", async (req, res) => {
    try {
      const results = await db.screenAllPending();
      res.json({ success: true, screenedCount: results.length, candidates: db.getCandidates() });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Natural Language Search candidates
  app.post("/api/search", async (req, res) => {
    try {
      const { query } = req.body;
      if (typeof query !== "string") {
        return res.status(400).json({ error: "Search query must be a string" });
      }
      const matched = await db.searchCandidatesSemantic(query);
      res.json(matched);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get general system settings
  app.get("/api/settings", (req, res) => {
    try {
      res.json(db.getSettings());
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update settings
  app.post("/api/settings", (req, res) => {
    try {
      const updated = db.updateSettings(req.body);
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get notifications
  app.get("/api/notifications", (req, res) => {
    try {
      res.json(db.getNotifications());
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Mark all read
  app.post("/api/notifications/read", (req, res) => {
    try {
      db.markAllNotificationsAsRead();
      res.json({ success: true, notifications: db.getNotifications() });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Clear notifications
  app.delete("/api/notifications", (req, res) => {
    try {
      db.clearNotifications();
      res.json({ success: true, notifications: [] });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get Home Dashboard aggregate stats
  app.get("/api/stats", (req, res) => {
    try {
      const candidates = db.getCandidates();
      const screened = candidates.filter(c => c.screeningStatus === "completed");
      const shortlisted = candidates.filter(c => c.status === "Shortlisted" || c.status === "Interview Scheduled");
      const rejected = candidates.filter(c => c.status === "Rejected");
      const averageMatchScore = screened.length > 0
        ? Math.round(screened.reduce((acc, c) => acc + (c.scores?.overall || 0), 0) / screened.length)
        : 0;

      // Find top candidate
      let topCandName = "N/A";
      let maxScore = -1;
      screened.forEach(c => {
        if (c.scores && c.scores.overall > maxScore) {
          maxScore = c.scores.overall;
          topCandName = `${c.name} (${maxScore}%)`;
        }
      });

      // Processing Status
      const processingCount = candidates.filter(c => c.screeningStatus === "processing").length;
      const pendingCount = candidates.filter(c => c.screeningStatus === "pending").length;
      let processingStatus = "Idle";
      if (processingCount > 0) {
        processingStatus = `Analyzing (${processingCount})`;
      } else if (pendingCount > 0) {
        processingStatus = `${pendingCount} Resumes Pending`;
      } else if (candidates.length > 0) {
        processingStatus = "Up to Date";
      }

      res.json({
        totalCandidates: candidates.length,
        shortlisted: shortlisted.length,
        rejected: rejected.length,
        averageMatchScore,
        topCandidate: topCandName,
        processingStatus
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get detailed analytical metrics
  app.get("/api/analytics", (req, res) => {
    try {
      const candidates = db.getCandidates();
      const completed = candidates.filter(c => c.screeningStatus === "completed");

      // 1. Skill Distribution count
      const skillCounts: { [key: string]: number } = {};
      completed.forEach(c => {
        c.skills.forEach(s => {
          const norm = s.trim();
          skillCounts[norm] = (skillCounts[norm] || 0) + 1;
        });
      });
      const topSkills = Object.entries(skillCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 8);

      // 2. Experience distributions
      const experienceDist = [
        { range: "0-2 Yrs", count: 0 },
        { range: "3-5 Yrs", count: 0 },
        { range: "6-8 Yrs", count: 0 },
        { range: "9+ Yrs", count: 0 }
      ];
      completed.forEach(c => {
        if (c.experienceYears <= 2) experienceDist[0].count++;
        else if (c.experienceYears <= 5) experienceDist[1].count++;
        else if (c.experienceYears <= 8) experienceDist[2].count++;
        else experienceDist[3].count++;
      });

      // 3. Education levels count
      const eduCounts: { [key: string]: number } = {};
      completed.forEach(c => {
        const edu = c.education.toLowerCase();
        let cat = "Other";
        if (edu.includes("bachelor") || edu.includes("b.s.") || edu.includes("b.a.")) cat = "Bachelor's";
        else if (edu.includes("master") || edu.includes("m.s.") || edu.includes("m.b.a.")) cat = "Master's";
        else if (edu.includes("ph.d") || edu.includes("doctor")) cat = "Ph.D.";
        else if (edu.includes("associate") || edu.includes("a.s.")) cat = "Associate";
        eduCounts[cat] = (eduCounts[cat] || 0) + 1;
      });
      const educationDist = Object.entries(eduCounts).map(([name, value]) => ({ name, value }));

      // 4. Hiring Funnel
      const funnel = [
        { stage: "Applied", count: candidates.length },
        { stage: "Screened", count: completed.length },
        { stage: "Shortlisted", count: candidates.filter(c => c.status === "Shortlisted" || c.status === "Interview Scheduled").length },
        { stage: "Interviews", count: candidates.filter(c => c.status === "Interview Scheduled").length },
        { stage: "Rejected", count: candidates.filter(c => c.status === "Rejected").length }
      ];

      // 5. Match Score Ranges
      const scoreDist = [
        { range: "90-100 (Excellent)", count: 0 },
        { range: "80-89 (Strong)", count: 0 },
        { range: "60-79 (Moderate)", count: 0 },
        { range: "45-59 (Weak)", count: 0 },
        { range: "0-44 (Reject)", count: 0 }
      ];
      completed.forEach(c => {
        const s = c.scores?.overall || 0;
        if (s >= 90) scoreDist[0].count++;
        else if (s >= 80) scoreDist[1].count++;
        else if (s >= 60) scoreDist[2].count++;
        else if (s >= 45) scoreDist[3].count++;
        else scoreDist[4].count++;
      });

      res.json({
        topSkills,
        experienceDist,
        educationDist,
        funnel,
        scoreDist,
        totalScreened: completed.length
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
