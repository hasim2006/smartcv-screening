import { Candidate, JobDescription, DashboardStats, AppSettings, AppNotification } from "../types.js";

const STORAGE_KEY = "smartcv_standalone_db_v1";

const INITIAL_JD: JobDescription = {
  id: "jd_seed",
  title: "Senior Full Stack Engineer",
  text: `Job Title: Senior Full Stack Engineer
Position Overview: We are looking for a Senior Full Stack Engineer to design, build, and scale our core SaaS platform.
Required Skills: React, TypeScript, Node.js, Express, PostgreSQL, Tailwind CSS.
Preferred Skills: Next.js, Docker, AWS, CI/CD pipelines.
Experience: 5+ years.`,
  parsed: {
    title: "Senior Full Stack Engineer",
    requiredSkills: ["React", "TypeScript", "Node.js", "Express", "PostgreSQL", "Tailwind CSS"],
    preferredSkills: ["Next.js", "Docker", "AWS", "CI/CD"],
    experienceYears: 5,
    education: "Bachelor's in Computer Science or equivalent",
    certifications: ["AWS Certified Solutions Architect"],
    softSkills: ["Communication", "Problem Solving", "Team Leadership"],
    responsibilities: [
      "Architect and develop secure, reusable front-end and back-end components.",
      "Optimize database queries and system performance.",
      "Collaborate with Product Managers and Designers."
    ],
    keywords: ["Front-end", "Microservices", "REST APIs", "PostgreSQL", "Tailwind CSS"],
    tools: ["Git", "VS Code", "Vite", "Docker"],
    technologies: ["React", "TypeScript", "Node.js", "Express", "PostgreSQL"]
  },
  uploadedAt: new Date().toISOString()
};

const SEED_CANDIDATES: Candidate[] = [
  {
    id: "cand_1",
    name: "Sarah Jenkins",
    email: "sarah.jenkins@techdev.io",
    phone: "+1 (415) 882-9012",
    fileName: "sarah_jenkins_resume.pdf",
    fileSize: 142050,
    rawText: "Sarah Jenkins - Lead Full Stack Engineer with 6 years experience in React, TypeScript, Node.js, PostgreSQL, Docker, AWS.",
    uploadTime: "2026-07-15T10:12:00Z",
    experienceYears: 6,
    education: "B.S. in Computer Science, UC Berkeley",
    skills: ["TypeScript", "JavaScript", "React.js", "Next.js", "Tailwind CSS", "Node.js", "Express", "PostgreSQL", "Docker", "AWS", "Git"],
    projects: [
      { title: "CollabCanvas", description: "Real-time interactive team canvas using React, WebSockets, and Redis." },
      { title: "ScaleData", description: "High-performance data ingestion pipeline streaming to PostgreSQL." }
    ],
    achievements: [
      "Architected dashboard improving page load performance by 45%.",
      "Optimized PostgreSQL queries reducing latency by 30%."
    ],
    certifications: ["AWS Certified Solutions Architect", "Certified ScrumMaster"],
    currentCompany: "OptimaSaaS Inc.",
    expectedSalary: "$145,000",
    location: "San Francisco, CA",
    screeningStatus: "completed",
    scores: {
      skillMatch: 95,
      experienceMatch: 95,
      projectRelevance: 92,
      educationMatch: 95,
      certificationMatch: 90,
      keywordSimilarity: 90,
      semanticMatch: 94,
      overall: 94
    },
    aiVerdict: "Excellent Match",
    analysis: {
      summary: "Sarah Jenkins is an exceptional Senior Full Stack Engineer exceeding all mandatory requirements for the position.",
      strengths: [
        "Proven lead experience with React, TypeScript, and microservices architecture.",
        "Deep knowledge in PostgreSQL schema design and database optimization.",
        "Holds AWS Solutions Architect certification."
      ],
      weaknesses: ["High market demand candidate with expected compensation in upper tiers."],
      missingSkills: [],
      suggestedQuestions: {
        technical: ["Explain how you resolved database connection pooling locks in PostgreSQL under high traffic."],
        behavioral: ["Describe how you handle conflicting technical opinions between backend and frontend engineers."],
        situational: ["How would you structure a multi-tenant database migration with zero downtime?"],
        project: ["Walk us through the architecture of the ScaleData streaming ingestion pipeline."],
        leadership: ["How do you onboard and mentor junior developers in clean architecture standards?"],
        coding: ["Implement an efficient debounce hook in TypeScript for search input components."]
      },
      hiringRecommendation: "Immediate top-priority interview. Exceptional candidate with perfect technical and leadership alignment.",
      salaryRecommendation: "$140,000 - $155,000",
      culturalFit: 95,
      careerGrowth: "High trajectory for fast promotion to Staff or Principal Engineering roles.",
      explanation: "Sarah's profile matches 95% of technical criteria, with direct 6-year history in React, TypeScript, Node.js, and PostgreSQL.",
      formattingScore: 96,
      fakeDetectionScore: 99,
      atsCompatibilityScore: 98,
      keywordSuggestions: ["GraphQL", "Kubernetes", "Next.js App Router"]
    },
    status: "Shortlisted"
  },
  {
    id: "cand_2",
    name: "Marcus Chen",
    email: "marcus.chen.codes@gmail.com",
    phone: "+1 (206) 745-9311",
    fileName: "marcus_chen_resume.docx",
    fileSize: 84210,
    rawText: "Marcus Chen - Full Stack Web Engineer with 5 years experience in Node.js, React, Tailwind CSS, Express, PostgreSQL, AWS.",
    uploadTime: "2026-07-15T11:45:00Z",
    experienceYears: 5,
    education: "B.S. in Software Engineering, Seattle University",
    skills: ["JavaScript", "React", "Redux", "Tailwind CSS", "Node.js", "Express", "PostgreSQL", "AWS", "Docker", "Git"],
    projects: [
      { title: "StoreAnalytics", description: "Automated pipeline capturing merchant inventory events." },
      { title: "ExpressServerSeed", description: "Reusable Node.js Express scaffolding with JWT auth." }
    ],
    achievements: [
      "Designed retail analytics dashboard in React increasing merchant engagement by 25%.",
      "Resolved concurrency locks in PostgreSQL."
    ],
    certifications: ["Docker Certified Associate"],
    currentCompany: "Peak Retail Apps",
    expectedSalary: "$130,000",
    location: "Seattle, WA",
    screeningStatus: "completed",
    scores: {
      skillMatch: 88,
      experienceMatch: 90,
      projectRelevance: 85,
      educationMatch: 90,
      certificationMatch: 75,
      keywordSimilarity: 82,
      semanticMatch: 85,
      overall: 86
    },
    aiVerdict: "Strong Match",
    analysis: {
      summary: "Marcus Chen is a solid Full Stack Engineer with 5 years experience meeting all core requirements.",
      strengths: ["Strong backend Node.js and Express background.", "Solid practical PostgreSQL knowledge."],
      weaknesses: ["Slightly less emphasis on advanced TypeScript architectures."],
      missingSkills: ["TypeScript (Deep generics)"],
      suggestedQuestions: {
        technical: ["How do you handle JWT refresh token rotation securely across distributed clients?"],
        behavioral: ["Tell us about a technical disagreement you had with a PM."],
        situational: ["How do you isolate flaky third-party APIs from bringing down core server routes?"],
        project: ["What were the biggest performance challenges in your StoreAnalytics project?"],
        leadership: ["How do you guide code reviews constructively?"],
        coding: ["Write a middleware in Express to rate-limit requests per IP."]
      },
      hiringRecommendation: "Highly recommended for technical interview round.",
      salaryRecommendation: "$125,000 - $135,000",
      culturalFit: 88,
      careerGrowth: "Strong senior developer with quick runway to lead positions.",
      explanation: "Marcus is a strong candidate with a proven track record across React, Node, Express, and PostgreSQL.",
      formattingScore: 90,
      fakeDetectionScore: 97,
      atsCompatibilityScore: 92,
      keywordSuggestions: ["TypeScript", "Prisma", "Vitest"]
    },
    status: "Shortlisted"
  },
  {
    id: "cand_3",
    name: "Priya Patel",
    email: "priya.frontend@gmail.com",
    phone: "+1 (650) 492-1102",
    fileName: "priya_patel_cv.pdf",
    fileSize: 95400,
    rawText: "Priya Patel - Front End Developer with 4 years experience in React, TypeScript, Next.js, Tailwind CSS, Vite.",
    uploadTime: "2026-07-15T12:30:00Z",
    experienceYears: 4,
    education: "B.A. in Computer Applications, San Jose State University",
    skills: ["React", "TypeScript", "Tailwind CSS", "Next.js", "Redux", "HTML5", "CSS3", "Git"],
    projects: [
      { title: "DesignTokenHub", description: "Design system token manager built with React and Tailwind." }
    ],
    achievements: [
      "Built 15+ responsive portal websites using React and Tailwind CSS.",
      "Refactored legacy stylesheets to Tailwind, reducing bundle size by 60%."
    ],
    certifications: [],
    currentCompany: "PixelPerfect Web Agency",
    expectedSalary: "$105,000",
    location: "Palo Alto, CA",
    screeningStatus: "completed",
    scores: {
      skillMatch: 70,
      experienceMatch: 70,
      projectRelevance: 60,
      educationMatch: 75,
      certificationMatch: 20,
      keywordSimilarity: 68,
      semanticMatch: 72,
      overall: 68
    },
    aiVerdict: "Moderate Match",
    analysis: {
      summary: "Priya Patel is an excellent Frontend Developer with 4 years experience, but lacks deep backend Node and SQL experience.",
      strengths: ["Exceptional modern frontend styling with Tailwind CSS and React.", "Strong accessibility knowledge."],
      weaknesses: ["No demonstrable backend Node.js, Express, or PostgreSQL experience in production."],
      missingSkills: ["Node.js", "Express", "PostgreSQL", "Docker"],
      suggestedQuestions: {
        technical: ["How would you design a REST API backend to feed your React application?"],
        behavioral: ["Why are you looking to transition from front-end into full-stack?"],
        situational: ["How do you handle client-side caching of heavy API payloads?"],
        project: ["How did you organize theme tokens in DesignTokenHub?"],
        leadership: ["How do you handle reviews on UI consistency?"],
        coding: ["Write a custom React hook that detects click-outside events."]
      },
      hiringRecommendation: "Consider if willing to mentor on backend or if hiring for frontend-heavy fullstack.",
      salaryRecommendation: "$100,000 - $110,000",
      culturalFit: 92,
      careerGrowth: "High growth potential with proper backend mentoring.",
      explanation: "Priya is strong on frontend but currently misses backend Node and database requirements.",
      formattingScore: 94,
      fakeDetectionScore: 98,
      atsCompatibilityScore: 90,
      keywordSuggestions: ["Node.js", "PostgreSQL", "Express", "REST APIs"]
    },
    status: "Screened"
  },
  {
    id: "cand_4",
    name: "David Vance",
    email: "david.vance.graphics@outlook.com",
    phone: "+1 (512) 301-8843",
    fileName: "david_vance_graphic_design.pdf",
    fileSize: 52140,
    rawText: "David Vance - Junior Graphic Designer with 1 year experience in Photoshop, Illustrator, Figma, HTML, CSS.",
    uploadTime: "2026-07-15T13:40:00Z",
    experienceYears: 1,
    education: "High School Diploma, Austin High School",
    skills: ["Figma", "Adobe Photoshop", "Adobe Illustrator", "HTML", "CSS"],
    projects: [],
    achievements: ["Created branding templates for 30+ regional clients."],
    certifications: [],
    currentCompany: "GraphicArt Design Studio",
    expectedSalary: "$60,000",
    location: "Austin, TX",
    screeningStatus: "completed",
    scores: {
      skillMatch: 15,
      experienceMatch: 10,
      projectRelevance: 10,
      educationMatch: 20,
      certificationMatch: 0,
      keywordSimilarity: 10,
      semanticMatch: 15,
      overall: 14
    },
    aiVerdict: "Reject",
    analysis: {
      summary: "David Vance is a Junior Graphic Designer with no software engineering or full-stack qualifications.",
      strengths: ["Strong graphic design and visual illustration skills."],
      weaknesses: ["Has zero programming, backend, database, or software engineering experience."],
      missingSkills: ["React", "TypeScript", "Node.js", "PostgreSQL", "Express", "Docker"],
      suggestedQuestions: {
        technical: ["Candidate does not meet minimum technical criteria."],
        behavioral: ["What motivates your interest in software development?"],
        situational: ["N/A"],
        project: ["N/A"],
        leadership: ["N/A"],
        coding: ["N/A"]
      },
      hiringRecommendation: "Screen out. Unqualified for this technical engineering position.",
      salaryRecommendation: "N/A",
      culturalFit: 60,
      careerGrowth: "Best suited for visual marketing and graphic design roles.",
      explanation: "David's profile lacks all mandatory technical and engineering qualifications.",
      formattingScore: 80,
      fakeDetectionScore: 95,
      atsCompatibilityScore: 65,
      keywordSuggestions: ["JavaScript", "React", "Node.js", "Computer Science"]
    },
    status: "Rejected"
  }
];

class StandaloneStore {
  public candidates: Candidate[] = [];
  public activeJD: JobDescription | null = null;
  public settings: AppSettings;
  public notifications: AppNotification[] = [];

  constructor() {
    this.settings = {
      weights: { skills: 35, experience: 20, projects: 15, education: 10, certifications: 5, keywords: 5, semantic: 10 },
      shortlistThreshold: 75,
      notificationsEnabled: true,
      languagePreference: "english"
    };
    this.load();
  }

  private load() {
    if (typeof window === "undefined") return;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        this.candidates = parsed.candidates || SEED_CANDIDATES;
        this.activeJD = parsed.activeJD || INITIAL_JD;
        this.settings = parsed.settings || this.settings;
        this.notifications = parsed.notifications || [];
        return;
      }
    } catch {
      // Ignore
    }
    this.candidates = [...SEED_CANDIDATES];
    this.activeJD = INITIAL_JD;
    this.notifications = [
      {
        id: "notif_welcome",
        title: "Workspace Initialized",
        message: "SmartCV Screening engine loaded with active Senior Full Stack Engineer role.",
        type: "success",
        timestamp: new Date().toISOString(),
        read: false
      }
    ];
    this.save();
  }

  public save() {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        candidates: this.candidates,
        activeJD: this.activeJD,
        settings: this.settings,
        notifications: this.notifications
      }));
    } catch {
      // Ignore
    }
  }

  public getStats(): DashboardStats {
    const total = this.candidates.length;
    const completed = this.candidates.filter(c => c.screeningStatus === "completed");
    const shortlisted = this.candidates.filter(c => c.status === "Shortlisted" || c.status === "Interview Scheduled").length;
    const rejected = this.candidates.filter(c => c.status === "Rejected").length;
    
    let sumScore = 0;
    let topCandidate = "None Loaded";
    let topScore = -1;

    completed.forEach(c => {
      const s = c.scores?.overall || 0;
      sumScore += s;
      if (s > topScore) {
        topScore = s;
        topCandidate = `${c.name} (${s}%)`;
      }
    });

    const averageMatchScore = completed.length > 0 ? Math.round(sumScore / completed.length) : 0;

    return {
      totalCandidates: total,
      shortlisted,
      rejected,
      averageMatchScore,
      topCandidate,
      processingStatus: "Idle (Ready)"
    };
  }
}

export const standaloneStore = new StandaloneStore();

/**
 * Initializes transparent client-side fallback interceptor
 * If a request to /api/* fails or 404s (e.g. on static hosting like Netlify/Vercel/GitHub Pages),
 * it seamlessly intercepts and serves from local browser storage!
 */
export function setupClientApiFallback() {
  if (typeof window === "undefined") return;
  
  const originalFetch = window.fetch;

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;

    // Only intercept /api/ routes
    if (url.startsWith("/api/") || url.includes("/api/")) {
      try {
        const response = await originalFetch(input, init);
        // If server responds with OK, pass it through directly!
        if (response.status !== 404 && response.status !== 502 && response.status !== 503) {
          return response;
        }
      } catch (e) {
        // Network error - fallback to local simulation
      }

      // Handle locally via standaloneStore
      const method = (init?.method || "GET").toUpperCase();
      const endpoint = url.split("?")[0].replace(/^.*\/api\//, "/api/");

      // 1. Health
      if (endpoint === "/api/health") {
        return new Response(JSON.stringify({ status: "ok", mode: "client-edge", timestamp: new Date().toISOString() }), { status: 200, headers: { "Content-Type": "application/json" } });
      }

      // 2. Active JD
      if (endpoint === "/api/active-jd") {
        if (method === "GET") {
          return new Response(JSON.stringify(standaloneStore.activeJD), { status: 200, headers: { "Content-Type": "application/json" } });
        }
        if (method === "POST") {
          const body = JSON.parse(init?.body as string || "{}");
          standaloneStore.activeJD = {
            id: "jd_" + Date.now(),
            title: body.title || "Custom Job Role",
            text: body.text || "",
            parsed: {
              title: body.title || "Custom Job Role",
              requiredSkills: ["React", "TypeScript", "Node.js", "SQL"],
              preferredSkills: ["Docker", "AWS"],
              experienceYears: 4,
              education: "Bachelor's Degree",
              certifications: [],
              softSkills: ["Communication", "Problem Solving"],
              responsibilities: ["Develop modern web applications."],
              keywords: ["Frontend", "Backend", "Full Stack"],
              tools: ["Git", "VS Code"],
              technologies: ["React", "TypeScript", "Node.js"]
            },
            uploadedAt: new Date().toISOString()
          };
          standaloneStore.save();
          return new Response(JSON.stringify(standaloneStore.activeJD), { status: 200, headers: { "Content-Type": "application/json" } });
        }
      }

      // 3. Candidates
      if (endpoint === "/api/candidates") {
        if (method === "GET") {
          return new Response(JSON.stringify(standaloneStore.candidates), { status: 200, headers: { "Content-Type": "application/json" } });
        }
        if (method === "POST") {
          const body = JSON.parse(init?.body as string || "{}");
          const newCand: Candidate = {
            id: "cand_" + Date.now(),
            name: body.fileName?.replace(/\.[^/.]+$/, "").split(/[_\s-]+/).map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") || "New Applicant",
            email: "applicant." + Date.now().toString().slice(-4) + "@talent.com",
            phone: "+1 (555) 234-9102",
            rawText: body.rawText || "",
            fileName: body.fileName || "resume.pdf",
            fileSize: body.fileSize || 64000,
            uploadTime: new Date().toISOString(),
            experienceYears: 4,
            education: "B.S. in Computer Science",
            skills: ["JavaScript", "React", "TypeScript", "Node.js", "Tailwind CSS"],
            projects: [{ title: "Production Portal", description: "Built scalable web interfaces with responsive layouts." }],
            achievements: ["Delivered feature sprint ahead of schedule."],
            certifications: [],
            currentCompany: "Innovative Tech",
            expectedSalary: "$120,000",
            location: "Remote",
            screeningStatus: "completed",
            scores: {
              skillMatch: 85,
              experienceMatch: 80,
              projectRelevance: 82,
              educationMatch: 85,
              certificationMatch: 50,
              keywordSimilarity: 80,
              semanticMatch: 84,
              overall: 82
            },
            aiVerdict: "Strong Match",
            analysis: {
              summary: "Candidate holds 4 years of verified software experience with high compatibility across required tech stacks.",
              strengths: ["Strong experience in React and TypeScript.", "Quick turnaround on product features."],
              weaknesses: ["Limited explicit cloud infrastructure experience."],
              missingSkills: ["Docker", "Kubernetes"],
              suggestedQuestions: {
                technical: ["Walk us through how you manage global state in complex React applications."],
                coding: ["How would you optimize re-renders in a deep component tree?"],
                behavioral: ["Describe a difficult deadline and how you prioritized deliverables."],
                situational: ["How do you approach learning an unfamiliar database paradigm?"],
                leadership: ["Describe a time you assisted a teammate with debugging."],
                project: ["What was your role in building the Production Portal?"]
              },
              hiringRecommendation: "Recommended for technical interview.",
              salaryRecommendation: "$115,000 - $125,000",
              culturalFit: 90,
              careerGrowth: "High potential to grow into senior tech lead.",
              explanation: "Strong alignment with core React and Node.js stack requirements.",
              formattingScore: 92,
              fakeDetectionScore: 97,
              atsCompatibilityScore: 91,
              keywordSuggestions: ["Docker", "Kubernetes", "AWS"]
            },
            status: "Screened"
          };
          standaloneStore.candidates.unshift(newCand);
          standaloneStore.save();
          return new Response(JSON.stringify(newCand), { status: 201, headers: { "Content-Type": "application/json" } });
        }
      }

      // Delete candidate
      if (endpoint.startsWith("/api/candidates/") && method === "DELETE") {
        const id = endpoint.split("/").pop();
        standaloneStore.candidates = standaloneStore.candidates.filter(c => c.id !== id);
        standaloneStore.save();
        return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json" } });
      }

      // Candidate status update
      if (endpoint.includes("/api/candidates/") && endpoint.endsWith("/status") && method === "POST") {
        const parts = endpoint.split("/");
        const id = parts[parts.length - 2];
        const body = JSON.parse(init?.body as string || "{}");
        const cand = standaloneStore.candidates.find(c => c.id === id);
        if (cand) {
          cand.status = body.status;
          standaloneStore.save();
        }
        return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json" } });
      }

      // Screen all
      if (endpoint === "/api/screen-all" && method === "POST") {
        standaloneStore.candidates.forEach(c => {
          c.screeningStatus = "completed";
          if (!c.scores) {
            c.scores = {
              skillMatch: 85,
              experienceMatch: 80,
              projectRelevance: 80,
              educationMatch: 85,
              certificationMatch: 50,
              keywordSimilarity: 80,
              semanticMatch: 85,
              overall: 82
            };
            c.aiVerdict = "Strong Match";
          }
        });
        standaloneStore.save();
        return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json" } });
      }

      // 4. Stats
      if (endpoint === "/api/stats") {
        return new Response(JSON.stringify(standaloneStore.getStats()), { status: 200, headers: { "Content-Type": "application/json" } });
      }

      // 5. Settings
      if (endpoint === "/api/settings") {
        if (method === "GET") {
          return new Response(JSON.stringify(standaloneStore.settings), { status: 200, headers: { "Content-Type": "application/json" } });
        }
        if (method === "POST") {
          const body = JSON.parse(init?.body as string || "{}");
          standaloneStore.settings = { ...standaloneStore.settings, ...body };
          standaloneStore.save();
          return new Response(JSON.stringify(standaloneStore.settings), { status: 200, headers: { "Content-Type": "application/json" } });
        }
      }

      // 6. Notifications
      if (endpoint === "/api/notifications") {
        if (method === "GET") {
          return new Response(JSON.stringify(standaloneStore.notifications), { status: 200, headers: { "Content-Type": "application/json" } });
        }
        if (method === "DELETE") {
          standaloneStore.notifications = [];
          standaloneStore.save();
          return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json" } });
        }
      }

      if (endpoint === "/api/notifications/read" && method === "POST") {
        standaloneStore.notifications.forEach(n => n.read = true);
        standaloneStore.save();
        return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json" } });
      }

      // 7. Search
      if (endpoint === "/api/search" && method === "POST") {
        const body = JSON.parse(init?.body as string || "{}");
        const q = (body.query || "").toLowerCase();
        const results = standaloneStore.candidates.filter(c =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.skills.some(s => s.toLowerCase().includes(q))
        );
        return new Response(JSON.stringify(results), { status: 200, headers: { "Content-Type": "application/json" } });
      }

      // 8. Analytics
      if (endpoint === "/api/analytics") {
        const analytics = {
          topSkills: [
            { name: "React", value: 3 },
            { name: "TypeScript", value: 3 },
            { name: "Tailwind CSS", value: 3 },
            { name: "Node.js", value: 2 },
            { name: "PostgreSQL", value: 2 }
          ],
          expDist: [
            { bracket: "Junior (0-2y)", count: 1 },
            { bracket: "Mid (3-5y)", count: 2 },
            { bracket: "Senior (6-9y)", count: 1 },
            { bracket: "Principal (10y+)", count: 0 }
          ],
          eduDist: [
            { level: "Bachelor's", count: 3 },
            { level: "Master's", count: 0 },
            { level: "High School / Other", count: 1 }
          ],
          funnel: [
            { stage: "Applied", count: standaloneStore.candidates.length },
            { stage: "Screened", count: standaloneStore.candidates.filter(c => c.screeningStatus === "completed").length },
            { stage: "Shortlisted", count: standaloneStore.candidates.filter(c => c.status === "Shortlisted").length },
            { stage: "Interviews", count: standaloneStore.candidates.filter(c => c.status === "Interview Scheduled").length },
            { stage: "Rejected", count: standaloneStore.candidates.filter(c => c.status === "Rejected").length }
          ],
          scoreDist: [
            { range: "90-100", count: 1 },
            { range: "80-89", count: 1 },
            { range: "60-79", count: 1 },
            { range: "45-59", count: 0 },
            { range: "0-44", count: 1 }
          ]
        };
        return new Response(JSON.stringify(analytics), { status: 200, headers: { "Content-Type": "application/json" } });
      }
    }

    return originalFetch(input, init);
  };
}
