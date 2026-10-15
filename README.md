# Campus Idea Board

A REST API built with Python and FastAPI to view and submit campus ideas.

## Requirements

- Python 3.10 or later (developed using Python 3.14)
- Internet access to install dependencies
- Postman for manual API testing

## Setup and run
Open the project folder in VS Code. In Terminal → New Terminal,
use PowerShell and make sure you are in the folder containing
`requirements.txt`.

Create an isolated environment:

macOS or Linux:
```sh
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --port 8000
```

Windows PowerShell:
```powershell
py -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn app.main:app --port 8000
```
These commands use the virtual environment directly, so activation
is not required.

Open http://localhost:8000/docs to try the endpoints.

Press Ctrl+C to stop the server.


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

Ideas are stored in memory. Restarting the server resets the list
to the two seed ideas.


## Run tests

```powershell
.\.venv\Scripts\python.exe -m pytest -v
```


