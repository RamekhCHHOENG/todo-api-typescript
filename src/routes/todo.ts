import express, { Request, Response } from 'express';
import { Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import Todo, { ITodo } from '../models/Todo';

const router = express.Router();

router.get('/todos', async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    const filter = q ? { todo: { $regex: q, $options: 'i' } } : {};
    const todos = await Todo.find(filter).sort({createdAt: -1});
    res.json({ success: true, data: todos });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/todo', async (req: Request, res: Response) => {
  try {
    const { todo } = req.body;

    const existingTodo = await Todo.findOne({ todo });
    if (existingTodo) {
      return res.status(400).json({ success: false, error: 'Todo already exists' });
    }
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

router.put('/todo/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const updatedFields: any = {};
    if (req.body.todo) updatedFields.todo = req.body.todo;
    if (req.body.isCompleted !== undefined) updatedFields.isCompleted = req.body.isCompleted;

    updatedFields.updatedAt = Date.now();

    const updatedTodo = await Todo.findByIdAndUpdate(id,
      { $set: updatedFields },
      { new: true }
    );

    res.json({ success: true, data: updatedTodo });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});


router.delete('/todo/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res
        .status(404)
        .json({ success: false, error: 'Invalid todo ID' });
    }

    const todo = await Todo.findByIdAndDelete(id);

    if (!todo) {
      return res.status(404).json({ success: false, error: 'Todo not found' });
    }

    res.json({ success: true, data: todo });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
