import express, { Request, Response } from 'express';
import cors from 'cors';
import eventRoutes from './routes/eventRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api', eventRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Event Management API!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
