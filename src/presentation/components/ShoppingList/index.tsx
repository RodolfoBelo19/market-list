import React, { useState, ChangeEvent, useEffect } from "react";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DraggableTodo } from "./draggable";
import { ShoppingListRepositoryLocalStorage } from "../../../infra/local-storage/shopping-list.repository";
import { ShoppingListUseCase } from "../../../domain/shopping-list/use-cases/todo.use-case";

type TodoItem = {
  text: string;
  checked: boolean;
}

const shoppingListRepository = new ShoppingListRepositoryLocalStorage();
const shoppingListUseCase = new ShoppingListUseCase(shoppingListRepository);

export const ShoppingList: React.FC = () => {
  const [todo, setTodo] = useState<TodoItem>({ text: "", checked: false });
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [search, setSearch] = useState<string>("");

  const addTodo = () => {
    setTodo({ text: "", checked: false });
    setTodos([...todos, todo]);
    shoppingListUseCase.add([...todos, todo]);
  }

  const removeTodo = (index: number) => {
    const newTodos = [...todos];
    newTodos.splice(index, 1);
    setTodos(newTodos);
    shoppingListUseCase.add(newTodos);
  }

  const handleCheck = (index: number) => {
    const newTodos = [...todos];
    newTodos[index].checked = !newTodos[index].checked;
    setTodos(newTodos);
    shoppingListUseCase.add(newTodos);
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTodo({ ...todo, text: e.target.value });
  }

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }

  const moveTodo = (fromIndex: number, toIndex: number) => {
    const updatedTodos = [...todos];
    const [removedTodo] = updatedTodos.splice(fromIndex, 1);
    updatedTodos.splice(toIndex, 0, removedTodo);
    setTodos(updatedTodos);
    shoppingListUseCase.add(updatedTodos);
  };

  useEffect(() => {
    const localTodos = async () => {
      const res = await shoppingListUseCase.list();

      if (Array.isArray(res)) {
        setTodos(res);
      }
    }

    localTodos();
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-4 flex flex-col gap-36 mx-auto max-w-md p-5">
        <div className="flex items-center justify-center gap-4">
          <img
            className="w-20"
            src="https://img.icons8.com/ios/452/shopping-cart.png"
            alt="shopping bag" />
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
            .filter(todoItem => todoItem.text.includes(search))
            .map((todoItem, index) => (
              <DraggableTodo
                key={`${index}-${todoItem.text}`}
                index={index}
                todo={todoItem}
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
