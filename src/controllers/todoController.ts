import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/isAuth";
import { AppDataSource } from "../config/db";
import { Todo } from "../entities/Todo";
import { createTodoSchema, updateTodoSchema } from "../validator/todoValidation";

const todoRepository = AppDataSource.getRepository(Todo);

// 取得使用者的所有 todos
export async function getTodos(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const todos = await todoRepository.find({
      where: { userId: req.user!.id },
      order: { createdAt: "DESC" },
    });

    res.json({
      status: "success",
      data: todos,
    });
  } catch (err) {
    next(err);
  }
}

// 新增使用者的 todo
export async function createTodo(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const parsed = createTodoSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ status: "failed", message: "資料格式錯誤" });
      return;
    }

    const todo = todoRepository.create({
      title: parsed.data.title,
      userId: req.user!.id,
    });

    const saved = await todoRepository.save(todo);

    res.status(201).json({
      status: "success",
      data: saved,
    });
  } catch (err) {
    next(err);
  }
}

// 更新使用者的 todo
export async function updateTodo(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const parsed = updateTodoSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ status: "failed", message: "更新資料格式錯誤" });
      return;
    }

    // 檢查 todo 是否存在且屬於當前使用者
    const todo = await todoRepository.findOne({
      where: { id, userId: req.user!.id },
    });

    if (!todo) {
      res.status(404).json({ status: "error", message: "Todo 不存在或無權限操作" });
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

// 刪除使用者的 todo
export async function deleteTodo(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;

    // 檢查 todo 是否存在且屬於當前使用者
    const todo = await todoRepository.findOne({
      where: { id, userId: req.user!.id },
    });

    if (!todo) {
      res.status(404).json({ status: "error", message: "Todo 不存在或無權限操作" });
      return;
    }

    await todoRepository.remove(todo);
    res.json({ status: "success", message: "Todo 已刪除" });
  } catch (error) {
    next(error);
  }
}
