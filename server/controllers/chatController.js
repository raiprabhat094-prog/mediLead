import OpenAI from 'openai'

const systemPrompt = `
You are MediLead AI, a professional healthcare crisis leadership mentor.
Answer with evidence-informed, practical guidance for healthcare leaders.
Focus on patient safety, ethics, communication, team coordination, quality improvement, and responsible AI use.
Do not provide diagnosis or treatment instructions. Encourage clinical governance and local policy review when appropriate.
`

function buildLocalMentorReply(message) {
  const lowerMessage = message.toLowerCase()
  const isCrisis = ['icu', 'emergency', 'oxygen', 'surge', 'pandemic', 'ambulance'].some((term) =>
    lowerMessage.includes(term),
  )
  const isConflict = ['conflict', 'angry', 'communication', 'staff'].some((term) => lowerMessage.includes(term))

  if (isCrisis) {
    return [
      'MediLead AI local simulation mode:',
      '',
      '1. Stabilize the situation with a brief incident huddle and name the immediate patient-safety risk.',
      '2. Prioritize critical patients using transparent triage criteria and local escalation policy.',
      '3. Assign clear roles: clinical lead, operations lead, family communication lead, and documentation owner.',
      '4. Escalate early to administration/command center with resource needs, time horizon, and risk level.',
      '5. Debrief after the event and convert the gaps into a simulation and microlearning path.',
      '',
      'Detected competency focus: crisis command, prioritization, ethical reasoning, and calm communication.',
    ].join('\n')
  }

  if (isConflict) {
    return [
      'MediLead AI local coaching mode:',
      '',
      'Start with a private, non-blaming conversation. Clarify the shared patient-safety goal, name the behavior pattern, ask each person what support they need, and close with one observable agreement.',
      '',
      'Detected competency focus: emotional intelligence, conflict communication, accountability, and psychological safety.',
    ].join('\n')
  }

  return [
    'MediLead AI local coaching mode:',
    '',
    'Frame the challenge as a leadership decision: what risk must be reduced, who needs to be aligned, what tradeoff is ethical, and what action should happen in the next 15 minutes?',
    '',
    'Next step: run a matching crisis simulation, score the decision, then assign a short microlearning module.',
  ].join('\n')
}

function normalizeHistory(history = []) {
  return history
    .filter((message) => ['user', 'assistant'].includes(message.role) && message.content)
    .slice(-10)
    .map((message) => ({
      role: message.role,
      content: String(message.content).slice(0, 1800),
    }))
}

export async function chatWithMentor(req, res) {
  const { message, history } = req.body

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'A message is required.' })
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.json({
      mode: 'local-fallback',
      reply: buildLocalMentorReply(message),
    })
  }

  try {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
      temperature: 0.45,
      messages: [
        { role: 'system', content: systemPrompt },
        ...normalizeHistory(history),
        { role: 'user', content: message },
      ],
    })

    const reply = completion.choices[0]?.message?.content?.trim()

    res.json({
      reply:
        reply ||
        'I could not generate a complete response. Please reframe the healthcare leadership question and try again.',
    })
  } catch (error) {
    console.error('OpenAI chat error:', error)
    res.json({
      mode: 'local-fallback',
      reply: buildLocalMentorReply(message),
    })
  }
}
