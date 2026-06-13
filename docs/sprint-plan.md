# IIMV Sprint Plan

This plan covers 9 weeks of development and pilot preparation for the IIMV voice triage MVP.

## Sprint 1 — Foundation (Weeks 1–4)

### Week 1
- Digitize IMCI fever/ARI decision tree as structured rules.
- Define the triage conversation flow and voice prompt sequence.
- Create the monorepo scaffold and initialize `mobile-app`, `backend-api`, and `dashboard`.

### Week 2
- Build the Expo mobile app scaffold.
- Add voice prompt playback and audio recording support.
- Create the FastAPI backend scaffold and DB schema.

### Week 3
- Integrate offline cache in the mobile app using SQLite.
- Add local pending case storage and sync logic.
- Implement the backend triage endpoint and initial data model.

### Week 4
- Validate Hindi and English voice prompt scripts.
- Test end-to-end voice recording upload from mobile to backend.
- Confirm rule-based IMCI logic returns expected escalation decisions.

## Sprint 2 — Core build (Weeks 5–8)

### Week 5
- Expand the IMCI rule engine and danger sign detection.
- Add transcript-to-structured symptom extraction.
- Build the SOAP note draft generation flow.

### Week 6
- Add manual vitals entry UI on the mobile app.
- Implement backend validation for SpO2 and fever thresholds.
- Add escalation decision logic for Home / PHC / Emergency.

### Week 7
- Improve offline sync handling and conflict resolution.
- Add CHO approval screens for SOAP note review.
- Create dashboard case listing and review views.

### Week 8
- Complete full integration testing of the mobile app, backend, and dashboard.
- Capture sample triage sessions in a staging environment.
- Refine prompt wording and UI flow based on initial feedback.

## Sprint 3 — Pilot & validate (Weeks 9–13)

### Week 9
- Deploy the app to pilot devices at 2 Arogya Mandirs.
- Train CHOs on using the voice triage flow.
- Start collecting real case data.

### Week 10
- Monitor pilot sessions and gather user feedback.
- Review case outputs with a clinical advisor.
- Adjust the IMCI rule set and transcription prompts.

### Week 11
- Validate SOAP note accuracy target.
- Fix UI and backend issues discovered during pilot use.
- Improve offline resilience and sync reliability.

### Week 12
- Perform final pilot validation and prepare metrics.
- Stabilize the mobile app and backend for demonstration.
- Collect at least 20–40 live triage sessions.

### Week 13
- Prepare the final report, demo materials, and presentation.
- Document pilot outcomes, success metrics, and risks.
- Plan next-phase enhancements beyond MVP.
