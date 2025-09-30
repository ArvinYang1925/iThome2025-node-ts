import { Router } from "express";
import { getTodos, createTodo, updateTodo, deleteTodo } from "../controllers/todoController";
import { isAuth } from "../middleware/isAuth";

const router = Router();

router.get("/", isAuth, getTodos);
router.post("/", isAuth, createTodo);
router.put("/:id", isAuth, updateTodo);
router.delete("/:id", isAuth, deleteTodo);

export default router;
