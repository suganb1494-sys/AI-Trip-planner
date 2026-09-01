# AI Trip Planner POC

Full-stack proof of concept based on the supplied requirements: React + TypeScript, FastAPI, SQL persistence, deterministic budget calculation, destination RAG, tool orchestration, and conversational plan changes.

## Quick start

On Windows, start both the API and UI with one command:

```powershell
powershell -ExecutionPolicy Bypass -File .\start.ps1
```

If the API is not running, the UI automatically enters clearly labelled local demo mode instead of failing.

### Docker (recommended)

```bash
copy .env.example .env
docker compose up --build
```

- UI: http://localhost:5173
- API docs: http://localhost:8000/docs

### Local development

Backend (Python 3.11+):

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Frontend (Node 20+):

```bash
cd frontend
npm install
npm run dev
```

The app starts in `demo` mode. It uses deterministic provider adapters and curated destination knowledge, so it works without API keys. Set `DATA_MODE=live` and implement/configure provider credentials to enable real searches. The UI always labels records as `estimated`, `cached`, or `live`.

## Demo request

Use: `Plan a 5-day trip to Dubai for 2 people from Chennai under ₹1,50,000, starting 15 October 2026.`

Then try: `Replace the desert safari with a cheaper cultural activity.`

## Architecture

`React UI -> FastAPI -> trip orchestrator -> RAG + provider tools -> budget engine -> SQL database`

The orchestrator deliberately performs arithmetic in `budget.py`, not in an LLM. Provider results are normalized before reaching the planner. Missing dates return a clarification response rather than invented dates.

## API

- `POST /api/trips` create a trip from natural language
- `GET /api/trips/{id}` retrieve the persisted trip and plan
- `POST /api/trips/{id}/plan` create/regenerate the itinerary
- `POST /api/trips/{id}/chat` modify a plan while retaining context
- `GET /api/trips/{id}/messages`
- `GET /api/trips/{id}/budget`
- `GET /api/trips/{id}/weather`
- `GET /api/trips/{id}/map`
- `GET /health`

## Tests

```bash
cd backend
pytest
```

The tests cover extraction, missing dates, budget arithmetic, itinerary day count, persistence, and follow-up changes.
