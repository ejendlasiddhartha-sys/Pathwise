# Pathwise
A Student Certification and Skill Gap analysis tool.

Pathwise is a web app that helps students see which skills and certifications stand between them and a career they want. A student will enter their background and goal. The app will compare that profile with the skills a career usually needs, then recommend what to learn next.

This repository is the milestone 1 foundation: a React frontend, a FastAPI backend, and a local SQLite database. Gemini-powered recommendations are planned for a later milestone and are not connected yet.

The project is free software under the GNU General Public License v3.0. See `LICENSE`.

## Problem being solved

Students often collect courses and certificates without a clear picture of what a target career still requires. Pathwise is meant to make that gap visible:

- What the student already studied or can do.
- What the career goal typically requires.
- Which skills or certifications are still missing.

Milestone 1 only prepares the app so the team can build those features on a working base.

## Technology stack

Frontend:

- React with JavaScript
- Vite
- Tailwind CSS
- React Router
- Axios
- Lucide React icons

Backend:

- Python
- FastAPI
- SQLModel
- Pydantic
- SQLite
- Uvicorn

AI:

- The Gemini API will be added in a later milestone. No API key belongs in the frontend.

## Project folder structure

```text
Pathwise/
├── frontend/
│   ├── public/                 Static files such as the favicon
│   ├── src/
│   │   ├── components/         Shared interface pieces, starting with the navbar
│   │   ├── pages/              One file per screen
│   │   ├── services/           Axios calls to the backend
│   │   ├── App.jsx             Routes
│   │   ├── main.jsx            React entry point
│   │   └── index.css           Tailwind import
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── app/
│   │   ├── routes/             HTTP endpoints
│   │   ├── services/           Business logic for later milestones
│   │   ├── data/               Local reference data for later milestones
│   │   ├── main.py             FastAPI app, CORS, and startup
│   │   ├── database.py         SQLite connection and table creation
│   │   ├── models.py           Database tables
│   │   └── schemas.py          Request and response shapes
│   ├── .env.example
│   └── requirements.txt
├── .gitignore
├── LICENSE
└── README.md
```

## Installation

Use two terminals. Install each side once.

### Frontend

Requirements: Node.js 20 or newer, with npm.

```powershell
cd frontend
npm install
copy .env.example .env
```

`frontend/.env` is only for your machine. It is ignored by Git. `VITE_API_URL` tells Axios where the backend lives.

### Backend

Requirements: Python 3.11 or newer.

From the repository root:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
```

`uvicorn` is installed without the optional `standard` extras. Those extras pull in PyYAML, which does not yet publish a Python 3.15 wheel, and building it locally is blocked on this machine. `uvicorn --reload` still works with Uvicorn's built-in reloader.

If PowerShell blocks the activate script, start the server with the virtual environment's Python directly:

```powershell
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

Run backend commands from the `backend` folder. `DATABASE_URL=sqlite:///./pathwise.db` creates the database file in that folder.

## Frontend startup

From `frontend`, after installation:

```powershell
npm run dev
```

If PowerShell blocks running scripts (npm.ps1), run `npm.cmd run dev` or run in Command Prompt.

Open http://localhost:5173.

## Backend startup

From `backend`, with the virtual environment active:

```powershell
uvicorn app.main:app --reload
```

The API runs at http://localhost:8000. Interactive docs are at http://localhost:8000/docs.

Start the backend before using the connection test on the home page.

## API endpoints

### `GET /health`

Checks that the API process is running.

```json
{
  "status": "ok",
  "application": "Pathwise"
}
```

### `GET /api/test`

Checks that the frontend can reach the API. The home page button calls this route.

```json
{
  "message": "Frontend successfully connected to Pathwise backend"
}
```

Unexpected server errors return HTTP 500 with a short `detail` message. The traceback stays in the backend terminal.

The browser is allowed to call this API from `http://localhost:5173` and `http://127.0.0.1:5173`.

## Database

SQLite is a single file, `backend/pathwise.db`. FastAPI creates the file and tables when the server starts. The file is listed in `.gitignore`, so each teammate gets their own local database.

The first table is `student`:

| Column | Type | Notes |
| --- | --- | --- |
| `id` | integer | Primary key, assigned automatically |
| `name` | string | Student name |
| `email` | string | Student email |
| `education` | string | Current education or background |
| `career_goal` | string | Career the student wants |

No student records are created in this milestone. `backend/app/database.py` owns the connection. Route files should not open SQLite themselves.

## Team development instructions

Four people can work in this repo without stepping on the setup:

1. Clone the repository and stay on a new branch for your task. Do not rewrite `main` history.
2. Copy both `.env.example` files to `.env` as shown above. Never commit `.env`, `pathwise.db`, or an API key.
3. Keep Gemini keys, when they exist, in `backend/.env` only. The React app must not contain secrets. Only variables that start with `VITE_` are visible in the browser.
4. Use one terminal for `npm run dev` and another for `uvicorn`.
5. Add a page in `frontend/src/pages` and register it in `App.jsx`. Put shared buttons and layout in `frontend/src/components`. Put every backend call in `frontend/src/services/api.js`.
6. Add an endpoint in a file under `backend/app/routes`, then include that router from `backend/app/main.py`. Put database tables in `models.py` and response shapes in `schemas.py`.
7. Add a Python package to `backend/requirements.txt` and a JavaScript package with npm, then tell the team. Do not add Docker, authentication, or an AI library until that milestone starts.
8. This project stays under the GNU GPL v3.0. Keep the existing `LICENSE` file with the code you share.
9. Before you say a screen works, click through it in the browser with the backend running.

Suggested split for the next milestone: one person on the student form, one on the API that saves a student, one on the dashboard layout, and one on sample career-skill data in `backend/app/data`.
