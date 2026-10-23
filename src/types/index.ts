export interface ParsedJD {
  title: string;
  requiredSkills: string[];
  preferredSkills: string[];
  experienceYears: number;
  education: string;
  certifications: string[];
  softSkills: string[];
  responsibilities: string[];
  keywords: string[];
  tools: string[];
  technologies: string[];
}

export interface JobDescription {
  id: string;
  text: string;
  title: string;
  parsed: ParsedJD | null;
  uploadedAt: string;
}

export interface Project {
  title: string;
  description: string;
}

export interface SuggestedQuestions {
  technical: string[];
  behavioral: string[];
  situational: string[];
  project: string[];
  leadership: string[];
  coding: string[];
}

export interface CandidateAnalysis {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  suggestedQuestions: SuggestedQuestions;
  hiringRecommendation: string;
  salaryRecommendation: string;
  culturalFit: number; // 0 - 100
  careerGrowth: string;
  explanation: string;
  formattingScore: number; // ATS formatting score 0-100
  fakeDetectionScore: number; // 0-100 (probability of being genuine)
  atsCompatibilityScore: number; // 0-100
  keywordSuggestions: string[];
}

export interface MatchingScores {
  skillMatch: number;      // 35%
  experienceMatch: number; // 20%
  projectRelevance: number;// 15%
  educationMatch: number;  // 10%
  certificationMatch: number; // 5%
  keywordSimilarity: number;  // 5%
  semanticMatch: number;      // 10%
  overall: number;
}

export type AIVerdict = 'Excellent Match' | 'Strong Match' | 'Moderate Match' | 'Weak Match' | 'Reject';
export type CandidateStatus = 'Applied' | 'Screened' | 'Shortlisted' | 'Interview Scheduled' | 'Rejected';

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  rawText: string;
  fileName: string;
  fileSize: number;
  uploadTime: string;
  experienceYears: number;
  education: string;
  skills: string[];
  projects: Project[];
  achievements: string[];
  certifications: string[];
  currentCompany: string;
  expectedSalary: string;
  location: string;
  screeningStatus: 'pending' | 'processing' | 'completed' | 'failed';
  scores: MatchingScores | null;
  aiVerdict: AIVerdict | null;
  analysis: CandidateAnalysis | null;
  status: CandidateStatus;
}

export interface ScreeningSettings {
  weights: {
    skills: number;       // default 35
    experience: number;   // default 20
    projects: number;     // default 15
    education: number;    // default 10
    certifications: number;// default 5
    keywords: number;     // default 5
    semantic: number;     // default 10
  };
  shortlistThreshold: number; // default 75
  theme?: 'dark-futuristic' | 'neon-matrix' | 'luxe-slate';
  notificationsEnabled: boolean;
  language?: 'en' | 'es' | 'de' | 'fr';
  deepEvaluationEnabled?: boolean;
  languagePreference?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}

export interface DashboardStats {
  totalCandidates: number;
  shortlisted: number;
  rejected: number;
  averageMatchScore: number;
  topCandidate: string;
  processingStatus: string;
}

export type AppSettings = ScreeningSettings;
export type ScoringWeights = ScreeningSettings["weights"];

