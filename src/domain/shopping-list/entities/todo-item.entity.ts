export class TodoItem {
  constructor(
    public readonly text: string,
    public readonly checked: boolean,
    public readonly order?: number
  ) { }
}