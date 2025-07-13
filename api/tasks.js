import { connectDB } from './_lib/db.js'
import Task from './_lib/taskModel.js'

export default async function handler(req, res) {
  // Manejar preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method === 'GET') {
    try {
      await connectDB()
      const tasks = await Task.find()

      return res.status(200).json({
        status: 'OK',
        message: 'Tasks retrieved successfully',
        tasks,
      })
    } catch (error) {
      console.error('GET Error:', error)
      return res.status(500).json({
        status: 'ERROR',
        message: 'Error retrieving tasks',
        error: error.message,
      })
    }
  }

  if (req.method === 'POST') {
    try {
      await connectDB()
      const { projectId, title, description, priority, dueDate } = req.body

      const newTask = await Task.create({
        projectId,
        title,
        description,
        priority,
        dueDate,
      })

      return res.status(201).json({
        status: 'OK',
        message: 'Task created successfully',
        newTask,
      })
    } catch (error) {
      console.error('POST Error:', error)
      return res.status(500).json({
        status: 'ERROR',
        message: 'Error creating task',
        error: error.message,
      })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
