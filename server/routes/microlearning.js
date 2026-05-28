import { Router } from 'express'
import { generateJson } from '../services/gemini.js'

const router = Router()

const fallback = {
  lessons: [
    {
      title: 'Rapid escalation framework',
      type: 'Leadership Framework',
      duration: '5 min',
      reason: 'Builds a clear escalation habit after crisis scoring.',
    },
    {
      title: 'Two-minute safety huddle',
      type: 'Communication Tip',
      duration: '4 min',
      reason: 'Improves role clarity and emotional containment during pressure.',
    },
    {
      title: 'Ethical triage reflection',
      type: 'Reflection',
      duration: '3 min',
      reason: 'Connects patient-safety tradeoffs with fair decision-making.',
    },
  ],
  quiz: [
    {
      question: 'What should escalation include?',
      answer: 'Risk level, resource request, time horizon, and decision owner.',
    },
    {
      question: 'What does a safety huddle create?',
      answer: 'Shared awareness, role clarity, and a short reassessment cycle.',
    },
  ],
  recommendations: [
    'Repeat the simulation with a higher difficulty level.',
    'Practice concise escalation language before the next scenario.',
    'Review emotional intelligence cues during staff pressure.',
  ],
}

router.post('/', async (req, res) => {
  const { evaluation, diagnosis, role } = req.body

  if (!evaluation) {
    return res.status(400).json({ error: 'evaluation is required' })
  }

  try {
    const learning = await generateJson(
      `
Create adaptive microlearning for a healthcare leadership learner.

Role: ${role || 'healthcare leader'}
Diagnosis: ${JSON.stringify(diagnosis || {})}
Evaluation: ${JSON.stringify(evaluation)}

Return JSON exactly:
{
  "lessons": [
    { "title": "string", "type": "string", "duration": "string", "reason": "string" }
  ],
  "quiz": [
    { "question": "string", "answer": "string" }
  ],
  "recommendations": ["string"]
}

Keep lessons short and practical.
`,
      fallback,
    )

    res.json(learning)
  } catch (error) {
    console.error('Microlearning route error:', error)
    res.json(fallback)
  }
})

export default router
