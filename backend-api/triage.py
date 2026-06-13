import os
import re
from typing import Any, Dict
from models import StructuredSymptomData, TriageRequest

IMCI_RULES = {
    'danger_signs': [
        'unable to drink',
        'vomiting everything',
        'stridor',
        'severe breathlessness',
        'convulsions',
    ],
}


def transcribe_audio_stub(file_bytes: bytes) -> str:
    # Replace this stub with Whisper or another ASR implementation.
    return 'Patient reports fever for 3 days with cough and mild breathlessness.'


def extract_structured_data(transcription: str) -> StructuredSymptomData:
    text = transcription.lower()
    complaint = 'fever / respiratory illness'
    duration_days = None
    fever = 'fever' in text
    cough = 'cough' in text
    breathlessness = 'breathlessness' in text or 'difficulty breathing' in text
    danger_signs = [s for s in IMCI_RULES['danger_signs'] if s in text]

    duration_match = re.search(r'(\d+)\s*(?:days|day)', text)
    if duration_match:
        duration_days = int(duration_match.group(1))

    return StructuredSymptomData(
        complaint=complaint,
        duration_days=duration_days,
        fever=fever,
        cough=cough,
        breathlessness=breathlessness,
        danger_signs=danger_signs,
    )


def apply_imci_rules(data: StructuredSymptomData, vitals: TriageRequest) -> Dict[str, Any]:
    escalation = 'Home care with follow-up'
    flags = []

    if data.danger_signs:
        escalation = 'Emergency referral'
        flags.extend(data.danger_signs)
    elif data.breathlessness:
        escalation = 'PHC referral'
    elif data.fever and data.duration_days and data.duration_days >= 3:
        escalation = 'PHC referral'

    if vitals.vitals.spo2 is not None and vitals.vitals.spo2 < 92:
        escalation = 'Emergency referral'
        flags.append('low SpO2')
    if vitals.vitals.temperature is not None and vitals.vitals.temperature >= 102.0:
        flags.append('high fever')

    return {
        'escalation': escalation,
        'flags': flags,
    }


def generate_soap_note(transcription: str, structured: StructuredSymptomData, decision: Dict[str, Any]) -> str:
    openai_api_key = os.getenv('OPENAI_API_KEY')
    if openai_api_key:
        try:
            import openai
            openai.api_key = openai_api_key
            prompt = (
                'Create a concise SOAP note for a patient with the following information:\n'
                f'Transcription: {transcription}\n'
                f'Symptoms: fever={structured.fever}, cough={structured.cough}, breathlessness={structured.breathlessness}\n'
                f'Duration: {structured.duration_days} days\n'
                f'Danger signs: {structured.danger_signs}\n'
                f'Escalation: {decision["escalation"]}'
            )
            response = openai.ChatCompletion.create(
                model='gpt-4o-mini',
                messages=[{'role': 'user', 'content': prompt}],
                max_tokens=250,
            )
            return response.choices[0].message.content.strip()
        except Exception:
            pass

    return (
        'S: Patient reports fever, cough, and breathlessness.\n'
        f'O: Temperature check indicates fever. SpO2 and BP recorded by CHO.\n'
        f'A: Likely acute respiratory infection with possible risk factors {structured.danger_signs}.\n'
        f'P: {decision["escalation"]} and follow-up in 24-48 hours.'
    )
