import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../config/db";
import { Todo } from "../entities/Todo";
import { createTodoSchema, updateTodoSchema } from "../validator/todoValidation";

const todoRepository = AppDataSource.getRepository(Todo);

export async function getTodos(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const todos = await todoRepository.find();
    res.json({ status: "success", data: todos });
  } catch (error) {
    next(error);
  }
}

export async function createTodo(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = createTodoSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ status: "failed", message: "標題過長或過短" });
      return;
    }

    const newTodo = todoRepository.create({ title: parsed.data.title });
    const savedTodo = await todoRepository.save(newTodo);
    res.status(201).json({ status: "success", data: savedTodo });
  } catch (error) {
    next(error);
  }
}

export async function updateTodo(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const parsed = updateTodoSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ status: "failed", message: "更新資料格式錯誤" });
      return;
    }

    const todo = await todoRepository.findOneBy({ id });
    if (!todo) {
      res.status(404).json({ status: "error", message: "Todo not found" });
      return;
    }

    todo.title = parsed.data.title ?? todo.title;
    todo.completed = parsed.data.completed ?? todo.completed;

    const updatedTodo = await todoRepository.save(todo);
    res.json({ status: "success", data: updatedTodo });
  } catch (error) {
    next(error);
  }
}

export async function deleteTodo(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const result = await todoRepository.delete({ id });
    if (result.affected === 0) {
      res.status(404).json({ status: "error", message: "Todo not found" });
      return;
    }
    res.json({ status: "success", data: result });
  } catch (error) {
    next(error);
  }
}
