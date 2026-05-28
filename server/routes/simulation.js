import { Router } from 'express'
import { generateJson } from '../services/gemini.js'

const router = Router()

function fallbackSimulation(role, crisis, difficulty) {
  return {
    title: `${crisis} for ${role}`,
    scenario: `Difficulty ${difficulty}: You are the ${role}. A ${crisis} is unfolding, staff are under pressure, and patient-safety risk is rising. You must stabilize the team, prioritize resources, communicate clearly, and escalate before harm increases.`,
    stakes: 'patient safety, ethical triage, communication clarity, escalation timing, staff morale',
    decisions: [
      'Open a safety huddle, assign roles, prioritize highest-risk patients, and escalate resource needs.',
      'Ask staff to continue current work while you look for support after the immediate rush.',
      'Move resources from another unit without a documented escalation or communication plan.',
    ],
  }
}

router.post('/', async (req, res) => {
  const { role, crisis, difficulty = 3 } = req.body

  if (!role || !crisis) {
    return res.status(400).json({ error: 'role and crisis are required' })
  }

  const fallback = fallbackSimulation(role, crisis, difficulty)

  try {
    const simulation = await generateJson(
      `
Generate a realistic healthcare crisis leadership simulation.

Role: ${role}
Crisis: ${crisis}
Difficulty: ${difficulty}/5

Return JSON exactly:
{
  "title": "string",
  "scenario": "string, 80-130 words",
  "stakes": "string",
  "decisions": ["decision A", "decision B", "decision C"]
}

The decisions must be meaningfully different and suitable for leadership scoring.
Do not include clinical treatment instructions.
`,
      fallback,
    )

    res.json(simulation)
  } catch (error) {
    console.error('Simulation route error:', error)
    res.json(fallback)
  }
})

export default router
