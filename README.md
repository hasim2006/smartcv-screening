# SmartCV Screening AI — Intelligent ATS Resume Matcher & Talent Intelligence Platform

<div align="center">

[![Live Demo](https://img.shields.io/badge/Live%20Demo-smartcv--screening--ai.netlify.app-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://smartcv-screening-ai.netlify.app)
[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**SmartCV Screening AI** is an enterprise-grade AI recruiting intelligence suite designed for modern hiring teams. It automates candidate resume screening, evaluates candidates against Job Descriptions using multi-dimensional ATS criteria, visualizes skill profiles through interactive radar graphics, and streamlines the interview pipeline.

[🚀 Explore Live Demo](https://smartcv-screening-ai.netlify.app) • [✨ Key Modules](#-key-modules) • [📁 Domain Architecture](#-domain-driven-project-structure) • [🛠️ Tech Stack](#️-technology-stack) • [🚀 Getting Started](#-getting-started)

</div>

---

## 🌟 Live Application

The production build is deployed and hosted on Netlify with automated single-page application (SPA) routing:

- **Production URL**: [https://smartcv-screening-ai.netlify.app](https://smartcv-screening-ai.netlify.app)
- **Source Repository**: [https://github.com/hasim2006/smartcv-screening](https://github.com/hasim2006/smartcv-screening)

---

## 💼 Executive Overview

Hiring workflows are often bottlenecked by manual resume triage and fragmented candidate evaluation. **SmartCV Screening AI** bridges this gap by combining automated text extraction, multi-factor ATS scoring algorithms, and an intuitive recruiter workspace:

- **Precision Matching**: Benchmarks applicants across Technical Skills, Relevant Experience, Education, and Soft Skills.
- **Visual Profiling**: Generates 5-axis pentagonal skill radar charts for instant qualitative assessment.
- **Workflow Automation**: Facilitates one-click interview scheduling, note recording, and candidate status tracking.
- **Executive Reporting**: One-click data export into CSV, JSON, and PDF dossiers for recruitment syncs.

---

## ✨ Key Modules

### 1. 🤖 Multi-Factor ATS Screening Engine
- Compares uploaded candidate resumes against the active Job Description (JD).
- Computes comprehensive match percentiles: **Overall ATS Match**, **Core Technical Fit**, **Domain Experience**, **Education Level**, and **Soft Skills**.
- Automatically extracts detected skills, highlights keyword deficiencies, and generates candidate interview questions.

### 2. 🌓 Dynamic Light & Dark Theme System
- Context-driven state management with instant persistence in `localStorage`.
- Automatic detection of operating system color preferences (`prefers-color-scheme`).
- Semantic CSS color variables (`--bg-app`, `--bg-card`, `--border-main`, `--text-main`, `--text-muted`) guaranteeing optimal readability, contrast, and zero flicker across all components.

### 3. 📱 Responsive Multi-Device Interface
- **Mobile Handsets (`< 640px`)**: Off-canvas sliding drawer with smooth touch backdrop, compact search bar, and full-width candidate modals.
- **Tablets & Laptops (`640px - 1023px`)**: Adaptive 2-to-3 column dashboard grid, responsive data table scroll wrappers, and compact split-screen views.
- **Desktop & Widescreen (`1024px+`)**: Fixed left-hand navigation, synchronized Recharts analytics, and side-by-side resume inspection panels.

### 4. 👥 Candidate Talent Pool & Deep-Dive Profiles
- Real-time debounced full-text search across applicant names, roles, and technical skill tags.
- Granular filtering by score thresholds, department, and candidate hiring status.
- Interactive candidate drawer featuring SVG skill radar charts, work history timelines, and recruiter evaluation notes.

### 5. 📅 Shortlist & Interview Scheduler
- Fast-tracks top-tier applicants into dedicated review stages.
- Interactive interview booking modal with interviewer assignment, round selection, date-time picker, and calendar integration.

### 6. 📊 Talent Analytics & Export Center
- Candidate pipeline funnel tracking using Recharts.
- Demand distribution of required job skills across open requisitions.
- Instant batch export of filtered candidate rosters into formatted CSV, JSON, and executive briefs.

---

## 🎨 Design System & Color Tokens

The UI is built upon a cohesive semantic design system that adapts dynamically between light and dark themes:

| Design Token | Light Palette | Dark Palette | Application Target |
| :--- | :--- | :--- | :--- |
| `--bg-app` | `#F8FAFC` (Slate 50) | `#070B14` (Deep Space) | Main application canvas background |
| `--bg-card` | `#FFFFFF` (Pure White) | `#0D1527` (Midnight Navy) | Metric tiles, modal panels, drawers |
| `--border-main` | `#E2E8F0` (Slate 200) | `rgba(255,255,255,0.08)` | Card dividers, inputs, container borders |
| `--text-main` | `#0F172A` (Slate 900) | `#F8FAFC` (Slate 50) | Primary typography & headers |
| `--text-muted` | `#64748B` (Slate 500) | `#94A3B8` (Slate 400) | Secondary captions & timestamps |
| `--primary` | `#4F8CFF` (Bright Royal) | `#4F8CFF` (Bright Royal) | Primary actions, radar fills, active states |

---

## 📁 Domain-Driven Project Structure

All application components and modules are organized strictly by functional domain:

```
smartcv-screening/
├── public/
│   ├── _redirects                 # Netlify SPA redirect rules
│   └── favicon.ico                # Application brand favicon
├── src/
│   ├── components/
│   │   ├── layout/                # Layout & Navigation Domain
│   │   │   ├── Sidebar.tsx        # Responsive navigation drawer
│   │   │   ├── TopBar.tsx         # Global search, theme toggle, notifications
│   │   │   └── index.ts
│   │   ├── dashboard/             # Dashboard & Metrics Domain
│   │   │   ├── DashboardHome.tsx  # Executive KPI cards & recent activities
│   │   │   └── index.ts
│   │   ├── screening/             # Screening & Ingestion Domain
│   │   │   ├── ResumeScreening.tsx# Drag-and-drop batch CV uploader
│   │   │   ├── UploadJD.tsx       # Job Description parser & requirement builder
│   │   │   └── index.ts
│   │   ├── candidates/            # Candidate Management Domain
│   │   │   ├── Candidates.tsx     # Talent directory table & filter bar
│   │   │   ├── CandidateProfile.tsx# Deep-dive candidate drawer & radar chart
│   │   │   ├── ShortlistView.tsx  # Shortlist manager & interview scheduler
│   │   │   └── index.ts
│   │   ├── analytics/             # Analytics & Reporting Domain
│   │   │   ├── AnalyticsView.tsx  # Interactive funnel charts & skills radar
│   │   │   ├── ReportsView.tsx    # CSV/JSON data exporter & dossier briefs
│   │   │   └── index.ts
│   │   ├── settings/              # Settings & Preferences Domain
│   │   │   ├── SettingsView.tsx   # Theme preferences & AI model configurations
│   │   │   └── index.ts
│   │   └── index.ts               # Central components barrel export
│   ├── context/
│   │   └── ThemeContext.tsx       # Dark/Light mode state management & hook
│   ├── types/
│   │   └── index.ts               # TypeScript schemas for candidates & jobs
│   ├── utils/
│   │   ├── clientMockApi.ts       # Standalone resilience mock API layer
│   │   └── formatters.ts          # Score, date, initials, and metric helpers
│   ├── App.tsx                    # Root application component & routing shell
│   ├── index.css                  # Global design tokens, scrollbars, animations
│   ├── main.tsx                   # React 19 application mount point
│   └── types.ts                   # Backward-compatible type re-exporter
├── server/
│   ├── db.ts                      # Backend in-memory database store
│   └── gemini.ts                  # Optional Gemini AI API integration
├── server.ts                      # Express API server for local full-stack mode
├── data-store.json                # Seed candidate and job requisition database
├── netlify.toml                   # Netlify build and deployment configuration
├── package.json                   # Project dependencies and script commands
├── tsconfig.json                  # TypeScript compiler settings
└── vite.config.ts                 # Vite bundler plugins and build configuration
```

---

## 🛠️ Technology Stack

| Domain | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend Core** | [React](https://react.dev/) | `^19.0.0` | Reactive component architecture & hooks |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | `^5.8.2` | Static typing, interface contracts, safety |
| **Build Tool** | [Vite](https://vitejs.dev/) | `^6.2.0` | Fast local HMR & optimized production bundling |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | `^3.4.17` | Utility-first styling & responsive breakpoints |
| **Icons** | [Lucide React](https://lucide.dev/) | `^1.16.0` | Unified, lightweight SVG icon system |
| **Charts** | [Recharts](https://recharts.org/) | `^2.15.1` | Candidate pipeline and department analytics |
| **Backend (Optional)**| [Express](https://expressjs.com/) | `^4.21.2` | RESTful API service for candidate operations |
| **Hosting** | [Netlify](https://www.netlify.com/) | Live | Edge CDN hosting with SPA redirect support |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.x or v20.x recommended)
- **npm** or **pnpm**

### 1. Clone the Repository
```bash
git clone https://github.com/hasim2006/smartcv-screening.git
cd smartcv-screening
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration (Optional)
If connecting directly to Google Gemini AI for live prompt-based resume extraction, create a `.env` or `.env.local` file:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```
*(The application automatically operates in resilient standalone mode with preloaded seed data if no API key is specified).*

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 5. Build for Production
```bash
npm run build
```
Optimized assets will be generated in the `dist/` directory.

---

## 🌐 Production Deployment

### Deploying to Netlify
1. Fork or clone this repository to your GitHub account.
2. Sign in to [Netlify](https://app.netlify.com).
3. Click **Add new site** > **Import an existing project**.
4. Select `smartcv-screening` from your GitHub repositories.
5. Set the build configuration:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Click **Deploy Site**.

*The included `public/_redirects` and `netlify.toml` automatically route all SPA client subpaths to `index.html`.*

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the project repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'feat: Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
Developed with ❤️ by <a href="https://github.com/hasim2006">Mohammad Hasim</a>
</div>
