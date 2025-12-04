import { FastifyPluginAsync } from 'fastify';
import * as jwt from 'jsonwebtoken';
import { PoolClient } from 'pg';
import { dbService } from '../services/database.service';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: any;
  }
  
  interface FastifyRequest {
    user?: {
      id: number;
      email: string;
      role: string;
    };
  }
}

const jwtPlugin: FastifyPluginAsync = async (fastify) => {
  const secret = process.env.JWT_SECRET || 'my_jwt_secret_key';
  
  fastify.post('/api/auth/login', async (request, reply) => {
    const { email, password } = request.body as any;
    
    if (!email || !password) {
      return reply.status(400).send({
        success: false,
        error: 'Email and password are required'
      });
    }
    
    try {
      const client: PoolClient = await dbService.getClient();
      try {
        const result = await client.query(
          'SELECT id, email, role FROM users WHERE email = $1 AND password = $2',
          [email, password]
        );
        
        if (result.rows.length === 0) {
          return reply.status(401).send({
            success: false,
            error: 'Invalid credentials'
          });
        }
        
        const user = result.rows[0];
        const token = jwt.sign(
          { id: user.id, email: user.email, role: user.role },
          secret,
          { expiresIn: '24h' }
        );
        
        return reply.status(200).send({
          success: true,
          data: {
            token,
            user: {
              id: user.id,
              email: user.email,
              role: user.role
            }
          }
        });
      } finally {
        client.release();
      }
    } catch (error: any) {
      fastify.log.error(error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to login'
      });
    }
  });
  
  fastify.post('/api/auth/register', async (request, reply) => {
    const { email, password, role, firstName, lastName } = request.body as any;
    
    if (!email || !password || !role) {
      return reply.status(400).send({
        success: false,
        error: 'Email, password, and role are required'
      });
    }
    
    if (role !== 'driver' && role !== 'rider') {
      return reply.status(400).send({
        success: false,
        error: 'Role must be either driver or rider'
      });
    }
    
    try {
      const client: PoolClient = await dbService.getClient();
      try {
        const existingUser = await client.query(
          'SELECT id FROM users WHERE email = $1',
          [email]
        );
        
        if (existingUser.rows.length > 0) {
          return reply.status(409).send({
            success: false,
            error: 'User already exists'
          });
        }
        
        const result = await client.query(
          'INSERT INTO users (email, password, role, first_name, last_name) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, role',
          [email, password, role, firstName || null, lastName || null]
        );
        
        const user = result.rows[0];
        const token = jwt.sign(
          { id: user.id, email: user.email, role: user.role },
          secret,
          { expiresIn: '24h' }
        );
        
        return reply.status(201).send({
          success: true,
          data: {
            token,
            user: {
              id: user.id,
              email: user.email,
              role: user.role
            }
          }
        });
      } finally {
        client.release();
      }
    } catch (error: any) {
      fastify.log.error(error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to register user'
      });
    }
  });
};

export default jwtPlugin;