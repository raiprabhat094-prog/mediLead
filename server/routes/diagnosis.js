import { Router } from 'express'
import { generateJson } from '../services/gemini.js'

const router = Router()

function fallbackDiagnosis(message = '') {
  const text = message.toLowerCase()
  const problemArea = text.includes('staff') || text.includes('nurse')
    ? 'Staffing shortage'
    : text.includes('conflict')
      ? 'Conflict management'
      : text.includes('oxygen') || text.includes('icu') || text.includes('emergency')
        ? 'Emergency response'
        : 'Healthcare leadership challenge'

  const emotionalTone = text.includes('overwhelmed') || text.includes('panic') || text.includes('emergency') || text.includes('stressed') || text.includes('called out')
    ? 'high-pressure'
    : text.includes('angry') || text.includes('conflict')
      ? 'tense'
      : 'focused'

  return {
    problemArea,
    emotionalTone,
    competencyGap: emotionalTone === 'high-pressure' ? 'crisis leadership' : 'communication and prioritization',
    learningNeed: 'delegation, escalation, emotional leadership, and clear team communication',
  }
}

router.post('/', async (req, res) => {
  const { message } = req.body

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'message is required' })
  }

  const fallback = fallbackDiagnosis(message)

  try {
    const diagnosis = await generateJson(
      `
Analyze this healthcare leadership challenge and return JSON with exactly:
{
  "problemArea": "string",
  "emotionalTone": "string",
  "competencyGap": "string",
  "learningNeed": "string"
}

Challenge:
${message}
`,
      fallback,
    )

    res.json(diagnosis)
  } catch (error) {
    console.error('Diagnosis route error:', error)
    res.json(fallback)
  }
})

export default router
