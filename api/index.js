import express from 'express'
import taskRoutes from './routes/taskRoutes.js'
import connectDB from './db.js'

await connectDB()

const app = express()

app.use(express.json())

app.use('/api', taskRoutes)

export default app
