import { TodoItem } from "../entities/todo-item.entity";
import { ShoppingListRepository } from "../repositories/todo.repository";

export class ShoppingListUseCase {
  constructor(private repository: ShoppingListRepository) {}

  async add(todo: TodoItem) {
    await this.repository.set(todo);
    return todo;
  }

  async list(): Promise<TodoItem[]> {
    return this.repository.get();
  }

  async remove(id: string) {
    return this.repository.remove(id);
  }

  async update(id: string, todo: TodoItem) {
    return this.repository.patch(id, todo);
  }

  async reorder(ids: string[], order: number): Promise<void> {
    await this.repository.updateOrder(ids, order);
  }
}
