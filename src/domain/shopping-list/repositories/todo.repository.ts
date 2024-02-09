import { TodoItem } from "../entities/todo-item.entity";

export interface ShoppingListRepository {
  set(todo: TodoItem): void;
  get(): Promise<TodoItem[]>;
  remove(id: string): void;
  patch(id: string, todo: TodoItem): void;
  updateOrder(ids: string[], orders: number[]): void;
}
