import { GoogleGenerativeAI } from '@google/generative-ai'

const modelName = 'gemini-1.5-flash'

let model

function getModel() {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_KEY') return null

  if (!model) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    model = genAI.getGenerativeModel({ model: modelName })
  }

  return model
}

function stripJsonFence(text) {
  return text
    .replace(/^```json/i, '')
    .replace(/^```/i, '')
    .replace(/```$/i, '')
    .trim()
}

function extractJson(text) {
  const cleaned = stripJsonFence(text)
  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')

  if (start === -1 || end === -1) {
    throw new Error('Gemini did not return JSON.')
  }

  return JSON.parse(cleaned.slice(start, end + 1))
}

export async function generateText(prompt, fallback) {
  const activeModel = getModel()

  if (!activeModel) {
    return fallback
  }

  const result = await activeModel.generateContent(prompt)
  return result.response.text().trim()
}

export async function generateJson(prompt, fallback) {
  const activeModel = getModel()

  if (!activeModel) {
    return fallback
  }

  const result = await activeModel.generateContent(`${prompt}\n\nReturn only valid JSON. Do not wrap it in markdown.`)
  return extractJson(result.response.text())
}
