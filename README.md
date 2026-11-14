# Campus Idea Board

An application using react forntend connected to a REST API built with Python and FastAPI to view and submit campus ideas.

## Prerequisites

- Docker Desktop installed and running, with Docker Compose available.
- Python 3.10 or later. The local backend was developed using Python 3.14; the Docker image uses Python 3.12.
- Node.js 20.19 or later with npm, as required by Vite version.
- Internet access to install dependencies and download Docker images.
- A browser and two separate terminals. VS Code (Optional code editor)
- Postman for manual API testing.

## Run the API with Docker
Open a terminal in the project root (module3-rest-api), where Dockerfile and compose.yaml are located.

Stop any local API using port 8000 with Ctrl+C before starting the Docker API.

## Host port
The lesson uses host port 8080, but Docker could not bind to that port on my computer. This setup uses host port 8000 instead. The API still listens on port 8080 inside the container.

The API service in compose.yaml uses this port mapping:
```YAML
ports:
  - "127.0.0.1:8000:8080"
```  
The Dockerfile starts app.main:app because the FastAPI application is in app/main.py.

## Build and start
```Bash
docker compose up -d --build       
``` 
This builds the application image and starts the container in the background. The first build may take several minutes.

Check the service and its logs:
```Bash
docker compose ps
docker compose logs api
```

To start an existing container again:
```Bash
docker compose start
```
## Stop
Stop the container without removing it:
```Bash
docker compose stop
```
Stop and remove the project's containers and network:
```Bash
docker compose down
```
Run docker compose up -d --build again after changing the backend code.

## Local URLs and connection

| Service | URL |
| --- | --- |
| React frontend | http://localhost:5173 |
| FastAPI backend | http://localhost:8000 |
| FastAPI interactive API documentation | http://localhost:8000/docs |
| Ideas endpoint | http://localhost:8000/api/ideas |

Open the documentation URL to try the API directly.

## Install and run React

Docker runs the API. Start the React development server separately in another terminal:

```sh or powershell
cd frontend
npm install
npm run dev -- --port 5173 --strictPort
```
Open http://localhost:5173 to use the application. Keep this terminal running and press Ctrl+C to stop React. Install dependencies again only when they change.


## Run FastAPI locally instead of Docker

When you want to run the backend directly with Python. Stop the Docker API first with docker compose stop so port 8000 is available.
From the project root, create a virtual environment and install dependencies. If .venv already exists, skip its creation.

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

## Frontend connection and CORS
frontend/src/api.js uses this backend base URL:

```js
export const API_BASE_URL = "http://localhost:8000";
```

If the host port changes, update this value and the URLs used in the browser and Postman.

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

## Docker reflection

### 1. What is a Docker image?

A Docker image is a packaged template containing my application, and its dependencies, with the instructions needed to start the API. Docker builds it from the Dockerfile.

### 2. What is a Docker container?

A Docker container is an instance created from an image.  It executes my API in an isolated environment and makes it available through the configured port for it.

### 3. Why did my POST data disappear after replacing the container?

My application stored the ideas in memory. POST requests changed the running application's list, but those changes stay in memory. so, the container was replaced, the application restarts and loads the original ideas again, deleting stored data in-memory. To keep new ideas, I would need persistent storage, such as a database.