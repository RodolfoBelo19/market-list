import { TodoItem } from "../entities/todo-item.entity";
import { ShoppingListRepository } from "../repositories/todo.repository";

export class ShoppingListUseCase {
  constructor(private repository: ShoppingListRepository) { }

  async add(todo: TodoItem[]) {
    await this.repository.set(todo);
    return todo;
  }

  async list(): Promise<TodoItem[]> {
    return this.repository.get();
  }
}
