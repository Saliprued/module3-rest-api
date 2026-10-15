from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from app.models import Idea, IdeaRequest
from app.store import IdeaStore

def create_app() -> FastAPI:
    app = FastAPI(title="Campus Idea Board")
    store = IdeaStore()  # Fresh store per app; test clients can be isolated.

    # FastAPI normally uses 422 for validation errors. We supply this handler
    # so both classroom tracks use the same 400 error contract.
    @app.exception_handler(RequestValidationError)
    async def invalid_request(request: Request, error: RequestValidationError):
        return JSONResponse(status_code=400, content={"message": "Invalid request"})

    @app.get("/api/hello")
    def hello():
        # TODO 1: Personalize the message; keep the "message" key.
        return {"message": "Hello, this is Sandra from the Campus Idea Board!"}

    @app.get("/api/ideas") # TODO 2: Add the GET route decorator for /api/ideas.
    def get_ideas() -> list[Idea]:
        return store.find_all() # TODO 3: Return the store's read method result.

    @app.post("/api/ideas", status_code=201) # TODO 4: Add the POST route decorator for /api/ideas with status_code=201.
    def create_idea(request: IdeaRequest) -> Idea:
        # The supplied type annotation tells FastAPI to read and validate JSON.
        return store.add(request) # TODO 5: Return the idea created by the store's add method.

    return app

app = create_app()
