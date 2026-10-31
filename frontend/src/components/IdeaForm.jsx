import { useState } from "react";
import { isValidTitle } from "../validation.mjs";

export default function IdeaForm({ onCreate, saving, canSubmit }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState({});

  async function handleSubmit(event) {
    event.preventDefault();

    if (saving || !canSubmit) return;
    const nextErrors = {};
    
    if (!isValidTitle(title)) nextErrors.title = "Please enter a title.";
    if (!category.trim()) nextErrors.category = "Please enter a category.";
    setError(nextErrors);

     if (Object.keys(nextErrors).length > 0) return;

    // App returns true only after the server accepts the idea.
   await onCreate({ title: title.trim(), category: category.trim() });
    setTitle("");
    setCategory("");
    setError({});
    setIsOpen(false);
  }

  return (
    <section className="form-panel" aria-labelledby="form-heading">
      <h2 id="form-heading">Share an idea </h2>

      {!isOpen ? (
        <button 
        type="button"
          className="create-button"
          onClick={() => setIsOpen(true)}
          aria-expanded={false}
          aria-controls="new-idea-form"
        >
          Create
        </button>
      ) : (
        <form id="new-idea-form" onSubmit={handleSubmit} noValidate>
          <p className="help-text">Both fields are required.</p>

        <label htmlFor="idea-title">Title</label>
        <input
            id="idea-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          placeholder="Enter a title"
          required
          readOnly={saving}
          aria-invalid={Boolean(error.title)}
          aria-describedby={error.title ? "title-error" : undefined}
        />

        {error.title && <p id="title-error" className="field-error" role="alert">{error.title}</p>}
        
        <label htmlFor="idea-category">Category</label>
       
        <input
            id="idea-category"
            type="text"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            placeholder="Enter a category"
            required
            readOnly={saving}
            aria-invalid={Boolean(error.category)}
            aria-describedby={
              error.category ? "category-error" : undefined
            }
        />
        {error.category && (
            <p id="category-error" className="field-error" role="alert">
              {error.category}
            </p>
          )}
        

         <button type="submit" disabled={saving || !canSubmit}>
            {saving ? "Saving…" : "Save"}
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() => setIsOpen(false)}
          >
            Close
          </button>

        {!canSubmit && <p className="help-text">Load the idea list before adding an idea.</p>}

      </form>
    )}
    </section>
  );
}
