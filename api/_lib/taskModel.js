import { Schema, model, models } from 'mongoose'

const taskSchema = new Schema({
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
const Task = models.Task || model('Task', taskSchema)

export default Task
