# Project Status

Pathwise is a hackathon MVP and portfolio project. This document distinguishes implemented functionality from frontend simulations and known limitations.

## Implemented in the repository

- React/Vite single-page frontend and routed screens.
- FastAPI backend with health and connectivity endpoints.
- Student profile create, retrieve and update endpoints.
- SQLModel student and recommendation persistence models.
- Career benchmark catalogue for four target roles.
- Backend skill-gap calculation and weighted readiness scoring.
- Recommendation retrieval, profile fingerprinting and cache handling.
- Gemini integration with structured-response validation.
- Curated recommendation fallback when Gemini is unavailable.
- Frontend dashboard components and sample dashboard data.

## Partial or simulated

- Email/password registration and sign-in are simulated in frontend state.
- Google and Apple sign-in are simulated; production identity verification is not implemented.
- Some dashboard/profile state is stored in browser local storage.
- Sample dashboard content exists separately from database-backed profile and recommendation records.

## Do not claim as complete

- Production-grade authentication or account security.
- Fully verified certification matching against live provider catalogues.
- A validated employment prediction or job-readiness assessment.
- A comprehensive labour-market dataset.

## Suggested next engineering steps

1. Implement and test a real authentication/session flow.
2. Audit UI data paths and label sample/demo data clearly.
3. Add automated tests for readiness calculations and recommendation caching.
4. Add rate limits and robust handling for upstream AI outages.
5. Review database migrations and production database configuration.
6. Add screenshots and a short demo video after checking the deployed app.
