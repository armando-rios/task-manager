import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Low',
  },
  dueDate: { type: Date, required: true },
})

// Use existing model if available (prevents OverwriteModelError in serverless)
const Task = mongoose.models.Task || mongoose.model('Task', taskSchema)

export default Task
