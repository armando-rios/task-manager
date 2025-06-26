import { connectDB } from './_lib/db.js'
import Task from './_lib/taskModel.js'
import Project from './_lib/projectModel.js'

export async function GET() {
  try {
    await connectDB()

    const projects = await Project.find().sort({ createdAt: -1 })

    return Response.json({
      status: 'OK',
      message: 'Projects retrieved successfully',
      projects,
    })
  } catch (error) {
    console.error('GET Error:', error)
    return Response.json(
      {
        status: 'ERROR',
        message: 'Error retrieving projects',
        error: error.message,
      },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    await connectDB()

    const body = await request.json()
    const { name, description } = body

    if (!name || name.trim() === '') {
      return Response.json(
        {
          status: 'ERROR',
          message: 'Project name is required',
        },
        { status: 400 }
      )
    }

    const newProject = await Project.create({
      name,
      description: description || '',
    })

    return Response.json(
      {
        status: 'OK',
        message: 'Project created successfully',
        project: newProject,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('POST Error:', error)
    return Response.json(
      {
        status: 'ERROR',
        message: 'Error creating project',
        error: error.message,
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request) {
  try {
    await connectDB()

    const body = await request.json()
    const { id } = body

    if (!id) {
      return Response.json(
        {
          status: 'ERROR',
          message: 'Project ID is required',
        },
        { status: 400 }
      )
    }

    const deletedProject = await Project.findByIdAndDelete(id)

    if (!deletedProject) {
      return Response.json(
        {
          status: 'ERROR',
          message: 'Project not found',
        },
        { status: 404 }
      )
    }

    await Task.deleteMany({ projectId: id })

    return Response.json({
      status: 'OK',
      message: 'Project deleted successfully',
      project: deletedProject,
    })
  } catch (error) {
    console.error('DELETE Error:', error)
    return Response.json(
      {
        status: 'ERROR',
        message: 'Error deleting project',
        error: error.message,
      },
      { status: 500 }
    )
  }
}
