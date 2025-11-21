import { FastifyPluginAsync } from 'fastify'
import { sendEmailOtp, verifyOtp, signInWithGoogle, signOut, validateSession } from '../services/authService'

const authRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/auth/email-otp', async (request, reply) => {
    const { email } = request.body as { email: string }
    const result = await sendEmailOtp(email)
    return reply.status(result.status ? 200 : 400).send(result)
  })

  fastify.post('/auth/verify-otp', async (request, reply) => {
    const { email, otp } = request.body as { email: string; otp: string }
    const result = await verifyOtp({ email, otp })
    return reply.status(result.status ? 200 : 400).send(result)
  })

  fastify.get('/auth/google', async (request, reply) => {
    const result = await signInWithGoogle()
    return reply.status(result.status ? 200 : 400).send(result)
  })

  fastify.post('/auth/sign-out', async (request, reply) => {
    const { accessToken } = request.body as { accessToken: string }
    const result = await signOut(accessToken)
    return reply.status(result.status ? 200 : 400).send(result)
  })

  fastify.get('/auth/me', async (request, reply) => {
    const accessToken = request.headers.authorization?.replace('Bearer ', '')
    if (!accessToken) {
      return reply.status(401).send({ status: false, message: 'Unauthorized' })
    }
    
    const result = await validateSession(accessToken)
    return reply.status(result.status ? 200 : 401).send(result)
  })
}

export default authRoutes