import os
import sqlite3
from contextlib import closing
from pathlib import Path

from fastapi import HTTPException
from app.models import Idea, IdeaRequest


def connect():
    path = Path(os.environ.get("DB_PATH", "data/ideas.db"))
    path.parent.mkdir(parents=True, exist_ok=True)

    conn = sqlite3.connect(path)
    conn.row_factory = sqlite3.Row
    return conn


def initialize():
    schema = Path(__file__).with_name("schema.sql").read_text()

    with closing(connect()) as conn:
        conn.executescript(schema)
        conn.commit()


class IdeaStore:
    """Stores ideas in SQLite."""

    def __init__(self):
        initialize()

    def find_all(self) -> list[Idea]:
        with closing(connect()) as conn:
            rows = conn.execute(
                "SELECT id, title, category FROM ideas ORDER BY id"
            ).fetchall()

            return [
                Idea(
                    id=row["id"],
                    title=row["title"],
                    category=row["category"],
                )
                for row in rows
            ]

    def add(self, request: IdeaRequest) -> Idea:
        title = request.title.strip()
        category = request.category.strip()

        if not title or not category:
            raise HTTPException(
                status_code=400,
                detail="Title and category cannot be blank.",
            )

        with closing(connect()) as conn:
            cursor = conn.execute(
                "INSERT INTO ideas (title, category) VALUES (?, ?)",
                (title, category),
            )
            conn.commit()

            return Idea(
                id=cursor.lastrowid,
                title=title,
                category=category,
            )