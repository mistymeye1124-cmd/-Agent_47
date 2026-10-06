"""
==========================================================
AGENT 47 PLATFORM - REST API & FULL-STACK SERVER
==========================================================
High-speed FastAPI ASGI server powered by SQLite database.
Serves full REST API (/api/*) + Portfolio & Stealth Admin static assets.
"""

import os
import sys
from pathlib import Path
from typing import Dict, Any, Optional

import uvicorn
from fastapi import FastAPI, HTTPException, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from database import db

# Load environment variables from .env if present
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# Base project path
BASE_DIR = Path(__file__).resolve().parent

app = FastAPI(
    title="Agent 47 Platform API",
    description="Military-grade backend & SQLite persistence engine for Agent 47 Portfolio & Admin CMS",
    version="2.0.0"
)

# CORS Policy (Allows seamless connection from local dev & reverse proxies)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================================
# Pydantic Request Models
# ==========================================================

class MessageCreateRequest(BaseModel):
    name: str
    email: str
    message: str
    date: Optional[str] = None

class MessageReadRequest(BaseModel):
    read: bool = True

class PinVerifyRequest(BaseModel):
    pin: str

class PinChangeRequest(BaseModel):
    current_pin: str
    new_pin: str

# ==========================================================
# REST API ENDPOINTS (/api/*)
# ==========================================================

@app.get("/api/health", tags=["System"])
def api_health():
    """Returns database health, SQLite version, and statistics."""
    stats = db.get_db_stats()
    return {
        "status": "healthy",
        "database": stats,
        "api_version": "2.0.0"
    }

# --- Profile Endpoints ---

@app.get("/api/profile", tags=["Profile"])
def get_profile():
    """Retrieves full portfolio and CMS profile JSON from SQLite."""
    data = db.get_profile_data()
    return data

@app.post("/api/profile", tags=["Profile"])
async def save_profile(request: Request):
    """Saves updated profile JSON data to SQLite."""
    try:
        payload = await request.json()
        if not isinstance(payload, dict):
            raise HTTPException(status_code=400, detail="Profile data must be a JSON object")
        db.save_profile_data(payload)
        return {"success": True, "message": "Profile saved to SQLite successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.post("/api/profile/reset", tags=["Profile"])
def reset_profile():
    """Resets profile data back to factory default template in SQLite."""
    data = db.reset_profile_data()
    return {"success": True, "message": "Reset profile to defaults", "data": data}

# --- Contact Messages Endpoints ---

@app.get("/api/messages", tags=["Messages"])
def get_messages():
    """Retrieves all submitted contact messages from SQLite."""
    return db.get_all_messages()

@app.post("/api/messages", tags=["Messages"])
def create_message(msg: MessageCreateRequest):
    """Stores a message from public contact form into SQLite."""
    if not msg.name.strip() or not msg.email.strip() or not msg.message.strip():
        raise HTTPException(status_code=400, detail="Name, email, and message are required")
    saved = db.save_message(
        name=msg.name.strip(),
        email=msg.email.strip(),
        message=msg.message.strip(),
        date_str=msg.date
    )
    return {"success": True, "data": saved}

@app.put("/api/messages/{msg_id}/read", tags=["Messages"])
def update_message_read(msg_id: str, body: MessageReadRequest):
    """Marks a message as read or unread in SQLite."""
    db.mark_message_read(msg_id, body.read)
    return {"success": True, "id": msg_id, "read": body.read}

@app.delete("/api/messages/{msg_id}", tags=["Messages"])
def delete_message(msg_id: str):
    """Deletes a contact message from SQLite."""
    db.delete_message(msg_id)
    return {"success": True, "id": msg_id}

# --- Security & PIN Endpoints ---

@app.post("/api/auth/verify", tags=["Auth"])
def verify_pin(body: PinVerifyRequest):
    """Verifies submitted PIN against SQLite."""
    valid = db.verify_admin_pin(body.pin)
    return {"valid": valid}

@app.post("/api/auth/pin", tags=["Auth"])
def update_pin(body: PinChangeRequest):
    """Updates admin PIN in SQLite after verifying current PIN."""
    if not db.verify_admin_pin(body.current_pin):
        raise HTTPException(status_code=403, detail="Current PIN is incorrect")
    if not body.new_pin or len(body.new_pin.strip()) < 4:
        raise HTTPException(status_code=400, detail="New PIN must be at least 4 characters")
    db.set_admin_pin(body.new_pin.strip())
    return {"success": True, "message": "Security PIN updated in SQLite"}

# --- AI Bot Configuration Endpoints ---

@app.get("/api/config/bots", tags=["AI Bots"])
def get_bot_config():
    """Retrieves Triple Bot configuration and API keys from SQLite."""
    return db.get_triple_bot_config()

@app.post("/api/config/bots", tags=["AI Bots"])
async def save_bot_config(request: Request):
    """Saves Triple Bot configuration to SQLite."""
    try:
        payload = await request.json()
        if not isinstance(payload, dict):
            raise HTTPException(status_code=400, detail="Config must be a JSON object")
        db.save_triple_bot_config(payload)
        return {"success": True, "message": "Triple bot config saved to SQLite"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- Database Backup Download Endpoint ---

@app.get("/api/db/download", tags=["Database"])
def download_database():
    """Allows admin to download a binary backup of agent47.db."""
    db_file = BASE_DIR / "database" / "agent47.db"
    if not db_file.exists():
        raise HTTPException(status_code=404, detail="Database file not found")
    return FileResponse(
        path=str(db_file),
        filename="agent47.db",
        media_type="application/x-sqlite3"
    )

# ==========================================================
# STATIC FILES & WEB APPLICATION ROUTES
# ==========================================================

# Dedicated routes for clean URLs
@app.get("/", include_in_schema=False)
def serve_home():
    return FileResponse(str(BASE_DIR / "index.html"))

@app.get("/admin", include_in_schema=False)
def serve_admin():
    return FileResponse(str(BASE_DIR / "admin.html"))

@app.get("/admin.html", include_in_schema=False)
def serve_admin_html():
    return FileResponse(str(BASE_DIR / "admin.html"))

# Mount CSS & JS static asset folders
css_dir = BASE_DIR / "css"
if css_dir.exists():
    app.mount("/css", StaticFiles(directory=str(css_dir)), name="css")

js_dir = BASE_DIR / "js"
if js_dir.exists():
    app.mount("/js", StaticFiles(directory=str(js_dir)), name="js")

# Mount any root-level static assets (e.g. icons, images)
app.mount("/", StaticFiles(directory=str(BASE_DIR), html=True), name="static")

# ==========================================================
# ENTRYPOINT RUNNER
# ==========================================================

if __name__ == "__main__":
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    port = int(os.environ.get("PORT", 8000))
    print("\n" + "="*58)
    print("      >> AGENT 47 PLATFORM - SERVER ONLINE")
    print("="*58)
    print(f"  [+] Live Website:     http://localhost:{port}")
    print(f"  [+] Admin Studio:    http://localhost:{port}/admin.html")
    print(f"  [+] API Health:       http://localhost:{port}/api/health")
    print(f"  [+] Interactive Docs: http://localhost:{port}/docs")
    print("="*58 + "\n")
    uvicorn.run("server:app", host="0.0.0.0", port=port, reload=False)
