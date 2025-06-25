// src/server.ts
import 'module-alias/register';
import './env';
import { createServer } from 'http';
import app from './app';
import { connectMongoDB } from '@config/database';
import { redisClient } from '@config/redis';
import { initSocketServer } from './socket';
import log from '@common/logger';

const port = process.env.PORT || 3000;
const httpServer = createServer(app);

initSocketServer(httpServer);

async function startServer() {
  await connectMongoDB();
  if (!redisClient.isOpen) {
    await redisClient.connect();
    log.info("Connected to Redis Cloud");
  }
  httpServer.listen(port, () => {
    log.info(`🚀 Server running at http://localhost:${port}`);
  });
}

startServer();
