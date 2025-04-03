import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { AppDataSource } from './data-source';
import { authRouter } from './routes/auth.routes';
import { taskRouter } from './routes/task.routes';
import { errorHandler } from './middleware/error-handler';
import { authenticateToken } from './middleware/auth';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRouter);
app.use('/tasks', authenticateToken, taskRouter);

// Error handling
app.use(errorHandler);

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => console.error('Error during Data Source initialization:', error));