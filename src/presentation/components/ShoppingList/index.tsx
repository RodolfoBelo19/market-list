import React, { useState, ChangeEvent, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DraggableTodo } from "./draggable";
import { ShoppingListUseCase } from "../../../domain/shopping-list/use-cases/todo.use-case";
import { ShoppingListRepositoryApi } from "../../../infra/api-mongo/shopping-list.repository";

type TodoItem = {
  _id?: string;
  text: string;
  order?: number;
  checked: boolean;
};

const shoppingListRepository = new ShoppingListRepositoryApi();
const shoppingListUseCase = new ShoppingListUseCase(shoppingListRepository);

export const ShoppingList: React.FC = () => {
  const [todo, setTodo] = useState<TodoItem>({ text: "", checked: false });
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [search, setSearch] = useState<string>("");

  const addTodo = async () => {
    setTodo({ text: "", checked: false });
    const order = todos.length;
    await shoppingListUseCase.add({ ...todo, order });
    listTodos();
  };

  const removeTodo = async (id: string) => {
    await shoppingListUseCase.remove(id);
    listTodos();
  };

  const handleCheck = async (id: string) => {
    for (const todoItem of todos) {
      if (todoItem._id === id) {
        todoItem.checked = !todoItem.checked;
        try {
          await shoppingListUseCase.update(id, todoItem);
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

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

    const moveTodo = async (fromIndex: number, toIndex: number) => {
      const updatedTodos = [...todos];
      const [removedTodo] = updatedTodos.splice(fromIndex, 1);
      updatedTodos.splice(toIndex, 0, removedTodo);
      setTodos(updatedTodos);

      const ids = updatedTodos.map((todo) => todo._id).filter((id) => id !== undefined) as string[];
      const orders = updatedTodos.map((_, index) => index);
      await shoppingListUseCase.reorder(ids, orders);
    };

  const listTodos = async () => {
    const res = await shoppingListUseCase.list();
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
      <div className="space-y-4 flex flex-col gap-36 mx-auto max-w-md p-5">
        <div className="flex items-center justify-center gap-4">
          <img
            className="w-20"
            src="https://img.icons8.com/ios/452/shopping-cart.png"
            alt="shopping bag"
          />
          <h1 className="text-center sm:text-4xl text-lg">Shopping List</h1>
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
          <input
            className="rounded-lg sm:mt-0 mt-5 p-0.5 border sm:w-7/12 w-full placeholder:text-sm"
            type="text"
            placeholder="Search for a todo..."
            onChange={handleSearch}
          />
        </div>
        <ul className="overflow-y-auto max-h-96 p-3">
          {todos
            .filter((todoItemFilter) => todoItemFilter.text.includes(search))
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
