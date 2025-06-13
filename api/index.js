import express from 'express'
import taskRoutes from './routes/taskRoutes.js'
import connectDB from './db.js'

await connectDB()

const app = express()

app.use(express.json())

app.use('/api', taskRoutes)

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})

// export default app
