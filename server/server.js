import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import { fileURLToPath } from 'node:url'
import chatRoutes from './routes/chatRoutes.js'

dotenv.config({ path: fileURLToPath(new URL('./.env', import.meta.url)) })

const app = express()
const port = process.env.PORT || 5000

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }))
app.use(express.json({ limit: '10mb' }))

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'MediLead AI API' })
})

app.use('/chat', chatRoutes)

async function startServer() {
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI)
      console.log('MongoDB connected')
    } catch (error) {
      console.warn('MongoDB connection skipped:', error.message)
    }
  }

  app.listen(port, () => {
    console.log(`MediLead AI server running on http://localhost:${port}`)
  })
}

startServer()
