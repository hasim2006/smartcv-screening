# SmartCV Screening API Reference

## REST API Specification
- `GET /api/candidates`: Retrieve all screened candidates with search and score filters.
- `GET /api/candidates/:id`: Retrieve detailed candidate profile including radar breakdown.
- `POST /api/candidates`: Upload and screen new candidate resume.
- `PUT /api/candidates/:id/status`: Update candidate review status (Shortlisted, Under Review, Rejected).
- `GET /api/job-descriptions`: Retrieve list of active job descriptions.
- `POST /api/job-descriptions`: Create or parse a new job description.
- `GET /api/analytics`: Retrieve hiring pipeline funnel and department distribution data.
