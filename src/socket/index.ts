import { Server } from 'socket.io'
import http from 'http'
import log from '@common/logger'

let io: Server

export const initSocketServer = (server: http.Server) => {
  io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
  })

  io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId as string

    if (userId) {
      socket.join(userId)
      log.info(`🔌 [Socket] Connected: ${userId}`)
    }

    // TODO: register your own socket handlers here
  })

  return io
}

export const getIO = (): Server => {
  if (!io) throw new Error('[Socket] IO not initialized')
  return io
}
