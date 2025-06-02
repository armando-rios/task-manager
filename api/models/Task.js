import { Schema, model } from 'mongoose'

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

const task = model('Task', taskSchema)

export default task
