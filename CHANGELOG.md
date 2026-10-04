# Changelog

All notable changes to the SmartCV Screening project are documented in this file.

## [1.0.0] - 2026-10-24
### Added
- Complete Dark and Light Mode theme system with semantic tokens and instant toggle.
- 100% Fully responsive mobile, tablet, and desktop navigation with off-canvas drawer.
- AI-driven ATS resume scoring and multi-dimensional skill radar visualization.
- Batch resume screening queue with multi-file drag-and-drop support.
- Shortlist management and integrated interview scheduler.
- Executive reporting center with CSV and JSON data export.
- ClientMockApi layer for resilient static deployment on Netlify.
- [2026-09-13] docs: initialize changelog tracking project milestones
- [2026-09-13] docs: create system architecture specification overview
- [2026-09-14] feat(types): define Candidate, JobDescription and ScreeningResult interfaces
- [2026-09-14] feat(types): define scoring breakdown metrics and ATS match criteria
- [2026-09-15] feat(server): setup express application with json parser and cors middleware
- [2026-09-15] feat(server): create persistent json database seed for candidate records
- [2026-09-17] feat(server): implement GET /api/candidates query endpoint
- [2026-09-17] feat(server): implement GET /api/candidates/:id detail handler
- [2026-09-17] feat(server): implement candidate search by keyword and skill tags
- [2026-09-18] feat(server): implement status update endpoint for candidates
- [2026-09-18] feat(server): create job description ingestion endpoint
- [2026-09-19] feat(server): add analytics aggregation route for applicant pipeline
- [2026-09-19] docs: document REST API contracts and request/response schemas
- [2026-09-19] test(server): add test fixtures for candidate payload validation
- [2026-09-20] style: establish semantic color variables and typography scale
- [2026-09-20] style: add glassmorphism utilities and elevation shadow classes
- [2026-09-21] style: configure custom scrollbars and badge animations
- [2026-09-21] style: configure dark theme root variable defaults and accents
- [2026-09-21] feat(assets): configure modern svg favicon and application icons
- [2026-09-22] feat(html): configure responsive viewport meta tags and web app title
- [2026-09-22] feat(app): initialize React 19 root component and DOM mounting
- [2026-09-24] feat(layout): build responsive application shell with persistent nav slots
- [2026-09-24] feat(nav): create sidebar menu links and active indicator styling
- [2026-09-24] feat(nav): create top navigation bar with search bar container
- [2026-09-25] feat(dashboard): scaffold dashboard overview container and header
- [2026-09-25] feat(dashboard): implement KPI cards for total applicants and review counts
- [2026-09-26] feat(dashboard): add average match score and interview rate metric tiles
- [2026-09-26] feat(dashboard): build active job requisition overview grid
- [2026-09-26] feat(dashboard): add recent candidate activity feed with status tags
- [2026-09-27] feat(dashboard): add quick action shortcuts for resume screening and JD upload
- [2026-09-27] refactor(dashboard): optimize metric card layout for high DPI displays
- [2026-09-28] style(dashboard): refine card border glow and hover state transitions
- [2026-09-28] test(dashboard): verify metric calculation utility accuracy
- [2026-09-28] docs: document dashboard KPI formulas and data aggregation rules
- [2026-09-29] feat(jd): scaffold Job Description upload form container
- [2026-09-29] feat(jd): implement role title, department, and location input fields
- [2026-09-30] feat(jd): add dynamic skill tags input with addition and removal tags
- [2026-09-30] feat(jd): add minimum experience range slider and qualification criteria
- [2026-09-30] feat(jd): add full job description rich text editor input
- [2026-10-01] feat(jd): build real-time JD parsing preview card
- [2026-10-01] feat(jd): implement form reset and prefill sample job templates
- [2026-10-02] refactor(jd): add validation rules for required fields and minimum skill count
- [2026-10-02] style(jd): style dropzone with dashed border and drag-over highlight
- [2026-10-02] docs: document job description parsing rules and keyword extraction logic
- [2026-10-03] feat(screening): scaffold resume batch screening interface
- [2026-10-03] feat(screening): implement multi-file drag and drop uploader zone
- [2026-10-04] feat(screening): add file format validation for PDF and DOCX documents
