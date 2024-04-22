import React, { useState, ChangeEvent, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DraggableTodo } from "./draggable";
import { MarketListUseCase } from "../../../domain/market-list/use-cases/todo.use-case";
import { MarketListRepositoryApi } from "../../../infra/api-mongo/market-list.repository";

type TodoItem = {
  _id?: string;
  text: string;
  order?: number;
  checked: boolean;
};

const marketListRepository = new MarketListRepositoryApi();
const marketListUseCase = new MarketListUseCase(marketListRepository);

export const MarketList: React.FC = () => {
  const [todo, setTodo] = useState<TodoItem>({ text: "", checked: false });
  const [todos, setTodos] = useState<TodoItem[]>([]);

  const addTodo = async () => {
    setTodo({ text: "", checked: false });
    const order = todos.length;
    await marketListUseCase.add({ ...todo, order });
    listTodos();
  };

  const removeTodo = async (id: string) => {
    await marketListUseCase.remove(id);
    listTodos();
  };

  const handleCheck = async (id: string) => {
    for (const todoItem of todos) {
      if (todoItem._id === id) {
        todoItem.checked = !todoItem.checked;
        try {
          await marketListUseCase.update(id, todoItem);
          listTodos();
        } catch (error) {
          console.error(error);
        }
      }
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTodo({ ...todo, text: e.target.value });
  };

  const moveTodo = async (fromIndex: number, toIndex: number) => {
    const updatedTodos = [...todos];
    const [removedTodo] = updatedTodos.splice(fromIndex, 1);
    updatedTodos.splice(toIndex, 0, removedTodo);
    setTodos(updatedTodos);

    const ids = updatedTodos
      .map((todo) => todo._id)
      .filter((id) => id !== undefined) as string[];
    const orders = updatedTodos.map((_, index) => index);
    await marketListUseCase.reorder(ids, orders);
  };

  const listTodos = async () => {
    const res = await marketListUseCase.list();
    const sorted = res.sort((a, b) => a.order! - b.order!);

    if (Array.isArray(sorted)) {
      setTodos(sorted);
    }
  };

  useEffect(() => {
    listTodos();
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-4 flex flex-col gap-24 mx-auto max-w-md p-5">
        <div className="flex items-center justify-center gap-4">
          <img
            className="w-20"
            // src="https://img.icons8.com/ios/452/market-cart.png"
            src="/cart.png"
            alt="market bag"
          />
          <h1 className="text-center sm:text-4xl text-lg">Market List</h1>
        </div>
        <div className="sm:flex flex-wrap-reverse gap-4 items-center justify-center p-5 fixed left-0 right-0 pt-24">
          <div className="flex items-center space-x-4 sm:w-7/12 w-full">
            <input
              className="rounded-lg p-0.5 border w-full"
              type="text"
              value={todo.text}
              onChange={handleInputChange}
            />
            <button
              className="border py-0 border-green-400 hover:border-green-200 rounded-lg px-2"
              onClick={addTodo}
            >
              Add
            </button>
          </div>
        </div>
        <ul className="overflow-y-auto max-h-[550px] p-3">
          {todos
            .map((todoItemFilter, index) => (
              <DraggableTodo
                order={todoItemFilter.order || 0}
                key={`${index}-${todoItemFilter.text}`}
                index={index}
                todo={todoItemFilter}
                moveTodo={moveTodo}
                handleCheck={handleCheck}
                removeTodo={removeTodo}
              />
            ))}
        </ul>
      </div>
    </DndProvider>
  );
};
