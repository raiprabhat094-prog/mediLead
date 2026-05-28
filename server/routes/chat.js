import { Router } from 'express'
import { generateText } from '../services/gemini.js'

const router = Router()

function normalizeHistory(history = []) {
  return history
    .filter((message) => ['user', 'assistant'].includes(message.role) && message.content)
    .slice(-8)
    .map((message) => `${message.role.toUpperCase()}: ${String(message.content).slice(0, 1200)}`)
    .join('\n')
}

router.post('/', async (req, res) => {
  const { message, history = [] } = req.body

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'message is required' })
  }

  const fallback = [
    'Problem area: healthcare operations under pressure.',
    'Emotional tone: high-pressure and concerned.',
    'Competency gap: crisis leadership, escalation, communication clarity, and emotional intelligence.',
    'Recommended action: run a short safety huddle, clarify roles, escalate resource risk early, and document decisions.',
    'Learning direction: practice a matching crisis simulation and complete a rapid escalation microlearning module.',
  ].join('\n\n')

  try {
    const reply = await generateText(
      `
You are MediLead AI, an expert healthcare leadership mentor.

You help healthcare workers, nurse managers, hospital administrators, department heads, and public health officers.

When users describe a challenge:
1. Identify problem area
2. Detect emotional tone
3. Identify leadership competency gap
4. Recommend action
5. Suggest a learning direction

Always respond professionally and practically.
Do not provide medical diagnosis or treatment instructions.

Recent conversation:
${normalizeHistory(history)}

User challenge:
${message}
`,
      fallback,
    )

    res.json({ reply })
  } catch (error) {
    console.error('Chat route error:', error)
    res.json({ reply: fallback, mode: 'fallback' })
  }
})

export default router
