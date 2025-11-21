import fastify from 'fastify'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes'

dotenv.config()

const app = fastify({ logger: true })

app.register(authRoutes)

const start = async () => {
  try {
    await app.listen({ port: 4000, host: '0.0.0.0' })
    console.log('Server is running on port 4000')
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

start()