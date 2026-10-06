"""
==========================================================
AGENT 47 PLATFORM - DATABASE CLI MANAGER
==========================================================
Utility script for inspecting, backing up, and managing
the Agent 47 SQLite database from the command line.

Usage:
  python db_manager.py status
  python db_manager.py backup
  python db_manager.py reset-pin <new_pin>
  python db_manager.py seed
  python db_manager.py export
"""

import sys
import json
import shutil
import datetime
from pathlib import Path
from database import db

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "database" / "agent47.db"
BACKUP_DIR = BASE_DIR / "database" / "backups"

def cmd_status():
    stats = db.get_db_stats()
    pin = db.get_admin_pin()
    print("\n" + "="*50)
    print("      AGENT 47 DATABASE STATUS (SQLITE 3)")
    print("="*50)
    print(f"  Database File:    {stats['db_path']}")
    print(f"  Database Size:    {stats['db_size_kb']} KB")
    print(f"  SQLite Version:   {stats['version']}")
    print(f"  Health Status:    ONLINE / HEALTHY")
    print(f"  Admin PIN:        {pin}")
    print(f"  Total Messages:   {stats['messages_total']}")
    print(f"  Unread Messages:  {stats['messages_unread']}")
    print(f"  Last Update:      {stats['last_profile_update']}")
    print("="*50 + "\n")

def cmd_backup():
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_file = BACKUP_DIR / f"agent47_backup_{timestamp}.db"
    if DB_PATH.exists():
        shutil.copy2(DB_PATH, backup_file)
        print(f"[OK] Backup created successfully: {backup_file}")
    else:
        print("[ERROR] Database file not found!")

def cmd_reset_pin(new_pin: str):
    if not new_pin:
        print("[ERROR] Please provide a new PIN. Example: python db_manager.py reset-pin 1234")
        return
    db.set_admin_pin(new_pin)
    print(f"[OK] Admin PIN successfully updated to: {new_pin}")

def cmd_seed():
    db.reset_profile_data()
    print("[OK] Profile data re-seeded to factory defaults in SQLite.")

def cmd_export():
    profile = db.get_profile_data()
    messages = db.get_all_messages()
    export_data = {
        "exported_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "admin_pin": db.get_admin_pin(),
        "profile": profile,
        "messages": messages,
        "triple_bot_config": db.get_triple_bot_config()
    }
    export_file = BASE_DIR / "database" / f"export_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(export_file, "w", encoding="utf-8") as f:
        json.dump(export_data, f, indent=2, ensure_ascii=False)
    print(f"[OK] Database exported to JSON: {export_file}")

def main():
    if len(sys.argv) < 2:
        cmd_status()
        print("Available commands: status, backup, reset-pin <pin>, seed, export")
        return
    
    cmd = sys.argv[1].lower()
    if cmd == "status":
        cmd_status()
    elif cmd == "backup":
        cmd_backup()
    elif cmd == "reset-pin":
        if len(sys.argv) > 2:
            cmd_reset_pin(sys.argv[2])
        else:
            print("Usage: python db_manager.py reset-pin <new_pin>")
    elif cmd == "seed":
        cmd_seed()
    elif cmd == "export":
        cmd_export()
    else:
        print(f"Unknown command '{cmd}'. Available: status, backup, reset-pin, seed, export")

if __name__ == "__main__":
    main()
