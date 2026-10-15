import pytest
from app import store
from app.models import IdeaRequest
from app.store import IdeaStore

def test_fresh_store_contains_two_seed_ideas():
    # A unit test: no web server or HTTP client.
    store = IdeaStore()
    assert len(store.find_all()) == 2

def test_adding_idea_stores_title_and_category():
    # Arrange: fresh store and IdeaRequest.
    store = IdeaStore()
    request = IdeaRequest(title="Host a hackathon", category="events")
    # Act: call add(request).
    add_idea = store.add(request)

    # Assert: returned title/category and find_all contains the idea.
    assert add_idea.title == request.title
    assert add_idea.category == request.category
    assert add_idea in store.find_all()

def test_two_new_ideas_receive_different_ids():
    # Arrange: fresh store. Act: add two requests.
    store = IdeaStore()
    seed_ids = {idea.id for idea in store.find_all()}

    request1 = store.add(IdeaRequest(title="Organize a charity run", category="events"))
    request2 = store.add(IdeaRequest(title="Start a book club", category="clubs"))
    # Assert: ids differ, do not reuse seed ids, list size is four.
    assert request1.id != request2.id
    assert request1.id not in seed_ids
    assert request2.id not in seed_ids
    assert len(store.find_all()) == 4
