import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { fileURLToPath } from 'node:url'
import chatRoutes from './routes/chat.js'
import diagnosisRoutes from './routes/diagnosis.js'
import evaluationRoutes from './routes/evaluation.js'
import microlearningRoutes from './routes/microlearning.js'
import researchRoutes from './routes/research.js'
import simulationRoutes from './routes/simulation.js'

dotenv.config({ path: fileURLToPath(new URL('./.env', import.meta.url)) })

const app = express()
const port = process.env.PORT || 5000

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }))
app.use(express.json({ limit: '10mb' }))

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'MediLead AI API' })
})

app.use('/chat', chatRoutes)
app.use('/diagnose', diagnosisRoutes)
app.use('/simulate', simulationRoutes)
app.use('/evaluate', evaluationRoutes)
app.use('/microlearning', microlearningRoutes)
app.use('/research', researchRoutes)

async function startServer() {
  app.listen(port, () => {
    console.log(`MediLead AI server running on http://localhost:${port}`)
  })
}

startServer()
