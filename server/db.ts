import fs from "fs";
import path from "path";
import { Candidate, JobDescription, ScreeningSettings, AppNotification } from "../src/types.js";
import { parseJobDescription, parseAndMatchResume, isGeminiConfigured, getGeminiClient, getMockParsedJD } from "./gemini.js";
import { Type } from "@google/genai";

const STORE_FILE = path.join(process.cwd(), "data-store.json");

interface DataStoreSchema {
  activeJD: JobDescription | null;
  candidates: Candidate[];
  settings: ScreeningSettings;
  notifications: AppNotification[];
}

const DEFAULT_SETTINGS: ScreeningSettings = {
  weights: {
    skills: 35,
    experience: 20,
    projects: 15,
    education: 10,
    certifications: 5,
    keywords: 5,
    semantic: 10
  },
  shortlistThreshold: 75,
  theme: 'dark-futuristic',
  notificationsEnabled: true,
  language: 'en'
};

const INITIAL_JD_TEXT = `Job Title: Senior Full Stack Engineer

Position Overview:
We are looking for a Senior Full Stack Engineer to design, build, and scale our core SaaS platform. You will work across the entire stack, from building responsive React-based client interfaces to designing high-performance Node.js microservices and optimizing PostgreSQL database schemas.

Required Technical Skills:
- React.js, TypeScript, and modern state management (Redux, Context API, or Zustand)
- Node.js, Express, and building robust RESTful / GraphQL APIs
- Database design, optimization, and querying in PostgreSQL
- Modern CSS frameworks, particularly Tailwind CSS
- Source control using Git and version-control workflows

Preferred Skills & Technologies:
- Next.js and server-side rendering (SSR) frameworks
- Containerization using Docker and orchestration with Kubernetes
- Experience with cloud platforms (AWS, Google Cloud, or Azure)
- Setting up and managing CI/CD pipelines (GitHub Actions, GitLab CI)

Experience & Education:
- Minimum of 5 years of professional experience in software development
- Bachelor’s degree in Computer Science, Software Engineering, or related technical field (or equivalent work experience)

Core Responsibilities:
- Architect and develop secure, reusable, and clean front-end and back-end components
- Improve database and system query performance to ensure fast, responsive page loads
- Collaborate with Product Managers and Designers to transform wireframes into high-fidelity products
- Conduct constructive code reviews and mentor junior engineering staff
- Manage and streamline deployment processes to cloud environments`;

const SEED_CANDIDATES: Candidate[] = [
  {
    id: "cand_1",
    name: "Sarah Jenkins",
    email: "sarah.jenkins@techdev.io",
    phone: "+1 (415) 882-9012",
    fileName: "sarah_jenkins_resume.pdf",
    fileSize: 142050,
    rawText: `Sarah Jenkins
Senior Full Stack Developer | San Francisco, CA
Email: sarah.jenkins@techdev.io | Phone: +1 (415) 882-9012
Web: github.com/sjenkins-dev | LinkedIn: linkedin.com/in/sarah-j-developer

PROFESSIONAL SUMMARY:
Accomplished Full Stack Software Engineer with 6+ years of expertise in building enterprise SaaS platforms, high-performance web APIs, and responsive React applications. Passionate about TypeScript, database scaling, and automating deployment pipelines. Proven record of mentoring junior staff and delivering pixel-perfect interfaces.

TECHNICAL SKILLS:
- Languages: TypeScript, JavaScript (ES6+), Python, SQL, HTML5, CSS3
- Frontend: React.js, Next.js, Redux Toolkit, Zustand, Tailwind CSS, Webpack, Vite
- Backend: Node.js, Express, FastAPI, REST APIs, GraphQL
- Databases: PostgreSQL, Redis, MongoDB, Prisma ORM
- DevOps: Docker, AWS (S3, EC2, ECS, RDS), GitHub Actions (CI/CD), Git

WORK EXPERIENCE:
Lead Full Stack Engineer | OptimaSaaS Inc. | 2023 - Present
- Architected the core dashboard system using React, TypeScript, and Tailwind CSS, improving client load performance by 45%.
- Formulated and deployed containerized Node.js backend microservices using Docker and Express, integrating third-party payment and billing APIs.
- Optimized slow PostgreSQL queries and schema indices, reducing API response times by 30%.
- Promoted to Lead after delivering critical high-availability database migration. Mentored 4 junior engineers on best practices in clean code and testing.

Senior Software Developer | Nexus Cloud Apps | 2020 - 2023
- Implemented responsive responsive frontend views using React and Next.js paired with styled Tailwind templates.
- Created robust REST API routes in Node.js/Express backed by Redis cache buffers, facilitating 15,000+ concurrent requests.
- Set up automated CI/CD workflows using GitHub Actions, trimming production release cycles from 2 weeks to daily deployments.
- Conducted regular constructive code reviews ensuring 100% test coverage using Jest and React Testing Library.

EDUCATION:
B.S. in Computer Science | University of California, Berkeley | 2016 - 2020

PROJECTS:
- CollabCanvas: Real-time interactive team canvas using React, Canvas APIs, WebSockets, and Redis.
- ScaleData: High-performance data ingestion pipeline written in Node.js streaming CSV databases to PostgreSQL schemas.

CERTIFICATIONS:
- AWS Certified Solutions Architect - Professional
- Certified ScrumMaster (CSM)`,
    uploadTime: "2026-07-15T10:12:00Z",
    experienceYears: 6,
    education: "B.S. in Computer Science, UC Berkeley",
    skills: ["TypeScript", "JavaScript", "React.js", "Next.js", "Tailwind CSS", "Node.js", "Express", "PostgreSQL", "Docker", "AWS", "Git"],
    projects: [
      { title: "CollabCanvas", description: "Real-time interactive team canvas using React, Canvas APIs, WebSockets, and Redis." },
      { title: "ScaleData", description: "High-performance data ingestion pipeline written in Node.js streaming CSV databases to PostgreSQL schemas." }
    ],
    achievements: [
      "Architected OptimaSaaS dashboard improving page load performance by 45%.",
      "Optimized PostgreSQL queries reducing backend latency by 30%.",
      "Designed automatic CI/CD workflows using GitHub Actions to deploy daily."
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
      certificationMatch: 100,
      keywordSimilarity: 90,
      semanticMatch: 93,
      overall: 94
    },
    aiVerdict: "Excellent Match",
    analysis: {
      summary: "Sarah Jenkins is an outstanding Senior Full Stack Engineer with 6+ years of experience. She demonstrates exceptional depth in TypeScript, React, Node.js, and PostgreSQL database optimization, matching perfectly with all required and preferred credentials.",
      strengths: [
        "6 years of robust professional experience exceeding the 5-year requirement.",
        "Deep expertise in React, TypeScript, Tailwind, Node.js, and PostgreSQL matching 100% of the core stack.",
        "Proven leadership and mentoring track record coupled with strong cloud-native experience in Docker and AWS.",
        "Holds a B.S. in Computer Science from UC Berkeley."
      ],
      weaknesses: [
        "Limited direct experience with Kubernetes orchestration, though she has solid Docker experience."
      ],
      missingSkills: ["Kubernetes"],
      suggestedQuestions: {
        technical: [
          "Can you explain your strategy for optimizing slow PostgreSQL queries and how you determined which indexes to build?",
          "How do you structure global state and server caching in Next.js applications to support heavy read-write concurrency?"
        ],
        behavioral: [
          "Describe a time when you mentored a struggling junior developer. How did you structure your feedback?",
          "How do you resolve architectural disagreements between engineering and product management?"
        ],
        situational: [
          "If our Next.js backend server begins throttling under load during peak traffic, what are your immediate triage steps?",
          "How would you approach migrating a legacy monolithic database structure to isolated microservices?"
        ],
        project: [
          "In CollabCanvas, how did you handle data synchronization over WebSockets to prevent overlapping canvas edits from different users?",
          "Walk us through the data validation and retry policies you built in your ScaleData pipeline."
        ],
        leadership: [
          "What is your philosophy on maintainable software architecture and establishing technical standards across teams?",
          "Describe how you successfully advocated for technical debt remediation to business stakeholders."
        ],
        coding: [
          "Write a thread-safe caching wrapper using TypeScript to store API response payloads in memory.",
          "Describe how you would design an efficient database schema to log and audit user actions."
        ]
      },
      hiringRecommendation: "Strong hire recommendation. Her technical depth, DevOps automation experience, and past lead roles make her an immediate asset for leading complex full-stack features.",
      salaryRecommendation: "$140,000 - $155,000",
      culturalFit: 96,
      careerGrowth: "Highly likely to grow into an Engineering Manager or Principal Architect role within 18-24 months.",
      explanation: "Sarah's profile matches nearly every single indicator on the JD. Her background at OptimaSaaS showcases her capacity to scale systems and optimize database structures. Coupled with her Berkeley CS degree and AWS Certification, she stands out as a premier candidate.",
      formattingScore: 95,
      fakeDetectionScore: 99,
      atsCompatibilityScore: 98,
      keywordSuggestions: ["Kubernetes", "GraphQL API design"]
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
    rawText: `Marcus Chen
Full Stack Web Engineer - Seattle, WA
Email: marcus.chen.codes@gmail.com | Phone: +1 (206) 745-9311 | Web: marcuschen.dev

PROFESSIONAL EXPERIENCE Summary:
Dynamic Full Stack Developer with 5 years of experience specializing in Node.js backends, React SPAs, and database architecture. Proven experience building and designing scalable microservices on AWS and driving frontend modernization.

TECHNICAL TOOLBELT:
- Frontend: React, Redux, Tailwind CSS, HTML5, CSS3, JavaScript
- Backend: Node.js, Express, Restful API, RESTful services, GraphQL
- Databases: PostgreSQL, MySQL, Redis, SQL Server
- Tools & Cloud: AWS (EC2, S3, RDS), Docker, Git, CI/CD, JIRA

EMPLOYMENT HISTORY:
Senior Full Stack Engineer | Peak Retail Apps | 2024 - Present
- Built the merchant analytics dashboard using React, Tailwind, and chart utilities, increasing user engagement by 25%.
- Developed RESTful API structures using Node.js/Express, supporting 50+ merchant partner endpoints.
- Designed database migrations and normalized PostgreSQL tables, resolving concurrency locks on transactional tables.
- Implemented robust user authentication schemas using JWT and secure cookies.

Software Developer | CloudSpace Sol | 2021 - 2024
- Engineered core administrative panels with React, Redux, and custom CSS elements.
- Maintained backend microservices in Node.js, improving unit test coverage to 85% with Mocha/Chai.
- Configured continuous integration workflows with GitLab CI and Docker, accelerating delivery of minor patches.

EDUCATION:
B.S. in Software Engineering | Seattle University | 2017 - 2021

PROJECTS:
- StoreAnalytics: Automated pipeline capturing merchant inventory events and storing analytics aggregates.
- ExpressServerSeed: Reusable Node.js Express scaffolding with pre-configured JWT auth and PostgreSQL wrappers.`,
    uploadTime: "2026-07-15T11:45:00Z",
    experienceYears: 5,
    education: "B.S. in Software Engineering, Seattle University",
    skills: ["JavaScript", "React", "Redux", "Tailwind CSS", "Node.js", "Express", "PostgreSQL", "AWS", "Docker", "Git"],
    projects: [
      { title: "StoreAnalytics", description: "Automated pipeline capturing merchant inventory events and storing analytics aggregates." },
      { title: "ExpressServerSeed", description: "Reusable Node.js Express scaffolding with pre-configured JWT auth and PostgreSQL wrappers." }
    ],
    achievements: [
      "Designed retail analytics dashboard in React increasing merchant engagement by 25%.",
      "Resolved heavy concurrency transaction locks in PostgreSQL.",
      "Achieved 85% test coverage in core Node.js backend services."
    ],
    certifications: [],
    currentCompany: "Peak Retail Apps",
    expectedSalary: "$130,000",
    location: "Seattle, WA",
    screeningStatus: "completed",
    scores: {
      skillMatch: 88,
      experienceMatch: 90,
      projectRelevance: 85,
      educationMatch: 90,
      certificationMatch: 20,
      keywordSimilarity: 82,
      semanticMatch: 85,
      overall: 83
    },
    aiVerdict: "Strong Match",
    analysis: {
      summary: "Marcus Chen is a skilled Full Stack Developer with 5 years of experience. He is highly proficient in the core React, Tailwind, Node.js, and PostgreSQL stack. He holds solid experience with AWS and Docker, but is missing certifications or Next.js background.",
      strengths: [
        "Meets the 5-year experience requirement precisely.",
        "Demonstrated strength in PostgreSQL table normalization and concurrent database troubleshooting.",
        "Solid front-end engineering record using React and Tailwind CSS."
      ],
      weaknesses: [
        "Lacks formal certifications like AWS or Agile credentials.",
        "No direct Next.js, SSR, or TypeScript experience explicitly declared in the text, although React and Node.js are solid."
      ],
      missingSkills: ["TypeScript", "Next.js", "Certifications"],
      suggestedQuestions: {
        technical: [
          "You mentioned using Redux for state management. How do you decide between Redux and native Context API in smaller to medium apps?",
          "How do you handle database connection pooling and query timeouts in Node.js when connecting to PostgreSQL?"
        ],
        behavioral: [
          "Tell us about a time you had to deal with a database concurrency lock in production. What was your analysis and resolution?",
          "How do you organize your day when balancing active UI features with database normalization tasks?"
        ],
        situational: [
          "If we asked you to migrate a React app to Next.js to improve SEO and load time, what structural changes would you anticipate?",
          "How would you approach introducing TypeScript to an existing pure-JavaScript Node.js codebase?"
        ],
        project: [
          "In StoreAnalytics, how did you handle backpressure when digesting massive streams of inventory events?",
          "How did you secure JWT tokens in your ExpressServerSeed to prevent XSS and CSRF vectors?"
        ],
        leadership: [
          "How do you share technical learnings or code improvements with your peers?",
          "What is your approach to handling negative reviews on your code submissions?"
        ],
        coding: [
          "Write a simple middleware in Express that sanitizes incoming request payloads to prevent SQL injection.",
          "Write a React custom hook to track window resizing and throttle the updates."
        ]
      },
      hiringRecommendation: "Highly viable candidate. He has strong practical, on-the-ground experience with relational databases and backend services. We should test his familiarity with TypeScript during the technical phone screening.",
      salaryRecommendation: "$120,000 - $130,000",
      culturalFit: 92,
      careerGrowth: "With guidance on modern cloud structures and TypeScript, Marcus will quickly excel into a senior engineering leader.",
      explanation: "Marcus is a strong candidate whose 5-year history directly aligns with our core stack. He has resolved practical database scale problems and modern frontend dashboards. His score is slightly trimmed due to missing TypeScript and certifications, but his foundational engineering skills are solid.",
      formattingScore: 88,
      fakeDetectionScore: 96,
      atsCompatibilityScore: 90,
      keywordSuggestions: ["TypeScript", "Next.js", "CI/CD Actions", "Jest testing"]
    },
    status: "Screened"
  },
  {
    id: "cand_3",
    name: "Priya Patel",
    email: "priya.patel@webdevs.com",
    phone: "+1 (650) 233-4152",
    fileName: "priya_patel_resume.txt",
    fileSize: 52140,
    rawText: `Priya Patel
React Developer - Palo Alto, CA
Email: priya.patel@webdevs.com | Phone: +1 (650) 233-4152

SUMMARY:
Highly creative Front End Developer with 4 years of experience specialized in building beautiful, accessible React web applications. Fluent in Tailwind CSS, modern state managers, and component-driven styling. Looking to expand into Full Stack roles.

SKILLS:
- Frontend: React, Redux, TypeScript, JavaScript (ES6), HTML5, CSS3, Tailwind CSS, SASS
- Tools: Git, Webpack, Figma, Adobe XD
- Familiarity: Node.js, Express, MongoDB

EXPERIENCE:
Front-End Engineer | PixelPerfect Web Agency | 2022 - Present
- Developed 15+ highly responsive customer portal websites using React, TypeScript, and Tailwind CSS.
- Collaborated with design teams in Figma to establish scalable components and a reusable UI design system.
- Refactored legacy CSS to Tailwind utility classes, cutting total stylesheet payloads by 60%.
- Improved website accessibility score to 100 on Lighthouse audits by writing semantic markup.

Junior Web Developer | TechConsult Corp | 2020 - 2022
- Created landing pages and corporate sites using HTML, CSS, JavaScript, and React components.
- Maintained source code using Git and participated in agile sprint rituals.
- Provided client support and resolved browser compatibility bugs across mobile and desktop.

EDUCATION:
B.A. in Interactive Media & Web Design | San Jose State University | 2016 - 2020`,
    uploadTime: "2026-07-15T12:30:00Z",
    experienceYears: 4,
    education: "B.A. in Interactive Media & Web Design, San Jose State University",
    skills: ["React", "TypeScript", "JavaScript", "Tailwind CSS", "SASS", "Git", "Figma"],
    projects: [],
    achievements: [
      "Built 15+ responsive portal websites using React and Tailwind CSS.",
      "Refactored legacy stylesheets to Tailwind, reducing overall bundle size by 60%.",
      "Achieved 100% Lighthouse accessibility ratings across multiple client sites."
    ],
    certifications: [],
    currentCompany: "PixelPerfect Web Agency",
    expectedSalary: "$105,000",
    location: "Palo Alto, CA",
    screeningStatus: "completed",
    scores: {
      skillMatch: 70,
      experienceMatch: 70,
      projectRelevance: 55,
      educationMatch: 60,
      certificationMatch: 10,
      keywordSimilarity: 64,
      semanticMatch: 70,
      overall: 66
    },
    aiVerdict: "Moderate Match",
    analysis: {
      summary: "Priya Patel is an excellent Front End Developer with 4 years of experience. She possesses strong skills in React, TypeScript, and Tailwind CSS, but is missing professional backend credentials, SQL database experience, and meeting the 5-year seniority threshold.",
      strengths: [
        "Exceptional modern front-end styling skills with Tailwind CSS and a strong eye for UI/UX.",
        "Fluency in TypeScript and React component design systems.",
        "Excellent track record in web accessibility (A11y) and Lighthouse performance optimization."
      ],
      weaknesses: [
        "Lacks practical, professional backend experience with Node.js and Express.",
        "Has zero explicit experience with PostgreSQL, SQL queries, or relational database optimization.",
        "Experience of 4 years is slightly below the 5-year minimum requirement."
      ],
      missingSkills: ["Node.js", "Express", "PostgreSQL", "Docker", "DevOps"],
      suggestedQuestions: {
        technical: [
          "You have great frontend experience, but how would you approach building a secure POST endpoint in Node.js/Express?",
          "How would you query a relational database like PostgreSQL compared to a NoSQL database like MongoDB?"
        ],
        behavioral: [
          "Tell us about a time you had to work with a backend engineer who provided a slow or poorly formatted API. How did you communicate?",
          "Why are you looking to transition from front-end into a full-stack engineering role?"
        ],
        situational: [
          "If a design in Figma uses layout layouts that are extremely difficult to represent in standard responsive HTML, how do you handle it?",
          "How would you handle caching backend API data inside a React application to avoid unnecessary re-fetches?"
        ],
        project: [
          "Walk us through how you designed a reusable form component that validates inputs dynamically.",
          "Describe how you structured your styles and themes when building a multi-brand UI design system."
        ],
        leadership: [
          "How do you ensure web accessibility guidelines are respected in collaborative projects?",
          "How do you collaborate with designers to bridge the gap between design mockups and actual React code?"
        ],
        coding: [
          "Write a simple React custom hook that handles fetching data from a REST API with loading and error states.",
          "Describe how you would implement a debounce function in TypeScript to limit keypress event firing."
        ]
      },
      hiringRecommendation: "Consider as a junior-to-mid full-stack or strong front-end specialist. Her visual craft and TypeScript skills are great, but she would require technical mentorship on the server and database architecture.",
      salaryRecommendation: "$95,000 - $110,000",
      culturalFit: 94,
      careerGrowth: "Highly trainable on backend skills. Under senior engineering guidance, she can transition into a solid full-stack dev in 12 months.",
      explanation: "Priya's frontend qualifications are outstanding, aligning perfectly with our React/Tailwind frontend layout needs. However, she lacks critical backend engineering metrics, including SQL databases and Express microservices. Additionally, she has 4 years of experience, falling just below the senior threshold.",
      formattingScore: 90,
      fakeDetectionScore: 98,
      atsCompatibilityScore: 88,
      keywordSuggestions: ["Node.js", "SQL queries", "REST API integration", "PostgreSQL schema design"]
    },
    status: "Applied"
  },
  {
    id: "cand_4",
    name: "John Smith",
    email: "john.smith.dev@yahoo.com",
    phone: "+1 (312) 555-0199",
    fileName: "john_smith_resume.pdf",
    fileSize: 110450,
    rawText: `John Smith
Web Developer | Chicago, IL
Email: john.smith.dev@yahoo.com | Phone: +1 (312) 555-0199

OBJECTIVE:
Enthusiastic developer seeking a Web Engineering role to utilize skills in HTML, CSS, PHP, WordPress, and JavaScript.

TECHNICAL KNOWLEDGE:
- Languages: PHP, JavaScript, SQL, HTML5, CSS3, jQuery
- CMS & Frameworks: WordPress, Drupal, Bootstrap, basic React
- Tools: Git, cPanel, phpMyAdmin

WORK BACKGROUND:
Web Developer | Apex Creative Agencies | 2021 - Present
- Designed and updated corporate WordPress and Drupal sites, managing themes and plugins.
- Built responsive user interfaces using HTML, CSS, Bootstrap, and simple jQuery elements.
- Setup MySQL database structures using phpMyAdmin and executed simple SQL select statements.
- Managed server configurations using cPanel and synchronized updates using Git.

IT Support Tech | Heartland Systems | 2019 - 2021
- Resolved local company network failures, configured desktop environments, and maintained internal wiki directories.

EDUCATION:
A.S. in Computer Information Systems | Oakton Community College | 2019`,
    uploadTime: "2026-07-15T13:10:00Z",
    experienceYears: 5,
    education: "A.S. in Computer Information Systems, Oakton Community College",
    skills: ["JavaScript", "HTML5", "CSS3", "PHP", "WordPress", "MySQL", "Bootstrap", "Git"],
    projects: [],
    achievements: [
      "Successfully deployed and updated 20+ corporate WordPress sites.",
      "Designed layouts in HTML/CSS/Bootstrap for local retail clients."
    ],
    certifications: [],
    currentCompany: "Apex Creative Agencies",
    expectedSalary: "$85,000",
    location: "Chicago, IL",
    screeningStatus: "completed",
    scores: {
      skillMatch: 40,
      experienceMatch: 60,
      projectRelevance: 35,
      educationMatch: 45,
      certificationMatch: 0,
      keywordSimilarity: 30,
      semanticMatch: 42,
      overall: 45
    },
    aiVerdict: "Weak Match",
    analysis: {
      summary: "John Smith is a Web Developer with 5 years of experience, primarily focused on PHP, WordPress CMS, Bootstrap, and basic MySQL structures. He lacks modern JS/TS full-stack credentials (React, Node.js, TypeScript, PostgreSQL) required for this senior SaaS engineering position.",
      strengths: [
        "Solid experience managing content management systems (WordPress/Drupal).",
        "Practical understanding of basic SQL operations and relational table querying (MySQL).",
        "Experience building responsive web views with Bootstrap."
      ],
      weaknesses: [
        "Lacks modern JavaScript ecosystem proficiency: no professional React, Node.js, TypeScript, or Express experience.",
        "Relies heavily on legacy Bootstrap and jQuery libraries instead of modern utility frameworks like Tailwind CSS.",
        "Education background is an Associate degree, which is lower than the preferred Bachelor's in CS."
      ],
      missingSkills: ["TypeScript", "React.js", "Node.js", "Tailwind CSS", "PostgreSQL", "Docker", "AWS"],
      suggestedQuestions: {
        technical: [
          "Can you describe your experience with modern JavaScript features (ES6+), like Promises and Async/Await?",
          "How would you approach optimizing the speed and caching of an application compared to a static WordPress site?"
        ],
        behavioral: [
          "Describe a situation where a client demanded a feature that WordPress plugins couldn't support. How did you resolve it?",
          "What motivates you to transition from CMS development to modern React and Node.js full-stack development?"
        ],
        situational: [
          "If a custom PHP theme you deployed triggers a database connection timeout, how do you locate the slow script?",
          "How do you organize CSS code to keep it maintainable across large layouts without using CSS frameworks?"
        ],
        project: [
          "Walk us through a custom theme or plugin you developed. How did you organize the file structure?",
          "Describe your experience with source control and how you resolve merge conflicts when working in a team."
        ],
        leadership: [
          "How do you handle explaining technical server constraints to a non-technical small business client?",
          "Describe a time when you had to learn a new tool quickly to complete a task."
        ],
        coding: [
          "Write a simple JavaScript function that reverses a string.",
          "Describe the difference between an INNER JOIN and a LEFT JOIN in SQL querying."
        ]
      },
      hiringRecommendation: "Not suitable for this Senior Full Stack role. His background is tailored to CMS design, PHP, and local agency work, which lacks the software engineering depth, cloud scale, and JS/TS framework fluency we require.",
      salaryRecommendation: "$75,000 - $85,000",
      culturalFit: 80,
      careerGrowth: "With immersive training, John can grow into a mid-level web developer, but would require extensive training to handle high-concurrency SaaS infrastructures.",
      explanation: "John's skills are heavily rooted in PHP, WordPress, and Bootstrap. He lacks TypeScript, Node.js, and modern React skills which make up the entire core of our product line. His database experience is limited to MySQL via phpMyAdmin, with no Docker, cloud environments, or enterprise scalability metrics.",
      formattingScore: 82,
      fakeDetectionScore: 92,
      atsCompatibilityScore: 80,
      keywordSuggestions: ["React.js", "Tailwind CSS", "Node.js", "TypeScript", "RESTful APIs", "Modern ES6+ JS"]
    },
    status: "Applied"
  },
  {
    id: "cand_5",
    name: "David Vance",
    email: "david.vance99@gmail.com",
    phone: "+1 (512) 555-8291",
    fileName: "david_vance_resume.pdf",
    fileSize: 94050,
    rawText: `David Vance
Junior Graphic Designer & Entry Web Assistant - Austin, TX
Email: david.vance99@gmail.com | Phone: +1 (512) 555-8291

PROFILE:
Enthusiastic creative specializing in graphic designs, logo illustration, and simple HTML landing page layouts. Quick learner hoping to get into tech industries.

CORE COMPETENCIES:
- Graphic Design, Figma, Adobe Photoshop, Adobe Illustrator, CSS grids
- Simple HTML, CSS, Squarespace, Wix site building, copy editing

EXPERIENCE:
Junior Graphic Designer | GraphicArt Design Studio | 2023 - Present
- Created vector logos, branding templates, and social media flyers for 30+ regional clients.
- Designed high-fidelity graphic banners and layout drafts in Adobe Photoshop.
- Maintained company branding library and collaborated with media teams on layouts.

Entry Web Assistant | freelance | 2022 - 2023
- Built simple single-page landing sites using Wix and Squarespace editors.
- Edited layout copies and updated visual banners for local coffee shops and stores.

EDUCATION:
High School Diploma | Austin High School | 2021`,
    uploadTime: "2026-07-15T13:40:00Z",
    experienceYears: 1,
    education: "High School Diploma",
    skills: ["Figma", "Adobe Photoshop", "Adobe Illustrator", "HTML", "CSS"],
    projects: [],
    achievements: [],
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
      summary: "David Vance is a Junior Graphic Designer with high school education and limited experience in Squarespace/Wix web assistance. He has no software engineering, JavaScript/TypeScript, React, Node, SQL database, or DevOps qualifications, making him completely unqualified for a Senior Full Stack Engineer role.",
      strengths: [
        "Strong visual graphic design and vector illustration competencies.",
        "Experienced in Figma, Photoshop, and Illustrator.",
        "Positive, entry-level enthusiasm for tech industries."
      ],
      weaknesses: [
        "Has zero software engineering, system architecture, or full-stack programming experience.",
        "No knowledge of JavaScript, TypeScript, React, Node.js, Express, PostgreSQL, or Git.",
        "Only 1 year of design experience, completely missing the 5-year senior development requirement.",
        "Lacks formal higher education in Computer Science or technical domains."
      ],
      missingSkills: ["TypeScript", "JavaScript", "React.js", "Node.js", "PostgreSQL", "Docker", "AWS", "Git", "SaaS Engineering"],
      suggestedQuestions: {
        technical: [
          "Could you explain the difference between a graphic designer and a software engineer in a typical tech team?",
          "Have you written any JavaScript code or explored frontend development tools beyond Wix/Squarespace?"
        ],
        behavioral: [
          "What inspires you to transition from graphic design into software development?",
          "How do you handle receiving negative feedback from clients on your visual designs?"
        ],
        situational: [
          "If a client asks you to build a highly interactive database-backed checkout form, how would you approach learning the tools?",
          "How do you organize your visual layouts in Figma to hand them off to developers?"
        ],
        project: [
          "Describe your favorite graphic design branding project. What was your creative process?",
          "Have you ever collaborated with developers on a project? What was the experience like?"
        ],
        leadership: [
          "How do you manage your tasks and deadlines when working with multiple client briefs simultaneously?",
          "Describe a time when you had to explain your design decisions to an unhappy stakeholder."
        ],
        coding: [
          "What is an HTML tag and what is its purpose?",
          "What is the difference between an ID and a CLASS attribute in CSS?"
        ]
      },
      hiringRecommendation: "Reject. Completely unqualified for a Senior Software Engineer position. Recommend directing him toward junior UI design, graphic illustration, or entry-level web assistant roles.",
      salaryRecommendation: "$50,000 - $60,000",
      culturalFit: 70,
      careerGrowth: "David has great potential in graphic design and visual layouts, but would need several years of intensive technical training to enter a junior development track.",
      explanation: "David Vance possesses zero technical engineering coordinates. He does not write code, structure server logic, configure APIs, or scale relational databases. His experience is entirely graphic vector art and Squarespace visual page builders. He is a strict reject for this specific role.",
      formattingScore: 80,
      fakeDetectionScore: 98,
      atsCompatibilityScore: 40,
      keywordSuggestions: ["JavaScript basics", "HTML/CSS structure", "Git version control"]
    },
    status: "Rejected"
  }
];

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif_1",
    title: "System Seeding Completed",
    message: "Preloaded active Senior Full Stack Engineer role and parsed 5 sample candidate resumes into the dashboard successfully.",
    type: "success",
    timestamp: new Date().toISOString(),
    read: false
  }
];

class LocalDb {
  private data: DataStoreSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DataStoreSchema {
    try {
      if (fs.existsSync(STORE_FILE)) {
        const fileContent = fs.readFileSync(STORE_FILE, "utf-8");
        const parsed = JSON.parse(fileContent);
        // Ensure defaults are present if loaded store is empty
        return {
          activeJD: parsed.activeJD || null,
          candidates: parsed.candidates || [],
          settings: parsed.settings || DEFAULT_SETTINGS,
          notifications: parsed.notifications || []
        };
      }
    } catch (e) {
      console.error("Failed to load local data store, resetting to seed data:", e);
    }

    // Default seed setup
    const seed: DataStoreSchema = {
      activeJD: {
        id: "jd_seed",
        title: "Senior Full Stack Engineer",
        text: INITIAL_JD_TEXT,
        parsed: getMockParsedJD(INITIAL_JD_TEXT),
        uploadedAt: new Date().toISOString()
      },
      candidates: SEED_CANDIDATES,
      settings: DEFAULT_SETTINGS,
      notifications: INITIAL_NOTIFICATIONS
    };

    this.saveDataDirectly(seed);
    return seed;
  }

  private saveData() {
    this.saveDataDirectly(this.data);
  }

  private saveDataDirectly(d: DataStoreSchema) {
    try {
      fs.writeFileSync(STORE_FILE, JSON.stringify(d, null, 2), "utf-8");
    } catch (e) {
      console.error("Failed to save data store to file system:", e);
    }
  }

  // Active JD operations
  public getActiveJD(): JobDescription | null {
    return this.data.activeJD;
  }

  public async setActiveJD(text: string): Promise<JobDescription> {
    const id = "jd_" + Date.now();
    const parsed = await parseJobDescription(text);
    const jd: JobDescription = {
      id,
      text,
      title: parsed.title || "Selected Role",
      parsed,
      uploadedAt: new Date().toISOString()
    };
    this.data.activeJD = jd;
    
    // Add notification
    this.addNotification(
      "Job Description Updated",
      `The active JD has been set to: "${jd.title}". Existing candidates can now be screened against this role.`,
      "info"
    );

    this.saveData();
    return jd;
  }

  // Candidate Operations
  public getCandidates(): Candidate[] {
    return this.data.candidates;
  }

  public getCandidateById(id: string): Candidate | undefined {
    return this.data.candidates.find(c => c.id === id);
  }

  public addCandidate(candidate: Omit<Candidate, "id" | "status" | "screeningStatus" | "scores" | "aiVerdict" | "analysis">): Candidate {
    const newCand: Candidate = {
      ...candidate,
      id: "cand_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      screeningStatus: "pending",
      scores: null,
      aiVerdict: null,
      analysis: null,
      status: "Applied"
    };

    // Check for duplicate detection
    const duplicate = this.data.candidates.find(c => c.email && c.email.toLowerCase() === newCand.email.toLowerCase());
    if (duplicate) {
      this.addNotification(
        "Resume Duplicate Detected",
        `Candidate ${newCand.name} (${newCand.email}) appears to have already submitted a resume (${duplicate.fileName}).`,
        "warning"
      );
    }

    this.data.candidates.push(newCand);
    this.saveData();
    return newCand;
  }

  public removeCandidate(id: string): boolean {
    const initialLen = this.data.candidates.length;
    this.data.candidates = this.data.candidates.filter(c => c.id !== id);
    if (this.data.candidates.length < initialLen) {
      this.saveData();
      return true;
    }
    return false;
  }

  public updateCandidateStatus(id: string, status: Candidate['status']): boolean {
    const cand = this.getCandidateById(id);
    if (cand) {
      cand.status = status;
      this.addNotification(
        `Candidate Status Updated`,
        `Candidate "${cand.name}" status has been set to "${status}".`,
        status === "Rejected" ? "warning" : "success"
      );
      this.saveData();
      return true;
    }
    return false;
  }

  // Run matching process
  public async screenCandidate(id: string): Promise<Candidate> {
    const cand = this.getCandidateById(id);
    const jd = this.getActiveJD();

    if (!cand) throw new Error("Candidate not found.");
    if (!jd || !jd.parsed) throw new Error("No active Job Description set. Set active JD first.");

    cand.screeningStatus = "processing";
    this.saveData();

    try {
      const matchResult = await parseAndMatchResume(
        cand.rawText,
        cand.fileName,
        jd.text,
        jd.parsed,
        this.data.settings.weights
      );

      cand.name = matchResult.name || cand.name;
      cand.email = matchResult.email || cand.email;
      cand.phone = matchResult.phone || cand.phone;
      cand.experienceYears = matchResult.experienceYears;
      cand.education = matchResult.education;
      cand.skills = matchResult.skills;
      cand.projects = matchResult.projects;
      cand.achievements = matchResult.achievements;
      cand.certifications = matchResult.certifications;
      cand.currentCompany = matchResult.currentCompany;
      cand.expectedSalary = matchResult.expectedSalary;
      cand.location = matchResult.location;
      cand.scores = matchResult.scores;
      cand.aiVerdict = matchResult.aiVerdict;
      cand.analysis = matchResult.analysis;
      cand.screeningStatus = "completed";
      cand.status = "Screened";

      // If overall score is above threshold, auto-recommend shortlisting
      if (cand.scores && cand.scores.overall >= this.data.settings.shortlistThreshold) {
        // We can let the user shortlist manually but alert
        this.addNotification(
          "High Match Candidate Found!",
          `Candidate "${cand.name}" achieved a score of ${cand.scores.overall}% and is classified as "${cand.aiVerdict}".`,
          "success"
        );
      }

      this.saveData();
      return cand;
    } catch (e: any) {
      console.error(`Failed to screen candidate ${id}:`, e);
      cand.screeningStatus = "failed";
      this.saveData();
      throw e;
    }
  }

  // Screen all pending candidates
  public async screenAllPending(): Promise<Candidate[]> {
    const pending = this.data.candidates.filter(c => c.screeningStatus === "pending" || c.screeningStatus === "failed");
    const results: Candidate[] = [];
    
    for (const cand of pending) {
      try {
        const completed = await this.screenCandidate(cand.id);
        results.push(completed);
      } catch (e) {
        console.error(`Skipping candidate ${cand.name} due to failure`);
      }
    }

    if (results.length > 0) {
      this.addNotification(
        "Screening Campaign Completed",
        `Successfully screened ${results.length} resumes against the "${this.data.activeJD?.title || 'active'}" Job Description.`,
        "success"
      );
    }

    return results;
  }

  // Natural Language Candidate Semantic Filter
  public async searchCandidatesSemantic(query: string): Promise<Candidate[]> {
    if (!isGeminiConfigured()) {
      console.warn("Gemini is not configured. Falling back to local filter search.");
      return this.localSearchCandidates(query);
    }

    try {
      const ai = getGeminiClient();
      const candProfiles = this.data.candidates.map(c => ({
        id: c.id,
        name: c.name,
        skills: c.skills,
        experience: c.experienceYears,
        education: c.education,
        location: c.location,
        verdict: c.aiVerdict,
        score: c.scores?.overall || 0,
        summary: c.analysis?.summary || ""
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Evaluate which of the following candidate profiles match the natural language HR search query. Return the list of matched candidate IDs in order of relevance, with a brief explanation for each candidate's match.
        
Search Query: "${query}"

Candidates:
${JSON.stringify(candProfiles, null, 2)}`,
        config: {
          systemInstruction: "Select candidate IDs that match the natural language query. Be flexible: if they ask for '5 years experience', select candidates with >= 5 years. If they ask for 'React developers', select those with React in skills. Return a clean JSON list containing candidateId and explanation.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                candidateId: { type: Type.STRING },
                explanation: { type: Type.STRING }
              },
              required: ["candidateId", "explanation"]
            }
          }
        }
      });

      if (!response.text) {
        throw new Error("No response text from search semantic matcher");
      }

      const matchPayload = JSON.parse(response.text.trim()) as { candidateId: string; explanation: string }[];
      
      // Map to full candidates and attach temporary match explanation
      const matchedCandidates: Candidate[] = [];
      for (const m of matchPayload) {
        const originalCand = this.getCandidateById(m.candidateId);
        if (originalCand) {
          // Attach custom explanation to analysis if present, or return clone
          const clone = JSON.parse(JSON.stringify(originalCand)) as Candidate;
          if (clone.analysis) {
            clone.analysis.explanation = m.explanation + " | " + clone.analysis.explanation;
          }
          matchedCandidates.push(clone);
        }
      }

      return matchedCandidates;

    } catch (e) {
      console.error("Semantic search failed. Fallback to keyword search:", e);
      return this.localSearchCandidates(query);
    }
  }

  private localSearchCandidates(query: string): Candidate[] {
    const q = query.toLowerCase();
    
    // Parse years of experience query e.g. "5 years"
    const expMatch = q.match(/(\d+)\s*years?/);
    const expReq = expMatch ? parseInt(expMatch[1]) : 0;

    return this.data.candidates.filter(c => {
      const skillsStr = c.skills.join(" ").toLowerCase();
      const rawStr = (c.name + " " + c.education + " " + c.location + " " + skillsStr + " " + c.rawText).toLowerCase();
      
      // Match general keywords
      let matchesKeyword = q.split(" ").some(word => {
        if (word.length <= 2 || word === "with" || word === "show" || word === "find") return false;
        return rawStr.includes(word);
      });

      if (expReq > 0) {
        return c.experienceYears >= expReq || (matchesKeyword && c.experienceYears >= expReq - 1);
      }

      return matchesKeyword || q === "";
    });
  }

  // Settings
  public getSettings(): ScreeningSettings {
    return this.data.settings;
  }

  public updateSettings(settings: Partial<ScreeningSettings>): ScreeningSettings {
    this.data.settings = {
      ...this.data.settings,
      ...settings,
      weights: {
        ...this.data.settings.weights,
        ...(settings.weights || {})
      }
    };

    // Recalculate candidate overall scores based on new weights
    this.data.candidates.forEach(c => {
      if (c.scores) {
        const s = c.scores;
        const w = this.data.settings.weights;
        const totalWeight = w.skills + w.experience + w.projects + w.education + w.certifications + w.keywords + w.semantic;
        const rawOverall = (
          (s.skillMatch * w.skills) +
          (s.experienceMatch * w.experience) +
          (s.projectRelevance * w.projects) +
          (s.educationMatch * w.education) +
          (s.certificationMatch * w.certifications) +
          (s.keywordSimilarity * w.keywords) +
          (s.semanticMatch * w.semantic)
        ) / totalWeight;
        c.scores.overall = Math.round(rawOverall);

        if (c.scores.overall >= 90) c.aiVerdict = "Excellent Match";
        else if (c.scores.overall >= 80) c.aiVerdict = "Strong Match";
        else if (c.scores.overall >= 60) c.aiVerdict = "Moderate Match";
        else if (c.scores.overall >= 45) c.aiVerdict = "Weak Match";
        else c.aiVerdict = "Reject";
      }
    });

    this.saveData();
    return this.data.settings;
  }

  // Notifications
  public getNotifications(): AppNotification[] {
    return this.data.notifications;
  }

  public addNotification(title: string, message: string, type: AppNotification['type'] = 'info') {
    const notif: AppNotification = {
      id: "notif_" + Date.now() + "_" + Math.floor(Math.random() * 100),
      title,
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false
    };
    this.data.notifications.unshift(notif);
    // Keep max 30 notifications
    if (this.data.notifications.length > 30) {
      this.data.notifications.pop();
    }
    this.saveData();
  }

  public markAllNotificationsAsRead() {
    this.data.notifications.forEach(n => n.read = true);
    this.saveData();
  }

  public clearNotifications() {
    this.data.notifications = [];
    this.saveData();
  }
}

export const db = new LocalDb();
export { getMockParsedJD };
