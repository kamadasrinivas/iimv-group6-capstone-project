import sqlite3
from typing import Dict, Any

DB_PATH = 'triage_cases.db'
connection = sqlite3.connect(DB_PATH, check_same_thread=False)
connection.row_factory = sqlite3.Row

def init_db() -> None:
    cursor = connection.cursor()
    cursor.execute(
        '''
        CREATE TABLE IF NOT EXISTS triage_cases (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_name TEXT,
            transcription TEXT,
            escalation TEXT,
            soap_note TEXT
        )
        ''',
    )
    connection.commit()

def save_case(case: Dict[str, Any]) -> int:
    cursor = connection.cursor()
    cursor.execute(
        'INSERT INTO triage_cases (patient_name, transcription, escalation, soap_note) VALUES (?, ?, ?, ?)',
        (case['patient_name'], case['transcription'], case['escalation'], case['soap_note']),
    )
    connection.commit()
    return cursor.lastrowid

def list_cases() -> list[Dict[str, Any]]:
    cursor = connection.cursor()
    cursor.execute('SELECT id, patient_name, transcription, escalation, soap_note FROM triage_cases ORDER BY id DESC')
    return [dict(row) for row in cursor.fetchall()]
