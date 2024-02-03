import { ShoppingListRepository } from "../../domain/shopping-list/repositories/todo.repository";
import { TodoItem } from "../../domain/shopping-list/entities/todo-item.entity";

export class ShoppingListRepositoryLocalStorage implements ShoppingListRepository {
  private STORAGE_KEY = "todos";

  set(todos: TodoItem[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(todos));
  }

  get(): Promise<TodoItem[]> {
    const localTodos = localStorage.getItem(this.STORAGE_KEY);
    return localTodos ? JSON.parse(localTodos) : [];
  }
}