# IIMV Project Implementation Plan

## 1. High-level design

- Build a voice-first clinical triage system for fever and respiratory illness.
- Target a CHO-facing mobile app on basic Android devices, with a backend API and pilot dashboard.
- Use the IMCI fever/ARI protocol as the decision engine.
- Keep MVP scope narrow:
  - Hindi and English voice triage only
  - Manual vitals entry
  - AI-generated SOAP note
  - 3-tier escalation: Home / PHC / Emergency
  - WhatsApp follow-up is out of scope for MVP

## 2. Recommended project structure

Create three main projects:

1. `mobile-app`
   - React Native + Expo
   - Voice UI with `expo-speech` and `expo-av`
   - Offline-first local cache with SQLite
   - Screens: login, patient intake, voice triage flow, manual vitals, case summary

2. `backend-api`
   - FastAPI (Python)
   - Endpoints for:
     - audio upload
     - transcription
     - symptom extraction
     - triage decision
     - SOAP note generation
     - case storage / retrieval
   - Integrations:
     - Whisper ASR
     - GPT-4o / Llama 3-based prompt pipeline
     - Supabase PostgreSQL
     - optional Redis/Celery for background tasks

3. `dashboard`
   - Simple web app for CHO / pilot admin
   - Show case log, status, and error review
   - Can be a separate React or Next.js project
   - Uses the same backend/API for data

Optional:
- `shared` library for prompt templates, IMCI rule definitions, and shared types if you want to keep mobile/backend model aligned.

## 3. Data acquisition strategy

Use two parallel data sources:

1. Protocol-derived seed data
   - Digitize the IMCI fever/ARI decision tree from the PDF.
   - Create structured templates for symptoms, danger signs, duration, severity, and red flags.
   - Use this to build prompt templates and initial validation data.

2. Pilot-collected real session data
   - Collect audio + transcript pairs from CHO-patient interactions.
   - Store:
     - recorded audio
     - Whisper transcription
     - extracted structured symptom values
     - manual vital signs
     - generated SOAP note
     - CHO-approved final decision
   - Annotate with clinical advisor review to measure accuracy.

Suggested acquisition process:
- Start with test phrases and controlled audio in Hindi and English.
- Move to live pilot at 2 sites.
- Capture 20–40 real triage sessions.
- Review outputs with clinicians and refine the extraction/decision logic.

## 4. Chatbot with speech recognition

Implement the chatbot as a guided clinical conversation, not as an open chat.

Key pieces:

- **Voice prompt engine**
  - Use `expo-speech` for Hindi and English TTS prompts.
  - Use `expo-av` to record patient responses.

- **Audio processing**
  - Send recorded audio to the backend.
  - Use OpenAI Whisper for ASR.
  - Optionally cache audio locally when offline, then sync later.

- **Structured conversation flow**
  - Define a finite-state IMCI interview flow.
  - At each step:
    - App asks one clinical question
    - User answers
    - Backend transcribes
    - NLP maps answer to structured fields
    - Next question is chosen based on IMCI logic

- **NLP / triage extraction**
  - Use prompt-engineered LLM or rules to convert transcript to:
    - chief complaint
    - symptom duration/severity
    - danger signs
    - related features
  - Apply the IMCI decision tree to generate escalation and risk flags.

- **SOAP note generation**
  - After collecting patient data and vitals, backend generates a draft SOAP note.
  - Present draft to CHO for review and approval.

- **Fallback / correction flow**
  - Include a manual correction screen for transcript errors.
  - If Whisper fails or text is unclear, allow CHO to type or choose from options.

## 5. Suggested 3-phase delivery plan

Sprint 1 — Foundation
- Digitize IMCI fever/ARI protocol.
- Scaffold Expo mobile app.
- Integrate Whisper ASR with sample Hindi and English audio.
- Stand up FastAPI + Supabase PostgreSQL.
- Write Hindi and English voice prompt scripts.

Sprint 2 — Build Core
- Build IMCI triage engine.
- Add SOAP note generation.
- Add manual vitals entry and danger alerts.
- Complete mobile ↔ backend integration.

Sprint 3 — Pilot & Validate
- Deploy pilot at 2 Arogya Mandirs.
- Collect real cases.
- Validate SOAP note accuracy.
- Fix UI/voice issues.
- Produce final demo/report.

## 6. Tech stack summary

From `IIMVProject.pdf`, use:

- `React Native + Expo` for mobile app
- `expo-speech`, `expo-av` for voice
- `SQLite` for offline cache
- `FastAPI` for backend
- `PostgreSQL` on Supabase
- `OpenAI Whisper` for ASR
- `GPT-4o` or local `Llama 3` for extraction / note generation
- `LangChain` style workflow + IMCI rule engine
- `Docker` + Railway/Render for deployment

## 7. Recommended repo layout

Root structure:

- `/mobile-app`
- `/backend-api`
- `/dashboard`
- `/shared` (optional)
- `/docs` (requirements, prompt design, IMCI flowchart)

## 8. Key architectural decisions

- Use a single workspace with separate folders for mobile, backend, and dashboard.
- Keep triage logic rule-based for safety, and use LLMs for extraction and note drafting.
- Provide offline support for audio and case caching with sync-on-connect.

## 9. Next steps

- Create the repo scaffolds for mobile, backend, and dashboard.
- Digitize the IMCI decision tree into structured data.
- Build the first end-to-end voice triage flow.
- Plan pilot data collection and clinical validation.
