# Pathwise --- Shared Data Contract

**Purpose:** This document is the shared agreement for all four
developers. Keep frontend, backend, career data, and dashboard
components compatible by following these field names and response
shapes.

**Version:** 1.0\
**Status:** Milestone 2\
**Repository location:** `docs/API_CONTRACT.md`

------------------------------------------------------------------------

## 1. General rules

1.  Use the exact JSON field names shown below.
2.  Use `snake_case` for API and data fields.
3.  Skill proficiency is an integer from `0` to `5`.
4.  A skill gap is `max(required_level - current_level, 0)`.
5.  Readiness scores are percentages from `0` to `100`.
6.  The backend is the source of truth for saved student data and
    calculated scores.
7.  The frontend may use mock data while an endpoint is being developed,
    but mock data must be clearly separated from real API responses.
8.  Do not rename or change a shared field without telling the team and
    updating this document.

## 2. Student profile

### Create student

`POST /api/students`

Request:

``` json
{
  "name": "Rahul",
  "email": "rahul@example.com",
  "education": "B.Tech CSE, 2nd Year",
  "career_goal": "Frontend Developer"
}
```

Successful response (`201 Created`):

``` json
{
  "id": 1,
  "name": "Rahul",
  "email": "rahul@example.com",
  "education": "B.Tech CSE, 2nd Year",
  "career_goal": "Frontend Developer"
}
```

### Retrieve student

`GET /api/students/{id}`

Successful response (`200 OK`) uses the same student object as above.

Expected errors:

-   `404 Not Found`: no student exists with that ID.
-   `409 Conflict`: email is already registered (recommended).
-   `422 Unprocessable Entity`: request validation failed.

## 3. Skill proficiency

Use this scale consistently:

    Level Meaning
  ------- --------------
        0 No knowledge
        1 Beginner
        2 Basic
        3 Intermediate
        4 Advanced
        5 Proficient

A student skill record:

``` json
{
  "name": "JavaScript",
  "current_level": 2
}
```

A career-required skill record:

``` json
{
  "name": "JavaScript",
  "category": "technical",
  "required_level": 5,
  "weight": 0.9,
  "importance": "Essential for building interactive web applications."
}
```

Allowed categories: `technical`, `professional`.

`weight` must be a number greater than `0` and no greater than `1`.

## 4. Career catalogue format

Location: `backend/app/data/careers.json`

Use this structure for every career:

``` json
[
  {
    "id": "frontend_developer",
    "name": "Frontend Developer",
    "description": "Builds the user-facing parts of web applications.",
    "category": "Software Development",
    "skills": [
      {
        "name": "HTML",
        "category": "technical",
        "required_level": 4,
        "weight": 0.9,
        "importance": "Provides the structure of web pages."
      },
      {
        "name": "Communication",
        "category": "professional",
        "required_level": 3,
        "weight": 0.5,
        "importance": "Supports collaboration with designers and developers."
      }
    ]
  }
]
```

The catalogue should contain one object per career. Each career should
have approximately 10--15 relevant skills. Avoid duplicate skill names
within a career.

Initial career IDs:

-   `frontend_developer`
-   `data_analyst`
-   `cloud_engineer`
-   `machine_learning_engineer`

## 5. Skill gap analysis response

The dashboard should consume this shape when the analysis endpoint is
implemented:

``` json
{
  "student_id": 1,
  "career_id": "frontend_developer",
  "career": "Frontend Developer",
  "readiness_score": 65,
  "skills": [
    {
      "name": "HTML",
      "category": "technical",
      "current_level": 4,
      "required_level": 4,
      "gap": 0,
      "priority": "Low"
    },
    {
      "name": "JavaScript",
      "category": "technical",
      "current_level": 2,
      "required_level": 5,
      "gap": 3,
      "priority": "High"
    },
    {
      "name": "React",
      "category": "technical",
      "current_level": 0,
      "required_level": 4,
      "gap": 4,
      "priority": "Critical"
    }
  ]
}
```

Priority labels for the initial implementation:

-   `Low`: gap is 0 or 1.
-   `Medium`: gap is 2.
-   `High`: gap is 3.
-   `Critical`: gap is 4 or 5.

These are initial product rules and can be refined later.

## 6. Readiness score

Calculate the readiness score in the backend, not in the LLM or
frontend.

For each required skill:

-   `current_level` = student's level, defaulting to `0` if not
    supplied.
-   `required_level` = career target level.
-   `weight` = career skill importance.

Formula:

`readiness_score = (sum(weight * min(current_level, required_level)) / sum(weight * required_level)) * 100`

Round the final score to the nearest whole number. If there are no valid
weighted skills, return `0`.

This score is an estimate based on the selected role catalogue; do not
describe it as a guarantee of employability.

## 7. Frontend/backend responsibilities

### Frontend

-   Collect and validate profile form input.
-   Send requests using the shared Axios API service.
-   Display API response data.
-   Show loading, success, empty, and error states.
-   Do not independently calculate the official readiness score.

### Backend

-   Validate incoming request data.
-   Save and retrieve student records.
-   Load career data from `careers.json`.
-   Calculate skill gaps and readiness scores.
-   Return JSON matching this contract.

### Career data owner

-   Maintain `careers.json`.
-   Keep the schema consistent.
-   Use realistic entry-level requirements.
-   Do not invent certifications or resource URLs.

### Dashboard owner

-   Build reusable components using the response shapes in this
    document.
-   Use mock data only until the real endpoint is available.
-   Do not invent new field names.

## 8. Integration checklist

Before merging a feature, confirm:

-   [ ] Field names match this document.
-   [ ] Request and response JSON matches the examples.
-   [ ] Proficiency values are between 0 and 5.
-   [ ] Career IDs match the IDs in `careers.json`.
-   [ ] Missing student skills default to level 0 during analysis.
-   [ ] Errors use appropriate HTTP status codes.
-   [ ] Frontend loading and error states are handled.
-   [ ] No API keys, passwords, or personal student data are committed.

## 9. Change control

If a developer needs to change a field, endpoint, or schema:

1.  Discuss the change with the team.
2.  Update this document.
3.  Update the backend and frontend together.
4.  Test the affected integration before merging.

**This file is the shared contract for Milestone 2. When in doubt,
follow this document rather than inventing a new response format.**
