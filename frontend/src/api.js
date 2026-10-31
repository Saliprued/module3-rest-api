// Change this URL if FastAPI runs on a different host or port
export const API_BASE_URL = "http://localhost:8000";


// GET: read the list of ideas.
export async function readIdeas() {
  const response = await fetch(`${API_BASE_URL}/api/ideas`);

  if (!response.ok) {
    throw new Error(`Could not load ideas (${response.status}).`);
  }

  const ideas = await response.json();


  return ideas;
}

// POST: send a new idea.
export async function createIdea(draft) {
  const payload = JSON.stringify(draft);

  const response = await fetch(`${API_BASE_URL}/api/ideas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: payload,
  });

  if (!response.ok) {
    throw new Error(`Could not save idea (${response.status}).`);
  }

  const idea = await response.json();

  return idea;
}