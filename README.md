# MediLead AI

AI-powered healthcare crisis leadership simulator for hospital teams.

MediLead AI helps healthcare leaders practice high-pressure decisions through a continuous coaching loop:

1. Chat with an AI leadership mentor about a real workplace challenge.
2. Convert that challenge into a role-specific crisis simulation.
3. Score decisions for leadership quality, communication, ethics, prioritization, and risk handling.
4. Generate adaptive microlearning, quizzes, and reflection prompts from the same competency gap.

## Hackathon Pitch

Hospital leaders often face crisis decisions without enough realistic practice. MediLead AI turns emergency scenarios such as ICU oxygen shortage, emergency ward overload, pandemic surge, staff shortage, and ambulance surge into interactive AI-scored training.

The project is designed as a polished working MVP: practical impact, strong UX, real backend integration, and a demo flow that judges can understand quickly.

## Core Features

- AI healthcare leadership chatbot with chat history and typing feedback
- No-paid-API local fallback mode for reliable demos
- Crisis simulation cards for hospital leadership scenarios
- Decision scoring with leadership score, risk feedback, and adaptive difficulty
- Skill-gap analysis across communication, prioritization, ethics, crisis command, and emotional intelligence
- Personalized microlearning recommendations
- Rapid readiness quiz section
- Research PDF summarizer demo workflow
- Dashboard analytics for pitch/demo storytelling

## Tech Stack

- React
- Vite
- Tailwind CSS
- Express
- OpenAI SDK with local fallback response mode

## Setup

Install dependencies:

```bash
npm install
```

Run frontend and backend together:

```bash
npm run dev:full
```

Open:

```text
http://localhost:5173
```

API health check:

```text
http://localhost:5000/health
```

## Optional AI Key

Create `server/.env`:

```env
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4.1-mini
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
```

If no key is present, the backend returns a structured local mentor response so the simulator remains demo-ready.

## Demo Script

1. Explain the problem: hospital leaders need realistic crisis training.
2. Ask the chatbot: "How should I handle emergency ICU overload?"
3. Select "ICU Oxygen Crisis" or "Pandemic Response Surge."
4. Choose a leadership decision and show the score changing.
5. Show skill gaps, microlearning, quiz, and research summarizer workflow.
6. End with: "MediLead AI trains better healthcare leaders using simulation-driven intelligence."

## Build

```bash
npm run lint
npm run build
```
