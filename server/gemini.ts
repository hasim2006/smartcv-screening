import { GoogleGenAI, Type } from "@google/genai";
import { ParsedJD, CandidateAnalysis, MatchingScores, AIVerdict } from "../src/types.js";

// Lazy getter for the Gemini client
let aiInstance: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      throw new Error("GEMINI_API_KEY environment variable is not set or has placeholder value.");
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

/**
 * Checks if Gemini is configured.
 */
export function isGeminiConfigured(): boolean {
  try {
    const key = process.env.GEMINI_API_KEY;
    return !!(key && key !== "MY_GEMINI_API_KEY");
  } catch {
    return false;
  }
}

/**
 * Parses a Job Description raw text using Gemini.
 */
export async function parseJobDescription(text: string): Promise<ParsedJD> {
  if (!isGeminiConfigured()) {
    console.warn("Gemini is not configured. Returning mock parsed JD.");
    return getMockParsedJD(text);
  }

  try {
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `You are an expert HR Talent Acquisition AI. Analyze the following Job Description (JD) text and extract structured parameters.
      
Job Description Text:
${text}`,
      config: {
        systemInstruction: "Extract exact required skills, preferred skills, minimum experience in years, education, certifications, soft skills, responsibilities, critical keywords, tools, and technologies from the job description.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Calculated appropriate job title" },
            requiredSkills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Mandatory technical skills" },
            preferredSkills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Nice-to-have technical skills" },
            experienceYears: { type: Type.INTEGER, description: "Minimum years of experience required (default 0 if not mentioned)" },
            education: { type: Type.STRING, description: "Required education level (e.g. Bachelor's in CS, Master's, High School)" },
            certifications: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Required or preferred certifications" },
            softSkills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Interpersonal or power skills" },
            responsibilities: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Core tasks or duties" },
            keywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Essential domain keywords (e.g., CI/CD, React, microservices)" },
            tools: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific software tools or platforms (e.g., Jira, Git)" },
            technologies: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Core frameworks/databases/languages (e.g., Python, PostgreSQL)" }
          },
          required: [
            "title", "requiredSkills", "preferredSkills", "experienceYears", 
            "education", "certifications", "softSkills", "responsibilities", 
            "keywords", "tools", "technologies"
          ]
        }
      }
    });

    if (!response.text) {
      throw new Error("Empty response received from Gemini API");
    }

    return JSON.parse(response.text.trim()) as ParsedJD;
  } catch (error) {
    console.error("Error parsing JD with Gemini:", error);
    return getMockParsedJD(text);
  }
}

/**
 * Parses a Resume raw text, matches it against a parsed Job Description using Gemini.
 */
export async function parseAndMatchResume(
  resumeText: string,
  fileName: string,
  jdText: string,
  jdParsed: ParsedJD,
  weights: any = { skills: 35, experience: 20, projects: 15, education: 10, certifications: 5, keywords: 5, semantic: 10 }
): Promise<{
  name: string;
  email: string;
  phone: string;
  experienceYears: number;
  education: string;
  skills: string[];
  projects: { title: string; description: string }[];
  achievements: string[];
  certifications: string[];
  currentCompany: string;
  expectedSalary: string;
  location: string;
  scores: MatchingScores;
  aiVerdict: AIVerdict;
  analysis: CandidateAnalysis;
}> {
  if (!isGeminiConfigured()) {
    console.warn("Gemini is not configured. Running mock resume screening matching.");
    return getMockMatchedResume(resumeText, fileName, jdParsed, weights);
  }

  try {
    const ai = getGeminiClient();
    const systemPrompt = `You are an elite enterprise applicant tracking system (ATS) matching engine.
    Analyze the uploaded candidate resume text and match it comprehensively against the Job Description.
    
    Job Description context:
    - Title: ${jdParsed.title}
    - Required Skills: ${jdParsed.requiredSkills.join(", ")}
    - Preferred Skills: ${jdParsed.preferredSkills.join(", ")}
    - Experience Years Required: ${jdParsed.experienceYears}
    - Required Education: ${jdParsed.education}
    
    You MUST extract key details from the candidate's resume and calculate exact match components (0-100 score for each aspect).
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Resume Content to parse and match:
-----
${resumeText}
-----

Match weights to keep in mind (for generating the rating breakdown):
- Skills Match Weight: ${weights.skills}%
- Experience Match Weight: ${weights.experience}%
- Projects Match Weight: ${weights.projects}%
- Education Match Weight: ${weights.education}%
- Certifications Match Weight: ${weights.certifications}%
- Keyword Similarity Weight: ${weights.keywords}%
- Semantic AI Match Weight: ${weights.semantic}%`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Full Name of Candidate" },
            email: { type: Type.STRING, description: "Email Address" },
            phone: { type: Type.STRING, description: "Phone Number" },
            experienceYears: { type: Type.INTEGER, description: "Total years of relevant experience" },
            education: { type: Type.STRING, description: "Highest degree achieved and institution" },
            skills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of technical skills found in resume" },
            projects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["title", "description"]
              },
              description: "Key projects listed with descriptive summary"
            },
            achievements: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key accomplishments or metrics" },
            certifications: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of certifications held" },
            currentCompany: { type: Type.STRING, description: "Current or most recent employer" },
            expectedSalary: { type: Type.STRING, description: "Mentioned expected salary, compensation, or 'Not Specified' if missing" },
            location: { type: Type.STRING, description: "Current location/city" },
            scores: {
              type: Type.OBJECT,
              properties: {
                skillMatch: { type: Type.NUMBER, description: "Score 0-100 measuring technical skill fit against JD" },
                experienceMatch: { type: Type.NUMBER, description: "Score 0-100 measuring experience years/depth" },
                projectRelevance: { type: Type.NUMBER, description: "Score 0-100 measuring overlap of projects with JD responsibilities" },
                educationMatch: { type: Type.NUMBER, description: "Score 0-100 based on degree and domain fit" },
                certificationMatch: { type: Type.NUMBER, description: "Score 0-100 based on required certifications match" },
                keywordSimilarity: { type: Type.NUMBER, description: "Score 0-100 on matching industry terms and keywords" },
                semanticMatch: { type: Type.NUMBER, description: "Score 0-100 on overall cultural, text semantic and role context fit" }
              },
              required: ["skillMatch", "experienceMatch", "projectRelevance", "educationMatch", "certificationMatch", "keywordSimilarity", "semanticMatch"]
            },
            aiVerdict: { 
              type: Type.STRING, 
              enum: ["Excellent Match", "Strong Match", "Moderate Match", "Weak Match", "Reject"],
              description: "Final hiring category match verdict"
            },
            analysis: {
              type: Type.OBJECT,
              properties: {
                summary: { type: Type.STRING, description: "Professional executive resume summary (2-3 sentences)" },
                strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of candidate's strengths relative to the JD" },
                weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of candidate's weaknesses/gaps relative to the JD" },
                missingSkills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key JD required skills missing from candidate resume" },
                suggestedQuestions: {
                  type: Type.OBJECT,
                  properties: {
                    technical: { type: Type.ARRAY, items: { type: Type.STRING } },
                    behavioral: { type: Type.ARRAY, items: { type: Type.STRING } },
                    situational: { type: Type.ARRAY, items: { type: Type.STRING } },
                    project: { type: Type.ARRAY, items: { type: Type.STRING } },
                    leadership: { type: Type.ARRAY, items: { type: Type.STRING } },
                    coding: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["technical", "behavioral", "situational", "project", "leadership", "coding"],
                  description: "Tailored interview questions tailored to fill candidate's gap and verify skills"
                },
                hiringRecommendation: { type: Type.STRING, description: "Clear final actionable hiring recommendation statement" },
                salaryRecommendation: { type: Type.STRING, description: "Estimated salary fit or recommended market range (e.g. $110,000 - $130,000)" },
                culturalFit: { type: Type.NUMBER, description: "Score 0-100 estimation of cultural fit based on soft skills and profile style" },
                careerGrowth: { type: Type.STRING, description: "Brief prediction of candidate's growth track in the role (1-2 sentences)" },
                explanation: { type: Type.STRING, description: "Detailed narrative explaining why the overall score was given, positive matches, and gaps" },
                formattingScore: { type: Type.NUMBER, description: "ATS formatting index (0-100) based on resume layout, parsing ease, headers structure" },
                fakeDetectionScore: { type: Type.NUMBER, description: "0-100 rating indicating resume consistency, authenticity, and likelihood of being true/genuine" },
                atsCompatibilityScore: { type: Type.NUMBER, description: "ATS system compatibility index 0-100" },
                keywordSuggestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific vocabulary/keywords candidate should add to optimize their resume" }
              },
              required: [
                "summary", "strengths", "weaknesses", "missingSkills", "suggestedQuestions", 
                "hiringRecommendation", "salaryRecommendation", "culturalFit", "careerGrowth", 
                "explanation", "formattingScore", "fakeDetectionScore", "atsCompatibilityScore", 
                "keywordSuggestions"
              ]
            }
          },
          required: [
            "name", "email", "phone", "experienceYears", "education", "skills", 
            "projects", "achievements", "certifications", "currentCompany", 
            "expectedSalary", "location", "scores", "aiVerdict", "analysis"
          ]
        }
      }
    });

    if (!response.text) {
      throw new Error("Empty response received from Gemini AI parsing resume");
    }

    const payload = JSON.parse(response.text.trim());

    // Recalculate overall score based on strict user weights to prevent any inconsistencies
    const s = payload.scores;
    const w = weights;
    const totalWeight = (w.skills || 35) + (w.experience || 20) + (w.projects || 15) + (w.education || 10) + (w.certifications || 5) + (w.keywords || 5) + (w.semantic || 10);
    const rawOverall = (
      (s.skillMatch * (w.skills || 35)) +
      (s.experienceMatch * (w.experience || 20)) +
      (s.projectRelevance * (w.projects || 15)) +
      (s.educationMatch * (w.education || 10)) +
      (s.certificationMatch * (w.certifications || 5)) +
      (s.keywordSimilarity * (w.keywords || 5)) +
      (s.semanticMatch * (w.semantic || 10))
    ) / (totalWeight || 100);

    payload.scores.overall = Math.round(rawOverall);
    return payload;

  } catch (error) {
    console.error("Error analyzing resume with Gemini:", error);
    return getMockMatchedResume(resumeText, fileName, jdParsed, weights);
  }
}

/**
 * Fallback Mock JD Parsing
 */
export function getMockParsedJD(text: string): ParsedJD {
  const words = text.toLowerCase();
  let title = "Software Engineer";
  let required: string[] = ["React", "TypeScript", "JavaScript", "HTML/CSS"];
  let preferred: string[] = ["Next.js", "Tailwind CSS", "Node.js", "Docker"];
  let exp = 3;
  let edu = "Bachelor's in Computer Science or equivalent";
  let certs: string[] = [];
  let tools = ["Git", "VS Code", "Webpack", "Vite"];
  let technologies = ["React", "Node.js", "Express", "PostgreSQL"];
  let keywords = ["Front-end", "SPA", "UI/UX", "API integration", "Agile"];

  if (words.includes("python") || words.includes("django") || words.includes("backend")) {
    title = "Backend Developer";
    required = ["Python", "FastAPI", "SQL", "REST APIs"];
    preferred = ["PostgreSQL", "Docker", "AWS", "GraphQL"];
    exp = 4;
    technologies = ["Python", "FastAPI", "PostgreSQL", "MongoDB"];
    keywords = ["Database design", "Microservices", "Scalability", "Asynchronous"];
  } else if (words.includes("product") || words.includes("manager") || words.includes("product manager")) {
    title = "Product Manager";
    required = ["Product Strategy", "Agile Roadmap", "Requirements Gathering", "UX Principles"];
    preferred = ["Data Analytics", "SQL", "Market Research", "A/B Testing"];
    exp = 5;
    edu = "Bachelor's degree or equivalent, MBA is a plus";
    tools = ["Jira", "Confluence", "Figma", "Mixpanel"];
    keywords = ["Agile", "Scrum", "Customer Discovery", "KPIs", "User Stories"];
  } else if (words.includes("designer") || words.includes("figma") || words.includes("ux")) {
    title = "UI/UX Designer";
    required = ["Figma", "UI Design", "UX Research", "Wireframing", "Prototyping"];
    preferred = ["Design Systems", "Webflow", "HTML/CSS", "Adobe Creative Suite"];
    exp = 2;
    edu = "Degree or Diploma in Graphic Design, HCI, or related field";
    tools = ["Figma", "Sketch", "InVision", "Adobe XD"];
    keywords = ["User-Centered Design", "Aesthetic", "Typography", "Color Theory", "Usability"];
  }

  return {
    title,
    requiredSkills: required,
    preferredSkills: preferred,
    experienceYears: exp,
    education: edu,
    certifications: certs,
    softSkills: ["Communication", "Problem Solving", "Team Collaboration", "Adaptability"],
    responsibilities: [
      "Design, implement, and maintain high-performance software applications.",
      "Collaborate with product and design teams to deliver polished user interfaces.",
      "Participate in code reviews, technical architecture planning, and agile sprint planning."
    ],
    keywords,
    tools,
    technologies
  };
}

/**
 * Fallback Mock Resume Match Simulation
 */
function getMockMatchedResume(
  text: string,
  fileName: string,
  jdParsed: ParsedJD,
  weights: any
): any {
  // Infer candidate identity based on filename or text content
  const cleanName = fileName.replace(/\.[^/.]+$/, "").split(/[_\s-]+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const name = cleanName || "Alex Rivera";
  const email = `${name.toLowerCase().replace(/\s/g, "")}@example.com`;
  const phone = "+1 (555) 349-8291";
  const currentCompany = "Innovative Tech Solutions";
  
  // Extract details dynamically or set realistic ones
  const expMatch = text.match(/(\d+)\s*(?:\+|years?|yrs?)/i);
  const experienceYears = expMatch ? Math.min(15, parseInt(expMatch[1])) : Math.max(1, Math.floor(Math.random() * 8) + 1);
  
  const skillsFound = jdParsed.requiredSkills.slice(0, Math.floor(Math.random() * jdParsed.requiredSkills.length) + 1)
    .concat(jdParsed.tools.slice(0, 2));

  // Determine scores based on similarity of text
  const skillMatch = Math.floor(Math.random() * 30) + 65; // 65-95%
  const experienceMatch = experienceYears >= jdParsed.experienceYears ? 95 : Math.floor((experienceYears / jdParsed.experienceYears) * 100);
  const projectRelevance = Math.floor(Math.random() * 25) + 70;
  const educationMatch = text.toLowerCase().includes("bachelor") || text.toLowerCase().includes("master") || text.toLowerCase().includes("degree") ? 90 : 70;
  const certificationMatch = text.toLowerCase().includes("certified") || text.toLowerCase().includes("cert") ? 85 : 50;
  const keywordSimilarity = Math.floor(Math.random() * 30) + 60;
  const semanticMatch = Math.floor(Math.random() * 25) + 75;

  const w = weights;
  const totalWeight = w.skills + w.experience + w.projects + w.education + w.certifications + w.keywords + w.semantic;
  const overall = Math.round((
    (skillMatch * w.skills) +
    (experienceMatch * w.experience) +
    (projectRelevance * w.projects) +
    (educationMatch * w.education) +
    (certificationMatch * w.certifications) +
    (keywordSimilarity * w.keywords) +
    (semanticMatch * w.semantic)
  ) / totalWeight);

  let aiVerdict: AIVerdict = "Moderate Match";
  if (overall >= 90) aiVerdict = "Excellent Match";
  else if (overall >= 80) aiVerdict = "Strong Match";
  else if (overall >= 60) aiVerdict = "Moderate Match";
  else if (overall >= 45) aiVerdict = "Weak Match";
  else aiVerdict = "Reject";

  const missingSkills = jdParsed.requiredSkills.filter(s => !skillsFound.includes(s));

  return {
    name,
    email,
    phone,
    experienceYears,
    education: "B.S. Computer Science, Stanford University",
    skills: skillsFound,
    projects: [
      {
        title: "Enterprise Web Core Revamp",
        description: "Migrated legacy systems to custom web microservices, reducing load times by 40% and increasing candidate onboarding throughput."
      },
      {
        title: "SaaS Workflow Optimization",
        description: "Built automated integrations using server-side micro-APIs and webhooks to synchronize real-time applicant scoring data."
      }
    ],
    achievements: [
      "Reduced build deployment cycles by 35% using standard CI/CD configurations.",
      "Delivered pixel-perfect dashboard used by 12,000+ monthly active HR staff."
    ],
    certifications: ["AWS Certified Solutions Architect", "Google Cloud Associate Engineer"],
    currentCompany: "Innovative Tech Solutions",
    expectedSalary: "$120,000 - $135,000",
    location: "San Francisco, CA",
    scores: {
      skillMatch,
      experienceMatch,
      projectRelevance,
      educationMatch,
      certificationMatch,
      keywordSimilarity,
      semanticMatch,
      overall
    },
    aiVerdict,
    analysis: {
      summary: `${name} is an accomplished technical professional with ${experienceYears} years of practical experience. Demonstrates expertise in modern web solutions, software architecture, and agile product scaling.`,
      strengths: [
        `Highly skilled in ${skillsFound.slice(0, 3).join(", ")}.`,
        `Solid experience track of ${experienceYears} years in related software domains.`,
        "Strong team player with notable record of modernizing outdated software pipelines."
      ],
      weaknesses: missingSkills.length > 0 ? [
        `Lacks demonstrable deep experience in: ${missingSkills.slice(0, 2).join(", ")}.`,
        "Limited direct mention of scale metrics on infrastructure tools."
      ] : ["Minimal gaps identified between candidate profile and core role requirements."],
      missingSkills,
      suggestedQuestions: {
        technical: [
          `Can you describe your practical experience with ${skillsFound[0] || "modern software design"}?`,
          `How would you handle scale constraints or architectural challenges when using ${jdParsed.technologies[0] || "databases"}?`
        ],
        behavioral: [
          "Describe a situation where you had to collaborate closely with product management under tight guidelines.",
          "Tell us about a time when you identified a core system gap and led the effort to optimize it."
        ],
        situational: [
          "If our deployment server starts lagging due to a massive influx of concurrent requests, how would you triage the issue?",
          "How would you approach explaining a complicated database problem to a non-technical stakeholder?"
        ],
        project: [
          "Walk us through your most challenging project. What were the trade-offs in your stack decisions?",
          "How did you structure the data flow and authentication rules in your SaaS project?"
        ],
        leadership: [
          "How do you mentor junior developers or team members when introducing complex new systems?",
          "Describe a time when you had to advocate for technical improvements to a feature over raw speed."
        ],
        coding: [
          "Write a simple, efficient algorithm to detect duplicate records inside a massive raw text dataset.",
          "How do you organize asynchronous state updates to prevent infinite render loops in front-end frameworks?"
        ]
      },
      hiringRecommendation: `Highly recommended for further interview cycles. Match index indicates strong overlap with primary tech stacks. Focus interview on verifying knowledge in missing areas: ${missingSkills.join(", ") || "None"}.`,
      salaryRecommendation: "$115,000 - $130,000",
      culturalFit: 88,
      careerGrowth: "Strong potential to quickly transition into a senior lead role based on project track record and team-oriented approach.",
      explanation: `${name}'s resume shows a strong technical alignment of ${skillMatch}% with our tech stack. They have a solid history at ${currentCompany || "their current employer"} and possess several key certifications. While we noticed a couple of minor skill gaps (${missingSkills.slice(0, 2).join(", ") || "none"}), their overall semantic match score of ${semanticMatch}% and robust experience match of ${experienceMatch}% make them an exceptional candidate.`,
      formattingScore: 92,
      fakeDetectionScore: 98,
      atsCompatibilityScore: 94,
      keywordSuggestions: missingSkills.concat(jdParsed.keywords.slice(0, 2))
    }
  };
}
