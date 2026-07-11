# 🤖 GrowEasy AI CSV Importer

### An AI-Powered CRM Lead Extraction Engine

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Groq](https://img.shields.io/badge/Groq-Llama%203.3-F55036?style=flat-square&logo=meta&logoColor=white)](https://console.groq.com/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express)](https://expressjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-8b5cf6?style=flat-square)](LICENSE)

> Upload **any** CSV file — Facebook leads, Google Ads exports, Excel sheets, Real Estate CRMs — and let AI intelligently map, extract, and standardise every field into the GrowEasy CRM format. No column name configuration needed.

---

[Features](#-features) • [Demo](#-live-demo) • [Installation](#-installation) • [Usage](#-usage) • [Architecture](#-architecture) • [Deployment](#-deployment) • [API Docs](#-api-documentation)

---

## 📋 Overview

**GrowEasy AI CSV Importer** solves a real-world problem: sales and marketing teams receive leads in dozens of different CSV formats — each with different column names, layouts, and structures. Manually cleaning and reformatting this data is expensive and error-prone.

This application uses **Groq's Llama 3.3 70B model** to intelligently understand the *intent* of each column regardless of its name, intelligently mapping it to the GrowEasy CRM schema in real-time with streaming progress updates.

### Why this approach is different

| Traditional Importer | GrowEasy AI Importer |
|---|---|
| Requires exact column name match | Works with any column name variation |
| Manual field mapping configuration | Zero configuration — AI handles it |
| Breaks on novel CSV formats | Adapts to any CSV structure |
| No intelligence for messy data | Handles combined fields, typos, mixed formats |

---

## ✨ Features

### Core Functionality
- 🧠 **AI-Powered Field Mapping** — Intelligently maps 50+ column name variations to CRM schema
- 📂 **Universal CSV Support** — Facebook, Google Ads, Excel, Real Estate CRM, custom formats
- ⚡ **Real-Time Streaming** — Server-Sent Events stream live progress from each AI batch
- 🔄 **Smart Retry Logic** — Auto-retries failed AI batches with exponential backoff (3 attempts)
- 🛡️ **Data Validation** — Post-AI sanitisation enforces enum constraints and skips invalid records

### Frontend UX
- 🎨 **Premium Dark UI** — GitHub-inspired dark theme with purple accent gradients
- 📤 **Drag & Drop Upload** — Visual drop zone with animated concentric rings and glow effects
- 👁️ **CSV Preview** — Searchable, sticky-header, horizontally scrollable preview table
- 📊 **Results Dashboard** — Stats cards, status filter, full-text search, and CSV export
- 🪜 **Step Indicator** — 4-step progress pill: Upload → Preview → AI Extract → Results
- 🚨 **Graceful Errors** — Every error (invalid API key, network, model deprecated) shown with context

### Backend Quality
- 🏗️ **Clean Architecture** — Separate services for CSV parsing and AI extraction
- 📦 **Batch Processing** — Processes 10 rows per AI call to stay within token limits
- 🔍 **File Validation** — Type and size validation before processing (10MB limit)
- 📡 **SSE Streaming** — Real-time batch-level progress updates to the frontend

### Bonus Points Covered
| Bonus Feature | Status |
|---|---|
| Drag & Drop upload | ✅ |
| Progress indicators during AI processing | ✅ |
| Streaming / incremental parsing (SSE) | ✅ |
| Retry mechanism for failed AI batches | ✅ |
| Dark mode | ✅ |
| Well-written README with setup instructions | ✅ |
| Deployment (Vercel + Railway guide) | ✅ |
| Sample CSV download | ✅ |

---

## 🌐 Live Demo

> **Frontend:** [https://ai-powered-csv-extraction-grow-easy-plum.vercel.app](https://ai-powered-csv-extraction-grow-easy-plum.vercel.app/)
>
> **Backend:** [https://ai-powered-csv-extraction-groweasy-production.up.railway.app](https://ai-powered-csv-extraction-groweasy-production.up.railway.app) *(Live AI Server)*

---

## 🏗️ Project Structure

```
AI-Powered-CSV-Extraction---GrowEasy/
│
├── backend/                        # Node.js + Express API
│   ├── services/
│   │   ├── ai.service.js           # Groq AI integration with retry logic
│   │   └── csv.service.js          # CSV parsing with csv-parse
│   ├── server.js                   # Express server + SSE streaming endpoint
│   ├── package.json
│   └── .env.example                # Environment variable template
│
├── frontend/                       # Next.js 15 App Router
│   ├── app/
│   │   ├── page.js                 # Main 4-step import flow
│   │   ├── page.module.css
│   │   ├── layout.js               # Root layout with metadata
│   │   └── globals.css             # Design system, tokens, animations
│   ├── components/
│   │   ├── UploadArea.jsx          # Drag & drop upload zone
│   │   ├── UploadArea.module.css
│   │   ├── PreviewTable.jsx        # Searchable CSV preview table
│   │   ├── PreviewTable.module.css
│   │   ├── ProcessingView.jsx      # Real-time AI progress view
│   │   ├── ProcessingView.module.css
│   │   ├── ResultTable.jsx         # Results with filter, search & export
│   │   ├── ResultTable.module.css
│   │   ├── StepIndicator.jsx       # 4-step pipeline indicator
│   │   ├── StepIndicator.module.css
│   │   ├── ErrorAlert.jsx          # Reusable error component
│   │   └── ErrorAlert.module.css
│   ├── public/
│   └── package.json
│
├── sample_leads.csv                # Sample CSV for testing
└── README.md
```

---

## 🛠️ Tech Stack

| Category | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | Next.js 15 (App Router) | SSR, routing, bundling |
| **Frontend Styling** | Vanilla CSS + CSS Modules | Design system, no Tailwind |
| **CSV Parsing (client)** | PapaParse | Instant browser-side preview |
| **Backend Framework** | Node.js + Express 4 | REST API server |
| **CSV Parsing (server)** | csv-parse | Robust server-side parsing |
| **File Upload** | Multer | In-memory multipart handling |
| **AI Model** | Groq — llama-3.3-70b-versatile | Field extraction & mapping |
| **AI Streaming** | Server-Sent Events (SSE) | Real-time progress updates |
| **Deployment (FE)** | Vercel | Frontend hosting |
| **Deployment (BE)** | Railway / Render | Backend hosting |

---

## 🚀 Installation

### Prerequisites

Ensure you have the following installed:

- **Node.js** v18.0 or higher
- **npm** or yarn
- **Git**
- A free **Groq API key** → [console.groq.com](https://console.groq.com)

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/AmitC04/AI-Powered-CSV-Extraction---GrowEasy.git
cd AI-Powered-CSV-Extraction---GrowEasy
```

---

### Step 2: Set Up the Backend

```bash
cd backend
npm install
```

Create your environment file:

```bash
# Create .env from the example
cp .env.example .env
```

Edit `.env` and add your Groq API key:

```env
GROQ_API_KEY=gsk_your_groq_api_key_here
PORT=3001
```

> ⚠️ **Never commit your `.env` file!** It is already in `.gitignore`.
>
> 🔑 **Get a free Groq API key** at [console.groq.com](https://console.groq.com/keys) — it takes 30 seconds.

Start the backend server:

```bash
node server.js
```

You should see:
```
🚀  GrowEasy Backend running on http://localhost:3001
🤖  AI Model: llama-3.3-70b-versatile
🔑  Groq API Key: ✓ Found
```

---

### Step 3: Set Up the Frontend

Open a **new terminal window**:

```bash
cd frontend
npm install
npm run dev
```

---

### Step 4: Open the App 🎉

Navigate to **[http://localhost:3000](http://localhost:3000)** and upload your first CSV!

---

## 📖 Usage

### 4-Step Import Flow

```
① Upload CSV  →  ② Preview Data  →  ③ AI Extraction  →  ④ Results
```

**Step 1 — Upload:**
- Drag and drop a CSV file onto the upload zone, or click to browse
- Supports any CSV format up to 10 MB
- Click **"Download Sample CSV"** to get a test file

**Step 2 — Preview:**
- Raw CSV data is parsed instantly in the browser (no server call yet)
- Search across all rows, scroll horizontally and vertically
- Click **"Run AI Extraction"** when ready

**Step 3 — AI Processing:**
- Watch real-time batch progress with percentage and batch counter
- AI processes 10 rows at a time and streams results back

**Step 4 — Results:**
- View extracted CRM leads with stats: Imported, Skipped, Success Rate
- Filter by CRM status, search records, export to CSV

---

## 🤖 AI Architecture

### Prompt Engineering

The system prompt is designed to handle maximum variety:

```
Column Name Intelligence (50+ variations mapped):
  "name"   ← full_name, lead_name, contact, fname+lname, person, client
  "email"  ← email_address, e-mail, mail, contact_email, user_email
  "mobile" ← phone, phone_number, contact_number, cell, tel, number
  ...and many more
```

### Extraction Pipeline

```
CSV Upload
    │
    ▼
csv-parse (server)
    │
    ▼
Split into batches of 10 rows
    │
    ▼
┌─────────────────────────────────────┐
│  For each batch:                    │
│  1. Send to Groq Llama 3.3          │
│  2. Parse JSON response             │
│  3. Sanitise & validate fields      │
│  4. Enforce enum constraints        │
│  5. Skip records without contact    │
│  6. Stream progress via SSE         │
│  (Retry up to 3× on failure)        │
└─────────────────────────────────────┘
    │
    ▼
Merge all batches → Final JSON result
    │
    ▼
Frontend displays results table
```

### CRM Status Mapping

| Raw Data Values | Mapped To |
|---|---|
| interested, warm, follow up, callback, qualified | `GOOD_LEAD_FOLLOW_UP` |
| no answer, busy, not reachable, voicemail, missed | `DID_NOT_CONNECT` |
| not interested, invalid, wrong number, junk, spam | `BAD_LEAD` |
| closed, converted, won, purchased, deal done | `SALE_DONE` |

---

## 📋 CRM Fields Reference

| Field | Description | Notes |
|---|---|---|
| `created_at` | Lead creation timestamp | Must parse with `new Date()` |
| `name` | Full name | Merged from split name fields |
| `email` | Primary email | First if multiple; rest → `crm_note` |
| `country_code` | Country dial code | Format: `+91` |
| `mobile_without_country_code` | Phone number | Digits only, no country code |
| `company` | Company / organisation | — |
| `city` | City | — |
| `state` | State / Province | — |
| `country` | Country | — |
| `lead_owner` | Assigned sales rep | — |
| `crm_status` | Lead status (enum) | See status mapping above |
| `crm_note` | Notes, remarks, extras | Catch-all for additional info |
| `data_source` | Lead channel (enum) | `leads_on_demand`, `meridian_tower`, `eden_park`, `varah_swamy`, `sarjapur_plots` |
| `possession_time` | Property possession date | — |
| `description` | Additional description | — |

---

## 📡 API Documentation

### `GET /api/health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-07-11T11:00:00.000Z",
  "model": "llama-3.3-70b-versatile"
}
```

---

### `POST /api/process`

Upload and process a CSV file. Returns a **Server-Sent Events (SSE)** stream.

**Request:**
```
Content-Type: multipart/form-data
Body: file (CSV, max 10MB)
```

**SSE Event Types:**

| Event | Payload | Description |
|---|---|---|
| `progress` | `{ percent, message, batch, totalBatches }` | Batch progress update |
| `complete` | `{ data: { records, totalImported, totalSkipped } }` | Final result |
| `error` | `{ message }` | Processing error |

**Example (cURL):**
```bash
curl -X POST http://localhost:3001/api/process \
  -F "file=@sample_leads.csv" \
  --no-buffer
```

---

## ☁️ Deployment

### Frontend → Vercel

1. **Push your code to GitHub** (already done!)

2. **Import to Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click **"Import Project"** → select your GitHub repo
   - Set **Root Directory** to `frontend`
   - Framework: **Next.js** (auto-detected)
   - Click **Deploy**

3. **Set Environment Variable:**
   - In your Vercel project → Settings → Environment Variables
   - Add: `NEXT_PUBLIC_API_URL` = your Railway backend URL

> ⚡ Vercel deploys automatically on every `git push` to `main`!

---

### Backend → Railway

1. Go to [railway.app](https://railway.app) and create a new project

2. Click **"Deploy from GitHub repo"** → select your repo

3. Set **Root Directory** to `backend`

4. Add environment variables:
   ```
   GROQ_API_KEY=gsk_your_key_here
   PORT=3001
   ```

5. Railway will auto-detect Node.js and run `node server.js`

6. Copy your Railway URL (e.g. `https://groweasy-backend.up.railway.app`)

7. Update the API URL in your frontend code:
   - In `frontend/app/page.js`, change `http://localhost:3001` to your Railway URL

---

### Alternative: Render

```bash
# render.yaml (create in /backend)
services:
  - type: web
    name: groweasy-backend
    env: node
    buildCommand: npm install
    startCommand: node server.js
    envVars:
      - key: GROQ_API_KEY
        sync: false
```

---

## 🔧 Development Commands

### Backend

```bash
cd backend

node server.js          # Start server
node server.js | pino   # Start with pretty logs (if pino installed)
```

### Frontend

```bash
cd frontend

npm run dev             # Start dev server (http://localhost:3000)
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint
```

---

## 🌍 Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `GROQ_API_KEY` | ✅ **Yes** | Groq API key from console.groq.com |
| `PORT` | ❌ No | Server port (default: `3001`) |

### Frontend

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | ❌ No | Backend URL for production (default: `http://localhost:3001`) |

---

## 🐛 Troubleshooting

**Problem: "Authentication Error — API Key invalid"**
```bash
# Check your .env file has the correct key
cat backend/.env
# Restart the backend after editing
node server.js
```

**Problem: "Connection Error — cannot reach backend"**
```bash
# Make sure backend is running on port 3001
cd backend && node server.js
# Check no other process is using port 3001
netstat -ano | findstr :3001   # Windows
lsof -i :3001                  # Mac/Linux
```

**Problem: "Model Deprecated" error**
```bash
# Update the model in backend/services/ai.service.js
# Check latest models at: https://console.groq.com/docs/models
const MODEL_NAME = 'llama-3.3-70b-versatile';  # Update this line
```

**Problem: CORS error in browser**
```
# The backend has CORS enabled for all origins.
# If deploying, update the CORS origin in backend/server.js
app.use(cors({ origin: 'https://your-frontend.vercel.app' }));
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow existing code style (Vanilla CSS, no Tailwind)
- Write clear, descriptive commit messages
- Test with multiple CSV formats before submitting
- Run `npm run lint` before committing

---

## 📝 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Amit C04**

- GitHub: [@AmitC04](https://github.com/AmitC04)
- Project: [AI-Powered-CSV-Extraction---GrowEasy](https://github.com/AmitC04/AI-Powered-CSV-Extraction---GrowEasy)

---

## 🙏 Acknowledgments

- [Groq](https://groq.com) for blazing-fast LLM inference
- [Meta AI](https://ai.meta.com) for the Llama 3.3 model
- [Next.js](https://nextjs.org) Documentation
- [PapaParse](https://www.papaparse.com) for client-side CSV parsing
- [GrowEasy](https://groweasy.in) for the engineering challenge

---

## 📊 Project Status

🟢 **Active** — Built for the GrowEasy Engineering Assessment

**Position Applied For:** Full-Time Software Engineer

---

<div align="center">

Made with ❤️ using Next.js, Express, and Groq AI

⭐ **Star this repo if you find it helpful!**

</div>
