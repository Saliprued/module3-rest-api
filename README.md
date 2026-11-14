# Campus Idea Board

A React and FastAPI application to view and add campus ideas. SQLite saves the ideas.

## Prerequisites

- Docker Desktop installed and running, with Docker Compose available.
- Python 3.10 or later. The local backend was developed using Python 3.14; the Docker image uses Python 3.12.
- Node.js 20.19 or later with npm, as required by Vite version.
- Internet access to install dependencies and download Docker images.
- A browser and two separate terminals. VS Code (Optional code editor)
- Postman for manual API testing.

## Run locally

Stop the Docker API first to free port 8000:

docker compose stop

From the project root, run these Windows PowerShell commands. Skip the first command if .venv already exists:

py -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn app.main:app --port 8000

In another terminal, start React:

cd frontend
npm install
npm run dev -- --port 5173 --strictPort

Press Ctrl+C in each terminal to stop the servers.

## Frontend connection and CORS

The existing FastAPI application allows requests from the React origin through CORS:

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

## Run with Docker
Start or rebuild the API:

docker compose up -d --build

Check its status and logs:

docker compose ps
docker compose logs api

Stop it:

docker compose stop

Remove the containers and network:

docker compose down

React runs separately using the commands above

## SQLite database

The database file is data/ideas.db locally and /app/data/ideas.db in Docker. Each stores its own data.

The ideas table has three columns:

|Column| Description|
|id| ID created by SQLite|
|title| Title, cannot be blank|
|category|Category, cannot be blank|

At startup, app/store.py uses app/schema.sql to create the table if needed. Existing ideas stay saved.

GET /api/ideas reads ideas. POST /api/ideas checks and saves a new idea using SQL parameters, then returns its ID.

## Local URLs and connection

- React: http://localhost:5173
- API: http://localhost:8000
- API documentation: http://localhost:8000/docs

Docker maps port 8000 on the computer to port 8080 inside the container:

ports:
  - "127.0.0.1:8000:8080"

The browser still uses port 8000. If you change that host port, also update the backend URL in frontend/src/api.js.


## GET and POST

- **GET `/api/hello`** shows a greeting.
- **GET `/api/ideas`** shows all ideas with status **200**.
- **POST `/api/ideas`** adds an idea from a JSON body and returns it
  with a server-generated ID and status **201**.


Example POST body:

```json
{
  "title": "Host a hackathon",
  "category": "events"
}
```

The form checks the title before sending it. After saving, it shows the new idea and clears the form. If something fails, it shows an error.

The backend must reject empty titles with 400 and add nothing.

## Run tests

Backend tests, from the project root:
.\.venv\Scripts\python.exe -m pytest -v

Frontend tests and build, from the frontend folder:
node --test tests/validation.test.mjs
npm run build

## Keep data in Docker
This setting in compose.yaml stores the database in a named volume:
volumes:
  - ideas-data:/app/data
The volume is declared at the bottom of the file:
volumes:
  ideas-data:

## Check saved data
Create an idea using POST /api/ideas. Use GET /api/ideas and note its ID, title, and category.

Replace the container:
docker compose down
docker compose up -d
Run GET again. The same idea should still appear.

Do not use docker compose down -v if you want to keep the database. That command removes the volume.

## Frontend tests and production build

Inside Working directory (frontend folder) Use another terminal 

Windows PowerShell:
.\.venv\Scripts\node --test tests/validation.test.mjs

and verify that:

1. A normal title is accepted.
2. An empty string is rejected.
3. A spaces-only string is rejected.

`npm run build` creates the production frontend in `frontend/dist/`. 

## Docker reflection

### 1. What is a Docker image?

A Docker image is a packaged template containing my application, and its dependencies, with the instructions needed to start the API. Docker builds it from the Dockerfile.

### 2. What is a Docker container?

A Docker container is an instance created from an image.  It executes my API in an isolated environment and makes it available through the configured port for it.

### 3. Why did my POST data disappear after replacing the container?

My application stored the ideas in memory. POST requests changed the running application's list, but those changes stay in memory. so, the container was replaced, the application restarts and loads the original ideas again, deleting stored data in-memory. To keep new ideas, I would need persistent storage, such as a database.

### 4. Why data survives now with SQLite
Because at the first ideas were stored in memory, but with SQLite saves ideas in a database file. The Docker volume keeps that file when the container is replaced.