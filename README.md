# MediLead AI

AI-powered healthcare crisis leadership learning platform.

MediLead AI converts real workplace problems into a continuous learning flow:

```text
Chat -> Diagnose -> Simulate -> Score -> Learn
```

The MVP keeps the existing React/Vite UI and adds a working Express backend powered by Google Gemini `gemini-1.5-flash`, with local fallback responses for demo reliability.

## Folder Structure

```text
Project1/
├── src/
│   ├── hooks/
│   │   └── useLocalStorage.js
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   └── App.css
├── server/
│   ├── routes/
│   │   ├── chat.js
│   │   ├── diagnosis.js
│   │   ├── simulation.js
│   │   ├── evaluation.js
│   │   ├── microlearning.js
│   │   └── research.js
│   ├── services/
│   │   └── gemini.js
│   ├── server.js
│   └── .env
├── package.json
└── vite.config.js
```

## Install

```bash
npm install
npm install @google/generative-ai multer pdf-parse
```

## Environment

Create `server/.env`:

```env
PORT=5000
GEMINI_API_KEY=YOUR_KEY
CLIENT_ORIGIN=http://localhost:5173
```

Replace `YOUR_KEY` with a Google AI Studio key. If the key is missing or still `YOUR_KEY`, the app uses fallback responses so the hackathon demo still works.

## Run

Frontend and backend together:

```bash
npm run dev:full
```

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:5000
```

## API Routes

```text
POST /chat
POST /diagnose
POST /simulate
POST /evaluate
POST /microlearning
POST /research
GET  /health
```

## MVP Features

- Gemini-powered healthcare leadership mentor chatbot
- Persistent chat history with localStorage
- Structured diagnosis engine
- Dynamic crisis simulation generation
- AI decision scoring
- Adaptive microlearning generation
- PDF research summarizer
- Voice input with browser SpeechRecognition
- Persistent selected role, simulation history, scores, and learning progress

## Verify

```bash
npm run lint
npm run build
```

## Demo Flow

1. Ask: "We have ICU staffing shortage and staff are overwhelmed."
2. Show diagnosis: problem area, tone, competency gap, learning need.
3. Generate an ICU oxygen crisis simulation.
4. Select a decision and show AI scoring.
5. Show adaptive microlearning and quiz.
6. Upload a PDF to generate research learning assets.
