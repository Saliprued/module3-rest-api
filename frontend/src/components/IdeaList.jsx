export default function IdeaList({ ideas }) {
  if (ideas.length === 0) {
    return <p className="empty-state">No ideas yet. Add the first one.</p>;
  }
  return (
    <ul className="idea-list">
      {ideas.map((idea) => (
        <li className="idea-card" key={idea.id}>
          <h3>{idea.title}</h3>
          <p>Category: {idea.category}</p>
        </li>
      ))}
    </ul>
  );
}
