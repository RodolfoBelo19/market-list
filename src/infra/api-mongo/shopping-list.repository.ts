import { ShoppingListRepository } from "../../domain/shopping-list/repositories/todo.repository";
import { TodoItem } from "../../domain/shopping-list/entities/todo-item.entity";

export class ShoppingListRepositoryApi implements ShoppingListRepository {
  private BASE_URL = import.meta.env.VITE_API_URL;

  async set(todos: TodoItem): Promise<void> {
    console.log("fora do try:", todos);
    try {
      console.log("dentro do try:", JSON.stringify(todos));
      const response = await fetch(`${this.BASE_URL}/todos`, {
        method: "POST",
        body: JSON.stringify(todos),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to set todos. Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error setting todos:", error);
      throw error;
    }
  }

  async get(): Promise<TodoItem[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/todos`);
      if (!response.ok) {
        throw new Error(`Failed to get todos. Status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error("Error getting todos:", error);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.BASE_URL}/todos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to remove todo. Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error removing todo:", error);
      throw error;
    }
  }

  async patch(id: string, todo: TodoItem): Promise<void> {
    try {
      const response = await fetch(`${this.BASE_URL}/todos/${id}`, {
        method: "PATCH",
        body: JSON.stringify(todo),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to patch todo. Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error patching todo:", error);
      throw error;
    }
  }

  async updateOrder(ids: string[], orders: number[]): Promise<void> {
    try {
      const response = await fetch(`${this.BASE_URL}/todos`, {
        method: "PATCH",
        body: JSON.stringify({ ids, orders }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to update todo order. Status: ${response.status}`
        );
      }
    } catch (error) {
      console.error("Error updating todo order:", error);
      throw error;
    }
  }
}
