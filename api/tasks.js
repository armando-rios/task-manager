import { connectDB } from './_lib/db.js'
import Task from './_lib/taskModel.js'

// Handle GET request - Get all tasks
export async function GET() {
  try {
    await connectDB()

    const tasks = await Task.find()

    return Response.json({
      status: 'OK',
      message: 'Tasks retrieved successfully',
      tasks,
    })
  } catch (error) {
    console.error('GET Error:', error)
    return Response.json(
      {
        status: 'ERROR',
        message: 'Error retrieving tasks',
        error: error.message,
      },
      { status: 500 }
    )
  }
}

// Handle POST request - Create new task
export async function POST(request) {
  try {
    await connectDB()

    const body = await request.json()
    const { projectId, title, description, priority, dueDate } = body

    const newTask = await Task.create({
      projectId,
      title,
      description,
      priority,
      dueDate,
    })

    return Response.json(
      {
        status: 'OK',
        message: 'Task created successfully',
        newTask,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('POST Error:', error)
    return Response.json(
      {
        status: 'ERROR',
        message: 'Error creating task',
        error: error.message,
      },
      { status: 500 }
    )
  }
}
