import { Router } from 'express'
import { chatWithMentor } from '../controllers/chatController.js'

const router = Router()

router.post('/', chatWithMentor)

export default router
