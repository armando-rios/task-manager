import express from 'express'
import taskRoutes from './routes/taskRoutes.js'
import connectDB from './db.js'

await connectDB()

const app = express()

app.use('/api', taskRoutes)
app.use(express.json())

export default app
