import { Router } from 'express'
import { generateJson } from '../services/gemini.js'

const router = Router()

function fallbackEvaluation(decision = '') {
  const strong = /huddle|escalat|priorit|role|document/i.test(decision)

  return {
    score: strong ? 84 : 58,
    communication: strong ? 81 : 55,
    ethics: strong ? 88 : 61,
    crisisLeadership: strong ? 79 : 52,
    emotionalIntelligence: strong ? 83 : 57,
    feedback: strong
      ? 'Strong escalation and patient-safety awareness. Improve by naming a communication owner and setting a time-bound reassessment trigger.'
      : 'This decision needs clearer escalation, safer prioritization, and more visible emotional leadership for the team.',
  }
}

router.post('/', async (req, res) => {
  const { scenario, decision } = req.body

  if (!scenario || !decision) {
    return res.status(400).json({ error: 'scenario and decision are required' })
  }

  const fallback = fallbackEvaluation(decision)

  try {
    const evaluation = await generateJson(
      `
Evaluate this healthcare leadership simulation decision.

Scenario:
${scenario}

Decision:
${decision}

Return JSON exactly:
{
  "score": 84,
  "communication": 81,
  "ethics": 88,
  "crisisLeadership": 79,
  "emotionalIntelligence": 83,
  "feedback": "string"
}

All scores must be numbers from 0 to 100.
Feedback should be practical, concise, and leadership-focused.
Do not provide clinical treatment instructions.
`,
      fallback,
    )

    res.json(evaluation)
  } catch (error) {
    console.error('Evaluation route error:', error)
    res.json(fallback)
  }
})

export default router
