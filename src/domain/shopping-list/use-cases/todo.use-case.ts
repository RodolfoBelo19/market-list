// shopping-list/use-case/shopping-list.service.ts

import { TodoItem } from "../entities/todo-item.entity";
import { ShoppingListRepository } from "../repositories/todo.repository"; 

export class ShoppingListUseCase {
  private repository: ShoppingListRepository;

  constructor(repository: ShoppingListRepository) {
    this.repository = repository;
  }

  addTodo(todo: TodoItem): void {
    this.repository.addTodo(todo);
  }

  removeTodo(index: number): void {
    this.repository.removeTodo(index);
  }

  handleCheck(index: number): void {
    this.repository.handleCheck(index);
  }

  moveTodo(fromIndex: number, toIndex: number): void {
    this.repository.moveTodo(fromIndex, toIndex);
  }

  getTodos(): TodoItem[] {
    return this.repository.getTodos();
  }

  loadTodos(): void {
    this.repository.loadTodos();
  }
}
