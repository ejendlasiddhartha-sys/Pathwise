# Pathwise

**AI-assisted career readiness and skill-gap analysis for students.**

Pathwise helps students compare their current skills with role-specific benchmarks, understand skill gaps, and explore certifications and next steps.

> **Status:** Hackathon MVP / portfolio project. Career analysis and Gemini-backed recommendations are implemented. Authentication is currently simulated in the frontend and is not production-ready.

## Live application

- Frontend: https://pathwise-135u.vercel.app/
- Backend: https://pathwise-rj24.vercel.app
- Interactive API docs: https://pathwise-rj24.vercel.app/docs

## Features

- Student profile creation, retrieval and update through FastAPI endpoints.
- Career benchmark catalogue for Frontend Developer, Data Analyst, Cloud Engineer and Machine Learning Engineer.
- Skill-gap analysis with priority levels.
- Weighted readiness estimate from 0–100.
- Gemini-generated priority skills, certification suggestions and next steps.
- Curated recommendation fallback when Gemini is unavailable.
- Cached recommendations and explicit refresh support.

## How it works

1. The backend loads the selected role from `backend/app/data/careers.json`.
2. It compares reported skill levels with career requirements: `gap = max(required_level - current_level, 0)`.
3. It calculates a weighted readiness estimate:

   `readiness = (sum(weight × min(current_level, required_level)) / sum(weight × required_level)) × 100`

4. The recommendation service sends anonymised career-profile factors to Gemini.
5. If generation fails or returns invalid data, curated baseline recommendations are used.

Skill levels use a 0–5 scale. The readiness score is an indicative comparison against the included catalogue, not a validated employment prediction.

## Technology

| Layer | Stack |
|---|---|
| Frontend | React, JavaScript, Vite, Tailwind CSS |
| UI / routing | React Router, Lucide React, Recharts |
| API client | Axios |
| Backend | Python, FastAPI, SQLModel, Pydantic |
| AI | Google Gemini API (`google-genai`) |
| Database | SQLite locally; PostgreSQL supported for deployment |
| Hosting | Vercel |

## Structure

```text
Pathwise/
├── frontend/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── data/             # Sample dashboard data
│       ├── pages/
│       └── services/
├── backend/
│   ├── app/
│   │   ├── data/             # Career benchmark catalogue
│   │   ├── routes/
│   │   ├── services/
│   │   ├── database.py
│   │   ├── models.py
│   │   └── schemas.py
│   └── tests/
├── docs/
├── Pathwise_API_CONTRACT.md
├── CONTRIBUTING.md
└── LICENSE
```

## Run locally

### Prerequisites

- Node.js and npm
- Python 3.11+
- Gemini API key for live AI recommendations (optional; fallback data is available)

### Backend

```bash
git clone https://github.com/ejendlasiddhartha-sys/Pathwise.git
cd Pathwise/backend
python -m venv .venv
```

Activate the environment:

```powershell
# Windows PowerShell
.\.venv\Scripts\Activate.ps1
```

```bash
# macOS / Linux
source .venv/bin/activate
```

Install dependencies and create the local environment file:

```bash
pip install -r requirements.txt
```

Copy `backend/.env.example` to `backend/.env`, then configure:

```dotenv
APP_NAME=Pathwise
DATABASE_URL=sqlite:///./pathwise.db
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=http://localhost:5173
```

Run from the `backend` directory:

```bash
uvicorn app.main:app --reload
```

API: http://localhost:8000  
Docs: http://localhost:8000/docs

### Frontend

In a second terminal:

```bash
cd frontend
npm install
```

Copy `frontend/.env.example` to `frontend/.env` and set:

```dotenv
VITE_API_URL=http://localhost:8000
```

Run:

```bash
npm run dev
```

Open http://localhost:5173.

## API overview

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | API health |
| GET | `/api/test` | Connectivity test |
| POST | `/api/students` | Create student |
| GET | `/api/students/{id}` | Retrieve student |
| PUT | `/api/students/{id}` | Update student |
| GET | `/api/students/{id}/recommendations` | Retrieve or generate recommendations |
| POST | `/api/students/{id}/recommendations/refresh` | Force recommendation refresh |

Use `/docs` for exact request and response schemas.

## Environment variables

| Variable | Location | Purpose |
|---|---|---|
| `GEMINI_API_KEY` | Backend | Gemini API key; keep private |
| `DATABASE_URL` | Backend | SQLAlchemy database URL |
| `APP_NAME` | Backend | FastAPI application title |
| `FRONTEND_URL` | Backend | Allowed frontend CORS origin(s) |
| `VITE_API_URL` | Frontend | Backend base URL |

For deployment, configure secrets in the hosting provider's environment settings. Never commit real `.env` files. Variables beginning with `VITE_` are exposed to browser code.

## Known limitations

- Email/password, Google and Apple sign-in are simulated frontend flows; production authentication is not implemented.
- Some dashboard and profile experiences use local storage and sample data. Not every displayed value is necessarily a persisted database record.
- Gemini availability is external; curated benchmark data is used as a fallback.
- The career catalogue is limited and should not be treated as a complete labour-market dataset.
- Certification details should be verified with the issuing provider.
- Readiness is a product-defined estimate, not a guarantee of employability.

## Tests

Backend tests are in `backend/tests/`. From the backend directory:

```bash
python -m pytest
```

## Security

- Never commit `.env`, API keys, database credentials, tokens or real student data.
- Keep Gemini credentials on the backend only.
- If a secret was committed, rotate/revoke it and review Git history; deleting it from the latest commit is insufficient.

## Licence

GNU General Public License v3.0. See [LICENSE](LICENSE).
