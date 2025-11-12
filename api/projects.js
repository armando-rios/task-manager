import { connectDB } from './_lib/db.js'
import Task from './_lib/taskModel.js'
import Project from './_lib/projectModel.js'
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
      const projects = await Project.find().sort({ createdAt: -1 })

      return res.status(200).json({
        status: 'OK',
        message: 'Projects retrieved successfully',
        projects,
      })
    } catch (error) {
      console.error('GET Error:', error)
      return res.status(500).json({
        status: 'ERROR',
        message: 'Error retrieving projects',
        error: error.message,
      })
    }
  }

  if (req.method === 'POST') {
    try {
      await connectDB()
      const { name, description } = req.body

      if (!name || name.trim() === '') {
        return res.status(400).json({
          status: 'ERROR',
          message: 'Project name is required',
        })
      }

      const newProject = await Project.create({
        name,
        description: description || '',
      })

      return res.status(201).json({
        status: 'OK',
        message: 'Project created successfully',
        project: newProject,
      })
    } catch (error) {
      console.error('POST Error:', error)
      return res.status(500).json({
        status: 'ERROR',
        message: 'Error creating project',
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
          message: 'Project ID is required',
        })
      }

      const deletedProject = await Project.findByIdAndDelete(id)

      if (!deletedProject) {
        return res.status(404).json({
          status: 'ERROR',
          message: 'Project not found',
        })
      }

      await Task.deleteMany({ projectId: id })

      return res.status(200).json({
        status: 'OK',
        message: 'Project deleted successfully',
        project: deletedProject,
      })
    } catch (error) {
      console.error('DELETE Error:', error)
      return res.status(500).json({
        status: 'ERROR',
        message: 'Error deleting project',
        error: error.message,
      })
    }
  }

  return res.status(405).json({
    status: 'ERROR',
    message: 'Method not allowed',
  })
}
