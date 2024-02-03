import { ShoppingListRepository } from "../../domain/shopping-list/repositories/todo.repository";
import { TodoItem } from "../../domain/shopping-list/entities/todo-item.entity";

export class ShoppingListRepositoryApi implements ShoppingListRepository {
  private BASE_URL = "localhost:3000";

  async set(todos: Promise<TodoItem[]>) {
    fetch(`${this.BASE_URL}/todos`, {
      method: "POST",
      body: JSON.stringify(todos),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async get(): Promise<TodoItem[]> {
    const response = await fetch(`${this.BASE_URL}/todos`);
    return response.json();
  }
}