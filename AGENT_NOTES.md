# AGENT_NOTES

## 1) Exact setup and run commands

### Backend build

```powershell
cd C:\Users\sd967\Downloads\Agriculture-FoodTech\frontend\desktop-tutorial
set PATH=C:\apache-maven-3.9.9\bin;%PATH%
mvn test
```

### Backend run

```powershell
cd C:\Users\sd967\Downloads\Agriculture-FoodTech\frontend\desktop-tutorial
set PATH=C:\apache-maven-3.9.9\bin;%PATH%
mvn spring-boot:run
```

### Frontend build

```powershell
cd C:\Users\sd967\Downloads\Agriculture-FoodTech\frontend\desktop-tutorial\frontend
powershell -NoProfile -ExecutionPolicy Bypass -Command "npm ci --legacy-peer-deps; npm run build"
```

### Frontend dev server

```powershell
cd C:\Users\sd967\Downloads\Agriculture-FoodTech\frontend\desktop-tutorial\frontend
powershell -NoProfile -ExecutionPolicy Bypass -Command "npm run dev -- --host 0.0.0.0 --port 4173"
```

### Full stack launch via repo scripts

```powershell
cd C:\Users\sd967\Downloads\Agriculture-FoodTech
run-app.bat
```

### Regression checks

```powershell
cd C:\Users\sd967\Downloads\Agriculture-FoodTech
npx playwright test e2e/smoke.spec.ts
```

## 2) Real project structure

```text
Agriculture-FoodTech/
├─ AGENT_NOTES.md
├─ TASKS.md
├─ README.md
├─ plan.md
├─ run-app.bat
├─ setup-and-run.bat
├─ build-app.bat
├─ SETUP_GUIDE.md
├─ TEST_REPORT.md
├─ e2e/
│  └─ smoke.spec.ts
├─ frontend/
│  └─ desktop-tutorial/
│     ├─ pom.xml
│     ├─ models/
│     │  ├─ crop_model.pt
│     │  └─ classes.txt
│     ├─ frontend/
│     │  ├─ package.json
│     │  ├─ public/
│     │  └─ src/
│     │     ├─ api/
│     │     ├─ components/
│     │     ├─ context/
│     │     ├─ pages/
│     │     ├─ App.jsx
│     │     ├─ index.css
│     │     └─ main.jsx
│     ├─ src/
│     │  └─ main/
│     │     ├─ java/com/example/
│     │     │  ├─ controller/
│     │     │  ├─ dto/
│     │     │  ├─ entity/
│     │     │  ├─ repository/
│     │     │  ├─ service/
│     │     │  ├─ CropDiseaseApiApplication.java
│     │     │  ├─ Farmer.java
│     │     │  └─ ...
│     │     └─ resources/
│     │        ├─ application.properties
│     │        └─ infer_crop_model.py
│     └─ data/
│        └─ crop-disease-db.mv.db (H2 file DB)
├─ vosk-model-small-en-us-0.15/
└─ vosk-model-small-en-us-0.15.zip
```

## 3) Where state currently lives

- Frontend language preference: `localStorage` key `fasal-sathi-language`
- Farmer profile and saved district data: `localStorage` keys used by `ProfilePage.jsx` and `HomePage.jsx`
- Crop storage / planner data: `localStorage` keys such as `fasal-sathi-farmer-profile`, `fasal-sathi-pest-history`, and `fasal-sathi-irrigation`
- Backend persistence: H2 file database at `frontend/desktop-tutorial/data/crop-disease-db`
- ML model: `frontend/desktop-tutorial/models/crop_model.pt`
- Vosk speech model: `vosk-model-small-en-us-0.15/`
- Frontend runtime app: served by the Spring Boot backend from `frontend/desktop-tutorial/frontend/dist/`

## 4) Observed contradictions against the original brief

- The README and setup guide describe Java 25 as the target. The installed environment includes Java 26 and Java 17; the repo also declares `java.version=25` in `pom.xml`, but this local environment was able to run Maven with Java 17 and the project still built successfully.
- The app uses a static `localhost:8080` runtime and Vite build output, but the project README suggests an older localhost:4173 dev setup in some notes; the canonical repo launcher targets port 8080.
- There are no committed Java or frontend test suites today; the project had a build baseline but no automated regression net before creating the smoke test in `e2e/smoke.spec.ts`.
- The repo is a hackathon app with substantial localStorage-based state, so the T1 auth backlog is still a real future work item.

## 5) Baseline result

Validated in this session:

- Backend: `mvn test` in `frontend/desktop-tutorial` completed with `BUILD SUCCESS`.
- Frontend: `npm ci --legacy-peer-deps` followed by `npm run build` completed successfully with Vite `✓ built in 5.63s`.
- Runtime: backend health check at `http://localhost:8080/api/v1/health` is the reliable runtime entry for the demo path.
- Demo path: the repo can accept a leaf image via `POST /api/v1/diagnose` and returns a diagnosis payload with a `confidence` score.

This baseline is considered green; no T0 repair was required for the setup stage.
