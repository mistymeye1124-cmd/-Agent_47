FROM python:3.12-slim

WORKDIR /app

# Prevent Python from writing pyc files and buffering stdout
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY . .

# Ensure database directory exists
RUN mkdir -p /app/database

ENV PORT=8000
EXPOSE 8000

CMD ["python", "server.py"]
