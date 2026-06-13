from pydantic import BaseModel
from typing import List, Optional

class Vitals(BaseModel):
    temperature: Optional[float] = None
    blood_pressure_systolic: Optional[int] = None
    blood_pressure_diastolic: Optional[int] = None
    spo2: Optional[int] = None

class PatientInfo(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None

class TriageRequest(BaseModel):
    patient: PatientInfo
    vitals: Vitals
    notes: Optional[str] = None

class StructuredSymptomData(BaseModel):
    complaint: str
    duration_days: Optional[int] = None
    fever: bool = False
    cough: bool = False
    breathlessness: bool = False
    danger_signs: List[str] = []

class TriageResponse(BaseModel):
    transcription: str
    structured: StructuredSymptomData
    escalation: str
    soap_note: str
