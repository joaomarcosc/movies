import express from 'express';
import cors, { CorsOptions } from 'cors';

const corsOptions: CorsOptions = {
  credentials: true,
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
};

const app = express();
app.use(express.json());
app.use(cors(corsOptions));

app.get('/health', (_, res) => {
  res.send('Notification was running!');
});

export default app;
