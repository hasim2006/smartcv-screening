# SmartCV Screening Architecture

## System Overview
SmartCV Screening AI is an intelligent Applicant Tracking & Resume Screening platform built with React 19, TypeScript, Vite, and Tailwind CSS.

## Architecture Highlights
1. **Theme Engine**: Centralized ThemeContext providing seamless switching between Light and Dark modes with persistent storage.
2. **Scoring Engine**: Evaluates candidate resumes against target job descriptions using weighted multidimensional factors (Technical, Experience, Education, Soft Skills).
3. **Responsive Grid**: Adaptive layout scaling effortlessly from mobile screens to ultra-wide displays.
4. **Mock Resilience**: Client-side fetch interceptor enabling standalone deployment on static hosting (Netlify) with zero backend dependency when needed.
