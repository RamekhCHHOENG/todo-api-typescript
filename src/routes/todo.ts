import express, { Request, Response } from 'express';
import { Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import Todo, { ITodo } from '../models/Todo';

const router = express.Router();

router.get('/todos', async (req: Request, res: Response) => {
  try {
    const todos = await Todo.find();
    res.json({ success: true, data: todos });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/todo', async (req: Request, res: Response) => {
  try {
    const { todo } = req.body;
    const newTodo: ITodo = new Todo({
      id: uuidv4(),
      todo,
      createdAt: Date.now(),
    });

    await newTodo.save();

    res.json({ success: true, data: newTodo });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put('/todo/:_id', async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    const { todo, isCompleted } = req.body;

    const updatedFields: any = {};
    if (todo) updatedFields.todo = todo;
    if (isCompleted !== undefined) updatedFields.isCompleted = isCompleted;
    updatedFields.updatedAt = Date.now();

    const updatedTodo = await Todo.findByIdAndUpdate(_id, updatedFields, {
      new: true,
    });

    res.json({ success: true, data: updatedTodo });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/todo/:_id', async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;

    if (!Types.ObjectId.isValid(_id)) {
      return res
        .status(404)
        .json({ success: false, error: 'Invalid todo ID' });
    }

    const todo = await Todo.findByIdAndDelete(_id);

    if (!todo) {
      return res.status(404).json({ success: false, error: 'Todo not found' });
    }

    res.json({ success: true, data: todo });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
