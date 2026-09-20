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
