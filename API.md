# Pathwise API Reference

Interactive OpenAPI documentation is available at `/docs`.

Local base URL: `http://localhost:8000`

## System

### `GET /health`
Returns API health and application name.

### `GET /api/test`
Connectivity endpoint used to check frontend-to-backend communication.

## Student profiles

### `POST /api/students`
Creates a student profile. Required fields: `name`, `email`, `education`, `career_goal`. Optional fields include `target_career`, `skills`, `certifications` and `experience`. Duplicate email returns HTTP `409`.

### `GET /api/students/{id}`
Retrieves a student by database ID. Returns `404` if not found.

### `PUT /api/students/{id}`
Updates supplied profile fields. Returns `404` if the student does not exist and `409` if an email conflicts with another record.

## Recommendations

### `GET /api/students/{id}/recommendations`
Returns a cached recommendation when the profile fingerprint matches, or generates a new recommendation when required. Optional query parameter: `target_career_id`.

### `POST /api/students/{id}/recommendations/refresh`
Forces recommendation generation instead of reusing the current cache. Optional body fields: `target_career_id`, `skills`, `certifications`, `force`.

The response includes target career, readiness score, calculated skill gaps, cache metadata and a nested recommendation object.

## Readiness calculation

For each required skill:

`gap = max(required_level - current_level, 0)`

Weighted score:

`readiness_score = round(sum(weight * min(current_level, required_level)) / sum(weight * required_level) * 100)`

The result is bounded between 0 and 100 and is an estimate relative to the project's career catalogue.

## Common status codes

- `200`: successful retrieval or update
- `201`: student created
- `404`: student not found
- `409`: duplicate email
- `422`: request validation failed
- `500`: unexpected server error

Use `/docs` for the exact live schemas and interactive endpoint testing.
