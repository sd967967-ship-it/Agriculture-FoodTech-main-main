# FasalSathi

FasalSathi is an AI-assisted crop health and farm-planning platform for farmers in West Bengal. It combines leaf-image diagnosis with practical treatment guidance, local weather and mandi context, KVK support, multilingual assistance, and follow-up field monitoring.

The application is designed to answer the useful question after a symptom is noticed: **what should I do next, and when should I ask an expert?**

## Highlights

- AI-assisted crop disease diagnosis from JPG, PNG, and WebP leaf images
- Confidence scores, alternative candidates, crop matching, and escalation guidance
- Integrated Pest and Disease Management recommendations grouped by cultural, biological, chemical, and preventive actions
- Safety guidance covering PPE, spray timing, drift, hygiene, children, animals, and pre-harvest intervals
- English, Bengali, and Hindi interface and advisory support
- District-aware weather, three-day forecasts, mandi prices, harvest guidance, and KVK contacts
- Browser voice input backed by the bundled Vosk speech model
- Seven-day diagnosis follow-up reminders
- Pest and trap observation logging
- West Bengal hotspot surveillance and agriculture-admin dashboard
- Diagnosis feedback and KVK laboratory referral workflows
- Farmer tools for crop planning, irrigation, storage, and profit estimation

## Product Areas

| Route | Purpose |
| --- | --- |
| `/` | Farmer dashboard, weather, market information, and follow-up reminders |
| `/diagnose` | Leaf-image diagnosis, advisory, feedback, and lab referral |
| `/hotspots` | District-level disease and pest surveillance map |
| `/pest-log` | Manual and sensor pest-trap observations |
| `/tools` | Harvest, irrigation, market, scheme, and profit-planning tools |
| `/admin/dashboard` | Agriculture-official KPIs, trends, and expert review queue |
| `/profile` | Farmer profile and saved farm information |

## Architecture

```text
React 18 + Vite + Tailwind
              |
              | Axios /api/v1
              v
Spring Boot REST API
  |       |        |         |
  |       |        |         +-- H2 local persistence
  |       |        +------------ Weather, mandi, harvest, and KVK services
  |       +--------------------- Vosk speech recognition
  +----------------------------- Python + TorchScript crop model
```

The React application is built into `frontend/desktop-tutorial/frontend/dist`. Spring Boot serves that build and the API on port `8080`, so the normal entry point is `http://localhost:8080`.

## Requirements

- Windows for the supplied `.bat` launchers
- Java JDK 17 or later
- Maven 3.9 or later
- Node.js 20 or later with npm
- Python 3 available on `PATH`, or configured through `PYTHON_EXE`
- The bundled crop model and Vosk model, included in the repository

The launcher can discover common Java and Maven installations. If automatic discovery does not find them, add them to `PATH` before starting the app.

## Quick Start

From the repository root:

```bat
run-app.bat
```

The script builds the frontend when needed, packages the Spring Boot application, waits for `/api/v1/health`, and opens the app at:

```text
http://localhost:8080
```

For first-time setup, use:

```bat
setup-and-run.bat
```

Do not open the frontend `index.html` directly. The production UI expects to be served by the Spring Boot application.

## Manual Development

Build the frontend:

```bat
cd frontend\desktop-tutorial\frontend
npm ci --legacy-peer-deps
npm run build
```

Run backend tests or start Spring Boot:

```bat
cd ..
mvn test
mvn spring-boot:run
```

The backend serves the previously generated frontend build. For frontend-only iteration, run `npm run dev` inside `frontend/desktop-tutorial/frontend`.

## Configuration

Configuration is read from `frontend/desktop-tutorial/src/main/resources/application.properties` and environment variables.

| Variable | Purpose |
| --- | --- |
| `SERVER_PORT` | HTTP port; defaults to `8080` |
| `CROP_MODEL_PATH` | Path to the TorchScript model; defaults to `models/crop_model.pt` |
| `CROP_MODEL_CLASSES` | Optional comma-separated model labels |
| `PYTHON_EXE` | Optional Python executable used for inference |
| `MANDI_API_KEY` | Optional `data.gov.in` key for live mandi data |
| `MANDI_RESOURCE_ID` | Optional official mandi resource identifier |
| `OPENWEATHER_API_KEY` | Optional weather provider key |
| `WEATHER_BASE_URL` | Weather service base URL |
| `TRANSLATION_API_URL` | Optional translation service endpoint |

PowerShell example:

```powershell
$env:PYTHON_EXE = "C:\Python312\python.exe"
$env:MANDI_API_KEY = "your-data-gov-api-key"
& .\run-app.bat
```

Keep API keys out of source control.

## API Overview

All API routes use the `/api/v1` prefix.

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/health` | Service readiness check |
| `GET` | `/districts` | West Bengal district metadata and KVK context |
| `GET` | `/crops` | Supported crops, stages, seasons, and diseases |
| `POST` | `/diagnose` | Multipart leaf-image diagnosis and advisory |
| `POST` | `/speech/transcribe` | Vosk audio transcription |
| `GET` | `/weather` | Weather and forecast by latitude and longitude |
| `GET` | `/mandi-prices` | District-aware market prices |
| `GET` | `/market-info` | Harvest and market information |
| `GET` | `/hotspots` | District surveillance clusters |
| `GET` | `/admin/dashboard` | Official dashboard statistics |
| `GET` / `POST` | `/pest-observations` | Read or create pest-trap observations |
| `GET` / `POST` / `PUT` | `/follow-ups` | Manage diagnosis follow-up tasks |
| `POST` | `/diagnosis-feedback` | Submit field verification feedback |
| `POST` | `/referrals` | Create a KVK laboratory referral |
| `GET` | `/farms/{id}/risk-forecast` | Calculate micro-climate disease risk |

Example health check:

```powershell
Invoke-RestMethod http://localhost:8080/api/v1/health
```

Example diagnosis request:

```powershell
curl.exe -X POST http://localhost:8080/api/v1/diagnose `
  -F "image=@leaf.jpg" `
  -F "cropType=Tomato" `
  -F "cropStage=Flowering" `
  -F "district=Nadia" `
  -F "observations=Brown spots on lower leaves" `
  -F "language=en"
```

## Repository Layout

```text
.
├── e2e/                              # Playwright smoke tests
├── data/                             # Project data assets
├── frontend/desktop-tutorial/
│   ├── frontend/                     # React/Vite client
│   ├── models/                       # TorchScript model and class labels
│   ├── src/main/java/com/example/    # Spring Boot API and services
│   ├── src/main/resources/           # Application config and inference script
│   └── pom.xml                       # Maven build
├── vosk-model-small-en-us-0.15/      # Local speech model
├── build-app.bat                     # Package the backend
├── run-app.bat                       # Build and launch the full app
├── setup-and-run.bat                 # Setup, build, and launch helper
└── playwright.config.ts
```

## Testing

Backend tests:

```bat
cd frontend\desktop-tutorial
mvn test
```

End-to-end smoke tests require the application to be running on port `8080`:

```powershell
npx playwright test e2e/smoke.spec.ts
```

The project also includes `TEST_REPORT.md` with the latest recorded verification results.

## Responsible Use

FasalSathi provides decision support, not a guaranteed diagnosis or a substitute for a qualified agronomist. Image quality, crop stage, weather, and local conditions affect results. Farmers should verify pesticide labels and legal use instructions, follow the recommended safety precautions and pre-harvest interval, and contact a KVK or agriculture expert when confidence is low, symptoms are severe, or the recommendation requests escalation.

The local H2 database and browser storage are intended for development and demonstration. Production deployments should add authenticated access, durable managed storage, backups, observability, and a formal review process for agronomic recommendations.

## License

No license has been declared for this repository yet. Add a license before distributing or reusing the project outside its intended hackathon or internal context.
