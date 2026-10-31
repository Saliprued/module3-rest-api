# Campus Idea Board

An application using react forntend connected to a REST API built with Python and FastAPI to view and submit campus ideas.

## Prerequisites

- Python 3.10 or later (the backend was developed using Python 3.14).
- Node.js 20.19 or later with npm, as required by Vite version.
- Internet access to install dependencies
- A browser and two separate terminals. VS Code (Optional code editor)
- Postman for manual API testing.


## Terminal 1: install and run FastAPI

Open the project root in VS Code and select Terminal > New Terminal.
Make sure this terminal is in the backend working directory described above.

### Windows PowerShell

```powershell
py -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn app.main:app --port 8000
```

These commands use the virtual environment directly, so activation is not required.
If `.venv` already exists, skip its creation.

### macOS or Linux

```sh
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python -m uvicorn app.main:app --port 8000
```


Keep this terminal running while using the frontend.

## Terminal 2: install and run React

Open another terminal at the same project root, then enter the frontend folder:

```sh or powershell
cd frontend
npm install
npm run dev -- --port 5173 --strictPort
```

Keep both terminals running. Press Ctrl+C in each terminal to stop its server.
On later runs, dependency installation is only needed if dependencies change; run the server command in each working directory.

## Local URLs and connection

| Service | URL |
| --- | --- |
| React frontend | http://localhost:5173 |
| FastAPI backend | http://localhost:8000 |
| FastAPI interactive API documentation | http://localhost:8000/docs |
| Ideas endpoint | http://localhost:8000/api/ideas |

Open the React URL to use the application. Open the documentation URL to try the API directly.
Use `localhost` consistently: `127.0.0.1` is a different origin for CORS.

`frontend/src/api.js` uses this backend base URL:

```js
export const API_BASE_URL = "http://localhost:8000";
```

If the backend runs on a different port, update that value.
The existing FastAPI app must allow requests from the frontend origin through CORS.

add CORSMiddleware to your existing FastAPI app this way:

```main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)
```

Do not create a second FastAPI app. Restart the backend after changing its configuration.

## GET and POST

- **GET `/api/hello`** returns a personalized greeting.
- **GET `/api/ideas`** returns the list of ideas with status **200**.
- **POST `/api/ideas`** creates an idea from a JSON body and returns it
  with a server-generated ID and status **201**.


Example POST body:

```json
{
  "title": "Host a hackathon",
  "category": "events"
}
```

Example successful POST response (the actual id comes from the backend):

```json
{
  "id": 3,
  "title": "Host a hackathon",
  "category": "events"
}
```

The form keeps the title and category in React state. It removes spaces from the beginning and end of both values. It does not send a title that is empty or contains only spaces.

The frontend checks the HTTP response to confirm the save worked. While saving, it shows “Saving…” and blocks another submission. After a successful save, it adds the idea to the board once, shows a success message, and clears the form.

If saving fails, the app shows an error and keeps what you typed. If loading fails, it shows an error and a Retry button. Retry loads the ideas again without refreshing the page. Progress and success messages use a status area; errors use alerts.

Required backend validation: direct POST requests with `title: ""` or `title: "   "` must return HTTP 400 and add no record. HTTP 422 does not meet that specific assignment requirement. This behavior needs verification against your existing backend.Its  Check the list before and after each invalid request to confirm it is unchanged.If the connection fails during saving, the idea might already be saved. Check the list before sending it again to avoid duplicates.


## Backend tests

Use a separate terminal, or stop the backend server first.

Windows PowerShell:

```powershell
.\.venv\Scripts\python.exe -m pytest -v
```

macOS or Linux:

```sh
.venv/bin/python -m pytest -v
```

## Frontend tests and production build

Inside Working directory (frontend folder) Use another terminal 

Windows PowerShell:

```powershell
.\.venv\Scripts\node --test tests/validation.test.mjs
```

and verify that:

1. A normal title is accepted.
2. An empty string is rejected.
3. A spaces-only string is rejected.

`npm run build` creates the production frontend in `frontend/dist/`. 