# FasalSathi Setup & Installation Guide

## Quick Start

### Option 1: Automatic Setup (Recommended)
From the repository root on Windows, run:
```bash
setup-and-run.bat
```

This script will:
- ✓ Check Java JDK 25+
- ✓ Install Maven if needed  
- ✓ Check Node.js and npm
- ✓ Build the React frontend
- ✓ Start the Spring Boot backend
- ✓ Open the application in your browser

### Option 2: Manual Setup
If you prefer manual control, ensure you have installed:
- Java JDK 25+ - https://www.oracle.com/java/technologies/downloads/
- Maven 3.9+ - https://maven.apache.org/download.cgi
- Node.js 20+ - https://nodejs.org/

Then navigate to `Agriculture-FoodTech\` folder and run:
```bash
run-app.bat
```

## System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| Java | JDK 25 | JDK 25+ |
| Maven | 3.9 | 3.9.9+ |
| Node.js | 20 LTS | 22 LTS |
| RAM | 2GB | 4GB+ |
| Disk Space | 2GB | 5GB+ |

## Application URL

**Main Application:** http://localhost:8080

Do NOT open any other URLs or index files. All features are accessed through the main URL.

---

## Complete Feature Guide

### 1. Home Dashboard & Follow-Up Task Banner (`/`)
- View local weather for your West Bengal district
- Check current mandi prices for crops
- Find nearby agricultural & equipment shops
- **Follow-Up Reminder Banner**: Prominent 7-day post-diagnosis check-in countdown banner with direct "Mark Completed" and "Inspect Field" quick actions.
- Multi-language support (English, Bengali, Hindi)

### 2. AI Crop Diagnosis & IPDM Advisories (`/diagnose`)
- Upload crop leaf images (JPG, PNG, WebP)
- AI-powered disease identification with TorchScript ML models
- **IPDM Wording**: Structured multi-tiered recommendations (Cultural, Biological, Chemical steps with dosage per growth stage)
- **Ground-Truth ML Feedback**: Field worker accuracy confirmation widget (`/api/v1/diagnosis-feedback`)
- **Expert Lab Referral**: Direct KVK laboratory referral escalation flow (`/api/v1/referrals`)
- Voice input and text-to-speech accessibility

### 3. Pest & Trap Observation Logging (`/pest-log`)
- Manual trap count entry and sensor reading inputs
- Farm location selection and pest type logging (Brown Planthopper, Aphid, Stem Borer, Cutworm, Whitefly, Spodoptera)
- Real-time backend sync (`/api/v1/pest-observations`)

### 4. Geospatial Hotspot Map (`/hotspots`)
- Interactive West Bengal district risk node cluster map based on 14-day field diagnoses and trap counts
- Risk node color coding: Red (>10 cases / High Risk), Yellow (5-10 cases / Moderate), Green (<5 cases / Low)
- Filter by Crop Type (Rice, Potato, Tomato, Mustard, Chilli) and Timeframe (7, 14, 30 days)
- Selected district detail drawer with recommended preventive field intervention

### 5. Official Agriculture Admin Dashboard (`/admin/dashboard`)
- Executive surveillance portal for state & district agriculture officials
- 4 Top KPI Cards: Active Disease Hotspots, Pending Expert Reviews, Follow-Up Compliance Rate (%), Total Surveillance Reports
- **District Breakdown Chart**: Visual incident distribution per district
- **14-Day Trapping & Incident Trend Chart**: Dual-channel visual trend of diagnoses vs trap counts
- **Pending Expert Review Queue Table**: Interactive queue with *"Approve Advisory"* and *"Assign KVK Officer"* actions

### 6. Farmer Tools & Profit Calculator (`/tools`)
- Farm profit calculator with crop revenue & cost estimation
- Irrigation scheduler based on soil type and crop watering frequency
- Government agricultural scheme finder (PM-KISAN, PM Fasal Bima Yojana, Soil Health Card)
- Device-local pest & disease inspection history log

### 7. Local West Bengal Knowledge Layer
- Coverage for all 23 districts of West Bengal with coordinates and agro-climatic context
- Real-time weather data and 3-day forecast
- District KVK directory and official contact information

---

## Troubleshooting

### Problem: "Java JDK 25+ not found"
**Solution:** Install Java from https://www.oracle.com/java/technologies/downloads/
Then add it to your system PATH:
1. Right-click "This PC" → Properties
2. Click "Advanced system settings"
3. Click "Environment Variables"
4. Add Java bin folder to PATH (e.g., `C:\Program Files\Java\jdk-25.0.2\bin`)

### Problem: "Maven not found"
**Solution:** 
- Use the `setup-and-run.bat` script which will install Maven automatically, OR
- Install Maven from https://maven.apache.org/download.cgi and add to PATH

### Problem: "Port 8080 already in use"
**Solution:**
- Stop any other application using port 8080, OR
- Modify the port in `frontend/desktop-tutorial/src/main/resources/application.properties`:
  ```
  server.port=8081
  ```
  Then update the URL to http://localhost:8081

### Problem: Frontend not loading or showing blank page
**Solution:**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh the page (Ctrl+F5)
3. Check browser console for errors (F12)
4. Ensure backend is running (check terminal window)

### Problem: Image upload fails
**Solution:**
- Image must be less than 10MB
- Supported formats: JPG, PNG, JPEG, WebP
- Ensure good lighting for leaf photo

---

## Configuration

### Weather API (Live Data)
For real-time weather, set the OPENWEATHER_API_KEY:
```bash
set OPENWEATHER_API_KEY=your_key_here
```

### Market Prices (Live Data)
For live mandi prices, set the MANDI_API_KEY:
```bash
set MANDI_API_KEY=your_key_here
```
