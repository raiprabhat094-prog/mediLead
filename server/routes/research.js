import { Router } from 'express'
import multer from 'multer'
import { createRequire } from 'node:module'
import { generateJson } from '../services/gemini.js'

const router = Router()
const require = createRequire(import.meta.url)
const pdfParse = require('pdf-parse')
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
})

const fallback = {
  summary: 'Research summary generated. Connect a Gemini API key for deeper paper-specific synthesis.',
  keyInsights: [
    'Leadership training improves when it uses realistic scenarios.',
    'Crisis communication should be concise, role-based, and repeated.',
    'Reflection and feedback improve retention after simulation.',
  ],
  vivaQuestions: [
    'How would you define effective escalation during a crisis?',
    'What leadership behavior protects psychological safety?',
    'How should a leader balance urgency and ethical fairness?',
  ],
  flashcards: [
    { front: 'Safety huddle', back: 'A short team alignment conversation for risk, roles, and next actions.' },
    { front: 'Escalation', back: 'A clear request for support with risk level, time horizon, and decision owner.' },
  ],
}

router.post('/', upload.single('pdf'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'PDF file is required' })
  }

  try {
    const parsed = await pdfParse(req.file.buffer)
    const text = parsed.text.slice(0, 12000)

    const research = await generateJson(
      `
Summarize this healthcare leadership research PDF for a learning platform.

Text:
${text}

Return JSON exactly:
{
  "summary": "string",
  "keyInsights": ["string"],
  "vivaQuestions": ["string"],
  "flashcards": [{ "front": "string", "back": "string" }]
}
`,
      fallback,
    )

    res.json(research)
  } catch (error) {
    console.error('Research route error:', error)
    res.json(fallback)
  }
})

export default router
