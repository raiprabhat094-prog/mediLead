import OpenAI from 'openai'

const systemPrompt = `
You are MediLead AI, a professional healthcare leadership mentor.
Answer with evidence-informed, practical guidance for healthcare leaders.
Focus on patient safety, ethics, communication, team coordination, quality improvement, and responsible AI use.
Do not provide diagnosis or treatment instructions. Encourage clinical governance and local policy review when appropriate.
`

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
    return res.status(500).json({
      error: 'OPENAI_API_KEY is missing. Add it to server/.env before using the AI mentor.',
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
    res.status(500).json({
      error: 'MediLead AI could not reach the OpenAI service. Please check server logs and API configuration.',
      detail:
        error.status === 401
          ? 'Invalid OpenAI API key. Use a key from the OpenAI platform, usually starting with sk-.'
          : error.message,
      status: error.status,
    })
  }
}
