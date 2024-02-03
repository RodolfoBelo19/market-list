import { TodoItem } from "../entities/todo-item.entity";

export interface ShoppingListRepository {
  addTodo(todo: TodoItem): void;
  removeTodo(index: number): void;
  handleCheck(index: number): void;
  moveTodo(fromIndex: number, toIndex: number): void;
  getTodos(): TodoItem[];
  loadTodos(): void;
}