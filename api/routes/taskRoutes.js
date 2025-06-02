import { Router } from 'express'
import { createTask } from '../controllers/taskController'

const router = Router()

router.post('tasks', createTask)

export default router
