import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

let io: Server;

export function initSocket(server: HttpServer) {
  io = new Server(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL,
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    socket.on('join:invitation', (invitationId: string) => {
      socket.join(`invitation:${invitationId}`);
    });

    socket.on('leave:invitation', (invitationId: string) => {
      socket.leave(`invitation:${invitationId}`);
    });
  });

  return io;
}

export function getIO() {
  return io;
}
