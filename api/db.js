import mongoose, { connect } from 'mongoose'

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mydatabase'

const connectDB = async () => {
  try {
    await connect(uri)
    console.log('MongoDB connected successfully')

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err)
    })

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected')
    })
  } catch (error) {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  }
}

export default connectDB
