// src/app.ts
import express, { ErrorRequestHandler } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import mainRoutes from './routes/index.route';
import { errorHandler, notFound } from './core/middleware';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: ['http://localhost:3001', 'https://the-archive-of-one.vercel.app'],
    credentials: true,
  })
);
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

app.use('/api/v1', mainRoutes);

app.use(notFound);
app.use(errorHandler as unknown as ErrorRequestHandler);

export default app;
