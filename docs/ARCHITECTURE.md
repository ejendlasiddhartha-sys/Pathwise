# Pathwise Architecture

## System overview

```text
Browser
  |
  v
React + Vite frontend
  | Axios requests (VITE_API_URL)
  v
FastAPI application
  |
  +--> Student routes --> Student service --> SQLModel database
  |
  +--> Recommendation routes
          |
          v
      Recommendation service
          |
          +--> careers.json catalogue
          +--> skill-gap and readiness calculations
          +--> recommendation cache
          |
          v
      Gemini service
          +--> Google Gemini API
          +--> curated baseline fallback
```

## Frontend

- `src/pages/`: home, authentication, profile setup and dashboard screens.
- `src/components/`: shared interface and dashboard components.
- `src/context/AuthContext.jsx`: client-side user, profile and recommendation state.
- `src/data/mockDashboardData.js`: sample dashboard data.
- `src/services/api.js`: backend API client.

The frontend uses local storage for some state. Authentication providers are simulated and do not constitute a secure authentication system.

## Backend

- `routes/students.py`: student profile create, read and update endpoints.
- `routes/recommendations.py`: recommendation retrieval and forced refresh endpoints.
- `routes/system.py`: health and connectivity endpoints.
- `services/student_service.py`: student persistence logic.
- `services/recommendation_service.py`: career data loading, skill-gap calculation, readiness scoring, cache management and orchestration.
- `services/gemini_service.py`: Gemini calls, structured response parsing and curated fallback.
- `schemas.py`: Pydantic request and response models.
- `models.py`: `Student` and `CareerRecommendation` SQLModel tables.

## Data storage

`Student` stores profile information including education, career goal, skills, certifications and experience. Skills and certifications are JSON-encoded text fields.

`CareerRecommendation` stores the target role, profile fingerprint, readiness score, skill gaps, recommendation content and generation metadata.

`DATABASE_URL` configures the SQLAlchemy connection. Local development uses SQLite; the database module supports PostgreSQL connection URLs for deployment.

## Recommendation lifecycle

1. Load the requested student.
2. Resolve the target career from `careers.json`.
3. Load the student's skills and certifications.
4. Calculate skill gaps and weighted readiness in the backend.
5. Compute a fingerprint from career-relevant profile fields.
6. Return a matching, non-outdated cached recommendation unless refresh is forced.
7. Otherwise call Gemini with anonymised career-profile factors.
8. Parse and validate the structured response.
9. Use curated baseline data if generation fails.
10. Persist the recommendation.

## Privacy boundary

The Gemini prompt uses education, experience, calculated skill gaps, readiness score, completed certification names and detected changes. The service code is designed not to send student name or email.

`GEMINI_API_KEY` is a backend secret. Never place it in frontend source code or a `VITE_` variable.

## Deployment

The project uses Vercel for frontend and backend deployment. Configure production values through deployment environment variables, not committed `.env` files.
