import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { Task, TaskStatus } from '../entities/task.entity';
import { AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const router = Router();
const taskRepository = AppDataSource.getRepository(Task);

const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  status: z.enum([TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE])
});

const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum([TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE]).optional()
});

router.get('/', async (req: AuthRequest, res) => {
  try {
    const tasks = await taskRepository.find({
      where: { user: { id: req.user!.id } },
      order: { createdAt: 'DESC' }
    });
    return res.json(tasks);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching tasks' });
  }
});

router.post('/', async (req: AuthRequest, res) => {
  try {
    const taskData = createTaskSchema.parse(req.body);
    const task = taskRepository.create({
      ...taskData,
      user: req.user
    });
    await taskRepository.save(task);
    return res.status(201).json(task);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    return res.status(500).json({ message: 'Error creating task' });
  }
});

router.patch('/:id', async (req: AuthRequest, res) => {
  try {
    const taskData = updateTaskSchema.parse(req.body);
    const task = await taskRepository.findOne({
      where: { id: parseInt(req.params.id), user: { id: req.user!.id } }
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    Object.assign(task, taskData);
    await taskRepository.save(task);
    return res.json(task);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    return res.status(500).json({ message: 'Error updating task' });
  }
});

router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const task = await taskRepository.findOne({
      where: { id: parseInt(req.params.id), user: { id: req.user!.id } }
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await taskRepository.remove(task);
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting task' });
  }
});

export const taskRouter = router;