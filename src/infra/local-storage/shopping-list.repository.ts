import { ShoppingListRepository } from "../../domain/shopping-list/repositories/todo.repository";
import { TodoItem } from "../../domain/shopping-list/entities/todo-item.entity";

export class ShoppingListRepositoryLocalStorage
  implements ShoppingListRepository
{
  private STORAGE_KEY = "todos";

  set(todos: TodoItem): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(todos));
  }

  get(): Promise<TodoItem[]> {
    const localTodos = localStorage.getItem(this.STORAGE_KEY);
    return localTodos ? JSON.parse(localTodos) : [];
  }

  remove(id: string): void {
    return localStorage.removeItem(id);
  }

  patch(id: string, todo: TodoItem): void {
    if (localStorage.getItem(id)) {
      localStorage.setItem(id, JSON.stringify(todo));
    }
  }

  updateOrder(ids: string[], orders: number): void {
    for (const [, id] of ids.entries()) {
      const getItemId = localStorage.getItem(id);
      if (getItemId) {
        const todo = JSON.parse(getItemId);
        todo.order = orders;
        localStorage.setItem(id, JSON.stringify(todo));
      }
    }
  }
}
