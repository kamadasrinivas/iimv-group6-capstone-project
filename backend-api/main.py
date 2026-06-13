from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
from models import TriageRequest, TriageResponse, StructuredSymptomData
from triage import transcribe_audio_stub, extract_structured_data, apply_imci_rules, generate_soap_note
from database import init_db, save_case, list_cases

app = FastAPI(title='IIMV Backend API')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:19006', 'http://localhost:3000'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

init_db()

class TriageMetadata(BaseModel):
    patient: dict
    vitals: dict
    notes: str | None = None

@app.post('/api/triage', response_model=TriageResponse)
async def triage(audio: UploadFile = File(...), meta: str = Form(...)):
    metadata = TriageMetadata.parse_raw(meta)
    audio_bytes = await audio.read()
    transcription = transcribe_audio_stub(audio_bytes)
    structured = extract_structured_data(transcription)
    decision = apply_imci_rules(structured, TriageRequest(patient=metadata.patient, vitals=metadata.vitals, notes=metadata.notes))
    soap_note = generate_soap_note(transcription, structured, decision)
    save_case({
        'patient_name': metadata.patient.get('name', 'unknown'),
        'transcription': transcription,
        'escalation': decision['escalation'],
        'soap_note': soap_note,
    })
    return TriageResponse(
        transcription=transcription,
        structured=structured,
        escalation=decision['escalation'],
        soap_note=soap_note,
    )

@app.get('/api/cases')
def get_cases():
    return list_cases()
