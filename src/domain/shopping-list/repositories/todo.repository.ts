import { TodoItem } from "../entities/todo-item.entity";

export interface ShoppingListRepository {
  set(todo: TodoItem[]): void;
  get(): Promise<TodoItem[]>;
}