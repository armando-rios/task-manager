import Task from '../models/Task.js'

export const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body

    const newTask = await Task.create({
      title,
      description,
      priority,
      dueDate,
    })

    res.status(201).json({
      status: 'OK',
      message: 'Task created successfully',
      newTask,
    })
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Error creating task',
      error: error.message,
    })
  }
}
