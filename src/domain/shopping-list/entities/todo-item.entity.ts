export class TodoItem {
  constructor(
    public readonly text: string,
    public readonly checked: boolean,
  ) { }

  public addTodo(): TodoItem {
    return new TodoItem(this.text, false);
  }

  public removeTodo(): TodoItem {
    return new TodoItem(this.text, false);
  }

  public handleCheck(): TodoItem {
    return new TodoItem(this.text, !this.checked);
  }
}