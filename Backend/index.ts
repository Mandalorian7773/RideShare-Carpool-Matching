import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { Socket } from "socket.io";

dotenv.config();

const fastify = Fastify({
    logger: true
});

fastify.register(cors, {
    origin: '*'
});

fastify.register(jwt, {
    secret: process.env.JWT_SECRET!
});


fastify.get("/", async () => {
    return {
        status: "Server is up and running"
    }
});


const start = async () => {
    try {
        const PORT = 3000;
        await fastify.listen({ port: PORT, host: '0.0.0.0' });
        
 
        const io = new Server(fastify.server, {
            cors: { origin: '*' }
        });
        
        io.on("connection", (socket: Socket) => {
            console.log("someone connected : ", socket.id);
        });
        
        console.log(`Server is listening on port ${PORT}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();