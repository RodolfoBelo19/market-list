import { ShoppingListRepository } from "../../../../domain/shopping-list/repositories/todo.repository";
import { TodoItem } from "../../../../domain/shopping-list/entities/todo-item.entity";

export class ShoppingListRepositoryLocalStorage implements ShoppingListRepository {
  private todos: TodoItem[] = [];

  addTodo(todo: TodoItem): void {
    if (!todo.text) return;
    this.todos.push(todo.addTodo());
    this.saveTodos();
  }

  removeTodo(index: number): void {
    this.todos.splice(index, 1);
    this.saveTodos();
  }

  handleCheck(index: number): void {
    this.todos[index] = this.todos[index].handleCheck();
    this.saveTodos();
  }

  moveTodo(fromIndex: number, toIndex: number): void {
    const [removedTodo] = this.todos.splice(fromIndex, 1);
    this.todos.splice(toIndex, 0, removedTodo);
    this.saveTodos();
  }

  getTodos(): TodoItem[] {
    return [...this.todos];
  }

  private saveTodos(): void {
    localStorage.setItem("todos", JSON.stringify(this.todos));
  }

  loadTodos(): void {
    const localTodos = localStorage.getItem("todos");
    if (localTodos) {
      this.todos = JSON.parse(localTodos);
    }
  }
}