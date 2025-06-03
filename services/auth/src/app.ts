import express from 'express';
import cors, { CorsOptions } from 'cors';
import { errorHandler } from './middlewares/errorHandler';
import cookieParser from 'cookie-parser';
import { AuthRoutes } from './routes';

const app = express();

const corsOptions: CorsOptions = {
  credentials: true,
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
};

const authRoutes = new AuthRoutes();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use('/auth', authRoutes.router);
app.route('/health').get((_, res) => {
  res.status(200).json({ message: 'Auth service is running' });
});
app.use(errorHandler);

export default app;
