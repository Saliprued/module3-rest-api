# Phase 1 submission
Name: Sandra Perez Rueda
Course or section:
Chosen track: Python FastAPI


## My campus idea
Explain the idea in one sentence.

## Evidence log
folder screenshots

## Reflection
1. What does a controller do?
A controller receives requests, calls the appropriate code, and returns a response.
2. How is GET different from POST?
GET retrieves existing ideas (list). POST sends data to create a new idea. (add data)
3. How do JSON title and category become app data?
FastAPI reads the JSON and uses the IdeaRequest model to validate title and category and create a Python object.
4. Why does our added idea disappear after restarting?
Ideas are stored temporarily in memory. Restarting clears them and loads the two initial ideas again.
5. What would the React frontend need to know to use this API?React needs the API address, endpoints, HTTP methods, and JSON fields. The API must also allow requests from the React



