import pytest
from fastapi.testclient import TestClient
from app.main import create_app

@pytest.fixture
def client():
    # Each test gets its own application and memory store.
    with TestClient(create_app()) as test_client:
        yield test_client

def test_greeting_returns_json(client):
    response = client.get("/api/hello")
    assert response.status_code == 200
    assert isinstance(response.json()["message"], str)

def test_valid_post_returns_created_idea(client):
    # Send client.post("/api/ideas", json={"title": ..., "category": ...}).
    response = client.post("/api/ideas", json={"title": "Host a hackathon", "category": "events"})
    # Assert 201 and check response.json() id, title, and category.
    assert response.status_code == 201
    assert type(response.json()["id"]) is int
    assert response.json()["title"] == "Host a hackathon"
    assert response.json()["category"] == "events"  
