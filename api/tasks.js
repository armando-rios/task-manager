import { connectDB } from './_lib/db.js'
import Task from './_lib/taskModel.js'
import { verifyTokenFromCookie } from './_lib/authMiddleware.js'

export default async function handler(req, res) {
  // Manejar preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Verificar autenticación para todos los métodos
  const verification = verifyTokenFromCookie(req)
  if (!verification.valid) {
    return res.status(401).json({
      status: 'ERROR',
      message: verification.error || 'Authentication required',
    })
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

      // Validar campos requeridos
      if (!title || title.trim() === '') {
        return res.status(400).json({
          status: 'ERROR',
          message: 'Task title is required',
        })
      }

      if (!projectId) {
        return res.status(400).json({
          status: 'ERROR',
          message: 'Project ID is required',
        })
      }

      if (!dueDate) {
        return res.status(400).json({
          status: 'ERROR',
          message: 'Due date is required',
        })
      }

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
        task: newTask,
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

  if (req.method === 'PUT') {
    try {
      await connectDB()
      const { id, title, description, priority, dueDate, projectId } = req.body

      if (!id) {
        return res.status(400).json({
          status: 'ERROR',
          message: 'Task ID is required',
        })
      }

      const updateData = {}
      if (title !== undefined) updateData.title = title
      if (description !== undefined) updateData.description = description
      if (priority !== undefined) updateData.priority = priority
      if (dueDate !== undefined) updateData.dueDate = dueDate
      if (projectId !== undefined) updateData.projectId = projectId

      const updatedTask = await Task.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      })

      if (!updatedTask) {
        return res.status(404).json({
          status: 'ERROR',
          message: 'Task not found',
        })
      }

      return res.status(200).json({
        status: 'OK',
        message: 'Task updated successfully',
        task: updatedTask,
      })
    } catch (error) {
      console.error('PUT Error:', error)
      return res.status(500).json({
        status: 'ERROR',
        message: 'Error updating task',
        error: error.message,
      })
    }
  }

  if (req.method === 'DELETE') {
    try {
      await connectDB()
      const { id } = req.body

      if (!id) {
        return res.status(400).json({
          status: 'ERROR',
          message: 'Task ID is required',
        })
      }

      const deletedTask = await Task.findByIdAndDelete(id)

      if (!deletedTask) {
        return res.status(404).json({
          status: 'ERROR',
          message: 'Task not found',
        })
      }

      return res.status(200).json({
        status: 'OK',
        message: 'Task deleted successfully',
        task: deletedTask,
      })
    } catch (error) {
      console.error('DELETE Error:', error)
      return res.status(500).json({
        status: 'ERROR',
        message: 'Error deleting task',
        error: error.message,
      })
    }
  }

  return res.status(405).json({
    status: 'ERROR',
    message: 'Method not allowed',
  })
}
