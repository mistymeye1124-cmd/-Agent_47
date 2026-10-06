"""
==========================================================
AGENT 47 PLATFORM - SQLITE DATABASE CONTROLLER
==========================================================
High-performance, zero-maintenance SQLite persistence engine.
Provides WAL (Write-Ahead Logging) mode for concurrent access,
automatic seeding, robust error-handling, and backup utilities.
"""

import os
import json
import sqlite3
import datetime
from pathlib import Path
from typing import Dict, Any, List, Optional

# Base directories
BASE_DIR = Path(__file__).resolve().parent.parent
DB_DIR = BASE_DIR / "database"
DB_PATH = DB_DIR / "agent47.db"
DEFAULT_PROFILE_JSON = BASE_DIR / "default_profile.json"

# Ensure directory exists
DB_DIR.mkdir(parents=True, exist_ok=True)

def get_connection() -> sqlite3.Connection:
    """Creates a configured connection to SQLite with WAL mode."""
    conn = sqlite3.connect(str(DB_PATH), check_same_thread=False)
    conn.row_factory = sqlite3.Row
    # High-performance pragma configs
    conn.execute("PRAGMA journal_mode=WAL;")
    conn.execute("PRAGMA synchronous=NORMAL;")
    conn.execute("PRAGMA foreign_keys=ON;")
    return conn

def init_db():
    """Initializes SQLite database tables and seeds defaults if empty."""
    with get_connection() as conn:
        cursor = conn.cursor()
        
        # 1. Config / Settings Table (Stores Profile Data, Security PIN, AI Bot configs)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS config (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );
        """)
        
        # 2. Contact Messages Table (Stored directly from public contact form)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS messages (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                message TEXT NOT NULL,
                date TEXT NOT NULL,
                read INTEGER DEFAULT 0,
                created_at TEXT NOT NULL
            );
        """)
        
        # 3. System Activity Logs
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS activity_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                action TEXT NOT NULL,
                details TEXT,
                ip_address TEXT,
                timestamp TEXT NOT NULL
            );
        """)
        
        conn.commit()

    # Seed Initial Data if empty
    seed_defaults()

def seed_defaults():
    """Seeds default profile, PIN, and bot configurations if not present."""
    now = datetime.datetime.now(datetime.timezone.utc).isoformat()
    
    with get_connection() as conn:
        cursor = conn.cursor()
        
        # Check if profile_data exists
        cursor.execute("SELECT value FROM config WHERE key = 'profile_data'")
        row = cursor.fetchone()
        if not row:
            profile_data = {}
            if DEFAULT_PROFILE_JSON.exists():
                try:
                    with open(DEFAULT_PROFILE_JSON, "r", encoding="utf-8") as f:
                        profile_data = json.load(f)
                except Exception as e:
                    print(f"Error reading default_profile.json: {e}")
            
            cursor.execute(
                "INSERT INTO config (key, value, updated_at) VALUES (?, ?, ?)",
                ("profile_data", json.dumps(profile_data, ensure_ascii=False), now)
            )
            print("--> [DB] Initialized default profile data in SQLite.")
            
        # Check Admin Passcode PIN (default: 1234)
        cursor.execute("SELECT value FROM config WHERE key = 'admin_pin'")
        if not cursor.fetchone():
            cursor.execute(
                "INSERT INTO config (key, value, updated_at) VALUES (?, ?, ?)",
                ("admin_pin", "1234", now)
            )
            print("--> [DB] Initialized default Admin PIN ('1234') in SQLite.")
            
        # Check Triple Bot Config
        cursor.execute("SELECT value FROM config WHERE key = 'triple_bot_config'")
        if not cursor.fetchone():
            default_bots = {
                "bot1Persona": {
                    "name": "BioBot (Personal Clone)",
                    "apiKey": "",
                    "model": "gemini-1.5-flash",
                    "enabled": True
                },
                "bot2Public": {
                    "name": "Omni AI (Public Voice Bot)",
                    "apiKey": "",
                    "model": "gemini-1.5-flash",
                    "enabled": True
                },
                "bot3Private": {
                    "name": "Master Copilot (Admin Only)",
                    "apiKey": "",
                    "model": "gemini-1.5-flash",
                    "enabled": True
                }
            }
            cursor.execute(
                "INSERT INTO config (key, value, updated_at) VALUES (?, ?, ?)",
                ("triple_bot_config", json.dumps(default_bots), now)
            )
            print("--> [DB] Initialized default Triple Bot config in SQLite.")
            
        conn.commit()

# ==========================================================
# PROFILE DATA OPERATIONS
# ==========================================================

def get_profile_data() -> Dict[str, Any]:
    """Retrieves current profile JSON data from SQLite."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT value FROM config WHERE key = 'profile_data'")
        row = cursor.fetchone()
        if row:
            try:
                return json.loads(row["value"])
            except Exception:
                pass
    return {}

def save_profile_data(data: Dict[str, Any]) -> bool:
    """Saves updated profile JSON data to SQLite."""
    now = datetime.datetime.now(datetime.timezone.utc).isoformat()
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO config (key, value, updated_at)
            VALUES ('profile_data', ?, ?)
            ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
        """, (json.dumps(data, ensure_ascii=False), now))
        conn.commit()
    return True

def reset_profile_data() -> Dict[str, Any]:
    """Resets profile data back to default_profile.json template."""
    default_data = {}
    if DEFAULT_PROFILE_JSON.exists():
        with open(DEFAULT_PROFILE_JSON, "r", encoding="utf-8") as f:
            default_data = json.load(f)
    save_profile_data(default_data)
    return default_data

# ==========================================================
# AUTH / PIN OPERATIONS
# ==========================================================

def get_admin_pin() -> str:
    """Retrieves current admin PIN from SQLite."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT value FROM config WHERE key = 'admin_pin'")
        row = cursor.fetchone()
        if row:
            return row["value"]
    return "1234"

def verify_admin_pin(entered_pin: str) -> bool:
    """Verifies submitted PIN against SQLite."""
    stored_pin = get_admin_pin()
    return str(entered_pin).strip() == str(stored_pin).strip()

def set_admin_pin(new_pin: str) -> bool:
    """Updates admin PIN in SQLite."""
    now = datetime.datetime.now(datetime.timezone.utc).isoformat()
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO config (key, value, updated_at)
            VALUES ('admin_pin', ?, ?)
            ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
        """, (str(new_pin).strip(), now))
        conn.commit()
    return True

# ==========================================================
# BOT / GEMINI CONFIG OPERATIONS
# ==========================================================

def get_triple_bot_config() -> Dict[str, Any]:
    """Retrieves Triple Bot configuration from SQLite."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT value FROM config WHERE key = 'triple_bot_config'")
        row = cursor.fetchone()
        if row:
            try:
                return json.loads(row["value"])
            except Exception:
                pass
    return {}

def save_triple_bot_config(config: Dict[str, Any]) -> bool:
    """Saves Triple Bot configuration to SQLite."""
    now = datetime.datetime.now(datetime.timezone.utc).isoformat()
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO config (key, value, updated_at)
            VALUES ('triple_bot_config', ?, ?)
            ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
        """, (json.dumps(config), now))
        conn.commit()
    return True

# ==========================================================
# CONTACT MESSAGES OPERATIONS
# ==========================================================

def get_all_messages() -> List[Dict[str, Any]]:
    """Retrieves all submitted contact messages ordered newest first."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id, name, email, message, date, read FROM messages ORDER BY created_at DESC")
        rows = cursor.fetchall()
        return [
            {
                "id": r["id"],
                "name": r["name"],
                "email": r["email"],
                "message": r["message"],
                "date": r["date"],
                "read": bool(r["read"])
            }
            for r in rows
        ]

def save_message(name: str, email: str, message: str, date_str: Optional[str] = None) -> Dict[str, Any]:
    """Saves a newly submitted contact message to SQLite."""
    now = datetime.datetime.now(datetime.timezone.utc).isoformat()
    msg_id = f"msg_{int(datetime.datetime.now().timestamp() * 1000)}"
    display_date = date_str or now
    
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO messages (id, name, email, message, date, read, created_at)
            VALUES (?, ?, ?, ?, ?, 0, ?)
        """, (msg_id, name, email, message, display_date, now))
        conn.commit()
        
    return {
        "id": msg_id,
        "name": name,
        "email": email,
        "message": message,
        "date": display_date,
        "read": False
    }

def mark_message_read(msg_id: str, is_read: bool = True) -> bool:
    """Marks message as read or unread in SQLite."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("UPDATE messages SET read = ? WHERE id = ?", (1 if is_read else 0, msg_id))
        conn.commit()
    return True

def delete_message(msg_id: str) -> bool:
    """Deletes message by ID from SQLite."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM messages WHERE id = ?", (msg_id,))
        conn.commit()
    return True

# ==========================================================
# DATABASE HEALTH & STATS
# ==========================================================

def get_db_stats() -> Dict[str, Any]:
    """Returns real-time SQLite database health and metrics."""
    db_size_bytes = DB_PATH.stat().st_size if DB_PATH.exists() else 0
    db_size_kb = round(db_size_bytes / 1024, 2)
    
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT sqlite_version() as version")
        version = cursor.fetchone()["version"]
        
        cursor.execute("SELECT COUNT(*) as count FROM messages")
        msg_count = cursor.fetchone()["count"]
        
        cursor.execute("SELECT COUNT(*) as count FROM messages WHERE read = 0")
        unread_count = cursor.fetchone()["count"]
        
        cursor.execute("SELECT updated_at FROM config WHERE key = 'profile_data'")
        row = cursor.fetchone()
        last_profile_update = row["updated_at"] if row else None
        
    return {
        "status": "online",
        "engine": "SQLite 3",
        "version": version,
        "db_path": str(DB_PATH.name),
        "db_size_kb": db_size_kb,
        "messages_total": msg_count,
        "messages_unread": unread_count,
        "last_profile_update": last_profile_update
    }

# Initialize on import
init_db()
