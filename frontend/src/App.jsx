import { useEffect, useRef, useState } from "react";
import IdeaForm from "./components/IdeaForm.jsx";
import IdeaList from "./components/IdeaList.jsx";
import { readIdeas, createIdea } from "./api.js";

export default function App() {
  const [ideas, setIdeas] = useState([]);
  const [listStatus, setListStatus] = useState("loading");
  const [listError, setListError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [success, setSuccess] = useState("");
  const listController = useRef(null);
  const saveInProgress = useRef(false);

  async function loadIdeas() {
    listController.current?.abort();
    const controller = new AbortController();
    listController.current = controller;
    setListStatus("loading");
    setListError("");
    setSuccess("");
    try {
      const data = await readIdeas(controller.signal);
      if (controller.signal.aborted) return;
      setIdeas(data);
      setListStatus("ready");
    } catch (error) {
      if (controller.signal.aborted) return;
      setListError(error.message);
      setListStatus("error");
    }
  }

  useEffect(() => {
    loadIdeas();
    return () => listController.current?.abort();
  }, []);

  async function handleCreate(draft) {
    if (saveInProgress.current) return false;
    saveInProgress.current = true;
    setSaving(true);
    setSaveError("");
    setSuccess("");
    try {
      const idea = await createIdea(draft);
      setIdeas((current) => [...current.filter((item) => item.id !== idea.id), idea]);
      setSuccess("Idea added successfully.");
      return true;
    } catch (error) {
      setSaveError(error.message);
      return false;
    } finally {
      saveInProgress.current = false;
      setSaving(false);
    }
  }

  const statusMessage = saving ? "Saving your idea…"
    : listStatus === "loading" ? "Loading ideas…"
    : success || (listStatus === "ready" ? `${ideas.length} ${ideas.length === 1 ? "idea" : "ideas"} loaded.` : "");

  return (
    <main className="app-shell">
      <section className="app-card" aria-labelledby="page-title">
        <header className="app-header">
          <h1 id="page-title">IDEAS BOARD</h1>
          <p>Share an idea for your community.</p>
        </header>
        <div className="board-grid">
          <section className="list-panel" aria-labelledby="list-heading" aria-busy={listStatus === "loading"}>
            <h2 id="list-heading">Community ideas</h2>
            {listStatus === "ready" && <IdeaList ideas={ideas} />}
            {listStatus === "error" && <button className="retry-button" type="button" onClick={loadIdeas}>Retry loading ideas</button>}
          </section>
          <IdeaForm onCreate={handleCreate} saving={saving} canSubmit={listStatus === "ready"} />
        </div>
        <div className="feedback">
          <p className="status" role="status" aria-live="polite" aria-atomic="true">{statusMessage}</p>
          {listError && <p className="request-error" role="alert">Could not load ideas. {listError}</p>}
          {saveError && <p className="request-error" role="alert">Could not confirm the save. {saveError} Your fields have been kept.</p>}
        </div>
      </section>
    </main>
  );
}
