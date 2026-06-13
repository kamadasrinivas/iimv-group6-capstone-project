# IIMV Monorepo Scaffold

This repository contains a starter scaffold for the IIMV voice triage MVP.

## Structure

- `mobile-app/` — React Native Expo app with speech recognition and offline cache.
- `backend-api/` — FastAPI backend with rule-first IMCI triage logic and LLM note generation placeholders.
- `dashboard/` — React dashboard for case review and pilot monitoring.

## Goals

- Rule-first IMCI triage logic, with LLM used for extraction and SOAP note generation.
- Offline audio/case cache in the mobile app, syncing to backend when available.
- Chatbot-style voice prompts with speech recognition.

## Next steps

1. Install dependencies in each folder.
2. Replace backend placeholder transcription logic with Whisper or your chosen ASR.
3. Configure Supabase or another database backend for production.
4. Build out the IMCI rule set and pilot conversation flow.
