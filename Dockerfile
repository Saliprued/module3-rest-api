# Adapt the final app import path to your actual Phase 1 project.
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN mkdir -p /app/data && useradd --uid 10001 --create-home student \
    && chown -R student:student /app
ENV DB_PATH=/app/data/ideas.db
USER student
EXPOSE 8080
CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
