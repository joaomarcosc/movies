import express from 'express';
import cors, { CorsOptions } from 'cors';
import MovieRoutes from './routes';
import { authenticate } from './middlewares/authenticate';

const corsOptions: CorsOptions = {
  credentials: true,
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
};

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(authenticate);
app.use(new MovieRoutes().router);

export default app;
