# FasalSathi — Spring Boot & React Application Module

This directory contains the Spring Boot 3.5 backend service and embedded Vite React 18 frontend for **FasalSathi**.

---

## Architecture Overview

```text
frontend/desktop-tutorial/
|-- pom.xml                                 # Spring Boot, JPA, DJL, Vosk, H2 dependencies
|-- models/
|   |-- crop_model.pt                       # TorchScript ML Model for leaf symptom classification
|   `-- classes.txt                         # Model class labels
|-- frontend/                               # Vite + React 18 SPA
|   |-- package.json
|   |-- vite.config.js                      # Configured dev server port 4173 & API proxy to 8080
|   `-- src/
|       |-- App.jsx                         # Main router (HomePage, DiagnosePage, HotspotsPage, OfficialDashboard, PestLogPage, ToolsPage)
|       |-- api/cropApi.js                  # Axios client hitting /api/v1
|       |-- components/                     # Navbar, Footer, WeatherCard, ActionCard, SafetyWarnings, etc.
|       `-- pages/                          # Application pages
`-- src/main/java/com/example/              # Spring Boot backend
    |-- CropDiseaseApiApplication.java
    |-- controller/                         # REST Controllers (CropPredictionController, FollowUpTaskController, PestObservationController, HotspotController, DashboardController, FarmController)
    |-- dto/                                # Data Transfer Objects
    |-- entity/                             # JPA Entities (FollowUpTask, PestObservation, Farm, PredictionLog, Referral, DiagnosisFeedback)
    |-- repository/                         # Spring Data JPA Repositories
    `-- service/                            # Core Business Services (WeatherService, AdvisoryService, HotspotService, WBCropKnowledgeBase, SpeechService, TranslationService)
```

---

## Core Capabilities

1. **AI Crop Diagnosis (`/diagnose`)**: Computer vision symptom identification with TorchScript ML inference, explainable advisories, IPDM multi-step action plans, and voice transcription.
2. **Follow-Up Task System (`/api/v1/follow-ups`)**: Auto-schedules field checks 7 days post-treatment with an interactive home screen alert banner.
3. **Geospatial Hotspots Map (`/hotspots`)**: Real-time 14-day district risk node cluster mapping (`/api/v1/hotspots`).
4. **Official Agriculture Dashboard (`/admin/dashboard`)**: State surveillance dashboard with district disease breakdown, 14-day trapping trends, and pending KVK lab review queue.
5. **Pest & Trap Logging (`/pest-log`)**: Manual & sensor trap count logging for pest population tracking (`/api/v1/pest-observations`).
6. **Ground-Truth Feedback & KVK Lab Referral**: Farmer feedback widget (`/api/v1/diagnosis-feedback`) and direct lab referral ticket creation (`/api/v1/referrals`).

---

## Build & Launch Commands

### Frontend Build
```powershell
cd frontend
npm install
npm run build
```

### Backend Build & Run
```powershell
mvn clean package
mvn spring-boot:run
```

### Access Points
- **Main App**: `http://localhost:8080` (or `http://localhost:4173/` during frontend dev)
- **API Base**: `http://localhost:8080/api/v1`
